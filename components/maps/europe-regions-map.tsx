"use client"

import React, { useState, useMemo } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Annotation
} from "react-simple-maps"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

/**
 * Interface simplificada para regiões
 * Estrutura: região contém array de códigos de províncias
 */
export interface RegionData {
  id: string
  name: string
  color: string
  provinces: string[] // Array de códigos como 'NLFL', 'NLFR', etc
  churches_count?: number
  members_count?: number
}

export interface EuropeRegionsMapProps {
  regions: RegionData[]
  onRegionClick?: (region: RegionData) => void
  onProvinceClick?: (province: string, region: RegionData) => void
  className?: string
  height?: number
}

/**
 * Mapeamento de códigos de províncias para nomes
 */
const PROVINCE_NAMES: Record<string, string> = {
  // Holanda
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
  NLGE: "Gelderland"
}

/**
 * Principais cidades da Holanda com coordenadas
 */
const MAJOR_CITIES = [
  { name: "Amsterdam", coordinates: [4.9041, 52.3676], population: "872K" },
  { name: "Rotterdam", coordinates: [4.4777, 51.9244], population: "651K" },
  { name: "Den Haag", coordinates: [4.3007, 52.0705], population: "545K" },
  { name: "Utrecht", coordinates: [5.1214, 52.0907], population: "361K" },
  { name: "Eindhoven", coordinates: [5.4697, 51.4416], population: "235K" },
  { name: "Groningen", coordinates: [6.5665, 53.2194], population: "233K" },
  { name: "Tilburg", coordinates: [5.0913, 51.5555], population: "222K" },
  { name: "Almere", coordinates: [5.2647, 52.3508], population: "214K" },
  { name: "Breda", coordinates: [4.7762, 51.5719], population: "184K" },
  { name: "Nijmegen", coordinates: [5.8520, 51.8126], population: "177K" },
  { name: "Enschede", coordinates: [6.8937, 52.2215], population: "159K" },
  { name: "Haarlem", coordinates: [4.6462, 52.3874], population: "162K" }
]

/**
 * Paleta de cores minimalista para regiões
 */
const REGION_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
]

/**
 * EuropeRegionsMap - Mapa mundial com foco na Europa e coloração de províncias por região
 * 
 * Features:
 * - Mapa mundial usando react-simple-maps
 * - Zoom e pan interativos
 * - Foco automático na Europa (Holanda)
 * - Coloração de províncias completas por região
 * - Bordas visíveis entre províncias
 * - Tooltips informativos
 * - Controles de zoom minimalistas
 * - Design monocromático moderno
 * 
 * @example
 * ```tsx
 * const regions = [
 *   {
 *     id: 'region-1',
 *     name: 'Distrito Norte',
 *     color: '#3b82f6',
 *     provinces: ['NLFL', 'NLFR'],
 *     churches_count: 12,
 *     members_count: 450
 *   }
 * ]
 * <EuropeRegionsMap regions={regions} />
 * ```
 */
