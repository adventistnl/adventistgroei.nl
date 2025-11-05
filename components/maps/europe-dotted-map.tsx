'use client';

import React, { useState, useRef, useEffect } from 'react';
import DottedMap from 'dotted-map';
import { ZoomIn, ZoomOut, Maximize2, MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDistrictByProvince, districts } from '@/lib/districts';

interface EuropeDottedMapProps {
  onSelectProvince?: (provinceName: string, districtId?: string) => void;
  selectedDistrictId?: string | null;
  className?: string;
}

export function EuropeDottedMap({
  onSelectProvince,
  selectedDistrictId,
  className = ''
}: EuropeDottedMapProps) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [detailLevel, setDetailLevel] = useState<'continent' | 'countries' | 'provinces' | 'cities'>('continent');
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Criar o mapa pontilhado da Europa com MAIS DENSIDADE
  const map = new DottedMap({ 
    height: 120,
    grid: 'diagonal',
    countries: ['NLD', 'BEL', 'DEU', 'FRA', 'GBR', 'ESP', 'ITA', 'POL', 'CHE', 'AUT', 'DNK', 'SWE', 'NOR', 'PRT', 'IRL', 'CZE', 'SVK', 'HUN', 'ROU', 'BGR', 'GRC']
  });

  // Gerar SVG do mapa com densidade dinâmica baseada no zoom
  const getDotRadius = () => {
    if (zoom < 1.5) return 0.4;
    if (zoom < 3) return 0.35;
    if (zoom < 5) return 0.3;
    return 0.25;
  };

  const svgMap = map.getSVG({
    radius: getDotRadius(),
    color: '#4B5563',
    shape: 'circle',
    backgroundColor: 'transparent',
  });

  // Determinar nível de detalhe baseado no zoom
  const getDetailLevel = (currentZoom: number): 'continent' | 'countries' | 'provinces' | 'cities' => {
    if (currentZoom < 1.8) return 'continent';
    if (currentZoom < 3.5) return 'countries';
    if (currentZoom < 6) return 'provinces';
    return 'cities';
  };

  // Atualizar nível de detalhe quando zoom mudar
  useEffect(() => {
    setDetailLevel(getDetailLevel(zoom));
  }, [zoom]);

  // Coordenadas dos países europeus
  const europeanCountries = [
    { name: 'Países Baixos', code: 'NLD', lat: 52.2, lng: 5.5, color: '#EF4444' },
    { name: 'Alemanha', code: 'DEU', lat: 51.0, lng: 10.5, color: '#F59E0B' },
    { name: 'França', code: 'FRA', lat: 46.5, lng: 2.5, color: '#3B82F6' },
    { name: 'Bélgica', code: 'BEL', lat: 50.5, lng: 4.5, color: '#8B5CF6' },
    { name: 'Reino Unido', code: 'GBR', lat: 54.0, lng: -2.0, color: '#EC4899' },
    { name: 'Espanha', code: 'ESP', lat: 40.0, lng: -4.0, color: '#F97316' },
    { name: 'Itália', code: 'ITA', lat: 42.8, lng: 12.8, color: '#14B8A6' },
    { name: 'Polônia', code: 'POL', lat: 52.0, lng: 19.0, color: '#84CC16' },
  ];

  // Coordenadas das províncias holandesas (PRECISAS)
  const netherlandsProvinces = [
    { name: 'Groningen', lat: 53.2194, lng: 6.5665, color: '#EF4444' },
    { name: 'Friesland', lat: 53.1641, lng: 5.7818, color: '#F59E0B' },
    { name: 'Drenthe', lat: 52.9476, lng: 6.6233, color: '#10B981' },
    { name: 'Overijssel', lat: 52.4384, lng: 6.5018, color: '#3B82F6' },
    { name: 'Flevoland', lat: 52.5279, lng: 5.5981, color: '#8B5CF6' },
    { name: 'Gelderland', lat: 52.0451, lng: 5.8717, color: '#EC4899' },
    { name: 'Utrecht', lat: 52.0907, lng: 5.1214, color: '#14B8A6' },
    { name: 'Noord-Holland', lat: 52.5208, lng: 4.7880, color: '#F43F5E' },
    { name: 'Zuid-Holland', lat: 52.0705, lng: 4.3007, color: '#8B5CF6' },
    { name: 'Zeeland', lat: 51.4940, lng: 3.8497, color: '#0EA5E9' },
    { name: 'Noord-Brabant', lat: 51.4826, lng: 5.2300, color: '#F97316' },
    { name: 'Limburg', lat: 51.4427, lng: 6.0619, color: '#84CC16' }
  ];

  // Principais cidades da Holanda com coordenadas PRECISAS
  const dutchCities = [
    { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, province: 'Noord-Holland' },
    { name: 'Rotterdam', lat: 51.9244, lng: 4.4777, province: 'Zuid-Holland' },
    { name: 'Den Haag', lat: 52.0705, lng: 4.3007, province: 'Zuid-Holland' },
    { name: 'Utrecht', lat: 52.0907, lng: 5.1214, province: 'Utrecht' },
    { name: 'Eindhoven', lat: 51.4416, lng: 5.4697, province: 'Noord-Brabant' },
    { name: 'Groningen', lat: 53.2194, lng: 6.5665, province: 'Groningen' },
    { name: 'Tilburg', lat: 51.5555, lng: 5.0913, province: 'Noord-Brabant' },
    { name: 'Almere', lat: 52.3702, lng: 5.2141, province: 'Flevoland' },
    { name: 'Breda', lat: 51.5719, lng: 4.7683, province: 'Noord-Brabant' },
    { name: 'Nijmegen', lat: 51.8126, lng: 5.8372, province: 'Gelderland' },
    { name: 'Enschede', lat: 52.2184, lng: 6.8961, province: 'Overijssel' },
    { name: 'Haarlem', lat: 52.3874, lng: 4.6462, province: 'Noord-Holland' },
    { name: 'Arnhem', lat: 51.9851, lng: 5.8987, province: 'Gelderland' },
    { name: 'Zaanstad', lat: 52.4391, lng: 4.8251, province: 'Noord-Holland' },
    { name: 'Apeldoorn', lat: 52.2110, lng: 5.9699, province: 'Gelderland' },
    { name: 'Amersfoort', lat: 52.1561, lng: 5.3878, province: 'Utrecht' },
    { name: 'Maastricht', lat: 50.8514, lng: 5.6910, province: 'Limburg' },
    { name: 'Leeuwarden', lat: 53.2012, lng: 5.7999, province: 'Friesland' },
    { name: 'Zwolle', lat: 52.5168, lng: 6.0830, province: 'Overijssel' },
    { name: 'Leiden', lat: 52.1601, lng: 4.4970, province: 'Zuid-Holland' },
  ];

  // Converter lat/lng para coordenadas SVG
  const projectPoint = (lat: number, lng: number) => {
    const mapWidth = 1600;
    const mapHeight = 1000;
    
    const centerLat = 51;
    const centerLng = 10;
    const scale = 20;
    
    const x = ((lng - centerLng) * scale) + (mapWidth / 2);
    const y = ((centerLat - lat) * scale) + (mapHeight / 2);
    
    return { x, y };
  };

  // Handlers de zoom
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.5, 10);
    setZoom(newZoom);
    setDetailLevel(getDetailLevel(newZoom));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.5, 0.5);
    setZoom(newZoom);
    setDetailLevel(getDetailLevel(newZoom));
  };

  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setDetailLevel('continent');
  };

  // NOVO: Botão para focar na Holanda
  const focusOnNetherlands = () => {
    setZoom(6);
    setPanX(-150);
    setPanY(50);
    setDetailLevel('cities');
  };

  // Handlers de drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(10, zoom * delta));
    setZoom(newZoom);
    setDetailLevel(getDetailLevel(newZoom));
  };

  // Calcular raio dos pontos baseado no distrito e zoom
  const getProvinceRadius = (provinceName: string) => {
    const district = getDistrictByProvince(provinceName);
    const isSelected = selectedDistrictId && district?.id === selectedDistrictId;
    const isHovered = hoveredProvince === provinceName;
    
    const baseRadius = Math.max(6, 12 / zoom);
    
    if (isSelected) return baseRadius * 1.5;
    if (isHovered) return baseRadius * 1.3;
    return baseRadius;
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Controls */}
      <div className="mb-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-slate-300 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Mapa Progressivo da Europa - Sistema LOD Completo
            </p>
            <p className="text-sm text-slate-600 mt-1">
              🌍 Continente → 🇪🇺 Países → 🗺️ Províncias → 🏙️ Cidades • Densidade aumenta com zoom
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={focusOnNetherlands}
              title="Focar na Holanda"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2"
            >
              <Target className="h-4 w-4" />
              🇳🇱 Holanda
            </Button>
            <div className="w-px h-8 bg-slate-300" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              title="Zoom In"
              className="h-9 w-9"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="h-9 w-9"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="Reset View"
              className="h-9 w-9"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[700px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl border-4 border-slate-700 shadow-2xl overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Base map with dots */}
        <div 
          className="absolute inset-0 select-none"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            className="w-full h-full opacity-60 pointer-events-none"
            alt="Europe map"
            draggable={false}
          />

          {/* SVG overlay */}
          <svg
            ref={svgRef}
            viewBox="0 0 1600 1000"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* NÍVEL 1: Label do Continente */}
            {detailLevel === 'continent' && (
              <text
                x="800"
                y="400"
                textAnchor="middle"
                fill="white"
                fontSize={Math.max(40, 60 / zoom)}
                fontWeight="bold"
                style={{
                  textShadow: '0 0 20px rgba(0,0,0,0.9)',
                  letterSpacing: '0.15em'
                }}
              >
                🌍 EUROPA
              </text>
            )}

            {/* NÍVEL 2: Labels dos Países */}
            {detailLevel === 'countries' && europeanCountries.map((country) => {
              const pos = projectPoint(country.lat, country.lng);
              return (
                <text
                  key={country.code}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  fill="white"
                  fontSize={Math.max(12, 18 / zoom)}
                  fontWeight="bold"
                  style={{
                    textShadow: '0 0 8px rgba(0,0,0,0.9)'
                  }}
                >
                  {country.name === 'Países Baixos' ? '🇳🇱 ' : ''}{country.name}
                </text>
              );
            })}

            {/* NÍVEL 3: Províncias da Holanda */}
            {detailLevel === 'provinces' && netherlandsProvinces.map((province) => {
              const pos = projectPoint(province.lat, province.lng);
              const district = getDistrictByProvince(province.name);
              const isSelected = selectedDistrictId && district?.id === selectedDistrictId;
              const isHovered = hoveredProvince === province.name;
              const radius = getProvinceRadius(province.name);

              return (
                <g key={province.name}>
                  {(isSelected || isHovered) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius + 8}
                      fill={district?.color || province.color}
                      opacity={0.3}
                      className="animate-pulse"
                    />
                  )}
                  
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    fill={district?.color || province.color}
                    stroke={isSelected ? '#FFFFFF' : isHovered ? '#000000' : 'none'}
                    strokeWidth={isSelected ? 3 : 2}
                    opacity={isSelected ? 1 : isHovered ? 0.9 : 0.8}
                    className="pointer-events-auto cursor-pointer transition-all duration-200"
                    onMouseEnter={() => !isDragging && setHoveredProvince(province.name)}
                    onMouseLeave={() => setHoveredProvince(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDragging && onSelectProvince) {
                        onSelectProvince(province.name, district?.id);
                      }
                    }}
                    style={{
                      filter: isHovered ? 'brightness(1.3) drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none'
                    }}
                  />

                  <text
                    x={pos.x}
                    y={pos.y - radius - 8}
                    textAnchor="middle"
                    fill="white"
                    fontSize={Math.max(8, 12 / zoom)}
                    fontWeight="bold"
                    style={{
                      textShadow: '0 0 4px rgba(0,0,0,0.9)'
                    }}
                  >
                    {province.name}
                  </text>
                </g>
              );
            })}

            {/* NÍVEL 4: Cidades da Holanda */}
            {detailLevel === 'cities' && dutchCities.map((city) => {
              const pos = projectPoint(city.lat, city.lng);
              const isHovered = hoveredCity === city.name;
              const cityRadius = Math.max(3, 6 / zoom);

              return (
                <g key={city.name}>
                  {isHovered && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={cityRadius + 6}
                      fill="white"
                      opacity={0.3}
                      className="animate-pulse"
                    />
                  )}

                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={cityRadius}
                    fill="white"
                    stroke="#000000"
                    strokeWidth={1.5}
                    opacity={isHovered ? 1 : 0.9}
                    className="pointer-events-auto cursor-pointer transition-all duration-200"
                    onMouseEnter={() => !isDragging && setHoveredCity(city.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => {
                      if (!isDragging) {
                        alert(`🏙️ ${city.name}\n📍 Província: ${city.province}`);
                      }
                    }}
                    style={{
                      filter: isHovered ? 'drop-shadow(0 0 6px rgba(255,255,255,0.9))' : 'none'
                    }}
                  />

                  <text
                    x={pos.x}
                    y={pos.y - cityRadius - 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize={Math.max(6, 10 / zoom)}
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    style={{
                      textShadow: '0 0 3px rgba(0,0,0,0.9)'
                    }}
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail level indicator */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold border-2 border-white/30">
          {detailLevel === 'continent' && '🌍 Continente'}
          {detailLevel === 'countries' && '🇪🇺 Países'}
          {detailLevel === 'provinces' && '🗺️ Províncias'}
          {detailLevel === 'cities' && '🏙️ Cidades'}
        </div>

        {/* Province hover tooltip */}
        {hoveredProvince && !isDragging && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-2xl text-lg font-bold animate-in fade-in zoom-in duration-200 border-2 border-white/30">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ 
                  backgroundColor: getDistrictByProvince(hoveredProvince)?.color || '#FFFFFF' 
                }}
              />
              <span>🏛️ {hoveredProvince}</span>
            </div>
          </div>
        )}

        {/* City hover tooltip */}
        {hoveredCity && !isDragging && (
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-xl text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
            🏙️ {hoveredCity}
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full shadow-lg text-sm font-bold border-2 border-slate-300">
          🔍 Zoom: {zoom.toFixed(1)}x
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2">
          {isDragging ? (
            <>
              <span className="animate-pulse">🖐️</span>
              Movendo
            </>
          ) : (
            <>✅ Mapa LOD Ativo</>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-xl border-2 border-slate-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            🎯 Sistema de Nível de Detalhe (LOD)
          </h3>
          <span className="text-sm text-slate-500">
            {netherlandsProvinces.length} províncias • {dutchCities.length} cidades
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
            <div className="text-2xl">🌍</div>
            <div>
              <p className="font-bold text-sm text-slate-800">Continente</p>
              <p className="text-xs text-slate-600">Zoom 0.5-1.8x</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-2xl">🇪🇺</div>
            <div>
              <p className="font-bold text-sm text-slate-800">Países</p>
              <p className="text-xs text-slate-600">Zoom 1.8-3.5x</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="text-2xl">🗺️</div>
            <div>
              <p className="font-bold text-sm text-slate-800">Províncias</p>
              <p className="text-xs text-slate-600">Zoom 3.5-6x</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
            <div className="text-2xl">🏙️</div>
            <div>
              <p className="font-bold text-sm text-slate-800">Cidades</p>
              <p className="text-xs text-slate-600">Zoom 6-10x</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {districts.map((district) => {
            const isSelected = district.id === selectedDistrictId;
            return (
              <div 
                key={district.id} 
                className={`flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border-2 ${
                  isSelected ? 'border-slate-400 bg-slate-50 shadow-md' : 'border-transparent'
                }`}
                onClick={() => onSelectProvince?.('', district.id)}
              >
                <div 
                  className="w-6 h-6 rounded-md flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: district.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900">{district.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{district.provinces.length} províncias</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
