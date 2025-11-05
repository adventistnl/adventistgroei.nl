'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';

const geoUrl = 'https://cartomap.github.io/nl/wgs84/provincie_2020.topojson';

// Cores vibrantes para cada província
const provinceColors: Record<string, string> = {
  'Groningen': '#EF4444',
  'Friesland': '#F59E0B',
  'Drenthe': '#10B981',
  'Overijssel': '#3B82F6',
  'Flevoland': '#8B5CF6',
  'Gelderland': '#EC4899',
  'Utrecht': '#14B8A6',
  'Noord-Holland': '#F43F5E',
  'Zuid-Holland': '#8B5CF6',
  'Zeeland': '#0EA5E9',
  'Noord-Brabant': '#F97316',
  'Limburg': '#84CC16'
};

// Principais cidades por província com coordenadas
const citiesByProvince: Record<string, Array<{name: string, lat: number, lng: number}>> = {
  'Groningen': [
    { name: 'Groningen', lat: 53.2194, lng: 6.5665 },
    { name: 'Delfzijl', lat: 53.3308, lng: 6.9214 },
    { name: 'Winschoten', lat: 53.1427, lng: 7.0339 }
  ],
  'Friesland': [
    { name: 'Leeuwarden', lat: 53.2012, lng: 5.7999 },
    { name: 'Sneek', lat: 53.0333, lng: 5.6583 },
    { name: 'Heerenveen', lat: 52.9597, lng: 5.9197 }
  ],
  'Drenthe': [
    { name: 'Assen', lat: 52.9960, lng: 6.5623 },
    { name: 'Emmen', lat: 52.7793, lng: 6.8954 },
    { name: 'Hoogeveen', lat: 52.7227, lng: 6.4763 }
  ],
  'Overijssel': [
    { name: 'Zwolle', lat: 52.5168, lng: 6.0830 },
    { name: 'Enschede', lat: 52.2184, lng: 6.8961 },
    { name: 'Almelo', lat: 52.3560, lng: 6.6627 }
  ],
  'Flevoland': [
    { name: 'Lelystad', lat: 52.5082, lng: 5.4752 },
    { name: 'Almere', lat: 52.3702, lng: 5.2141 },
    { name: 'Dronten', lat: 52.5243, lng: 5.7198 }
  ],
  'Gelderland': [
    { name: 'Arnhem', lat: 51.9851, lng: 5.8987 },
    { name: 'Nijmegen', lat: 51.8126, lng: 5.8372 },
    { name: 'Apeldoorn', lat: 52.2110, lng: 5.9699 }
  ],
  'Utrecht': [
    { name: 'Utrecht', lat: 52.0907, lng: 5.1214 },
    { name: 'Amersfoort', lat: 52.1561, lng: 5.3878 },
    { name: 'Nieuwegein', lat: 52.0293, lng: 5.0802 }
  ],
  'Noord-Holland': [
    { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
    { name: 'Haarlem', lat: 52.3874, lng: 4.6462 },
    { name: 'Alkmaar', lat: 52.6323, lng: 4.7483 }
  ],
  'Zuid-Holland': [
    { name: 'Rotterdam', lat: 51.9244, lng: 4.4777 },
    { name: 'Den Haag', lat: 52.0705, lng: 4.3007 },
    { name: 'Leiden', lat: 52.1601, lng: 4.4970 }
  ],
  'Zeeland': [
    { name: 'Middelburg', lat: 51.4988, lng: 3.6109 },
    { name: 'Vlissingen', lat: 51.4427, lng: 3.5734 },
    { name: 'Goes', lat: 51.5050, lng: 3.8883 }
  ],
  'Noord-Brabant': [
    { name: 'Eindhoven', lat: 51.4416, lng: 5.4697 },
    { name: 's-Hertogenbosch', lat: 51.6978, lng: 5.3037 },
    { name: 'Tilburg', lat: 51.5555, lng: 5.0913 }
  ],
  'Limburg': [
    { name: 'Maastricht', lat: 50.8514, lng: 5.6910 },
    { name: 'Venlo', lat: 51.3704, lng: 6.1724 },
    { name: 'Heerlen', lat: 50.8836, lng: 5.9795 }
  ]
};

// Calcular densidade baseada no nível de zoom
const getDensityByZoom = (zoom: number): number => {
  if (zoom < 1.5) return 0.02;      // Zoom baixo: visão geral
  if (zoom < 2.5) return 0.012;     // Zoom médio: mais detalhes
  if (zoom < 4) return 0.008;       // Zoom alto: ainda mais pontos
  if (zoom < 6) return 0.005;       // Zoom muito alto: definição extrema
  return 0.003;                     // Zoom máximo: ultra detalhado
};

// Determinar o que mostrar baseado no zoom
const getDetailLevel = (zoom: number): 'country' | 'provinces' | 'cities' => {
  if (zoom < 2) return 'country';
  if (zoom < 5) return 'provinces';
  return 'cities';
};

// Função para converter polígono em pontos com máxima densidade
function polygonToPoints(coordinates: any[], density: number = 0.01): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  
  const processCoordinates = (coords: any[]) => {
    if (!coords || coords.length === 0) return;
    
    // Processar bordas
    for (let i = 0; i < coords.length - 1; i++) {
      const [x1, y1] = coords[i];
      const [x2, y2] = coords[i + 1];
      
      const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const numPoints = Math.max(5, Math.floor(distance / density));
      
      for (let j = 0; j < numPoints; j++) {
        const t = j / numPoints;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        points.push([x, y]);
      }
    }
  };
  
  // Função para preencher o interior do polígono
  const fillPolygon = (coords: any[]) => {
    if (!coords || coords.length === 0) return;
    
    // Encontrar bounding box
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    coords.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
    
    // Criar grid de pontos dentro do polígono
    const step = density * 1.5; // Espaçamento entre pontos internos
    
    for (let x = minX; x <= maxX; x += step) {
      for (let y = minY; y <= maxY; y += step) {
        // Verificar se o ponto está dentro do polígono (ray casting)
        if (isPointInPolygon([x, y], coords)) {
          points.push([x, y]);
        }
      }
    }
  };
  
  // Verificar se ponto está dentro do polígono (ray casting algorithm)
  const isPointInPolygon = (point: [number, number], polygon: any[]): boolean => {
    const [x, y] = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      
      const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  };
  
  if (coordinates[0] && Array.isArray(coordinates[0][0])) {
    coordinates.forEach(ring => {
      processCoordinates(ring);
      fillPolygon(ring);
    });
  } else {
    processCoordinates(coordinates);
    fillPolygon(coordinates);
  }
  
  return points;
}