export function EuropeRegionsMap({
  regions,
  onRegionClick,
  onProvinceClick,
  className = "",
  height = 500
}: EuropeRegionsMapProps) {
  // Estado para controle de zoom
  const [position, setPosition] = useState({ coordinates: [5.2913, 52.1326], zoom: 6 })
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [showCities, setShowCities] = useState(true)
  
  // GeoJSON URL - TopoJSON do mundo com províncias
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

  /**
   * Cria um mapa de província -> região para lookup rápido
   */
  const provinceToRegionMap = useMemo(() => {
    const map = new Map<string, RegionData>()
    regions.forEach(region => {
      region.provinces.forEach(provinceCode => {
        map.set(provinceCode, region)
      })
    })
    return map
  }, [regions])

  /**
   * Calcula estatísticas para exibição
   */
  const stats = useMemo(() => {
    const totalProvinces = regions.reduce((sum, r) => sum + r.provinces.length, 0)
    const totalChurches = regions.reduce((sum, r) => sum + (r.churches_count || 0), 0)
    const totalMembers = regions.reduce((sum, r) => sum + (r.members_count || 0), 0)
    return { totalProvinces, totalChurches, totalMembers }
  }, [regions])

  /**
   * Handlers de zoom
   */
  const handleZoomIn = () => {
    if (position.zoom >= 8) return
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }))
  }

  const handleZoomOut = () => {
    if (position.zoom <= 1) return
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }))
  }

  const handleReset = () => {
    setPosition({ coordinates: [5.2913, 52.1326], zoom: 6 })
  }

  /**
   * Handler para movimento do mapa
   */
  const handleMoveEnd = (position: any) => {
    setPosition(position)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Regional Distribution Map
            </CardTitle>
            <CardDescription>
              Interactive map showing regional territories in the Netherlands
            </CardDescription>
          </div>
          
          {/* Zoom Controls - Minimalista */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={position.zoom <= 1}
              className="h-8 w-8 p-0"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 w-8 p-0"
              title="Reset View"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={position.zoom >= 8}
              className="h-8 w-8 p-0"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant={showCities ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCities(!showCities)}
              className="h-8 px-3 text-xs"
              title="Toggle Cities"
            >
              Cities
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Legend - Monocromático */}
        <div className="mb-4 flex flex-wrap gap-3">
          {regions.map(region => (
            <TooltipProvider key={region.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onRegionClick?.(region)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-sm font-medium">{region.name}</span>
                    {region.churches_count !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {region.churches_count} churches
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
                    {region.members_count !== undefined && (
                      <p className="text-xs">Members: {region.members_count}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Map Container */}
        <div 
          className="relative border border-border rounded-lg overflow-hidden bg-gray-50/50"
          style={{ height: `${height}px` }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 200,
              center: [10, 52] // Europa central
            }}
            style={{
              width: "100%",
              height: "100%"
            }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates as [number, number]}
              onMoveEnd={handleMoveEnd}
              minZoom={1}
              maxZoom={8}
            >
              {/* Países base - Monocromático */}
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name
                    const isNetherlands = countryName === "Netherlands"
                    
                    // Se for Holanda, não renderizar (será renderizada com províncias)
                    if (isNetherlands) {
                      return null
                    }
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#fafafa" // gray-50
                        stroke="#e5e7eb" // gray-200
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fill: "#f3f4f6",
                            outline: "none"
                          },
                          pressed: { outline: "none" }
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Províncias da Holanda com cores por região */}
              <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/countries/netherlands/netherlands-provinces.json">
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const provinceCode = geo.id || geo.properties.code || geo.properties.iso_3166_2
                    const provinceName = geo.properties.name || geo.properties.NAME_1
                    
                    // Buscar região que contém esta província
                    const region = provinceToRegionMap.get(provinceCode)
                    
                    // Determinar cor da província
                    const fillColor = region ? region.color : "#f3f4f6" // gray-100 se não tiver região
                    const isHovered = hoveredProvince === provinceCode
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        fillOpacity={region ? 0.7 : 0.3}
                        stroke="#1f2937" // gray-800 - bordas bem escuras e visíveis
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          default: { outline: "none" },
                          hover: { 
                            fillOpacity: region ? 0.85 : 0.4,
                            stroke: "#111827", // gray-900 - ainda mais escuro no hover
                            strokeWidth: 2.5,
                            outline: "none",
                            cursor: region ? "pointer" : "default"
                          },
                          pressed: { 
                            fillOpacity: region ? 0.95 : 0.5,
                            outline: "none" 
                          }
                        }}
                        onMouseEnter={() => setHoveredProvince(provinceCode)}
                        onMouseLeave={() => setHoveredProvince(null)}
                        onClick={() => {
                          if (region && onProvinceClick) {
                            onProvinceClick(provinceCode, region)
                          } else if (region && onRegionClick) {
                            onRegionClick(region)
                          }
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Marcadores das principais cidades */}
              {showCities && position.zoom >= 4 && MAJOR_CITIES.map((city) => (
                <Marker key={city.name} coordinates={city.coordinates as [number, number]}>
                  <g>
                    {/* Círculo do marcador */}
                    <circle
                      r={position.zoom >= 6 ? 4 : 3}
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="drop-shadow-md"
                    />
                    
                    {/* Nome da cidade - apenas em zoom alto */}
                    {position.zoom >= 5 && (
                      <text
                        textAnchor="middle"
                        y={position.zoom >= 6 ? -8 : -6}
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: position.zoom >= 6 ? "10px" : "8px",
                          fontWeight: "600",
                          fill: "#111827",
                          stroke: "#ffffff",
                          strokeWidth: "3px",
                          paintOrder: "stroke",
                          pointerEvents: "none"
                        }}
                      >
                        {city.name}
                      </text>
                    )}
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Zoom Level Indicator - Minimalista */}
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-white/90 backdrop-blur-sm border border-border rounded text-xs text-muted-foreground">
            Zoom: {position.zoom.toFixed(1)}x
          </div>
        </div>

        {/* Map Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <p>Click and drag to pan • Scroll to zoom • Click provinces for details</p>
          <p>{stats.totalProvinces} provinces • {stats.totalChurches} churches • {MAJOR_CITIES.length} major cities</p>
        </div>
      </CardContent>
    </Card>
  )
}
