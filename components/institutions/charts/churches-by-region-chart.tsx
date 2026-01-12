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
import { useChartColors, CHART_PRESETS } from "@/lib/chart-colors"
import { useTranslation } from "react-i18next"

import { InstitutionById_institution_institutionChartsData_churchesByRegion } from "@/types/InstitutionById"

interface ChurchesByRegionChartProps {
  data?: InstitutionById_institution_institutionChartsData_churchesByRegion[]
  loading?: boolean
}

export function ChurchesByRegionChart({ data, loading }: ChurchesByRegionChartProps) {
  const { t } = useTranslation()
  const { theme } = useChartColors()
  const regionColors = CHART_PRESETS.regions(theme as 'light' | 'dark')

  const id = "churches-by-region"

  // Check if we have data
  const hasData = data && data.length > 0

  // Generate chart config dynamically based on data
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      churches: {
        label: "Churches",
        color: "#000000"
      }
    };

    if (hasData) {
      data.forEach((item) => {
        config[item.region] = {
          label: item.name,
          color: item.fill
        };
      });
    }

    return config;
  }, [data, hasData]);

  const [activeRegion, setActiveRegion] = React.useState<string>(hasData ? data[0].region : "")

  // Keep activeRegion in sync when data changes
  React.useEffect(() => {
    if (!hasData) {
      setActiveRegion("")
      return
    }

    setActiveRegion((prev) => {
      if (!prev) return data[0].region
      const exists = data.some((d) => d.region === prev)
      return exists ? prev : data[0].region
    })
  }, [data, hasData])

  const activeIndex = React.useMemo(() => {
    if (!hasData) return 0
    const idx = data.findIndex((item) => item.region === activeRegion)
    return idx >= 0 ? idx : 0
  }, [activeRegion, data, hasData])
  
  const regionKeys = React.useMemo(() => (hasData ? data.map((item) => item.region) : []), [data, hasData])
  const totalChurches = React.useMemo(
    () => (hasData ? data.reduce((sum, item) => sum + item.churches, 0) : 0),
    [data, hasData]
  )

  if (loading) {
    return (
      <Card data-chart={id} className="h-full flex flex-col">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1 flex-1">
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          <div className="w-[300px] h-[300px] bg-muted rounded-full animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (!hasData) {
    return (
      <Card data-chart={id} className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{t('institutions.analytics.churchesByRegion.title')}</CardTitle>
          <CardDescription>
            {t('institutions.analytics.churchesByRegion.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">{t('institutions.analytics.noData')}</p>
            <p className="text-sm">{t('institutions.analytics.churchesByRegion.noData')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="h-full flex flex-col">
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
            aria-label="Select a region"
          >
            <SelectValue placeholder="Select region" />
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
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          {totalChurches === 0 ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium mb-2">{t('institutions.analytics.noData')}</p>
                <p className="text-sm">{t('institutions.analytics.churchesByRegion.noData')}</p>
              </div>
            </div>
          ) : (
            <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
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
                    const activeData = data?.[activeIndex]
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
              style={{ backgroundColor: data?.[activeIndex]?.fill }}
            ></div>
            <span className="text-muted-foreground">{t('institutions.analytics.selected')}: {data?.[activeIndex]?.name}</span>
          </div>
          <span className="font-medium">
            {data?.[activeIndex]?.churches.toLocaleString()} churches
            <span className="text-muted-foreground ml-1">
              ({totalChurches > 0 ? Math.round(((data?.[activeIndex]?.churches || 0) / totalChurches) * 100) : 0}%)
            </span>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
