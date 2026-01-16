"use client"

import * as React from "react"
import { TrendingUp, Building2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export interface UserDistributionBarChartData {
  name: string
  users: number
}

export interface UserDistributionBarChartProps {
  /**
   * Chart title
   */
  title?: string
  
  /**
   * Chart description
   */
  description?: string
  
  /**
   * Optional icon for the title
   */
  icon?: LucideIcon
  
  /**
   * Users array to calculate distribution
   */
  users?: any[]
  
  /**
   * Departments array for structure data
   */
  departments?: any[]
  
  /**
   * Regions array for structure data
   */
  regions?: any[]
  
  /**
   * Churches array for structure data
   */
  churches?: any[]
  
  /**
   * Institutions array for structure data
   */
  institutions?: any[]
  
  /**
   * Legacy: Data to display in the chart (deprecated - use users prop instead)
   */
  data?: UserDistributionBarChartData[]
  
  /**
   * Whether the chart is loading
   */
  loading?: boolean
  
  /**
   * Footer content/message
   */
  footer?: React.ReactNode
}

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

/**
 * UserDistributionBarChart Component
 * 
 * A bar chart component for visualizing user distribution across all organizational structures.
 * Shows users grouped by institutions, regions, churches, institutional departments, and church departments.
 * 
 * @example
 * ```tsx
 * <UserDistributionBarChart
 *   title="User Distribution"
 *   description="Users distributed across organizational structure"
 *   icon={Building2}
 *   users={allUsers}
 *   institutions={allInstitutions}
 *   regions={allRegions}
 *   churches={allChurches}
 *   departments={allDepartments}
 * />
 * ```
 */
export function UserDistributionBarChart({
  title,
  description,
  icon: Icon = Building2,
  users = [],
  departments = [],
  regions = [],
  churches = [],
  institutions = [],
  data: legacyData,
  loading = false,
  footer
}: UserDistributionBarChartProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  
  // Translation helper
  const t = {
    title: {
      en: "User Distribution by Structure",
      pt: "Distribuição de Usuários por Estrutura",
      nl: "Gebruikersverdeling per Structuur"
    },
    description: {
      en: "Users distributed across organizational hierarchy",
      pt: "Usuários distribuídos pela hierarquia organizacional",
      nl: "Gebruikers verdeeld over organisatiehiërarchie"
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
        en: "Total users",
        pt: "Total de usuários",
        nl: "Totaal gebruikers"
      },
      largest: {
        en: "Most users in",
        pt: "Mais usuários em",
        nl: "Meeste gebruikers in"
      }
    }
  }

  const getText = (key: any) => {
    return key[currentLanguage as keyof typeof key] || key.en
  }

  // Calculate user distribution by structure
  const structureData = React.useMemo(() => {
    // If legacy data is provided, use it
    if (legacyData && legacyData.length > 0) {
      const totalUsers = legacyData.reduce((sum, item) => sum + item.users, 0)
      const topStructure = legacyData.reduce((max, item) => 
        item.users > max.users ? item : max
      , legacyData[0] || { name: "", users: 0 })
      
      return {
        chartData: legacyData,
        total: totalUsers,
        largest: { key: topStructure.name, value: topStructure.users }
      }
    }

    // Calculate users by structure type
    const activeUsers = users.filter((u: any) => !u.is_deleted)
    
    // Users in institutions (users with institution_id)
    const institutionUsers = new Set<string>()
    activeUsers.forEach((user: any) => {
      if (user.institution_id) institutionUsers.add(user.id)
    })
    
    // Users in regions (users whose church belongs to a region)
    const regionUsers = new Set<string>()
    activeUsers.forEach((user: any) => {
      if (user.church_id) {
        const church = churches.find((c: any) => c.id === user.church_id)
        if (church?.region_id) regionUsers.add(user.id)
      }
    })
    
    // Users in churches
    const churchUsers = new Set<string>()
    activeUsers.forEach((user: any) => {
      if (user.church_id) churchUsers.add(user.id)
    })
    
    // Users in institutional departments
    const institutionalDeptUsers = new Set<string>()
    departments.filter((d: any) => !d.church_id && !d.is_deleted).forEach((dept: any) => {
      dept.users?.forEach((user: any) => {
        if (!user.is_deleted) institutionalDeptUsers.add(user.id)
      })
    })
    
    // Users in church departments
    const churchDeptUsers = new Set<string>()
    departments.filter((d: any) => d.church_id && !d.is_deleted).forEach((dept: any) => {
      dept.users?.forEach((user: any) => {
        if (!user.is_deleted) churchDeptUsers.add(user.id)
      })
    })

    const data = {
      institutions: institutionUsers.size,
      regions: regionUsers.size,
      churches: churchUsers.size,
      institutionalDepts: institutionalDeptUsers.size,
      churchDepts: churchDeptUsers.size,
      total: activeUsers.length
    }

    // Find largest category
    const categories = [
      { key: 'institutions', value: data.institutions, label: getText(t.legends.institutions) },
      { key: 'regions', value: data.regions, label: getText(t.legends.regions) },
      { key: 'churches', value: data.churches, label: getText(t.legends.churches) },
      { key: 'institutionalDepts', value: data.institutionalDepts, label: getText(t.legends.institutionalDepts) },
      { key: 'churchDepts', value: data.churchDepts, label: getText(t.legends.churchDepts) }
    ]
    
    const largest = categories.reduce((max, cat) => 
      cat.value > max.value ? cat : max
    , { key: 'institutions' as string, value: 0 as number, label: getText(t.legends.institutions) })

    // Build chart data with colors
    const chartData = [
      {
        name: getText(t.legends.institutions),
        users: data.institutions,
        fill: "hsl(var(--structure-institutions))",
      },
      {
        name: getText(t.legends.regions),
        users: data.regions,
        fill: "hsl(var(--structure-regions))",
      },
      {
        name: getText(t.legends.churches),
        users: data.churches,
        fill: "hsl(var(--structure-churches))",
      },
      {
        name: getText(t.legends.institutionalDepts),
        users: data.institutionalDepts,
        fill: "hsl(var(--structure-institutional-depts))",
      },
      {
        name: getText(t.legends.churchDepts),
        users: data.churchDepts,
        fill: "hsl(var(--structure-church-depts))",
      }
    ]

    return { chartData, total: data.total, largest }
  }, [users, departments, regions, churches, institutions, legacyData, currentLanguage])

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

  // Use provided title/description or defaults
  const chartTitle = title || getText(t.title)
  const chartDescription = description || getText(t.description)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {chartTitle}
        </CardTitle>
        {chartDescription && <CardDescription>{chartDescription}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={structureData.chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="users" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="users"
              layout="vertical"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                style={{ fill: '#ffffff' }}
                fontSize={12}
                fontWeight={500}
              />
              <LabelList
                dataKey="users"
                position="right"
                offset={8}
                style={{ fill: 'hsl(var(--foreground))' }}
                fontSize={12}
                fontWeight={500}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {footer ? (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footer}
        </CardFooter>
      ) : (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            {getText(t.footer.largest)} {'label' in structureData.largest ? structureData.largest.label : structureData.largest.key} <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            {getText(t.footer.total)}: {structureData.total.toLocaleString()} {getText({ en: "users", pt: "usuários", nl: "gebruikers" })}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
