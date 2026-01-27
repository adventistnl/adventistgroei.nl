/**
 * EXEMPLO: Uso do Church-Region Matcher em Dashboard Chart
 * 
 * Este exemplo demonstra como usar o sistema de auto-linking
 * em um gráfico de distribuição de churches por região.
 */

import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { GET_CHURCHES_QUERY } from '@/graphql/queries/CHURCH_QUERY'
import { useRegions } from '@/hooks/use-regions'
import {
  enrichChurchesWithAutoLink,
  calculateAutoLinkStats,
  type EnrichedChurch,
  type AutoLinkStats
} from '@/lib/church-region-matcher'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Componente de exemplo: Gráfico de distribuição de churches
 * 
 * Features:
 * - Auto-linking de churches sem região
 * - Visual feedback (original vs auto-linked)
 * - Estatísticas agregadas
 * - Tooltip com detalhes
 */
export function ChurchDistributionChart() {
  // ============================================================================
  // 1. FETCH DATA
  // ============================================================================
  
  const { regions } = useRegions()
  const { data: churchesData, loading } = useQuery(GET_CHURCHES_QUERY)
  const churches = useMemo(
    () => churchesData?.churches?.filter((c: any) => !c.is_deleted) || [],
    [churchesData]
  )
  
  // ============================================================================
  // 2. APPLY AUTO-LINKING
  // ============================================================================
  
  const enrichedChurches = useMemo<EnrichedChurch[]>(() => {
    if (churches.length === 0 || regions.length === 0) return []
    
    // Usar função do utilitário
    return enrichChurchesWithAutoLink(churches, regions)
  }, [churches, regions])
  
  // ============================================================================
  // 3. CALCULATE STATS
  // ============================================================================
  
  const stats = useMemo<AutoLinkStats>(() => {
    return calculateAutoLinkStats(enrichedChurches)
  }, [enrichedChurches])
  
  // ============================================================================
  // 4. PREPARE CHART DATA
  // ============================================================================
  
  const chartData = useMemo(() => {
    return regions
      .filter(r => !r.is_deleted)
      .map(region => {
        // Filtrar churches desta região
        const regionChurches = enrichedChurches.filter(
          c => c.region_id === region.id
        )
        
        // Separar original vs auto-linked
        const originalCount = regionChurches.filter(
          c => !c.has_auto_link
        ).length
        const autoLinkedCount = regionChurches.filter(
          c => c.has_auto_link
        ).length
        
        return {
          name: region.name,
          original: originalCount,
          autoLinked: autoLinkedCount,
          total: regionChurches.length,
          color: region.color,
        }
      })
      .sort((a, b) => b.total - a.total) // Ordenar por total
  }, [enrichedChurches, regions])
  
  // ============================================================================
  // 5. CUSTOM TOOLTIP
  // ============================================================================
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) return null
    
    const data = payload[0].payload
    
    return (
      <div
        style={{
          background: 'white',
          padding: '12px',
          border: `2px solid ${data.color}`,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0', color: data.color, fontWeight: 600 }}>
          {data.name}
        </h4>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#3b82f6' }}>●</span> Original: {data.original}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#10b981' }}>●</span> Auto-linked: {data.autoLinked}
          </div>
          <div style={{ fontWeight: 600, color: '#1f2937', marginTop: '8px' }}>
            Total: {data.total}
          </div>
        </div>
      </div>
    )
  }
  
  // ============================================================================
  // 6. RENDER
  // ============================================================================
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Church Distribution by Region</CardTitle>
        <div className="text-sm text-muted-foreground mt-2">
          <div className="flex gap-4">
            <span>
              Total: <strong>{stats.total}</strong>
            </span>
            <span>
              Original: <strong>{stats.withOriginalLink}</strong>
            </span>
            <span className="text-green-600">
              Auto-linked: <strong>{stats.withAutoLink}</strong>
            </span>
            <span className="text-amber-600">
              Unlinked: <strong>{stats.withoutLink}</strong>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar
              dataKey="original"
              name="Original Links"
              fill="#3b82f6"
              stackId="stack"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="autoLinked"
              name="Auto-linked"
              fill="#10b981"
              stackId="stack"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Legend com visual feedback */}
        <div className="mt-4 flex gap-4 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Original region links</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Auto-linked (intelligent matching)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * EXEMPLO 2: KPI Cards com Auto-Linking Stats
 */
export function ChurchAutoLinkingKPIs() {
  const { regions } = useRegions()
  const { data } = useQuery(GET_CHURCHES_QUERY)
  const churches = data?.churches?.filter((c: any) => !c.is_deleted) || []
  
  const enriched = useMemo(
    () => enrichChurchesWithAutoLink(churches, regions),
    [churches, regions]
  )
  
  const stats = useMemo(
    () => calculateAutoLinkStats(enriched),
    [enriched]
  )
  
  const kpiData = [
    {
      title: 'Total Churches',
      value: stats.total,
      subtitle: 'All active churches',
      icon: '🏛️',
    },
    {
      title: 'Original Links',
      value: stats.withOriginalLink,
      subtitle: 'Manually assigned',
      icon: '✅',
      color: 'text-blue-600',
    },
    {
      title: 'Auto-Linked',
      value: stats.withAutoLink,
      subtitle: `${stats.withHighConfidence} high + ${stats.withMediumConfidence} medium`,
      icon: '🤖',
      color: 'text-green-600',
    },
    {
      title: 'Unlinked',
      value: stats.withoutLink,
      subtitle: 'Require manual linking',
      icon: '⚠️',
      color: 'text-amber-600',
    },
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <h3 className={`text-2xl font-bold mt-1 ${kpi.color || ''}`}>
                  {kpi.value}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.subtitle}
                </p>
              </div>
              <div className="text-3xl">{kpi.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/**
 * EXEMPLO 3: Lista de Churches com Visual Feedback
 */
export function ChurchListWithAutoLinking() {
  const { regions } = useRegions()
  const { data } = useQuery(GET_CHURCHES_QUERY)
  const churches = data?.churches?.filter((c: any) => !c.is_deleted) || []
  
  const enriched = useMemo(
    () => enrichChurchesWithAutoLink(churches, regions),
    [churches, regions]
  )
  
  return (
    <div className="space-y-2">
      {enriched.map(church => {
        const hasRegion = !!church.region_id
        const borderStyle = church.has_auto_link ? 'dashed' : 'solid'
        const borderColor = church.region?.color || '#d1d5db'
        
        return (
          <div
            key={church.id}
            style={{
              padding: '12px',
              border: `2px ${borderStyle} ${borderColor}`,
              borderRadius: '8px',
              background: hasRegion ? `${borderColor}08` : '#f9fafb',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{church.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {church.contact?.city}, {church.contact?.state}
                </p>
              </div>
              <div className="text-right">
                {church.has_auto_link ? (
                  <div className="text-xs">
                    <span className="text-green-600 font-medium">
                      🤖 Auto-linked
                    </span>
                    <p className="text-muted-foreground">
                      {church.link_confidence}% confidence
                    </p>
                  </div>
                ) : hasRegion ? (
                  <span className="text-xs text-blue-600">✅ Original</span>
                ) : (
                  <span className="text-xs text-amber-600">⚠️ No region</span>
                )}
                {church.region && (
                  <p
                    className="text-sm font-medium mt-1"
                    style={{ color: borderColor }}
                  >
                    {church.region.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
