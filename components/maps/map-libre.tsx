'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/**
 * MAPLIBRE GL MAP COMPONENT
 * 
 * Componente de mapa interativo usando MapLibre GL (sem necessidade de token de API)
 * 
 * Features:
 * - Mapa interativo com controles de navegação
 * - Suporte a temas (dark/light)
 * - Controles de geolocalização, tela cheia e escala
 * - Marcadores personalizados
 * - Camadas GeoJSON customizáveis
 * - TypeScript totalmente tipado
 * - Otimizado para Next.js 13+ (Client Component)
 * 
 * @example
 * ```tsx
 * <MapLibre 
 *   center={[-46.6333, -23.5505]} 
 *   zoom={11}
 *   theme="dark"
 *   markers={[
 *     { lngLat: [-46.6333, -23.5505], title: 'São Paulo' }
 *   ]}
 * />
 * ```
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Configuração de marcador personalizado
 */
export interface MarkerConfig {
  /** Coordenadas [longitude, latitude] */
  lngLat: [number, number];
  /** Título do marcador (aparece no popup) */
  title?: string;
  /** Descrição do marcador (aparece no popup) */
  description?: string;
  /** Cor do marcador (formato hex) */
  color?: string;
  /** HTML customizado para o popup */
  popupHTML?: string;
}

/**
 * Configuração de camada GeoJSON
 */
export interface GeoJSONLayerConfig {
  /** ID único da camada */
  id: string;
  /** Dados GeoJSON */
  data: any;
  /** Configuração de estilo da camada */
  style?: {
    type?: 'circle' | 'line' | 'fill' | 'symbol';
    paint?: any;
    layout?: any;
  };
}

/**
 * Configuração de região com províncias
 */
export interface RegionConfig {
  /** ID único da região */
  id: string;
  /** Nome da região */
  name: string;
  /** Cor da região (formato hex) */
  color: string;
  /** Lista de códigos de províncias desta região */
  provinces: string[];
  /** Número de igrejas (opcional) */
  churches_count?: number;
  /** Número de membros (opcional) */
  members_count?: number;
}

/**
 * Props do componente MapLibre
 */
export interface MapLibreProps {
  /** Largura do mapa (CSS) */
  width?: string;
  /** Altura do mapa (CSS) */
  height?: string;
  /** Centro inicial do mapa [longitude, latitude] */
  center?: [number, number];
  /** Nível de zoom inicial (0-22) */
  zoom?: number;
  /** Inclinação inicial do mapa (0-60 graus) */
  pitch?: number;
  /** Tema do mapa */
  theme?: 'dark' | 'light' | 'voyager';
  /** Exibir controles de navegação */
  showControls?: boolean;
  /** Exibir controle de geolocalização */
  showGeolocation?: boolean;
  /** Exibir controle de tela cheia */
  showFullscreen?: boolean;
  /** Exibir controle de escala */
  showScale?: boolean;
  /** Lista de marcadores a serem adicionados */
  markers?: MarkerConfig[];
  /** Lista de camadas GeoJSON a serem adicionadas */
  layers?: GeoJSONLayerConfig[];
  /** Configuração de regiões com províncias (para colorir mapa por região) */
  regions?: RegionConfig[];
  /** URL do GeoJSON das províncias (padrão: Países Baixos) */
  provincesGeoJsonUrl?: string;
  /** Callback quando o mapa é clicado */
  onClick?: (event: maplibregl.MapMouseEvent) => void;
  /** Callback quando o mapa está pronto */
  onLoad?: (map: maplibregl.Map) => void;
  /** Callback quando uma província é clicada */
  onProvinceClick?: (provinceCode: string, regionName?: string) => void;
  /** Callback quando uma província recebe hover */
  onProvinceHover?: (provinceCode: string | null, regionName?: string) => void;
  /** Exibir painel de debug com informações */
  showDebugPanel?: boolean;
  /** Classe CSS adicional para o container */
  className?: string;
}

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

/**
 * URLs dos estilos de mapa gratuitos do CartoCDN
 */