export function NetherlandsMapTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([5.5, 52.2]);
  const [isDragging, setIsDragging] = useState(false);
  const [detailLevel, setDetailLevel] = useState<'country' | 'provinces' | 'cities'>('country');
  const [pointCount, setPointCount] = useState(0);

  useEffect(() => {
    console.log('🗺️ NetherlandsMapTest mounted');
    console.log('📍 GeoURL:', geoUrl);
    
    // Test fetch
    fetch(geoUrl)
      .then(res => {
        console.log('✅ TopoJSON fetch successful:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('✅ TopoJSON parsed:', data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ TopoJSON fetch failed:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.5, 8);
    setZoom(newZoom);
    setDetailLevel(getDetailLevel(newZoom));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.5, 1);
    setZoom(newZoom);
    setDetailLevel(getDetailLevel(newZoom));
  };

  const handleReset = () => {
    setZoom(1);
    setCenter([5.5, 52.2]);
    setDetailLevel('country');
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-gradient-to-br from-blue-100 to-green-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-700">Carregando mapa dos Países Baixos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[600px] bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-200">
        <div className="text-center p-8">
          <p className="text-2xl mb-2">❌</p>
          <p className="text-lg font-semibold text-red-700 mb-2">Erro ao carregar mapa</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-900">
              🗺️ Mapa Progressivo Multi-Nível - Países Baixos
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Zoom dinâmico: País → Províncias → Cidades • Densidade aumenta automaticamente
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              title="Zoom In"
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="Reset View"
              className="h-8 w-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl border-4 border-slate-700 shadow-2xl p-8">
        <div 
          className={`relative w-full h-[700px] bg-slate-950 rounded-xl shadow-inner overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: center,
              scale: 8000
            }}
            width={800}
            height={1000}
            className="w-full h-full"
          >
            <ZoomableGroup
              center={center}
              zoom={zoom}
              onMoveStart={() => setIsDragging(true)}
              onMoveEnd={(position) => {
                setIsDragging(false);
                setCenter(position.coordinates);
                const newZoom = position.zoom;
                setZoom(newZoom);
                setDetailLevel(getDetailLevel(newZoom));
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  const density = getDensityByZoom(zoom);
                  let totalPoints = 0;
                  
                  console.log(`🎨 Zoom: ${zoom.toFixed(2)}x | Densidade: ${density} | Nível: ${detailLevel}`);
                  
                  return geographies.map((geo, index) => {
                    const provinceName = geo.properties?.provincienaam || geo.properties?.name || `Province ${index}`;
                    const color = provinceColors[provinceName] || '#94A3B8';
                    
                    // Converter geometria em pontos com densidade dinâmica baseada no zoom
                    const coordinates = geo.geometry.coordinates;
                    let allPoints: Array<[number, number]> = [];
                    
                    if (geo.geometry.type === 'Polygon') {
                      allPoints = polygonToPoints(coordinates[0], density);
                    } else if (geo.geometry.type === 'MultiPolygon') {
                      coordinates.forEach((polygon: any) => {
                        allPoints = allPoints.concat(polygonToPoints(polygon[0], density));
                      });
                    }
                    
                    totalPoints += allPoints.length;
                    if (index === geographies.length - 1) {
                      setPointCount(totalPoints);
                    }
                    
                    console.log(`🏛️ ${provinceName}: ${allPoints.length} pontos`);

                    return (
                      <g key={geo.rsmKey}>
                        {allPoints.map((point, i) => (
                          <circle
                            key={`${geo.rsmKey}-${i}`}
                            cx={point[0]}
                            cy={point[1]}
                            r={Math.max(0.3, 0.6 / zoom)}
                            fill={color}
                            opacity={hoveredProvince === provinceName ? 1 : 0.85}
                            style={{
                              cursor: 'pointer',
                              transition: 'opacity 0.15s, r 0.15s'
                            }}
                            onMouseEnter={() => {
                              if (!isDragging) {
                                setHoveredProvince(provinceName);
                              }
                            }}
                            onMouseLeave={() => {
                              setHoveredProvince(null);
                            }}
                            onClick={() => {
                              if (!isDragging) {
                                console.log('🖱️ Click:', provinceName);
                                alert(`Você clicou em: ${provinceName}`);
                              }
                            }}
                          />
                        ))}
                      </g>
                    );
                  });
                }}
              </Geographies>

              {/* Labels de País (zoom < 2) */}
              {detailLevel === 'country' && (
                <text
                  x="5.5"
                  y="52.2"
                  textAnchor="middle"
                  fill="white"
                  fontSize={Math.max(1.5, 3 / zoom)}
                  fontWeight="bold"
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 0 8px rgba(0,0,0,0.8)',
                    letterSpacing: '0.1em'
                  }}
                >
                  🇳🇱 PAÍSES BAIXOS
                </text>
              )}

              {/* Labels de Províncias (2 < zoom < 5) */}
              {detailLevel === 'provinces' && (
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const provinceName = geo.properties?.provincienaam || geo.properties?.name || '';
                      if (!provinceName) return null;

                      // Calcular centróide aproximado
                      const coords = geo.geometry.type === 'Polygon' 
                        ? geo.geometry.coordinates[0]
                        : geo.geometry.coordinates[0][0];
                      
                      let sumX = 0, sumY = 0, count = 0;
                      coords.forEach(([x, y]: [number, number]) => {
                        sumX += x;
                        sumY += y;
                        count++;
                      });
                      const centroidX = sumX / count;
                      const centroidY = sumY / count;

                      return (
                        <text
                          key={`label-${geo.rsmKey}`}
                          x={centroidX}
                          y={centroidY}
                          textAnchor="middle"
                          fill="white"
                          fontSize={Math.max(0.4, 0.8 / zoom)}
                          fontWeight="bold"
                          style={{
                            pointerEvents: 'none',
                            textShadow: '0 0 4px rgba(0,0,0,0.9)'
                          }}
                        >
                          {provinceName}
                        </text>
                      );
                    })
                  }
                </Geographies>
              )}

              {/* Labels de Cidades (zoom >= 5) */}
              {detailLevel === 'cities' && Object.entries(citiesByProvince).map(([province, cities]) => {
                const color = provinceColors[province] || '#FFFFFF';
                
                return cities.map((city) => {
                  const isHovered = hoveredCity === city.name;
                  
                  return (
                    <g key={`city-${city.name}`}>
                      {/* Ponto da cidade */}
                      <circle
                        cx={city.lng}
                        cy={city.lat}
                        r={Math.max(0.08, 0.15 / zoom)}
                        fill="white"
                        stroke={color}
                        strokeWidth={Math.max(0.02, 0.04 / zoom)}
                        style={{
                          cursor: 'pointer',
                          filter: isHovered ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 'none'
                        }}
                        onMouseEnter={() => setHoveredCity(city.name)}
                        onMouseLeave={() => setHoveredCity(null)}
                        onClick={() => alert(`Cidade: ${city.name} (${province})`)}
                      />
                      
                      {/* Label da cidade */}
                      <text
                        x={city.lng}
                        y={city.lat - 0.15 / zoom}
                        textAnchor="middle"
                        fill="white"
                        fontSize={Math.max(0.25, 0.4 / zoom)}
                        fontWeight={isHovered ? 'bold' : 'normal'}
                        style={{
                          pointerEvents: 'none',
                          textShadow: '0 0 3px rgba(0,0,0,0.9)'
                        }}
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                });
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Hover indicator */}
          {hoveredProvince && !isDragging && (
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-2xl text-lg font-bold animate-in fade-in zoom-in duration-200 border-2 border-white/30">
              🏛️ {hoveredProvince}
            </div>
          )}

          {/* City hover indicator */}
          {hoveredCity && !isDragging && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
              🏙️ {hoveredCity}
            </div>
          )}

          {/* Detail level indicator */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full shadow-lg text-sm font-bold border-2 border-slate-300">
            {detailLevel === 'country' && '🌍 País'}
            {detailLevel === 'provinces' && '🗺️ Províncias'}
            {detailLevel === 'cities' && '🏙️ Cidades'}
          </div>

          {/* Points counter */}
          <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold">
            ⚫ {pointCount.toLocaleString()} pontos
          </div>

          {/* Zoom level indicator */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-full shadow-lg text-sm font-bold border border-slate-200">
            🔍 Zoom: {zoom.toFixed(1)}x
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2">
            {isDragging ? (
              <>
                <Move className="w-4 h-4 animate-pulse" />
                Movendo
              </>
            ) : (
              <>✅ Mapa Ultra Detalhado</>
            )}
          </div>
        </div>
      </div>

      {/* Legend with zoom guide */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">🎨 Províncias dos Países Baixos</h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
              Zoom 1-2x: País
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
              Zoom 2-5x: Províncias
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
              Zoom 5-8x: Cidades
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(provinceColors).map(([province, color]) => {
            const cityCount = citiesByProvince[province]?.length || 0;
            return (
              <div 
                key={province} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div 
                  className="w-6 h-6 rounded-md border-2 border-slate-300 shadow-sm flex-shrink-0" 
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700 block">{province}</span>
                  <span className="text-xs text-slate-500">{cityCount} cidades</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Info sobre densidade */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-slate-200">
          <h4 className="text-sm font-bold text-slate-800 mb-2">📊 Sistema de Densidade Progressiva</h4>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>• <strong>Zoom 1.0-1.5x:</strong> ~500-1.000 pontos/província (visão geral)</li>
            <li>• <strong>Zoom 1.5-2.5x:</strong> ~2.000-4.000 pontos/província (detalhes médios)</li>
            <li>• <strong>Zoom 2.5-4.0x:</strong> ~8.000-12.000 pontos/província (alta definição)</li>
            <li>• <strong>Zoom 4.0-6.0x:</strong> ~15.000-25.000 pontos/província (ultra definição)</li>
            <li>• <strong>Zoom 6.0-8.0x:</strong> ~30.000-50.000 pontos/província (máxima definição)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
