"use client"

import React, { useState, useMemo, useCallback } from "react"
import MapGL, { Source, Layer, NavigationControl, ScaleControl, ViewStateChangeEvent, type MapMouseEvent } from "react-map-gl/mapbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize2, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import "mapbox-gl/dist/mapbox-gl.css"

/**
 * Interface simplificada para regiões
 */
export interface RegionData {
  id: string
  name: string
  color: string
  provinces: string[] // Ex: ['NLFL', 'NLFR']
  churches_count?: number
  members_count?: number
}

export interface EuropeRegionsMapProps {
  regions: RegionData[]
  onRegionClick?: (region: RegionData) => void
  onProvinceClick?: (province: string, region: RegionData) => void
  className?: string
  height?: number
  mapboxToken?: string
}

/**
 * Mapeamento de códigos ISO para províncias da Holanda
 */
const PROVINCE_CODES: Record<string, string> = {
  NLGR: "NL-GR", // Groningen
  NLFR: "NL-FR", // Friesland
  NLDR: "NL-DR", // Drenthe
  NLNH: "NL-NH", // Noord-Holland
  NLZH: "NL-ZH", // Zuid-Holland
  NLUT: "NL-UT", // Utrecht
  NLFL: "NL-FL", // Flevoland
  NLZL: "NL-ZL", // Zeeland
  NLNB: "NL-NB", // Noord-Brabant
  NLLI: "NL-LI", // Limburg
  NLOV: "NL-OV", // Overijssel
  NLGE: "NL-GE", // Gelderland
}

const PROVINCE_NAMES: Record<string, string> = {
  NLGR: "Groningen",
  NLFR: "Friesland",
  NLDR: "Drenthe",
  NLNH: "Noord-Holland",
  NLZH: "Zuid-Holland",
  NLUT: "Utrecht",
  NLFL: "Flevoland",
  NLZL: "Zeeland",
  NLNB: "Noord-Brabant",
  NLLI: "Limburg",
  NLOV: "Overijssel",
  NLGE: "Gelderland",
}

/**
 * EuropeRegionsMap - Mapa interativo com Mapbox GL
 * 
 * Minimalista | Monocromático | Alto Desempenho
 * 
 * Features:
 * - Mapbox GL para renderização vetorial suave
 * - Foco automático na Holanda
 * - Zoom/Pan com controles nativos
 * - Coloração por região
 * - Design minimalista monocromático
 * 
 * @example
 * ```tsx
 * const regions = [{
 *   id: 'region-1',
 *   name: 'Distrito Norte',
 *   color: '#3b82f6',
 *   provinces: ['NLFL', 'NLFR']
 * }]
 * <EuropeRegionsMap regions={regions} />
 * ```
 */