const MAP_STYLES = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
} as const;

/**
 * URL padrão do GeoJSON das províncias dos Países Baixos
 */
const DEFAULT_PROVINCES_GEOJSON_URL = 
  'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/netherlands/netherlands-provinces.json';

/**
 * Mapeamento de códigos de províncias para códigos ISO 3166-2
 * Baseado nos 12 províncias oficiais dos Países Baixos
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
// MAIN COMPONENT
// ============================================================================

/**
 * Gera expressão de cores dinâmica para MapLibre GL
 * Baseado na documentação oficial do MapLibre
 * Formato: ['match', ['get', 'property'], value1, color1, value2, color2, ..., defaultColor]
 */
function generateColorExpression(regions: RegionConfig[]): any[] {
  const matches: any[] = [];
  
  console.log('🎨 Gerando expressão de cores MapLibre...');
  
  regions.forEach(region => {
    console.log(`  📍 Região: ${region.name} (${region.color})`);
    region.provinces.forEach(provinceCode => {
      const isoCode = PROVINCE_CODES[provinceCode];
      if (isoCode) {
        matches.push(isoCode, region.color);
        console.log(`     ✓ ${provinceCode} → ${isoCode} → ${region.color}`);
      } else {
        console.warn(`     ⚠️ Código de província inválido: ${provinceCode}`);
      }
    });
  });
  
  // Expressão completa: ['match', ['get', 'iso_3166_2'], ...matches, defaultColor]
  const expression = ['match', ['get', 'iso_3166_2'], ...matches, '#e5e7eb'];
  
  console.log('✅ Expressão de cores gerada:', expression);
  
  return expression;
}

