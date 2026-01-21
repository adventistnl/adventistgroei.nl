"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getProjectColor } from "@/lib/chart-colors"
import { useTranslation } from "react-i18next"

import { InstitutionById_institution_institutionChartsData_churchesByRegion } from "@/types/InstitutionById"
import { MapPin } from "lucide-react"

interface ChurchesByRegionChartProps {
  churches?: any[] // Raw churches array from API
  regions?: any[] // Raw regions array from API
  data?: InstitutionById_institution_institutionChartsData_churchesByRegion[] // Legacy support
  loading?: boolean
}

export function ChurchesByRegionChart({ churches, regions, data, loading }: ChurchesByRegionChartProps) {
  const { t } = useTranslation()

  const id = "churches-by-region"

  // DEBUG: Validate API data
  React.useEffect(() => {
    console.log('🔍 [ChurchesByRegionChart] API DATA VALIDATION:', {
      receivedData: {
        churchesCount: churches?.length || 0,
        regionsCount: regions?.length || 0,
        legacyDataCount: data?.length || 0,
        churchesIsArray: Array.isArray(churches),
        regionsIsArray: Array.isArray(regions),
      },
      churchesSample: churches?.slice(0, 3).map(c => ({
        id: c?.id,
        name: c?.name,
        region_id: c?.region_id,
        region_name: c?.region?.name,
        is_deleted: c?.is_deleted
      })),
      regionsSample: regions?.slice(0, 3).map(r => ({
        id: r?.id,
        name: r?.name,
        churches_count: r?.churches?.length || 0
      })),
      loading,
    })
  }, [churches, regions, data, loading])

  // Process churches from API to count by region
  const processedData = React.useMemo(() => {
    console.log('📊 [ChurchesByRegionChart] Processing churches data')
    
    // Use churches from API if available, otherwise fall back to legacy data
    const sourceChurches = churches || []
    const sourceRegions = regions || []
    
    if (sourceChurches.length === 0 && data && data.length > 0) {
      console.log('📊 [ChurchesByRegionChart] Using legacy data format')
      return data.map((item, index) => ({
        ...item,
        fill: getProjectColor(index)
      }))
    }
    
    // Filter active churches only
    const activeChurches = sourceChurches.filter((c: any) => !c?.is_deleted)
    
    console.log('📊 [ChurchesByRegionChart] Active churches:', {
      total: activeChurches.length,
      withRegion: activeChurches.filter((c: any) => c?.region_id).length,
      withoutRegion: activeChurches.filter((c: any) => !c?.region_id).length
    })
    
    // Count churches by region_id
    const regionCounts = new Map<string, { id: string; name: string; count: number }>()
    
    // Initialize with all regions (even if they have 0 churches)
    sourceRegions.forEach((region: any) => {
      if (!region?.is_deleted) {
        regionCounts.set(region.id, {
          id: region.id,
          name: region.name,
          count: 0
        })
      }
    })
    
    // Count churches per region and churches without region
    let churchesWithoutRegion = 0
    
    activeChurches.forEach((church: any) => {
      if (church?.region_id) {
        // Church has a region
        const existing = regionCounts.get(church.region_id)
        if (existing) {
          existing.count++
        } else {
          // Region exists in church but not in regions array (orphaned)
          const regionName = church.region?.name || t('institutions.analytics.churchesByRegion.unknownRegion')
          regionCounts.set(church.region_id, {
            id: church.region_id,
            name: regionName,
            count: 1
          })
        }
      } else {
        // Church has NO region
        churchesWithoutRegion++
      }
    })
    
    // Convert to array and add colors
    const result: any[] = []
    
    // Add regions with churches (exclude regions with 0 churches)
    Array.from(regionCounts.values())
      .filter(item => item.count > 0)
      .forEach((item, index) => {
        result.push({
          region: item.id,
          name: item.name,
          churches: item.count,
          fill: getProjectColor(index)
        })
      })
    
    // Add "No Region" category if there are churches without region
    if (churchesWithoutRegion > 0) {
      result.push({
        region: 'no_region',
        name: t('institutions.analytics.churchesByRegion.noRegion') || 'No Region',
        churches: churchesWithoutRegion,
        fill: 'hsl(var(--muted-foreground))' // Grey color for No Region
      })
    }
    
    console.log('📊 [ChurchesByRegionChart] Processed data:', {
      totalRegions: result.length,
      regionsWithChurches: result.filter(r => r.region !== 'no_region').length,
      churchesWithoutRegion,
      regionsList: result.map(r => ({ name: r.name, churches: r.churches }))
    })
    
    return result
  }, [churches, regions, data, t])

  // Check if we have data
  const hasData = processedData && processedData.length > 0

  // Generate chart config dynamically based on data using getProjectColor
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      churches: {
        label: t('institutions.analytics.churchesByRegion.churchesLabel'),
        color: "#000000"
      }
    };

    if (hasData) {
      processedData.forEach((item) => {
        config[item.region] = {
          label: item.name,
          color: item.fill
        };
      });
    }

    return config;
  }, [processedData, hasData, t]);

  const [activeRegion, setActiveRegion] = React.useState<string>(hasData ? processedData[0].region : "")

  // Keep activeRegion in sync when data changes
  React.useEffect(() => {
    if (!hasData) {
      setActiveRegion("")
      return
    }

    setActiveRegion((prev) => {
      if (!prev) return processedData[0].region
      const exists = processedData.some((d) => d.region === prev)
      return exists ? prev : processedData[0].region
    })
  }, [processedData, hasData])

  const activeIndex = React.useMemo(() => {
    if (!hasData) return 0
    const idx = processedData.findIndex((item) => item.region === activeRegion)
    return idx >= 0 ? idx : 0
  }, [activeRegion, processedData, hasData])
  
  const regionKeys = React.useMemo(() => (hasData ? processedData.map((item) => item.region) : []), [processedData, hasData])
  const totalChurches = React.useMemo(
    () => (hasData ? processedData.reduce((sum, item) => sum + item.churches, 0) : 0),
    [processedData, hasData]
  )

  if (loading) {
    return (
      <Card data-chart={id} className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1 flex-1">
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
          </div>
          <div className="h-7 w-[160px] bg-muted rounded-lg animate-pulse" />
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center pb-0">
          <div className="w-[300px] h-[300px] bg-muted rounded-full animate-pulse" />
        </CardContent>
        <CardFooter className="flex-col gap-2 border-t pt-4">
          <div className="w-full flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-20 animate-pulse" />
          </div>
        </CardFooter>
      </Card>
    )
  }

  if (!hasData) {
    return (
      <Card data-chart={id} className="h-full flex flex-col min-h-[500px]">
        <CardHeader>
          <CardTitle>{t('institutions.analytics.churchesByRegion.title')}</CardTitle>
          <CardDescription>
            {t('institutions.analytics.churchesByRegion.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center min-h-[350px]">
          <div className="text-center text-muted-foreground space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-lg font-medium mb-2">{t('institutions.analytics.noData')}</p>
              <p className="text-sm">{t('institutions.analytics.churchesByRegion.noDataDescription')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="h-full flex flex-col min-h-[500px]">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1 flex-1">
          <CardTitle>{t('institutions.analytics.churchesByRegion.title')}</CardTitle>
          <CardDescription>
            {t('institutions.analytics.churchesByRegion.description')}
          </CardDescription>
        </div>
        <Select value={activeRegion} onValueChange={setActiveRegion}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label={t('institutions.analytics.churchesByRegion.selectRegion')}
          >
            <SelectValue placeholder={t('institutions.analytics.churchesByRegion.selectRegion')} />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {regionKeys.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]
              if (!config) return null

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0 min-h-[350px]">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          {totalChurches === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center text-muted-foreground space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-lg font-medium mb-2">{t('institutions.analytics.noData')}</p>
                  <p className="text-sm">{t('institutions.analytics.churchesByRegion.noDataDescription')}</p>
                </div>
              </div>
            </div>
          ) : (
            <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={processedData}
              dataKey="churches"
              nameKey="region"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onClick={(entry: any) => {
                // Allow clicking on pie sectors to select them. Recharts may provide several shapes.
                const regionKey = entry?.region || entry?.payload?.region || entry?.name || entry?.payload?.name
                if (regionKey) setActiveRegion(regionKey)
              }}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeData = processedData?.[activeIndex]
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeData?.churches.toLocaleString() || 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t('institutions.analytics.churchesByRegion.churchesLabel')}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
        {/* Minimalist footer - show selected region data */}
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t('institutions.analytics.totalChurches')}</span>
          </div>
          <span className="font-semibold text-gray-900">
            {totalChurches.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: processedData?.[activeIndex]?.fill }}
            ></div>
            <span className="text-muted-foreground">{t('institutions.analytics.selected')}: {processedData?.[activeIndex]?.name}</span>
          </div>
          <span className="font-medium">
            {processedData?.[activeIndex]?.churches.toLocaleString()} {t('institutions.analytics.churchesByRegion.churches')}
            <span className="text-muted-foreground ml-1">
              ({totalChurches > 0 ? Math.round(((processedData?.[activeIndex]?.churches || 0) / totalChurches) * 100) : 0}%)
            </span>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
