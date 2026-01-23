'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';

/**
 * MAPLIBRE GL MAP COMPONENT - REFATORADO
 * 
 * Componente refatorado seguindo as melhores práticas do MapLibre GL JS
 * para renderização dinâmica de províncias coloridas por região.
 * 
 * Baseado na documentação oficial do MapLibre GL JS
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface MarkerConfig {
  lngLat: [number, number];
  title?: string;
  description?: string;
  color?: string;
  popupHTML?: string;
}

export interface RegionConfig {
  id: string;
  name: string;
  color: string;
  provinces: string[]; // Mantido para compatibilidade com código existente
  territory?: any; // JSON territory real da API: { NL: { DR: ['ASS', 'EMM'], ... } }
  churches?: Array<{
    id: string;
    name: string;
    city?: string;
    province?: string;
  }>;
  churches_count?: number;
  members_count?: number;
}

export interface MapLibreProps {
  width?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  theme?: 'dark' | 'light' | 'voyager'; // DEPRECATED: Tema agora é detectado automaticamente do sistema via next-themes
  showControls?: boolean;
  showGeolocation?: boolean;
  showFullscreen?: boolean;
  showScale?: boolean;
  markers?: MarkerConfig[];
  regions?: RegionConfig[];
  provincesGeoJsonUrl?: string;
  onClick?: (event: maplibregl.MapMouseEvent) => void;
  onLoad?: (map: maplibregl.Map) => void;
  onProvinceClick?: (provinceCode: string, regionName?: string) => void;
  onProvinceHover?: (provinceCode: string | null, regionName?: string) => void;
  showDebugPanel?: boolean;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAP_STYLES = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
} as const;

const DEFAULT_PROVINCES_GEOJSON_URL = 
  '/data/netherlands-provinces-simple.geojson';

/**
 * Códigos ISO 3166-2 das 12 províncias dos Países Baixos
 */