export default function MapLibre({
  width = '100%',
  height = '500px',
  center = [5.2913, 52.1326], // Países Baixos por padrão
  zoom = 7,
  pitch = 0,
  theme = 'dark',
  showControls = true,
  showGeolocation = true,
  showFullscreen = true,
  showScale = true,
  markers = [],
  layers = [],
  regions = [],
  provincesGeoJsonUrl = DEFAULT_PROVINCES_GEOJSON_URL,
  onClick,
  onLoad,
  onProvinceClick,
  onProvinceHover,
  showDebugPanel = false,
  className = '',
}: MapLibreProps) {
  // ============================================================================
  // STATE & REFS
  // ============================================================================

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [provincesData, setProvincesData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  // Carregar dados das províncias (se regiões foram fornecidas)
  useEffect(() => {
    if (regions.length === 0) return;

    const loadProvincesData = async () => {
      try {
        console.log('🔄 Iniciando carregamento do GeoJSON das províncias...');
        console.log('📍 URL:', provincesGeoJsonUrl);
        
        const response = await fetch(provincesGeoJsonUrl);
        
        console.log('📡 Status da resposta:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('✅ GeoJSON carregado com sucesso!');
        console.log('📊 Tipo de dados:', data.type);
        console.log('📊 Features encontradas:', data.features?.length || 0);
        
        // Validar estrutura do GeoJSON
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error('GeoJSON inválido: não contém array de features');
        }
        
        // Log das províncias encontradas no GeoJSON
        const provincesInData = data.features.map((f: any) => ({
          name: f.properties?.name,
          iso: f.properties?.iso_3166_2,
        }));
        console.log('🗺️ Províncias no GeoJSON:', provincesInData);
        
        setProvincesData(data);
        setMapError(null); // Limpar erro anterior se houver
        
      } catch (error) {
        console.error('❌ ERRO ao carregar GeoJSON das províncias:', error);
        console.error('🔍 Detalhes do erro:', {
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          url: provincesGeoJsonUrl,
          regionsCount: regions.length,
        });
        setMapError(`Erro ao carregar dados das províncias: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };

    loadProvincesData();
  }, [regions, provincesGeoJsonUrl]);

  useEffect(() => {
    // Prevenir inicialização duplicada
    if (map.current || !mapContainer.current) return;

    try {
      // Obter URL do estilo baseado no tema
      const styleUrl = MAP_STYLES[theme];

      // Inicializar o mapa
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: center,
        zoom: zoom,
        pitch: pitch,
      });

      // ============================================================================
      // CONTROLES
      // ============================================================================

      // Controles de navegação (zoom e rotação)
      if (showControls) {
        map.current.addControl(
          new maplibregl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true,
          }),
          'top-right'
        );
      }

      // Controle de geolocalização
      if (showGeolocation) {
        map.current.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          'top-right'
        );
      }

      // Controle de tela cheia
      if (showFullscreen) {
        map.current.addControl(
          new maplibregl.FullscreenControl(),
          'top-right'
        );
      }

      // Controle de escala
      if (showScale) {
        map.current.addControl(
          new maplibregl.ScaleControl({
            maxWidth: 200,
            unit: 'metric',
          }),
          'bottom-right'
        );
      }

      // ============================================================================
      // EVENT HANDLERS
      // ============================================================================

      // Evento de carregamento do mapa
      map.current.on('load', () => {
        setMapLoaded(true);
        if (onLoad && map.current) {
          onLoad(map.current);
        }
      });

      // Evento de erro
      map.current.on('error', (e) => {
        console.error('MapLibre Error:', e);
        setMapError('Erro ao carregar o mapa');
      });

      // Evento de clique
      if (onClick) {
        map.current.on('click', onClick);
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Falha na inicialização do mapa');
    }

    // ============================================================================
    // CLEANUP
    // ============================================================================

    return () => {
      // Remover marcadores
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Remover mapa
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Array vazio = executa apenas uma vez

  // ============================================================================
  // PROVINCES & REGIONS MANAGEMENT
  // ============================================================================

  useEffect(() => {
    if (!map.current || !mapLoaded || !provincesData || regions.length === 0) return;

    console.log('🎨 Iniciando configuração de regiões e províncias...');
    console.log('📊 Regiões fornecidas:', regions.length);
    console.log('📊 Dados GeoJSON carregados:', !!provincesData);

    const PROVINCES_SOURCE_ID = 'provinces';
    const PROVINCES_LAYER_ID = 'provinces-layer';
    const PROVINCES_BORDER_LAYER_ID = 'provinces-border';
    const PROVINCES_HOVER_LAYER_ID = 'provinces-hover';

    // Remover camadas e source existentes
    if (map.current.getLayer(PROVINCES_HOVER_LAYER_ID)) {
      map.current.removeLayer(PROVINCES_HOVER_LAYER_ID);
      console.log('🗑️ Camada de hover removida');
    }
    if (map.current.getLayer(PROVINCES_BORDER_LAYER_ID)) {
      map.current.removeLayer(PROVINCES_BORDER_LAYER_ID);
      console.log('🗑️ Camada de borda removida');
    }
    if (map.current.getLayer(PROVINCES_LAYER_ID)) {
      map.current.removeLayer(PROVINCES_LAYER_ID);
      console.log('🗑️ Camada de províncias removida');
    }
    if (map.current.getSource(PROVINCES_SOURCE_ID)) {
      map.current.removeSource(PROVINCES_SOURCE_ID);
      console.log('🗑️ Source de províncias removido');
    }

    // Criar mapa de província -> cor baseado nas regiões
    const provinceColorMap: Record<string, string> = {};
    const provinceRegionMap: Record<string, string> = {};
    
    console.log('🔄 Processando mapeamento de regiões...');
    
    regions.forEach((region) => {
      console.log(`  📍 Região: ${region.name} (${region.color})`);
      console.log(`     Províncias: ${region.provinces.join(', ')}`);
      
      region.provinces.forEach((provinceCode) => {
        const isoCode = PROVINCE_CODES[provinceCode];
        if (isoCode) {
          provinceColorMap[isoCode] = region.color;
          provinceRegionMap[isoCode] = region.name;
          console.log(`     ✓ ${provinceCode} → ${isoCode} → ${region.color}`);
        } else {
          console.warn(`     ⚠️ Código de província inválido: ${provinceCode}`);
        }
      });
    });

    console.log('📊 Mapeamento final:');
    console.log('   Total de províncias mapeadas:', Object.keys(provinceColorMap).length);
    console.log('   Províncias esperadas:', Object.keys(PROVINCE_CODES).length);
    console.log('   Mapa de cores:', provinceColorMap);

    // Adicionar source das províncias
    map.current.addSource(PROVINCES_SOURCE_ID, {
      type: 'geojson',
      data: provincesData,
    });
    console.log('✅ Source de províncias adicionado');

    // Criar expressão de cores para as províncias
    const colorExpression: any = ['match', ['get', 'iso_3166_2']];
    Object.entries(provinceColorMap).forEach(([isoCode, color]) => {
      colorExpression.push(isoCode, color);
    });
    colorExpression.push('#e5e7eb'); // Cor padrão (cinza claro)
    
    console.log('🎨 Expressão de cores criada:', colorExpression);

    // Camada de preenchimento das províncias
    map.current.addLayer({
      id: PROVINCES_LAYER_ID,
      type: 'fill',
      source: PROVINCES_SOURCE_ID,
      paint: {
        'fill-color': colorExpression,
        'fill-opacity': 0.7,
      },
    } as any);
    console.log('✅ Camada de preenchimento adicionada');

    // Camada de borda das províncias
    map.current.addLayer({
      id: PROVINCES_BORDER_LAYER_ID,
      type: 'line',
      source: PROVINCES_SOURCE_ID,
      paint: {
        'line-color': '#ffffff',
        'line-width': 2,
        'line-opacity': 0.8,
      },
    } as any);
    console.log('✅ Camada de borda adicionada');

    // Camada de hover
    map.current.addLayer({
      id: PROVINCES_HOVER_LAYER_ID,
      type: 'line',
      source: PROVINCES_SOURCE_ID,
      paint: {
        'line-color': '#000000',
        'line-width': 3,
        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0
        ],
      },
    } as any);
    console.log('✅ Camada de hover adicionada');

    // Event handlers para interação com províncias
    let hoveredProvinceId: string | number | null = null;

    // Mouse move para hover
    map.current.on('mousemove', PROVINCES_LAYER_ID, (e) => {
      if (!map.current || !e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const provinceIsoCode = feature.properties?.iso_3166_2;

      // Atualizar cursor
      map.current.getCanvas().style.cursor = 'pointer';

      // Remover hover anterior
      if (hoveredProvinceId !== null) {
        map.current.setFeatureState(
          { source: PROVINCES_SOURCE_ID, id: hoveredProvinceId },
          { hover: false }
        );
      }

      // Adicionar novo hover
      hoveredProvinceId = feature.id as string | number;
      map.current.setFeatureState(
        { source: PROVINCES_SOURCE_ID, id: hoveredProvinceId },
        { hover: true }
      );

      setHoveredProvince(provinceIsoCode);

      // Callback de hover
      if (onProvinceHover) {
        onProvinceHover(provinceIsoCode, provinceRegionMap[provinceIsoCode]);
      }
    });

    // Mouse leave
    map.current.on('mouseleave', PROVINCES_LAYER_ID, () => {
      if (!map.current) return;

      map.current.getCanvas().style.cursor = '';

      if (hoveredProvinceId !== null) {
        map.current.setFeatureState(
          { source: PROVINCES_SOURCE_ID, id: hoveredProvinceId },
          { hover: false }
        );
      }

      hoveredProvinceId = null;
      setHoveredProvince(null);

      // Callback de hover
      if (onProvinceHover) {
        onProvinceHover(null);
      }
    });

    // Click handler com zoom para a província/região
    if (onProvinceClick) {
      map.current.on('click', PROVINCES_LAYER_ID, (e) => {
        if (!e.features || e.features.length === 0) return;

        const feature = e.features[0];
        const provinceIsoCode = feature.properties?.iso_3166_2;
        const regionName = provinceRegionMap[provinceIsoCode];

        console.log('🖱️ Província clicada:', {
          province: provinceIsoCode,
          region: regionName,
          feature: feature.properties,
        });

        // Calcular bounds da província clicada
        if (map.current && feature.geometry) {
          try {
            // Criar um bbox (bounding box) para a feature
            const bounds = new maplibregl.LngLatBounds();
            
            // Função para processar coordenadas e adicionar ao bounds
            const addCoordinatesToBounds = (coords: any) => {
              if (Array.isArray(coords[0])) {
                coords.forEach((coord: any) => addCoordinatesToBounds(coord));
              } else {
                bounds.extend(coords as [number, number]);
              }
            };

            // Processar geometria baseado no tipo
            if (feature.geometry.type === 'Polygon') {
              feature.geometry.coordinates.forEach((ring: any) => {
                ring.forEach((coord: any) => bounds.extend(coord as [number, number]));
              });
            } else if (feature.geometry.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((polygon: any) => {
                polygon.forEach((ring: any) => {
                  ring.forEach((coord: any) => bounds.extend(coord as [number, number]));
                });
              });
            }

            // Aplicar zoom suave para a província
            map.current.fitBounds(bounds, {
              padding: { top: 100, bottom: 100, left: 100, right: 100 },
              maxZoom: 10,
              duration: 1500, // Animação de 1.5 segundos
            });

            console.log('� Zoom aplicado para província:', provinceIsoCode);
          } catch (error) {
            console.error('❌ Erro ao calcular bounds:', error);
          }
        }

        // Chamar callback
        onProvinceClick(provinceIsoCode, regionName);
      });
    }

    // Log de debug final
    console.log('✅ Configuração de províncias concluída!');
    console.log('📊 Resumo:', {
      totalProvinces: Object.keys(PROVINCE_CODES).length,
      mappedProvinces: Object.keys(provinceColorMap).length,
      regions: regions.length,
      unmappedProvinces: Object.keys(PROVINCE_CODES).length - Object.keys(provinceColorMap).length,
    });

    // Atualizar informações de debug
    setDebugInfo({
      totalProvinces: Object.keys(PROVINCE_CODES).length,
      mappedProvinces: Object.keys(provinceColorMap).length,
      regions: regions.length,
      unmappedProvinces: Object.keys(PROVINCE_CODES).length - Object.keys(provinceColorMap).length,
      provinceColorMap,
      provinceRegionMap,
      geoJsonFeatures: provincesData.features?.length || 0,
    });

  }, [regions, provincesData, mapLoaded, onProvinceClick, onProvinceHover]);

  // ============================================================================
  // MARKERS MANAGEMENT
  // ============================================================================

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remover marcadores existentes
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Adicionar novos marcadores
    markers.forEach((markerConfig) => {
      const { lngLat, title, description, color = '#FF0000', popupHTML } = markerConfig;

      const marker = new maplibregl.Marker({ color });
      marker.setLngLat(lngLat);

      // Adicionar popup se houver título ou descrição
      if (title || description || popupHTML) {
        const popupContent = popupHTML || `
          ${title ? `<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${title}</h3>` : ''}
          ${description ? `<p style="margin: 0; font-size: 14px; color: #666;">${description}</p>` : ''}
        `;

        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
        }).setHTML(popupContent);

        marker.setPopup(popup);
      }

      marker.addTo(map.current!);
      markersRef.current.push(marker);
    });
  }, [markers, mapLoaded]);

  // ============================================================================
  // LAYERS MANAGEMENT
  // ============================================================================

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    layers.forEach((layerConfig) => {
      const { id, data, style } = layerConfig;

      // Remover source e layer se já existirem
      if (map.current!.getLayer(id)) {
        map.current!.removeLayer(id);
      }
      if (map.current!.getSource(id)) {
        map.current!.removeSource(id);
      }

      // Adicionar source
      map.current!.addSource(id, {
        type: 'geojson',
        data: data,
      });

      // Adicionar layer com estilo customizado
      const layerStyle = style || {};
      map.current!.addLayer({
        id: id,
        type: layerStyle.type || 'circle',
        source: id,
        paint: layerStyle.paint || {
          'circle-radius': 8,
          'circle-color': '#007cbf',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
        layout: layerStyle.layout || {},
      } as any);
    });
  }, [layers, mapLoaded]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ position: 'relative', width, height }} className={className}>
      {/* Container do mapa */}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />

      {/* Loading indicator */}
      {!mapLoaded && !mapError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTop: '3px solid #fff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p style={{ marginTop: '12px', color: '#666' }}>Carregando mapa...</p>
          </div>
        </div>
      )}

      {/* Error indicator */}
      {mapError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            zIndex: 10,
          }}
        >
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
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 100,
            maxWidth: '300px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '14px' }}>
            🗺️ Debug Info
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>
              <strong>Total Províncias:</strong> {debugInfo.totalProvinces}
            </div>
            <div>
              <strong>Províncias Mapeadas:</strong> {debugInfo.mappedProvinces}
            </div>
            <div>
              <strong>Regiões:</strong> {debugInfo.regions}
            </div>
            <div>
              <strong>Não Mapeadas:</strong> {debugInfo.unmappedProvinces}
            </div>
            <div>
              <strong>Features GeoJSON:</strong> {debugInfo.geoJsonFeatures}
            </div>
            {hoveredProvince && (
              <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                <strong>Hover:</strong> {hoveredProvince}
                <br />
                <strong>Região:</strong> {debugInfo.provinceRegionMap[hoveredProvince] || 'N/A'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS para animação de loading */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// UTILITY FUNCTIONS (EXPORTADAS)
// ============================================================================

/**
 * Helper para criar configuração de marcador
 */
export const createMarker = (
  lngLat: [number, number],
  options?: Partial<MarkerConfig>
): MarkerConfig => ({
  lngLat,
  ...options,
});

/**
 * Helper para criar configuração de camada GeoJSON
 */
export const createGeoJSONLayer = (
  id: string,
  data: any,
  style?: GeoJSONLayerConfig['style']
): GeoJSONLayerConfig => ({
  id,
  data,
  style,
});

/**
 * Helper para criar configuração de região
 */
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
 * Coordenadas de cidades importantes dos Países Baixos
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

/**
 * Centro geográfico dos Países Baixos
 */
export const NETHERLANDS_CENTER: [number, number] = [5.2913, 52.1326];

/**
 * Lista de todas as províncias dos Países Baixos com seus códigos
 */
export const NETHERLANDS_PROVINCES = {
  NLGR: 'Groningen',
  NLFR: 'Friesland',
  NLDR: 'Drenthe',
  NLNH: 'Noord-Holland',
  NLZH: 'Zuid-Holland',
  NLUT: 'Utrecht',
  NLFL: 'Flevoland',
  NLZL: 'Zeeland',
  NLNB: 'Noord-Brabant',
  NLLI: 'Limburg',
  NLOV: 'Overijssel',
  NLGE: 'Gelderland',
} as const;

/**
 * Exemplo de configuração de regiões
 */
export const EXAMPLE_REGIONS: RegionConfig[] = [
  {
    id: 'region-norte',
    name: 'Distrito Norte',
    color: '#3b82f6', // blue
    provinces: ['NLGR', 'NLFR', 'NLDR'],
    churches_count: 8,
    members_count: 320,
  },
  {
    id: 'region-oeste',
    name: 'Distrito Oeste',
    color: '#10b981', // green
    provinces: ['NLNH', 'NLZH', 'NLUT', 'NLFL'],
    churches_count: 15,
    members_count: 650,
  },
  {
    id: 'region-sul',
    name: 'Distrito Sul',
    color: '#f59e0b', // amber
    provinces: ['NLZL', 'NLNB', 'NLLI'],
    churches_count: 12,
    members_count: 480,
  },
  {
    id: 'region-leste',
    name: 'Distrito Leste',
    color: '#ef4444', // red
    provinces: ['NLOV', 'NLGE'],
    churches_count: 10,
    members_count: 410,
  },
];
