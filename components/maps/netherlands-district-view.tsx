'use client';

import React, { useState } from 'react';
import NetherlandsDistrictMap from './netherlands-district-map';
import { DistrictList } from './district-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, List, MapPin } from 'lucide-react';
import { getDistrictById } from '@/lib/districts';

interface NetherlandsDistrictViewProps {
  className?: string;
}

export function NetherlandsDistrictView({ className = '' }: NetherlandsDistrictViewProps) {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const selectedDistrict = selectedDistrictId ? getDistrictById(selectedDistrictId) : null;

  const handleProvinceSelect = (provinceName: string, districtId?: string) => {
    if (districtId) {
      setSelectedDistrictId(districtId);
    }
  };

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrictId(
      selectedDistrictId === districtId ? null : districtId
    );
  };

  return (
    <div className={className}>
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <MapPin className="w-6 h-6 text-blue-600" />
                Mapa de Distritos da Holanda
              </CardTitle>
              <CardDescription className="mt-2 text-base">
                Visualize e selecione distritos regionais dos Países Baixos
                {selectedDistrict && (
                  <span 
                    className="ml-3 font-bold text-base inline-flex items-center gap-2"
                    style={{ color: selectedDistrict.color }}
                  >
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: selectedDistrict.color }} />
                    {selectedDistrict.name}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="combined" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
              <TabsTrigger value="combined" className="flex items-center gap-2 text-sm">
                <Map className="w-4 h-4" />
                Visualização Completa
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2 text-sm">
                <Map className="w-4 h-4" />
                Apenas Mapa
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2 text-sm">
                <List className="w-4 h-4" />
                Apenas Lista
              </TabsTrigger>
            </TabsList>

            {/* Combined View */}
            <TabsContent value="combined" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mapa - 2 colunas */}
                <div className="lg:col-span-2">
                  <NetherlandsDistrictMap
                    onSelectProvince={handleProvinceSelect}
                    selectedDistrictId={selectedDistrictId}
                    className="w-full"
                  />
                </div>

                {/* Lista lateral - 1 coluna */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4">
                    <h3 className="text-sm font-bold mb-4 text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <List className="w-4 h-4" />
                      Todos os Distritos
                    </h3>
                    <DistrictList
                      onSelect={handleDistrictSelect}
                      selectedDistrictId={selectedDistrictId}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Map Only View */}
            <TabsContent value="map" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <NetherlandsDistrictMap
                  onSelectProvince={handleProvinceSelect}
                  selectedDistrictId={selectedDistrictId}
                  className="w-full"
                />
              </div>
            </TabsContent>

            {/* List Only View */}
            <TabsContent value="list" className="mt-0">
              <DistrictList
                onSelect={handleDistrictSelect}
                selectedDistrictId={selectedDistrictId}
              />
            </TabsContent>
          </Tabs>

          {/* Informação do distrito selecionado */}
          {selectedDistrict && (
            <div 
              className="mt-6 p-5 rounded-xl border-l-4 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ 
                borderLeftColor: selectedDistrict.color,
                backgroundColor: `${selectedDistrict.color}15`
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: selectedDistrict.color }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                    {selectedDistrict.name}
                    <span className="text-xs bg-white px-2 py-1 rounded-full border text-gray-600">
                      {selectedDistrict.provinces.length} províncias
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {selectedDistrict.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDistrict.provinces.map((province) => (
                      <span 
                        key={province} 
                        className="text-xs font-medium px-3 py-1 bg-white rounded-full border shadow-sm"
                        style={{ borderColor: selectedDistrict.color }}
                      >
                        {province}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
