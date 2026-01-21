'use client';

import React from 'react';
import { districts, District } from '@/lib/districts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DistrictListProps {
  onSelect?: (districtId: string) => void;
  selectedDistrictId?: string | null;
  className?: string;
}

export function DistrictList({
  onSelect,
  selectedDistrictId,
  className = ''
}: DistrictListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {districts.map((district) => {
        const isSelected = selectedDistrictId === district.id;
        
        return (
          <Card
            key={district.id}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-md',
              isSelected && 'ring-2 ring-offset-2'
            )}
            style={{
              borderLeft: `4px solid ${district.color}`,
              ...(isSelected && { ringColor: district.color })
            }}
            onClick={() => onSelect?.(district.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: district.color }}
                    />
                    <h3 className="font-semibold text-sm">{district.name}</h3>
                    {isSelected && (
                      <Badge variant="default" className="text-xs">
                        Selecionado
                      </Badge>
                    )}
                  </div>
                  
                  {district.description && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {district.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {district.provinces.map((province) => (
                      <Badge
                        key={province}
                        variant="outline"
                        className="text-xs"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {province}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
