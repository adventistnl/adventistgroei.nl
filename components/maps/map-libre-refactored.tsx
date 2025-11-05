'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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
  provinces: string[];
  churches_count?: number;
  members_count?: number;
}

export interface MapLibreProps {
  width?: string;
  height?: string;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  theme?: 'dark' | 'light' | 'voyager';
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
  
  console.log('🎨 Gerando expressão de cores MapLibre...');
  console.log(`📋 Propriedade GeoJSON: ${propertyName}`);
  
  // Adicionar províncias que têm região atribuída
  regions.forEach(region => {
    console.log(`  📍 Região: ${region.name} (${region.color})`);
    region.provinces.forEach(provinceCode => {
      const isoCode = PROVINCE_CODES[provinceCode];
      if (isoCode) {
        matches.push(isoCode, region.color);
        assignedProvinces.add(isoCode);
        console.log(`     ✓ ${provinceCode} → ${isoCode} → ${region.color}`);
      } else {
        console.warn(`     ⚠️ Código de província inválido: ${provinceCode}`);
      }
    });
  });
  
  // Adicionar províncias não atribuídas com cor padrão
  Object.entries(PROVINCE_CODES).forEach(([code, isoCode]) => {
    if (!assignedProvinces.has(isoCode)) {
      matches.push(isoCode, '#d1d5db'); // Cor cinza monocromática
      console.log(`     ○ ${code} → ${isoCode} → #d1d5db (sem região)`);
    }
  });
  
  console.log(`📊 Total: ${assignedProvinces.size} com região, ${Object.keys(PROVINCE_CODES).length - assignedProvinces.size} sem região`);
  
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
  theme = 'light',
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

  // ============================================================================
  // CARREGAR GEOJSON DAS PROVÍNCIAS
  // ============================================================================

  useEffect(() => {
    if (regions.length === 0) return;

    const loadProvincesData = async () => {
      try {
        console.log('🔄 Carregando GeoJSON das províncias...');
        console.log('📍 URL:', provincesGeoJsonUrl);
        
        const response = await fetch(provincesGeoJsonUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - URL pode estar indisponível`);
        }
        
        const data = await response.json();
        
        console.log('✅ GeoJSON carregado com sucesso!');
        console.log('📊 Features encontradas:', data.features?.length || 0);
        
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error('GeoJSON inválido: não contém array de features');
        }

        // Debug: mostrar propriedades da primeira feature
        if (data.features.length > 0) {
          console.log('🔍 Propriedades disponíveis:', Object.keys(data.features[0].properties || {}));
          console.log('🔍 Exemplo de propriedades:', data.features[0].properties);
        }
        
        setProvincesData(data);
        setMapError(null);
        
      } catch (error) {
        console.error('❌ ERRO ao carregar GeoJSON:', error);
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        setMapError(`Falha ao carregar províncias: ${errorMsg}`);
        
        // Tentar URL alternativa
        if (provincesGeoJsonUrl.includes('cartomap')) {
          console.log('⚠️ Tentando URL alternativa...');
          try {
            const altUrl = 'https://raw.githubusercontent.com/benassa-de-glassa/netherlands_地域_geography/master/provinces.geojson';
            const altResponse = await fetch(altUrl);
            if (altResponse.ok) {
              const altData = await altResponse.json();
              console.log('✅ URL alternativa funcionou!');
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
      console.log('🗺️ Inicializando MapLibre GL...');
      
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: MAP_STYLES[theme],
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
        console.log('✅ Mapa carregado!');
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
  // CONFIGURAR PROVÍNCIAS E REGIÕES
  // ============================================================================

  useEffect(() => {
    if (!map.current || !mapLoaded || !provincesData || regions.length === 0) {
      console.log('⏳ Aguardando condições:', {
        mapExists: !!map.current,
        mapLoaded,
        provincesLoaded: !!provincesData,
        regionsCount: regions.length
      });
      return;
    }

    console.log('🎨 Configurando províncias e regiões...');

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
      console.log('✅ Source adicionado');

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
        
        console.log(`🔍 Usando propriedade: ${propertyName}`);
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
      console.log('✅ Layer de preenchimento adicionado');

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
      console.log('✅ Layer de contorno adicionado');

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
      console.log('✅ Layer de hover adicionado');

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
      
      console.log('✅ Labels das regiões adicionados');

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

        // LOG DETALHADO DO HOVER
        console.group('🖱️ HOVER NA PROVÍNCIA');
        console.log('📍 Código ISO:', isoCode);
        console.log('🏷️ Nome:', provinceName);
        console.log('🌍 Região:', regionName || '⚠️ Sem região atribuída');
        console.log('🎨 Cor:', regionName ? regions.find(r => r.name === regionName)?.color : '#d1d5db (padrão)');
        console.log('📊 Feature ID:', feature.id);
        console.log('� Propriedades completas:', feature.properties);
        console.groupEnd();

        // Atualiza estado e callback
        setHoveredProvince(isoCode);
        if (onProvinceHover) {
          onProvinceHover(isoCode, regionName);
        }
      });

      // Evento de mouse saindo da província
      map.current.on('mouseleave', FILL_LAYER, () => {
        if (!map.current) return;
        
        // Log de saída do hover
        if (hoveredId !== null) {
          console.log('👋 Mouse saiu da província');
        }
        
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

          // LOG DETALHADO DO CLICK
          console.group('🖱️ CLICK NA PROVÍNCIA');
          console.log('� Código ISO:', isoCode);
          console.log('🏷️ Nome:', provinceName);
          console.log('🌍 Região:', regionName || '⚠️ Sem região atribuída');
          console.log('🎨 Cor:', regionData?.color || '#d1d5db (padrão)');
          console.log('⛪ Igrejas na região:', regionData?.churches_count || 'N/A');
          console.log('👥 Membros na região:', regionData?.members_count || 'N/A');
          console.log('📊 Feature ID:', feature.id);
          console.log('📐 Coordenadas do click:', {
            lng: e.lngLat.lng.toFixed(4),
            lat: e.lngLat.lat.toFixed(4)
          });
          console.log('📝 Propriedades completas:', feature.properties);
          console.log('🗺️ Geometria:', feature.geometry?.type);
          console.groupEnd();

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
              
              console.log('🔍 Zoom aplicado para:', provinceName);
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

      console.log('✅ Configuração concluída!', {
        mapped: mappedCount,
        total: Object.keys(PROVINCE_CODES).length,
        unassigned: unassignedProvinces.length,
      });
      
      if (unassignedProvinces.length > 0) {
        console.log('⚠️ Províncias sem região (cor padrão #d1d5db):', unassignedProvinces);
      }

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
              Verifique o console para mais detalhes
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
