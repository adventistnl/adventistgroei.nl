'use client';

import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { getDistrictByProvince } from '@/lib/districts';
import { cn } from '@/lib/utils';

const geoUrl = 'https://cartomap.github.io/nl/wgs84/provincie_2020.topojson';

interface NetherlandsDistrictMapProps {
  onSelectProvince?: (provinceName: string, districtId?: string) => void;
  selectedDistrictId?: string | null;
  className?: string;
}

export default function NetherlandsDistrictMap({
  onSelectProvince,
  selectedDistrictId,
  className = ''
}: NetherlandsDistrictMapProps) {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Main map container with enhanced visibility */}
      <div className="relative w-full bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 rounded-2xl border-2 border-slate-300 shadow-lg overflow-hidden p-4">
        <div className="relative w-full h-[600px] bg-white rounded-xl shadow-inner">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [5.5, 52.2],
              scale: 7500
            }}
            width={800}
            height={900}
            className="w-full h-full"
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <ZoomableGroup center={[5.5, 52.2]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  // Debug: log first geography properties to understand structure
                  if (geographies.length > 0 && typeof window !== 'undefined') {
                    console.log('Geography loaded:', geographies.length, 'provinces');
                    console.log('First province:', geographies[0].properties);
                  }
                  
                  return geographies.map((geo) => {
                    const provinceName = geo.properties?.provincienaam || geo.properties?.name || '';
                    
                    // Skip if no province name found
                    if (!provinceName) {
                      console.warn('Geography without province name:', geo.properties);
                      return null;
                    }
                    
                    const district = getDistrictByProvince(provinceName);
                    const isSelected = selectedDistrictId && district?.id === selectedDistrictId;
                    const isHovered = hoveredProvince === provinceName;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          setHoveredProvince(provinceName);
                          console.log('Hovering:', provinceName, 'District:', district?.name);
                        }}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => {
                          console.log('Clicked:', provinceName, 'District:', district?.name);
                          if (onSelectProvince) {
                            onSelectProvince(provinceName, district?.id);
                          }
                        }}
                        style={{
                          default: {
                            fill: district?.color ?? '#E5E7EB',
                            stroke: isSelected ? '#000000' : '#FFFFFF',
                            strokeWidth: isSelected ? 3 : 2,
                            outline: 'none',
                            transition: 'all 0.2s ease-in-out',
                            opacity: isSelected ? 1 : 0.95
                          },
                          hover: {
                            fill: district?.color ?? '#D1D5DB',
                            stroke: '#000000',
                            strokeWidth: 3,
                            outline: 'none',
                            cursor: 'pointer',
                            opacity: 1,
                            filter: 'brightness(1.2) saturate(1.2)'
                          },
                          pressed: {
                            fill: district?.color ?? '#9CA3AF',
                            stroke: '#000000',
                            strokeWidth: 3,
                            outline: 'none',
                            opacity: 1
                          }
                        }}
                      />
                    );
                  });
                }}
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Tooltip on hover */}
          {hoveredProvince && (
            <div className="absolute top-4 right-4 bg-white shadow-2xl rounded-xl p-4 z-50 border-2 border-slate-300 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-sm bg-opacity-95">
              <p className="font-bold text-lg text-slate-900">{hoveredProvince}</p>
              {getDistrictByProvince(hoveredProvince) && (
                <div className="mt-2 flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm" 
                    style={{ backgroundColor: getDistrictByProvince(hoveredProvince)?.color }}
                  />
                  <p className="text-sm font-semibold text-slate-700">
                    {getDistrictByProvince(hoveredProvince)?.name}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading indicator */}
          <div className="absolute bottom-4 left-4 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            🗺️ Interactive Map
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-5 bg-white rounded-xl border-2 border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            📍 Legenda dos Distritos
          </p>
          <span className="text-xs text-slate-500">6 distritos</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Distrito Norte', color: '#3B82F6' },
            { name: 'Distrito Sul', color: '#EF4444' },
            { name: 'Distrito Oeste', color: '#10B981' },
            { name: 'Distrito Centro', color: '#F59E0B' },
            { name: 'Distrito Nordeste', color: '#8B5CF6' },
            { name: 'Distrito Sudoeste', color: '#EC4899' }
          ].map((district) => (
            <div 
              key={district.name} 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => {
                // Future: filter by district
                console.log('Legend clicked:', district.name);
              }}
            >
              <div 
                className="w-5 h-5 rounded-md border-2 border-slate-300 shadow-sm flex-shrink-0" 
                style={{ backgroundColor: district.color }}
              />
              <span className="text-sm font-medium text-slate-700">{district.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
