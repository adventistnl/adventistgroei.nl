"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
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
import { useChartColors } from "@/lib/chart-colors"

interface UserStructureGrowthChartProps {
  loading?: boolean
  users?: any[]
  departments?: any[]
  regions?: any[]
  churches?: any[]
  selectedYear?: number
}

export function UserStructureGrowthChart({ 
  loading, 
  users = [], 
  departments = [],
  regions = [],
  churches = [],
  selectedYear = new Date().getFullYear() 
}: UserStructureGrowthChartProps) {
  const [timeRange, setTimeRange] = React.useState("12m")
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  
  // Translation helper
  const t = {
    title: {
      en: "User Growth by Organizational Structure",
      pt: "Crescimento de Usuários por Estrutura Organizacional",
      nl: "Gebruikersgroei per Organisatiestructuur"
    },
    description: {
      en: "New user registrations per month across organizational hierarchy",
      pt: "Novos registros de usuários por mês na hierarquia organizacional",
      nl: "Nieuwe gebruikersregistraties per maand in de organisatiehiërarchie"
    },
    timePeriods: {
      last_12_months: {
        en: "Last 12 months",
        pt: "Últimos 12 meses",
        nl: "Laatste 12 maanden"
      },
      last_6_months: {
        en: "Last 6 months",
        pt: "Últimos 6 meses",
        nl: "Laatste 6 maanden"
      },
      last_3_months: {
        en: "Last 3 months",
        pt: "Últimos 3 meses",
        nl: "Laatste 3 maanden"
      }
    },
    legends: {
      institutionalDepts: {
        en: "Institutional Departments",
        pt: "Departamentos Institucionais",
        nl: "Institutionele Afdelingen"
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
      churchDepts: {
        en: "Church Departments",
        pt: "Departamentos de Igreja",
        nl: "Kerkafdelingen"
      }
    },
    footer: {
      total: {
        en: "Total active users",
        pt: "Total de usuários ativos",
        nl: "Totaal actieve gebruikers"
      },
      mostUsers: {
        en: "Most users in",
        pt: "Mais usuários em",
        nl: "Meeste gebruikers in"
      }
    }
  }

  const getText = (key: any) => {
    return key[currentLanguage as keyof typeof key] || key.en
  }

  // Helper function para determinar em quais estruturas o usuário está
  // Um usuário pode estar em múltiplas estruturas simultaneamente
  const getUserStructureTypes = React.useCallback((user: any) => {
    const structures: string[] = []
    
    // Verificar se está em departamento de igreja
    const isInChurchDept = churches
      .flatMap(church => church.departments || [])
      .some(dept => dept.users?.some((u: any) => u.id === user.id))
    
    if (isInChurchDept) {
      structures.push('churchDepts')
    }

    // Verificar se está em departamento institucional
    const isInInstitutionalDept = departments.some(dept => 
      dept.users?.some((u: any) => u.id === user.id)
    )
    
    if (isInInstitutionalDept) {
      structures.push('institutionalDepts')
    }

    // Se tem igreja vinculada (pode ter mesmo tendo departamento)
    if (user.church && user.church.id) {
      structures.push('churches')
    }

    // Se não está em nenhuma estrutura específica, está apenas na instituição (region level)
    if (structures.length === 0) {
      structures.push('regions')
    }

    return structures
  }, [churches, departments])

  // Processar usuários por estrutura e data de criação
  const structureData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // Inicializar contadores por mês
    const monthlyData = months.map((month, index) => ({
      month,
      date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
      institutionalDepts: 0,
      regions: 0,
      churches: 0,
      churchDepts: 0,
      total: 0
    }))

    // Filtrar usuários ativos do ano selecionado
    const yearUsers = users.filter((user: any) => {
      if (user.is_deleted) return false
      const createdDate = new Date(user.created_at)
      const userYear = createdDate.getFullYear()
      return userYear === selectedYear
    })

    // Contar usuários por estrutura e mês
    // Um usuário pode ser contado em múltiplas estruturas se fizer parte delas
    yearUsers.forEach((user: any) => {
      const createdDate = new Date(user.created_at)
      const month = createdDate.getMonth()
      
      // Só contar se o mês já passou (para ano atual)
      if (selectedYear === currentYear && month > currentMonth) {
        return
      }

      // Determinar todas as estruturas que o usuário faz parte
      const structureTypes = getUserStructureTypes(user)
      
      // Incrementar contador para cada estrutura que o usuário pertence
      structureTypes.forEach(structureType => {
        monthlyData[month][structureType]++
      })
    })

    // Calcular totais únicos por mês (contar cada usuário apenas uma vez no total)
    monthlyData.forEach((data, index) => {
      const monthUsers = yearUsers.filter((user: any) => {
        const createdDate = new Date(user.created_at)
        return createdDate.getMonth() === index
      })
      data.total = monthUsers.length
    })

    return monthlyData
  }, [users, selectedYear, getUserStructureTypes])

  // Calcular estatísticas totais para o footer
  const structureStats = React.useMemo(() => {
    const activeUsers = users.filter((user: any) => !user.is_deleted)
    
    const stats = {
      institutionalDepts: 0,
      regions: 0,
      churches: 0,
      churchDepts: 0,
      total: activeUsers.length
    }

    // Contabilizar quantos usuários estão em cada estrutura
    // Um usuário pode estar em múltiplas estruturas
    activeUsers.forEach((user: any) => {
      const structureTypes = getUserStructureTypes(user)
      structureTypes.forEach(structureType => {
        stats[structureType]++
      })
    })

    // Encontrar qual estrutura tem mais usuários
    const maxStructure = Object.entries(stats)
      .filter(([key]) => key !== 'total')
      .reduce((max, [key, value]) => {
        return value > max.value ? { key, value } : max
      }, { key: 'institutionalDepts', value: 0 })

    return { ...stats, maxStructure }
  }, [users, getUserStructureTypes])

  const { generatePalette } = useChartColors()

  // Cores para cada tipo de estrutura
  const structureColors = React.useMemo(() => {
    const palette = generatePalette(4)
    return {
      institutionalDepts: palette[0],
      regions: palette[1],
      churches: palette[2],
      churchDepts: palette[3]
    }
  }, [generatePalette])

  // Configuração do gráfico
  const chartConfig = React.useMemo(() => ({
    institutionalDepts: {
      label: getText(t.legends.institutionalDepts),
      color: structureColors.institutionalDepts,
    },
    regions: {
      label: getText(t.legends.regions),
      color: structureColors.regions,
    },
    churches: {
      label: getText(t.legends.churches),
      color: structureColors.churches,
    },
    churchDepts: {
      label: getText(t.legends.churchDepts),
      color: structureColors.churchDepts,
    }
  }), [structureColors, currentLanguage])

  const filteredData = React.useMemo(() => {
    if (timeRange === "6m") {
      return structureData.slice(-6)
    } else if (timeRange === "3m") {
      return structureData.slice(-3)
    }
    return structureData
  }, [timeRange, structureData])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b py-5">
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{getText(t.title)}</CardTitle>
          <CardDescription>
            {getText(t.description)}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder={getText(t.timePeriods.last_12_months)} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              {getText(t.timePeriods.last_12_months)}
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              {getText(t.timePeriods.last_6_months)}
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              {getText(t.timePeriods.last_3_months)}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillInstitutionalDepts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={structureColors.institutionalDepts} stopOpacity={0.8} />
                <stop offset="95%" stopColor={structureColors.institutionalDepts} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRegions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={structureColors.regions} stopOpacity={0.8} />
                <stop offset="95%" stopColor={structureColors.regions} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillChurches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={structureColors.churches} stopOpacity={0.8} />
                <stop offset="95%" stopColor={structureColors.churches} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillChurchDepts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={structureColors.churchDepts} stopOpacity={0.8} />
                <stop offset="95%" stopColor={structureColors.churchDepts} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="institutionalDepts"
              type="natural"
              fill="url(#fillInstitutionalDepts)"
              stroke={structureColors.institutionalDepts}
              stackId="a"
            />
            <Area
              dataKey="regions"
              type="natural"
              fill="url(#fillRegions)"
              stroke={structureColors.regions}
              stackId="a"
            />
            <Area
              dataKey="churches"
              type="natural"
              fill="url(#fillChurches)"
              stroke={structureColors.churches}
              stackId="a"
            />
            <Area
              dataKey="churchDepts"
              type="natural"
              fill="url(#fillChurchDepts)"
              stroke={structureColors.churchDepts}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium">
              {getText(t.footer.total)}: {structureStats.total}
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: structureColors.institutionalDepts }} />
              {structureStats.institutionalDepts}
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: structureColors.regions }} />
              {structureStats.regions}
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: structureColors.churches }} />
              {structureStats.churches}
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: structureColors.churchDepts }} />
              {structureStats.churchDepts}
            </div>
          </div>
        </div>
        <div className="text-muted-foreground">
          {getText(t.footer.mostUsers)}: <span className="font-medium text-foreground">{getText(t.legends[structureStats.maxStructure.key as keyof typeof t.legends])}</span> ({structureStats.maxStructure.value} {structureStats.maxStructure.value === 1 ? 'user' : 'users'})
        </div>
      </CardFooter>
    </Card>
  )
}
