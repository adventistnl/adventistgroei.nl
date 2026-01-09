"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from "recharts"
import { Building2, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useChartColors } from "@/lib/chart-colors"
import { useTranslation } from "react-i18next"

interface UsersByStructureOverviewChartProps {
  loading?: boolean
  users?: any[]
  departments?: any[]
  regions?: any[]
  churches?: any[]
  institutions?: any[]
}

/**
 * UsersByStructureOverviewChart Component
 * 
 * Displays the total count of entities distributed across the organizational structure.
 * Shows how many entities exist in each structural level:
 * - Institutions
 * - Regions
 * - Churches
 * - Institutional Departments
 * - Church Departments
 */
export function UsersByStructureOverviewChart({ 
  loading, 
  users = [], 
  departments = [],
  regions = [],
  churches = [],
  institutions = []
}: UsersByStructureOverviewChartProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const { theme, generatePalette } = useChartColors()
  
  // Translation helper
  const t = {
    title: {
      en: "Organizational Structure Overview",
      pt: "Visão Geral da Estrutura Organizacional",
      nl: "Organisatiestructuur Overzicht"
    },
    description: {
      en: "Total entities distributed across organizational hierarchy",
      pt: "Total de entidades distribuídas pela hierarquia organizacional",
      nl: "Totaal entiteiten verdeeld over organisatiehiërarchie"
    },
    legends: {
      institutions: {
        en: "Institutions",
        pt: "Instituições",
        nl: "Instellingen"
      },
      regions: {
        en: "Regions",
        pt: "Regiões",
        nl: "Regio's"
      },
      churches: {
        en: "Churches",
        pt: "Igrejas",
        nl: "Kerken"
      },
      institutionalDepts: {
        en: "Institutional Depts",
        pt: "Depts Institucionais",
        nl: "Institutionele Afd"
      },
      churchDepts: {
        en: "Church Depts",
        pt: "Depts de Igreja",
        nl: "Kerkafdelingen"
      }
    },
    footer: {
      total: {
        en: "Total entities",
        pt: "Total de entidades",
        nl: "Totaal entiteiten"
      },
      largest: {
        en: "Largest category",
        pt: "Maior categoria",
        nl: "Grootste categorie"
      }
    }
  }

  const getText = (key: any) => {
    return key[currentLanguage as keyof typeof key] || key.en
  }

  // Generate colors for each structure type
  const structureColors = React.useMemo(() => {
    const palette = generatePalette(5)
    return {
      institutions: palette[0],
      regions: palette[1],
      churches: palette[2],
      institutionalDepts: palette[3],
      churchDepts: palette[4]
    }
  }, [generatePalette])

  // Calculate entity counts by structure
  const structureData = React.useMemo(() => {
    // Count active entities only
    const activeInstitutions = institutions.filter((i: any) => !i.is_deleted).length
    const activeRegions = regions.filter((r: any) => !r.is_deleted).length
    const activeChurches = churches.filter((c: any) => !c.is_deleted).length
    
    // Separate institutional and church departments
    const institutionalDepts = departments.filter((d: any) => !d.church_id && !d.is_deleted).length
    const churchDepts = departments.filter((d: any) => d.church_id && !d.is_deleted).length

    const data = {
      institutions: activeInstitutions,
      regions: activeRegions,
      churches: activeChurches,
      institutionalDepts,
      churchDepts,
      total: activeInstitutions + activeRegions + activeChurches + institutionalDepts + churchDepts
    }

    // Find largest category
    const categories = [
      { key: 'institutions', value: activeInstitutions },
      { key: 'regions', value: activeRegions },
      { key: 'churches', value: activeChurches },
      { key: 'institutionalDepts', value: institutionalDepts },
      { key: 'churchDepts', value: churchDepts }
    ]
    
    const largest = categories.reduce((max, cat) => 
      cat.value > max.value ? cat : max
    , { key: 'institutions', value: 0 })

    return { ...data, largest }
  }, [institutions, regions, churches, departments])

  // Chart data
  const chartData = React.useMemo(() => [
    {
      structure: "institutions",
      count: structureData.institutions,
      fill: structureColors.institutions,
    },
    {
      structure: "regions",
      count: structureData.regions,
      fill: structureColors.regions,
    },
    {
      structure: "churches",
      count: structureData.churches,
      fill: structureColors.churches,
    },
    {
      structure: "institutionalDepts",
      count: structureData.institutionalDepts,
      fill: structureColors.institutionalDepts,
    },
    {
      structure: "churchDepts",
      count: structureData.churchDepts,
      fill: structureColors.churchDepts,
    }
  ], [structureData, structureColors])

  // Chart configuration
  const chartConfig: ChartConfig = React.useMemo(() => ({
    count: {
      label: getText({ en: "Entities", pt: "Entidades", nl: "Entiteiten" }),
    },
    institutions: {
      label: getText(t.legends.institutions),
      color: structureColors.institutions,
    },
    regions: {
      label: getText(t.legends.regions),
      color: structureColors.regions,
    },
    churches: {
      label: getText(t.legends.churches),
      color: structureColors.churches,
    },
    institutionalDepts: {
      label: getText(t.legends.institutionalDepts),
      color: structureColors.institutionalDepts,
    },
    churchDepts: {
      label: getText(t.legends.churchDepts),
      color: structureColors.churchDepts,
    },
  }), [structureColors, currentLanguage])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {getText(t.title)}
        </CardTitle>
        <CardDescription>
          {getText(t.description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="structure"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          <TrendingUp className="h-4 w-4" />
          {getText(t.footer.largest)}: {getText(t.legends[structureData.largest.key as keyof typeof t.legends])} ({structureData.largest.value})
        </div>
        <div className="text-muted-foreground leading-none">
          {getText(t.footer.total)}: {structureData.total.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  )
}