export function EuropeRegionsMap({
  regions,
  onRegionClick,
  onProvinceClick,
  className = "",
  height = 600,
  mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example",
}: EuropeRegionsMapProps) {
  // Estado do mapa
  const [viewState, setViewState] = useState({
    longitude: 5.2913,
    latitude: 52.5,
    zoom: 6.5,
    pitch: 0,
    bearing: 0,
  })

  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [hoveredInfo, setHoveredInfo] = useState<{province: string; region: RegionData} | null>(null)
  const [cursor, setCursor] = useState<string>("grab")
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showDebug, setShowDebug] = useState(true) // Toggle para debug panel

  // Debug: Log do token
  React.useEffect(() => {
    console.log("🗺️ Mapbox Token:", mapboxToken ? `${mapboxToken.substring(0, 20)}...` : "NOT SET")
    console.log("🗺️ Regions:", regions.length)
    console.log("🗺️ View State:", viewState)
    
    // Log do mapeamento região -> províncias -> cores
    console.log("\n🎨 ===== REGION TO PROVINCE COLOR MAPPING =====")
    regions.forEach(region => {
      console.log(`\n📍 ${region.name} (${region.color}):`)
      region.provinces.forEach(code => {
        const isoCode = PROVINCE_CODES[code]
        const provinceName = PROVINCE_NAMES[code]
        console.log(`   ✓ ${provinceName} (${code} → ${isoCode}) → ${region.color}`)
      })
    })
    console.log("\n🎨 ============================================\n")
  }, [mapboxToken, regions, viewState])

  /**
   * Mapa de província -> região para lookup rápido
   */
  const provinceToRegionMap = useMemo(() => {
    const map = new Map<string, RegionData>()
    regions.forEach((region) => {
      region.provinces.forEach((code) => {
        const isoCode = PROVINCE_CODES[code]
        if (isoCode) {
          map.set(isoCode, region)
        }
      })
    })
    return map
  }, [regions])

  /**
   * Estatísticas
   */
  const stats = useMemo(() => {
    const totalProvinces = regions.reduce((sum, r) => sum + r.provinces.length, 0)
    const totalChurches = regions.reduce((sum, r) => sum + (r.churches_count || 0), 0)
    return { totalProvinces, totalChurches }
  }, [regions])

  /**
   * Reset view para Holanda
   */
  const handleReset = useCallback(() => {
    setViewState({
      longitude: 5.2913,
      latitude: 52.5,
      zoom: 6.5,
      pitch: 0,
      bearing: 0,
    })
  }, [])

  /**
   * Hover handler
   */
  const onHover = useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0]
    if (feature) {
      const isoCode = feature.properties?.iso_3166_2
      const provinceName = feature.properties?.name || PROVINCE_NAMES[Object.keys(PROVINCE_CODES).find(k => PROVINCE_CODES[k] === isoCode) || '']
      const region = provinceToRegionMap.get(isoCode)
      
      setHoveredProvince(isoCode || null)
      
      if (region && provinceName) {
        setHoveredInfo({ province: provinceName, region })
      } else {
        setHoveredInfo(null)
      }
      
      setCursor("pointer")
    } else {
      setHoveredProvince(null)
      setHoveredInfo(null)
      setCursor("grab")
    }
  }, [provinceToRegionMap])

  /**
   * Click handler
   */
  const onClick = useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0]
      if (feature) {
        const isoCode = feature.properties?.iso_3166_2
        const region = provinceToRegionMap.get(isoCode)
        
        if (region) {
          // Encontrar código original da província
          const provinceCode = Object.keys(PROVINCE_CODES).find(
            (key) => PROVINCE_CODES[key] === isoCode
          )
          
          if (provinceCode && onProvinceClick) {
            onProvinceClick(provinceCode, region)
          } else if (onRegionClick) {
            onRegionClick(region)
          }
        }
      }
    },
    [provinceToRegionMap, onProvinceClick, onRegionClick]
  )

  /**
   * GeoJSON de províncias da Holanda
   * URL pública com geometrias de alta qualidade
   */
  const netherlandsGeoJSON = useMemo(
    () => ({
      type: "geojson" as const,
      data: "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/netherlands/netherlands-provinces.json",
    }),
    []
  )

  /**
   * Cria uma expressão Mapbox "match" para colorir províncias por região
   * Formato: ['match', ['get', 'iso_3166_2'], 'NL-FL', '#color1', 'NL-FR', '#color2', ..., '#default']
   */
  const provinceColorExpression = useMemo(() => {
    const expression: (string | string[])[] = ['match', ['get', 'iso_3166_2']]
    const mappedProvinces: string[] = []
    
    // Para cada região, adicionar suas províncias e cor
    regions.forEach((region) => {
      region.provinces.forEach((code) => {
        const isoCode = PROVINCE_CODES[code]
        if (isoCode) {
          expression.push(isoCode) // ISO code da província
          expression.push(region.color) // Cor da região
          mappedProvinces.push(isoCode)
        } else {
          console.warn(`⚠️ Province code "${code}" not found in PROVINCE_CODES mapping`)
        }
      })
    })
    
    // Cor padrão para províncias não mapeadas
    expression.push('#f3f4f6')
    
    console.log('🎨 Province Color Expression:', expression)
    console.log('✅ Total provinces mapped:', mappedProvinces.length)
    console.log('📍 Mapped provinces:', mappedProvinces.sort())
    
    // Validar se todas as 12 províncias foram mapeadas
    const allProvinces = Object.values(PROVINCE_CODES)
    const unmappedProvinces = allProvinces.filter(p => !mappedProvinces.includes(p))
    if (unmappedProvinces.length > 0) {
      console.warn('⚠️ Unmapped provinces:', unmappedProvinces)
    } else {
      console.log('✅ All 12 provinces successfully mapped!')
    }
    
    return expression as any // Mapbox expression type
  }, [regions])

  /**
   * Estilo da camada de províncias com coloração por região
   */
  const provinceLayer = useMemo(
    () => ({
      id: "provinces-fill",
      type: "fill" as const,
      paint: {
        "fill-color": provinceColorExpression,
        "fill-opacity": [
          'case',
          ['==', ['get', 'iso_3166_2'], hoveredProvince || ''],
          0.95, // Opacidade alta quando hover
          0.75  // Opacidade normal
        ] as any,
      },
    }),
    [provinceColorExpression, hoveredProvince]
  )

  /**
   * Estilo da borda das províncias
   */
  const provinceBorderLayer = useMemo(
    () => ({
      id: "provinces-border",
      type: "line" as const,
      paint: {
        "line-color": "#1f2937",
        "line-width": [
          'case',
          ['==', ['get', 'iso_3166_2'], hoveredProvince || ''],
          3, // Borda mais grossa quando hover
          1.5  // Borda normal
        ] as any,
      },
    }),
    [hoveredProvince]
  )

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-700" />
              Regional Distribution Map
            </CardTitle>
            <CardDescription className="text-gray-500">
              Interactive map • Netherlands regions • Click to explore
            </CardDescription>
          </div>

          {/* Reset Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0 border-2 hover:border-gray-700"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset view</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Legend - Minimalista */}
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => (
            <TooltipProvider key={region.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onRegionClick?.(region)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {region.name}
                    </span>
                    {region.churches_count !== undefined && (
                      <Badge variant="secondary" className="text-xs h-5">
                        {region.churches_count}
                      </Badge>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1">
                    <p className="font-semibold">{region.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {region.provinces.length} provinces
                    </p>
                    {region.churches_count !== undefined && (
                      <p className="text-xs">Churches: {region.churches_count}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Map Container */}
        <div
          className="relative border-2 border-gray-200 rounded-lg overflow-hidden"
          style={{ height: `${height}px` }}
        >
          {/* Debug Info */}
          {mapError && (
            <div className="absolute top-0 left-0 right-0 bg-red-100 border-b-2 border-red-400 p-3 z-50">
              <p className="text-red-800 text-sm font-medium">⚠️ Map Error:</p>
              <p className="text-red-600 text-xs mt-1">{mapError}</p>
            </div>
          )}

          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-40">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600 text-sm">Loading map...</p>
              </div>
            </div>
          )}

          <MapGL
            {...viewState}
            onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
            onLoad={() => {
              console.log("✅ Map loaded successfully")
              setMapLoaded(true)
            }}
            onError={(evt) => {
              console.error("❌ Map error:", evt.error)
              setMapError(evt.error?.message || "Unknown map error")
            }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={mapboxToken}
            style={{ width: "100%", height: "100%" }}
            cursor={cursor}
            onMouseMove={onHover}
            onClick={onClick}
            interactiveLayerIds={["provinces-fill"]}
          >
            {/* Controles de navegação nativos */}
            <NavigationControl position="top-right" showCompass={false} />
            <ScaleControl position="bottom-left" />

            {/* Camada de províncias */}
            <Source {...netherlandsGeoJSON}>
              <Layer {...provinceLayer} />
              <Layer {...provinceBorderLayer} />
            </Source>
          </MapGL>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-white/95 backdrop-blur-sm border border-gray-200 rounded text-xs text-gray-600 font-mono">
            {viewState.zoom.toFixed(1)}x
          </div>

          {/* Debug Toggle Button */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="absolute bottom-4 left-4 px-2 py-1 bg-white/95 backdrop-blur-sm border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-100 transition-colors z-30"
            title={showDebug ? "Hide Debug" : "Show Debug"}
          >
            {showDebug ? "🐛 Hide Debug" : "🐛 Show Debug"}
          </button>

          {/* Hover Tooltip */}
          {hoveredInfo && (
            <div className="absolute top-20 left-4 px-3 py-2 bg-white/95 backdrop-blur-sm border-2 border-gray-300 rounded-lg shadow-lg text-sm z-40 max-w-xs">
              <p className="font-bold text-gray-800">{hoveredInfo.province}</p>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: hoveredInfo.region.color }}
                />
                <span className="text-gray-600">{hoveredInfo.region.name}</span>
              </div>
              {hoveredInfo.region.churches_count !== undefined && (
                <p className="text-xs text-gray-500 mt-1">
                  {hoveredInfo.region.churches_count} churches
                </p>
              )}
            </div>
          )}

          {/* Debug Panel - removível após testes */}
          {showDebug && (
            <div className="absolute top-4 left-4 px-3 py-2 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg text-xs space-y-2 z-30 max-w-sm shadow-lg">
              <p className="font-bold text-gray-800 border-b border-gray-200 pb-1">🐛 Debug Info</p>
            
            {/* Token Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Token:</span>
              <span className={mapboxToken.startsWith("pk.") ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {mapboxToken.startsWith("pk.") ? "✓ Valid" : "✗ Invalid"}
              </span>
            </div>
            
            {/* Map Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Map:</span>
              <span className={mapLoaded ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>
                {mapLoaded ? "✓ Loaded" : "⏳ Loading"}
              </span>
            </div>
            
            {/* Position */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Position:</span>
              <span className="text-gray-800 font-mono text-[10px]">
                {viewState.latitude.toFixed(2)}, {viewState.longitude.toFixed(2)}
              </span>
            </div>
            
            {/* Region Mapping */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="font-bold text-gray-800 mb-2">🎨 Region Mapping ({regions.length})</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {regions.map((region) => (
                  <div key={region.id} className="border-l-2 pl-2" style={{ borderColor: region.color }}>
                    <div className="flex items-center gap-1 mb-1">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: region.color }}
                      />
                      <span className="font-semibold text-gray-800 text-[11px]">
                        {region.name}
                      </span>
                    </div>
                    <div className="space-y-0.5 ml-3">
                      {region.provinces.map((code) => {
                        const isoCode = PROVINCE_CODES[code]
                        const provinceName = PROVINCE_NAMES[code]
                        return (
                          <div key={code} className="text-[10px] text-gray-600 flex items-center gap-1">
                            <span className="text-gray-400">✓</span>
                            <span>{provinceName}</span>
                            <span className="text-gray-400 font-mono">({isoCode})</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total Stats */}
            <div className="border-t border-gray-200 pt-2 mt-2 text-[10px] text-gray-500">
              Total: {stats.totalProvinces} provinces • {stats.totalChurches} churches
            </div>
          </div>
          )}
        </div>

        {/* Instructions - Minimalista */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3" />
            <span>Drag to pan • Scroll to zoom • Click provinces</span>
          </div>
          <span className="font-medium">
            {stats.totalProvinces} provinces • {stats.totalChurches} churches
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