const PROVINCE_CODES: Record<string, string> = {
  NLDR: 'NL-DR', // Drenthe
  NLFL: 'NL-FL', // Flevoland
  NLFR: 'NL-FR', // Friesland/Fryslân
  NLGE: 'NL-GE', // Gelderland
  NLGR: 'NL-GR', // Groningen
  NLLI: 'NL-LI', // Limburg
  NLNB: 'NL-NB', // Noord-Brabant
  NLNH: 'NL-NH', // Noord-Holland
  NLOV: 'NL-OV', // Overijssel
  NLUT: 'NL-UT', // Utrecht
  NLZL: 'NL-ZL', // Zeeland
  NLZH: 'NL-ZH', // Zuid-Holland
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gera expressão de cores dinâmica para MapLibre GL
 * Formato: ['match', ['get', 'property'], value1, color1, ..., defaultColor]
 * 
 * TODAS as províncias serão exibidas:
 * - Províncias com região: usa cor da região
 * - Províncias sem região: usa cor padrão monocromática (#d1d5db)
 */
function generateColorExpression(regions: RegionConfig[], propertyName: string = 'iso_3166_2'): any[] {
  const matches: any[] = [];
  const assignedProvinces = new Set<string>();
  
  // Adicionar províncias que têm região atribuída
  regions.forEach(region => {
    region.provinces.forEach(provinceCode => {
      const isoCode = PROVINCE_CODES[provinceCode];
      if (isoCode) {
        matches.push(isoCode, region.color);
        assignedProvinces.add(isoCode);
      }
    });
  });
  
  // Adicionar províncias não atribuídas com cor padrão
  Object.entries(PROVINCE_CODES).forEach(([code, isoCode]) => {
    if (!assignedProvinces.has(isoCode)) {
      matches.push(isoCode, '#d1d5db'); // Cor cinza monocromática
    }
  });
  
  // Cor padrão para qualquer coisa não mapeada
  return ['match', ['get', propertyName], ...matches, '#e5e7eb'];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MapLibre({
  width = '100%',
  height = '500px',
  center = [5.2913, 52.1326],
  zoom = 7,
  pitch = 0,
  theme = 'light', // Mantido para compatibilidade, mas será sobrescrito pelo tema do sistema
  showControls = true,
  showGeolocation = true,
  showFullscreen = true,
  showScale = true,
  markers = [],
  regions = [],
  provincesGeoJsonUrl = DEFAULT_PROVINCES_GEOJSON_URL,
  onClick,
  onLoad,
  onProvinceClick,
  onProvinceHover,
  showDebugPanel = false,
  className = '',
}: MapLibreProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [provincesData, setProvincesData] = useState<any>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Detectar tema do sistema
  const { theme: systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Aguardar montagem para evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Determinar tema atual (light ou dark)
  const currentTheme = mounted ? (resolvedTheme === 'dark' ? 'dark' : 'light') : theme;

  // ============================================================================
  // CARREGAR GEOJSON DAS PROVÍNCIAS
  // ============================================================================

  useEffect(() => {
    if (regions.length === 0) return;

    const loadProvincesData = async () => {
      try {
        const response = await fetch(provincesGeoJsonUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - URL pode estar indisponível`);
        }
        
        const data = await response.json();
        
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error('GeoJSON inválido: não contém array de features');
        }
        
        setProvincesData(data);
        setMapError(null);
        
      } catch (error) {
        console.error('❌ ERRO ao carregar GeoJSON:', error);
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        setMapError(`Falha ao carregar províncias: ${errorMsg}`);
        
        // Tentar URL alternativa
        if (provincesGeoJsonUrl.includes('cartomap')) {
          try {
            const altUrl = 'https://raw.githubusercontent.com/benassa-de-glassa/netherlands_地域_geography/master/provinces.geojson';
            const altResponse = await fetch(altUrl);
            if (altResponse.ok) {
              const altData = await altResponse.json();
              setProvincesData(altData);
              setMapError(null);
              return;
            }
          } catch (altError) {
            console.error('❌ URL alternativa também falhou');
          }
        }
      }
    };

    loadProvincesData();
  }, [regions, provincesGeoJsonUrl]);

  // ============================================================================
  // INICIALIZAR MAPA
  // ============================================================================

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[currentTheme as keyof typeof MAP_STYLES] || MAP_STYLES.light,
        center,
        zoom,
        pitch,
      });

      // Controles
      if (showControls) {
        map.current.addControl(
          new maplibregl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }),
          'top-right'
        );
      }

      if (showGeolocation) {
        map.current.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
            trackUserLocation: true,
          }),
          'top-right'
        );
      }

      if (showFullscreen) {
        map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');
      }

      if (showScale) {
        map.current.addControl(
          new maplibregl.ScaleControl({ maxWidth: 200, unit: 'metric' }),
          'bottom-right'
        );
      }

      // Eventos
      map.current.on('load', () => {
        setMapLoaded(true);
        if (onLoad && map.current) {
          onLoad(map.current);
        }
      });

      map.current.on('error', (e) => {
        console.error('❌ MapLibre Error:', e);
        setMapError('Erro ao carregar o mapa');
      });

      if (onClick) {
        map.current.on('click', onClick);
      }

    } catch (error) {
      console.error('❌ Erro ao inicializar mapa:', error);
      setMapError('Falha na inicialização do mapa');
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // ============================================================================
  // ATUALIZAR TEMA DO MAPA DINAMICAMENTE
  // ============================================================================

  useEffect(() => {
    if (!map.current || !mapLoaded || !mounted) return;

    
    try {
      // Atualizar estilo do mapa baseado no tema
      const newStyle = MAP_STYLES[currentTheme as keyof typeof MAP_STYLES];
      
      // Salvar estado atual antes de mudar o estilo
      const currentCenter = map.current.getCenter();
      const currentZoom = map.current.getZoom();
      const currentPitch = map.current.getPitch();
      
      // Mudar estilo do mapa
      map.current.setStyle(newStyle);
      
      // Aguardar carregamento do novo estilo
      map.current.once('style.load', () => {
        
        // Restaurar posição do mapa
        if (map.current) {
          map.current.setCenter(currentCenter);
          map.current.setZoom(currentZoom);
          map.current.setPitch(currentPitch);
          
          // Re-trigger de configuração de províncias será feito pelo useEffect de provincesData
          setMapLoaded(true);
        }
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar tema do mapa:', error);
    }
  }, [currentTheme, mounted]);

  // ============================================================================
  // CONFIGURAR PROVÍNCIAS E REGIÕES
  // ============================================================================

  useEffect(() => {
    if (!map.current || !mapLoaded || !provincesData || regions.length === 0) {
      return;
    }

    const SOURCE_ID = 'netherlands-provinces';
    const FILL_LAYER = 'provinces-fill';
    const OUTLINE_LAYER = 'provinces-outline';
    const HOVER_LAYER = 'provinces-hover';
    const LABELS_SOURCE_ID = 'region-labels';
    const LABELS_LAYER = 'region-labels-text';
    const LABELS_BACKGROUND = 'region-labels-background';

    try {
      // Remover camadas existentes (incluindo labels) - ordem inversa
      const layersToRemove = [LABELS_LAYER, LABELS_BACKGROUND, HOVER_LAYER, OUTLINE_LAYER, FILL_LAYER];
      layersToRemove.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
      });

      // Remover sources existentes
      if (map.current.getSource(LABELS_SOURCE_ID)) {
        map.current.removeSource(LABELS_SOURCE_ID);
      }
      if (map.current.getSource(SOURCE_ID)) {
        map.current.removeSource(SOURCE_ID);
      }

      // Adicionar source
      map.current.addSource(SOURCE_ID, {
        type: 'geojson',
        data: provincesData,
      });

      // Detectar propriedade correta do GeoJSON
      let propertyName = 'iso_3166_2';
      if (provincesData.features && provincesData.features.length > 0) {
        const props = provincesData.features[0].properties || {};
        // Tentar encontrar propriedade de código ISO
        if (props.statnaam) propertyName = 'statnaam'; // CartoMap
        else if (props.name) propertyName = 'name';
        else if (props.NAME) propertyName = 'NAME';
        else if (props.code) propertyName = 'code';
        else if (props.CODE) propertyName = 'CODE';
      }

      // Gerar expressão de cores
      const colorExpression = generateColorExpression(regions, propertyName);

      // Adicionar layer de preenchimento com opacidade base
      map.current.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: {
          'fill-color': colorExpression as any,
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.95, // Opacidade no hover
            0.7   // Opacidade normal
          ],
        },
      });

      // Adicionar layer de contorno das províncias (demarcação principal)
      map.current.addLayer({
        id: OUTLINE_LAYER,
        type: 'line',
        source: SOURCE_ID,
        paint: {
          'line-color': '#222222',
          'line-width': 1.5,
          'line-opacity': 0.8,
        },
      });

      // Adicionar layer de hover (destaque na província)
      map.current.addLayer({
        id: HOVER_LAYER,
        type: 'line',
        source: SOURCE_ID,
        paint: {
          'line-color': '#000000',
          'line-width': 3,
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
        },
      });

      // Criar GeoJSON com pontos centrais das regiões para labels
      const regionLabels = {
        type: 'FeatureCollection' as const,
        features: regions.map(region => {
          // Calcular centróide aproximado das províncias da região
          const provinceCodes = region.provinces.map(code => PROVINCE_CODES[code]).filter(Boolean);
          
          // Coordenadas médias das províncias (centróide simples)
          const provinceCoords: Record<string, [number, number]> = {
            'NL-DR': [6.5665, 52.9476],  // Drenthe
            'NL-FL': [5.5222, 52.5269],  // Flevoland
            'NL-FR': [5.7985, 53.1641],  // Friesland
            'NL-GE': [5.8987, 52.0451],  // Gelderland
            'NL-GR': [6.5665, 53.2194],  // Groningen
            'NL-LI': [5.9699, 51.4427],  // Limburg
            'NL-NB': [5.3037, 51.6978],  // Noord-Brabant
            'NL-NH': [4.7903, 52.5208],  // Noord-Holland
            'NL-OV': [6.1604, 52.4387],  // Overijssel
            'NL-UT': [5.1214, 52.0907],  // Utrecht
            'NL-ZL': [3.6129, 51.4940],  // Zeeland
            'NL-ZH': [4.4777, 52.0115],  // Zuid-Holland
          };
          
          // Calcular centro da região
          const coords = provinceCodes
            .map(code => provinceCoords[code])
            .filter(Boolean);
          
          const avgLng = coords.reduce((sum, [lng]) => sum + lng, 0) / coords.length;
          const avgLat = coords.reduce((sum, [, lat]) => sum + lat, 0) / coords.length;
          
          return {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [avgLng, avgLat],
            },
            properties: {
              name: region.name,
              color: region.color,
              provinces_count: region.provinces.length,
              churches_count: region.churches_count || 0,
              members_count: region.members_count || 0,
            },
          };
        }),
      };

      // Adicionar source para labels das regiões (usar constantes já declaradas)
      if (map.current.getSource(LABELS_SOURCE_ID)) {
        map.current.removeSource(LABELS_SOURCE_ID);
      }
      
      map.current.addSource(LABELS_SOURCE_ID, {
        type: 'geojson',
        data: regionLabels as any,
      });

      // Layer de background para os labels (círculo colorido)
      map.current.addLayer({
        id: LABELS_BACKGROUND,
        type: 'circle',
        source: LABELS_SOURCE_ID,
        paint: {
          'circle-radius': 35,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.85,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Layer de texto para os labels
      map.current.addLayer({
        id: LABELS_LAYER,
        type: 'symbol',
        source: LABELS_SOURCE_ID,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 13,
          'text-anchor': 'center',
          'text-offset': [0, 0],
          'text-allow-overlap': false,
          'text-ignore-placement': false,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': 'rgba(0, 0, 0, 0.8)',
          'text-halo-width': 1.5,
        },
      });

      // Mapa província → região para interatividade
      const provinceRegionMap: Record<string, string> = {};
      const unassignedProvinces: string[] = [];
      
      regions.forEach(region => {
        region.provinces.forEach(code => {
          const isoCode = PROVINCE_CODES[code];
          if (isoCode) provinceRegionMap[isoCode] = region.name;
        });
      });
      
      // Identificar províncias sem região
      Object.entries(PROVINCE_CODES).forEach(([code, isoCode]) => {
        if (!provinceRegionMap[isoCode]) {
          unassignedProvinces.push(`${code} (${isoCode})`);
        }
      });

      // ====================================================================
      // INTERATIVIDADE: HOVER E DESTAQUE DE PROVÍNCIAS
      // ====================================================================
      let hoveredId: string | number | null = null;

      // Evento de mouse sobre província
      map.current.on('mousemove', FILL_LAYER, (e: any) => {
        if (!map.current || !e.features || e.features.length === 0) return;

        const feature = e.features[0];
        const isoCode = feature.properties?.iso_3166_2;
        const provinceName = feature.properties?.name || isoCode;
        const regionName = provinceRegionMap[isoCode];

        // Cursor pointer
        map.current.getCanvas().style.cursor = 'pointer';

        // Remove hover anterior
        if (hoveredId !== null && hoveredId !== feature.id) {
          map.current.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
        }

        // Adiciona hover atual
        hoveredId = feature.id as string | number;
        if (hoveredId !== null) {
          map.current.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: true });
        }

        // Atualiza estado e callback
        setHoveredProvince(isoCode);
        if (onProvinceHover) {
          onProvinceHover(isoCode, regionName);
        }
      });

      // Evento de mouse saindo da província
      map.current.on('mouseleave', FILL_LAYER, () => {
        if (!map.current) return;
        
        // Remove cursor pointer
        map.current.getCanvas().style.cursor = '';
        
        // Remove hover state
        if (hoveredId !== null) {
          map.current.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false });
        }
        hoveredId = null;
        
        // Limpa estado
        setHoveredProvince(null);
        if (onProvinceHover) {
          onProvinceHover(null);
        }
      });

      if (onProvinceClick) {
        map.current.on('click', FILL_LAYER, (e: any) => {
          if (!map.current || !e.features || e.features.length === 0) return;

          const feature = e.features[0];
          const isoCode = feature.properties?.iso_3166_2;
          const provinceName = feature.properties?.name || isoCode;
          const regionName = provinceRegionMap[isoCode];
          const regionData = regions.find(r => r.name === regionName);

          // Zoom para província
          if (feature.geometry) {
            try {
              const bounds = new maplibregl.LngLatBounds();

              if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates.forEach((ring: any) => {
                  ring.forEach((coord: any) => bounds.extend(coord));
                });
              } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((polygon: any) => {
                  polygon.forEach((ring: any) => {
                    ring.forEach((coord: any) => bounds.extend(coord));
                  });
                });
              }

              map.current!.fitBounds(bounds, {
                padding: 100,
                maxZoom: 10,
                duration: 1500,
              });
            } catch (error) {
              console.error('❌ Erro ao calcular bounds:', error);
            }
          }

          onProvinceClick(isoCode, regionName);
        });
      }

      // Debug info - usar variáveis já declaradas acima
      const mappedCount = Object.keys(provinceRegionMap).length;
      setDebugInfo({
        totalProvinces: Object.keys(PROVINCE_CODES).length,
        mappedProvinces: mappedCount,
        regions: regions.length,
        unmappedProvinces: Object.keys(PROVINCE_CODES).length - mappedCount,
        provinceRegionMap,
        unassignedProvinces,
        geoJsonFeatures: provincesData.features?.length || 0,
      });

    } catch (error) {
      console.error('❌ Erro ao configurar províncias:', error);
      setMapError(`Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    }

  }, [regions, provincesData, mapLoaded, onProvinceClick, onProvinceHover]);

  // ============================================================================
  // MARCADORES
  // ============================================================================

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    markers.forEach(({ lngLat, title, description, color = '#FF0000', popupHTML }) => {
      const marker = new maplibregl.Marker({ color }).setLngLat(lngLat);

      if (title || description || popupHTML) {
        const content = popupHTML || `
          ${title ? `<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${title}</h3>` : ''}
          ${description ? `<p style="margin: 0; font-size: 14px; color: #666;">${description}</p>` : ''}
        `;
        marker.setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(content));
      }

      marker.addTo(map.current!);
      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ position: 'relative', width, height }} className={className}>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}
      />

      {/* Loading */}
      {!mapLoaded && !mapError && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)', zIndex: 10,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              border: '3px solid rgba(255, 255, 255, 0.3)', borderTop: '3px solid #fff',
              borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite',
            }} />
            <p style={{ marginTop: '12px', color: '#666' }}>Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {mapError && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'rgba(255, 0, 0, 0.1)', zIndex: 10,
        }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#dc2626', fontWeight: 600 }}>{mapError}</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              See more details in the console log.
            </p>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      {showDebugPanel && debugInfo && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '16px', borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 100, maxWidth: '350px',
          fontSize: '12px', fontFamily: 'monospace',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
            🗺️ Debug Info
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div><strong>Total Províncias:</strong> {debugInfo.totalProvinces}</div>
            <div><strong>Províncias Mapeadas:</strong> {debugInfo.mappedProvinces} ✅</div>
            <div><strong>Regiões:</strong> {debugInfo.regions}</div>
            <div><strong>Não Mapeadas:</strong> {debugInfo.unmappedProvinces} (cor padrão #d1d5db)</div>
            <div><strong>Features GeoJSON:</strong> {debugInfo.geoJsonFeatures}</div>
            
            {debugInfo.unassignedProvinces && debugInfo.unassignedProvinces.length > 0 && (
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
                <strong>⚠️ Sem região:</strong><br />
                {debugInfo.unassignedProvinces.map((prov: string) => (
                  <div key={prov} style={{ fontSize: '11px', marginTop: '2px' }}>• {prov}</div>
                ))}
              </div>
            )}
            
            {hoveredProvince && (
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                <strong>Hover:</strong> {hoveredProvince}<br />
                <strong>Região:</strong> {debugInfo.provinceRegionMap[hoveredProvince] || 'Sem região (padrão)'}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export const createMarker = (lngLat: [number, number], options?: Partial<MarkerConfig>): MarkerConfig => ({
  lngLat,
  ...options,
});

export const createRegion = (
  id: string,
  name: string,
  color: string,
  provinces: string[],
  options?: Partial<RegionConfig>
): RegionConfig => ({
  id,
  name,
  color,
  provinces,
  ...options,
});

/**
 * COORDENADAS GEOGRÁFICAS DAS CIDADES HOLANDESAS
 * Organizadas por província para facilitar mapeamento de regiões
 */
export const NETHERLANDS_CITIES_COORDS: Record<string, Record<string, [number, number]>> = {
  // Drenthe (DR)
  DR: {
    ASS: [6.5615, 52.9959],  // Assen
    EMM: [6.9015, 52.7793],  // Emmen
    HOV: [6.4764, 52.7268],  // Hoogeveen
    MED: [6.1944, 52.6964],  // Meppel
    COE: [6.7407, 52.6609],  // Coevorden
  },
  // Flevoland (FL)
  FL: {
    LEL: [5.4750, 52.5084],  // Lelystad
    ALM: [5.2647, 52.3508],  // Almere
    EMM: [5.7500, 52.7108],  // Emmeloord
    DRO: [5.7208, 52.5260],  // Dronten
    URK: [5.6014, 52.6633],  // Urk
    ZWO: [5.6333, 52.5667],  // Swifterbant
  },
  // Friesland (FR)
  FR: {
    LWD: [5.7985, 53.2012],  // Leeuwarden
    SNK: [5.6584, 53.0333],  // Sneek
    HRL: [5.9397, 52.9597],  // Heerenveen
    FRA: [5.5414, 53.1875],  // Franeker
    DOK: [5.9939, 53.3243],  // Dokkum
    HAR: [5.4167, 53.1747],  // Harlingen
    IJL: [5.6167, 53.0167],  // IJlst
  },
  // Gelderland (GE)
  GE: {
    ARN: [5.8987, 51.9851],  // Arnhem
    NIM: [5.8520, 51.8126],  // Nijmegen
    APE: [5.9699, 52.2112],  // Apeldoorn
    EDE: [5.6608, 52.0408],  // Ede
    DOE: [6.2886, 51.9653],  // Doetinchem
    WGN: [5.6653, 51.9692],  // Wageningen
    HAR: [5.6215, 52.3508],  // Harderwijk
    WIN: [6.7194, 51.9697],  // Winterswijk
    ZUT: [6.2014, 52.1387],  // Zutphen
    TEL: [5.4292, 51.8858],  // Tiel
  },
  // Groningen (GR)
  GR: {
    GRO: [6.5665, 53.2194],  // Groningen
    WIN: [7.0378, 53.1425],  // Winschoten
    STA: [6.9644, 52.9906],  // Stadskanaal
    VEE: [6.8783, 53.1064],  // Veendam
    DLF: [6.9250, 53.3308],  // Delfzijl
    APP: [6.8578, 53.3217],  // Appingedam
  },
  // Limburg (LI)
  LI: {
    MAA: [5.6913, 50.8514],  // Maastricht
    HRL: [5.9825, 50.8872],  // Heerlen
    SIT: [5.8694, 51.0000],  // Sittard
    GEL: [5.8278, 50.9667],  // Geleen
    KER: [6.0664, 50.8667],  // Kerkrade
    BRU: [5.9708, 50.9453],  // Brunssum
    ROE: [5.9878, 51.1942],  // Roermond
    VEN: [6.1686, 51.3703],  // Venlo
    VEL: [5.9747, 51.5258],  // Venray
    WEE: [5.7053, 51.2517],  // Weert
  },
  // Noord-Brabant (NB)
  NB: {
    EIN: [5.4697, 51.4416],  // Eindhoven
    TIL: [5.0914, 51.5556],  // Tilburg
    BRE: [4.7758, 51.5719],  // Breda
    HER: [5.3048, 51.6853],  // Den Bosch
    HEL: [5.6558, 51.4817],  // Helmond
    OSS: [5.5181, 51.7650],  // Oss
    ROO: [4.4653, 51.5308],  // Roosendaal
    BER: [4.2917, 51.4950],  // Bergen op Zoom
    VEG: [5.5458, 51.6161],  // Veghel
    WAA: [5.0683, 51.6819],  // Waalwijk
  },
  // Noord-Holland (NH)
  NH: {
    AMS: [4.9041, 52.3676],  // Amsterdam
    HAA: [4.6368, 52.3873],  // Haarlem
    ZAN: [4.8267, 52.4389],  // Zaandam
    ALK: [4.7489, 52.6317],  // Alkmaar
    HIL: [5.1719, 52.2233],  // Hilversum
    HOR: [5.0597, 52.6431],  // Hoorn
    PUR: [4.9597, 52.5050],  // Purmerend
    ENK: [5.2944, 52.7028],  // Enkhuizen
    HEE: [4.8500, 52.6708],  // Heerhugowaard
    CAT: [4.6578, 52.5472],  // Castricum
  },
  // Overijssel (OV)
  OV: {
    ZWO: [6.0944, 52.5125],  // Zwolle
    ENS: [6.8958, 52.2183],  // Enschede
    HEN: [6.7936, 52.2650],  // Hengelo
    ALM: [6.6622, 52.3567],  // Almelo
    DEV: [6.1639, 52.2550],  // Deventer
    KAM: [5.9117, 52.5550],  // Kampen
    HAR: [6.6192, 52.5756],  // Hardenberg
    OLD: [6.9292, 52.3128],  // Oldenzaal
    STE: [6.1167, 52.7864],  // Steenwijk
    RIJ: [6.5189, 52.3081],  // Rijssen
  },
  // Utrecht (UT)
  UT: {
    UTR: [5.1214, 52.0907],  // Utrecht
    AME: [5.3878, 52.1561],  // Amersfoort
    NIE: [5.0806, 52.0292],  // Nieuwegein
    VEE: [5.5575, 52.0283],  // Veenendaal
    ZEI: [5.2378, 52.0894],  // Zeist
    WOU: [4.8839, 52.0850],  // Woerden
    IJM: [5.0428, 52.0208],  // IJsselstein
    HOE: [5.1681, 52.0281],  // Houten
    VIA: [5.0931, 51.9922],  // Vianen
    BUN: [5.2050, 52.0683],  // Bunnik
  },
  // Zeeland (ZE)
  ZE: {
    MID: [3.6103, 51.4988],  // Middelburg
    VLI: [3.5736, 51.4425],  // Vlissingen
    TER: [3.8292, 51.3347],  // Terneuzen
    GOE: [3.8883, 51.5028],  // Goes
    ZIE: [3.9178, 51.6500],  // Zierikzee
    HUL: [4.0528, 51.2822],  // Hulst
    AXE: [3.9061, 51.2675],  // Axel
    VEE: [3.5664, 51.5447],  // Veere
  },
  // Zuid-Holland (ZH)
  ZH: {
    DHA: [4.3007, 52.0705],  // The Hague
    ROT: [4.4777, 51.9244],  // Rotterdam
    LEI: [4.4794, 52.1601],  // Leiden
    DOR: [4.6900, 51.8133],  // Dordrecht
    ZOE: [4.4928, 52.0575],  // Zoetermeer
    DEL: [4.3571, 52.0116],  // Delft
    ALB: [4.6572, 52.1283],  // Alphen aan den Rijn
    WES: [4.2500, 52.0167],  // Westland
    GOU: [4.7103, 52.0175],  // Gouda
    SPE: [4.3292, 51.8447],  // Spijkenisse
    RID: [4.6025, 51.8700],  // Ridderkerk
    KAT: [4.3983, 52.2044],  // Katwijk
    NOO: [4.4419, 52.2364],  // Noordwijk
    WAS: [4.4028, 52.1456],  // Wassenaar
  },
};

/**
 * Coordenadas simplificadas para compatibilidade com código existente
 */
export const NETHERLANDS_CITIES = {
  amsterdam: [4.9041, 52.3676] as [number, number],
  rotterdam: [4.4777, 51.9244] as [number, number],
  hague: [4.3007, 52.0705] as [number, number],
  utrecht: [5.1214, 52.0907] as [number, number],
  eindhoven: [5.4697, 51.4416] as [number, number],
  groningen: [6.5665, 53.2194] as [number, number],
  maastricht: [5.6913, 50.8514] as [number, number],
};

export const NETHERLANDS_CENTER: [number, number] = [5.2913, 52.1326];

export const NETHERLANDS_PROVINCES = {
  NLDR: 'Drenthe',
  NLFL: 'Flevoland',
  NLFR: 'Friesland',
  NLGE: 'Gelderland',
  NLGR: 'Groningen',
  NLLI: 'Limburg',
  NLNB: 'Noord-Brabant',
  NLNH: 'Noord-Holland',
  NLOV: 'Overijssel',
  NLUT: 'Utrecht',
  NLZL: 'Zeeland',
  NLZH: 'Zuid-Holland',
} as const;

/**
 * FUNÇÃO HELPER: Gera markers de cidades com cores das regiões
 * 
 * NOVA IMPLEMENTAÇÃO - Trabalha com territory real da API
 * - Parse do JSON territory de cada região
 * - Filtra APENAS cidades registradas no territory
 * - Adiciona debug detalhado
 * - Suporte para churches
 * 
 * @param regions - Array de regiões da API (com territory JSON)
 * @param citiesCoords - Coordenadas de todas as cidades disponíveis
 * @returns Array de MarkerConfig com cores das regiões
 */
export function generateCityMarkers(
  regions: RegionConfig[],
  citiesCoords: Record<string, Record<string, [number, number]>> = NETHERLANDS_CITIES_COORDS
): MarkerConfig[] {
  const markers: MarkerConfig[] = [];
  const debugInfo = {
    totalRegions: regions.length,
    regionsWithTerritory: 0,
    totalCitiesInTerritories: 0,
    markersCreated: 0,
    regionDetails: [] as any[]
  };
  
  regions.forEach((region, index) => {
    let territoryCities: { province: string; city: string }[] = [];
    
    // Parse territory JSON
    if (region.territory) {
      try {
        const parsedTerritory = typeof region.territory === 'string' 
          ? JSON.parse(region.territory) 
          : region.territory;
        
        // Territory format: { NL: { DR: ['ASS', 'EMM'], FL: ['LEL'], ... } }
        if (parsedTerritory && parsedTerritory.NL) {
          Object.entries(parsedTerritory.NL).forEach(([provinceCode, cityCodes]) => {
            if (Array.isArray(cityCodes)) {
              cityCodes.forEach(cityCode => {
                territoryCities.push({ province: provinceCode, city: cityCode });
              });
            }
          });
          debugInfo.regionsWithTerritory++;
        }
      } catch (error) {
        console.error('❌ Erro ao parsear territory:', error);
      }
    }
    
    // Criar markers apenas para cidades no territory
    territoryCities.forEach(({ province, city }) => {
      const coords = citiesCoords[province]?.[city];
      
      if (coords) {
        const cityName = getCityNameFromCoords(province, city);
        const provinceName = NETHERLANDS_PROVINCES[`NL${province}` as keyof typeof NETHERLANDS_PROVINCES] || province;
        
        // Verificar se há church nesta cidade
        const churchesInCity = region.churches?.filter(church => 
          church.city === city || church.city === cityName
        ) || [];
        
        markers.push({
          lngLat: coords,
          title: cityName,
          description: `Região: ${region.name}`,
          color: region.color || '#10b981',
          popupHTML: `
            <div style="padding: 10px; min-width: 220px;">
              <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #111;">
                📍 ${cityName}
              </h3>
              <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
                <strong>Província:</strong> ${provinceName}
              </div>
              <div style="font-size: 13px; margin-bottom: 8px; padding: 8px 12px; background: ${region.color}15; border-left: 3px solid ${region.color}; border-radius: 4px;">
                <strong style="color: ${region.color};">🌍 ${region.name}</strong>
              </div>
              ${churchesInCity.length > 0 ? `
                <div style="font-size: 12px; margin-top: 10px; padding: 8px 12px; background: #f0fdf4; border-left: 3px solid #10b981; border-radius: 4px;">
                  <strong style="color: #10b981;">⛪ ${churchesInCity.length} ${churchesInCity.length === 1 ? 'Igreja' : 'Igrejas'}</strong>
                  <div style="margin-top: 4px; color: #666;">
                    ${churchesInCity.map(ch => `• ${ch.name}`).join('<br/>')}
                  </div>
                </div>
              ` : ''}
            </div>
          `,
        });
        
        debugInfo.markersCreated++;
      }
    });
    
    debugInfo.totalCitiesInTerritories += territoryCities.length;
    debugInfo.regionDetails.push({
      name: region.name,
      color: region.color,
      citiesCount: territoryCities.length,
      markersCreated: territoryCities.filter(tc => citiesCoords[tc.province]?.[tc.city]).length,
      churches: region.churches?.length || 0
    });
  });
  
  return markers;
}

/**
 * FUNÇÃO HELPER: Obtém nome da cidade a partir dos códigos
 */
function getCityNameFromCoords(provinceCode: string, cityCode: string): string {
  // Mapeamento manual de códigos para nomes (baseado em geographicData.ts)
  const cityNames: Record<string, Record<string, string>> = {
    DR: { ASS: 'Assen', EMM: 'Emmen', HOV: 'Hoogeveen', MED: 'Meppel', COE: 'Coevorden' },
    FL: { LEL: 'Lelystad', ALM: 'Almere', EMM: 'Emmeloord', DRO: 'Dronten', URK: 'Urk', ZWO: 'Swifterbant' },
    FR: { LWD: 'Leeuwarden', SNK: 'Sneek', HRL: 'Heerenveen', FRA: 'Franeker', DOK: 'Dokkum', HAR: 'Harlingen', IJL: 'IJlst' },
    GE: { ARN: 'Arnhem', NIM: 'Nijmegen', APE: 'Apeldoorn', EDE: 'Ede', DOE: 'Doetinchem', WGN: 'Wageningen', HAR: 'Harderwijk', WIN: 'Winterswijk', ZUT: 'Zutphen', TEL: 'Tiel' },
    GR: { GRO: 'Groningen', WIN: 'Winschoten', STA: 'Stadskanaal', VEE: 'Veendam', DLF: 'Delfzijl', APP: 'Appingedam' },
    LI: { MAA: 'Maastricht', HRL: 'Heerlen', SIT: 'Sittard', GEL: 'Geleen', KER: 'Kerkrade', BRU: 'Brunssum', ROE: 'Roermond', VEN: 'Venlo', VEL: 'Venray', WEE: 'Weert' },
    NB: { EIN: 'Eindhoven', TIL: 'Tilburg', BRE: 'Breda', HER: 'Den Bosch', HEL: 'Helmond', OSS: 'Oss', ROO: 'Roosendaal', BER: 'Bergen op Zoom', VEG: 'Veghel', WAA: 'Waalwijk' },
    NH: { AMS: 'Amsterdam', HAA: 'Haarlem', ZAN: 'Zaandam', ALK: 'Alkmaar', HIL: 'Hilversum', HOR: 'Hoorn', PUR: 'Purmerend', ENK: 'Enkhuizen', HEE: 'Heerhugowaard', CAT: 'Castricum' },
    OV: { ZWO: 'Zwolle', ENS: 'Enschede', HEN: 'Hengelo', ALM: 'Almelo', DEV: 'Deventer', KAM: 'Kampen', HAR: 'Hardenberg', OLD: 'Oldenzaal', STE: 'Steenwijk', RIJ: 'Rijssen' },
    UT: { UTR: 'Utrecht', AME: 'Amersfoort', NIE: 'Nieuwegein', VEE: 'Veenendaal', ZEI: 'Zeist', WOU: 'Woerden', IJM: 'IJsselstein', HOE: 'Houten', VIA: 'Vianen', BUN: 'Bunnik' },
    ZE: { MID: 'Middelburg', VLI: 'Vlissingen', TER: 'Terneuzen', GOE: 'Goes', ZIE: 'Zierikzee', HUL: 'Hulst', AXE: 'Axel', VEE: 'Veere' },
    ZH: { DHA: 'The Hague', ROT: 'Rotterdam', LEI: 'Leiden', DOR: 'Dordrecht', ZOE: 'Zoetermeer', DEL: 'Delft', ALB: 'Alphen aan den Rijn', WES: 'Westland', GOU: 'Gouda', SPE: 'Spijkenisse', RID: 'Ridderkerk', KAT: 'Katwijk', NOO: 'Noordwijk', WAS: 'Wassenaar' },
  };
  
  return cityNames[provinceCode]?.[cityCode] || cityCode;
}

export const EXAMPLE_REGIONS: RegionConfig[] = [
  {
    id: 'region-norte',
    name: 'Distrito Norte',
    color: '#3b82f6',
    provinces: ['NLGR', 'NLFR', 'NLDR'],
    churches_count: 8,
    members_count: 320,
  },
  {
    id: 'region-oeste',
    name: 'Distrito Oeste',
    color: '#10b981',
    provinces: ['NLNH', 'NLZH', 'NLUT', 'NLFL'],
    churches_count: 15,
    members_count: 650,
  },
  {
    id: 'region-sul',
    name: 'Distrito Sul',
    color: '#f59e0b',
    provinces: ['NLZL', 'NLNB', 'NLLI'],
    churches_count: 12,
    members_count: 480,
  },
  {
    id: 'region-leste',
    name: 'Distrito Leste',
    color: '#ef4444',
    provinces: ['NLOV', 'NLGE'],
    churches_count: 10,
    members_count: 410,
  },
];
