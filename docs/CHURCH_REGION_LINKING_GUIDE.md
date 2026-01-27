# Church-Region Auto-Linking Guide

## 📋 Visão Geral

Sistema inteligente de matching automático entre **Churches** e **Regions** baseado em validação geográfica (província + cidade). Este sistema permite que churches sem região atribuída sejam automaticamente linkadas à região correta com base em sua localização.

---

## 🎯 Objetivo

Resolver o problema de churches sem `region_id` criando sugestões automáticas de linking baseadas em:
- **Província (state)**: Validação primária
- **Cidade (city)**: Validação secundária para maior precisão

---

## 🏗️ Arquitetura

### Módulo Principal
```
/lib/church-region-matcher.ts
```

### Estrutura de Dados

#### Territory JSON (Region)
```typescript
{
  "NL": {
    "FL": ["LEL", "ALM", "EMM"],  // Flevoland: Lelystad, Almere, Emmeloord
    "DR": ["ASS", "EMM"],          // Drenthe: Assen, Emmen
    "GE": ["ARN", "NIM"]           // Gelderland: Arnhem, Nijmegen
  }
}
```

#### Church Contact Data
```typescript
{
  contact: {
    city: "Lelystad",      // Nome da cidade
    state: "Flevoland"     // Nome da província
  }
}
```

---

## 🚀 Como Usar

### 1. Importação Básica

```typescript
import {
  enrichChurchesWithAutoLink,
  calculateAutoLinkStats,
  findMatchingRegion
} from "@/lib/church-region-matcher"
```

### 2. Enriquecer Churches com Auto-Linking

```typescript
import { useQuery } from "@apollo/client"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import { useRegions } from "@/hooks/use-regions"
import { enrichChurchesWithAutoLink } from "@/lib/church-region-matcher"

function MyComponent() {
  const { regions } = useRegions()
  const { data: churchesData } = useQuery(GET_CHURCHES_QUERY)
  const churches = churchesData?.churches?.filter(c => !c.is_deleted) || []
  
  // Aplicar auto-linking
  const churchesWithAutoLink = useMemo(() => {
    return enrichChurchesWithAutoLink(churches, regions)
  }, [churches, regions])
  
  return (
    <div>
      {churchesWithAutoLink.map(church => (
        <div key={church.id}>
          {church.name}
          {church.has_auto_link && (
            <span>🤖 Auto-linked to {church.suggested_region?.name}</span>
          )}
        </div>
      ))}
    </div>
  )
}
```

### 3. Calcular Estatísticas

```typescript
import { calculateAutoLinkStats } from "@/lib/church-region-matcher"

const stats = useMemo(() => {
  return calculateAutoLinkStats(churchesWithAutoLink)
}, [churchesWithAutoLink])

console.log(`Total churches: ${stats.total}`)
console.log(`Auto-linked: ${stats.withAutoLink}`)
console.log(`High confidence: ${stats.withHighConfidence}`)
console.log(`Medium confidence: ${stats.withMediumConfidence}`)
```

### 4. Validar Church Individual

```typescript
import { findMatchingRegion } from "@/lib/church-region-matcher"

const church = {
  id: "1",
  name: "dev Church",
  contact: {
    city: "Lelystad",
    state: "Flevoland"
  }
}

const match = findMatchingRegion(church, regions)

if (match.confidence === 100) {
  console.log(`✅ Perfect match: ${match.region.name}`)
} else if (match.confidence === 70) {
  console.log(`⚠️ Province match: ${match.region.name}`)
} else {
  console.log(`❌ No match found`)
}
```

---

## 📊 Níveis de Confidence

| Confidence | Match Type | Descrição | Exemplo |
|------------|------------|-----------|---------|
| **100%** | `city` | Província + Cidade coincidem | Church em "Lelystad, FL" → Region com territory `{"NL": {"FL": ["LEL"]}}` |
| **70%** | `province` | Apenas província coincide | Church em "Amsterdam, NH" → Region com territory `{"NL": {"NH": [...]}}` mas cidade não está listada |
| **0%** | `none` | Sem match | Church sem dados válidos ou província não encontrada |

---

## 🔧 Casos de Uso

### 1. Renderizar Churches com Visual Feedback

```typescript
// Em um componente de mapa ou lista
{churchesWithAutoLink.map(church => {
  const borderStyle = church.has_auto_link ? 'dashed' : 'solid'
  const borderColor = church.region?.color || '#gray'
  
  return (
    <div 
      key={church.id}
      style={{ 
        border: `2px ${borderStyle} ${borderColor}` 
      }}
    >
      <h3>{church.name}</h3>
      {church.has_auto_link && (
        <Badge>
          🤖 Auto-linked ({church.link_confidence}%)
        </Badge>
      )}
      {church.region && (
        <span>{church.region.name}</span>
      )}
    </div>
  )
})}
```

### 2. Filtrar Churches por Região

```typescript
import { filterChurchesByRegion } from "@/lib/church-region-matcher"

const selectedRegion = regions[0]
const churchesInRegion = filterChurchesByRegion(churches, selectedRegion)

console.log(`Churches in ${selectedRegion.name}: ${churchesInRegion.length}`)
```

### 3. Validar Dados de Church

```typescript
import { validateChurchInRegion } from "@/lib/church-region-matcher"

const church = churches[0]
const region = regions[0]

if (!validateChurchInRegion(church, region)) {
  console.warn(`⚠️ Church ${church.name} is outside region ${region.name}`)
  console.warn(`Church location: ${church.contact?.city}, ${church.contact?.state}`)
}
```

### 4. KPI Cards com Auto-Linking

```typescript
const kpiData = useMemo(() => {
  const stats = calculateAutoLinkStats(churchesWithAutoLink)
  
  return [
    {
      title: "Total Churches",
      value: stats.total,
      subtitle: `${stats.withOriginalLink} original + ${stats.withAutoLink} auto-linked`
    },
    {
      title: "High Confidence Matches",
      value: stats.withHighConfidence,
      subtitle: "100% province + city match"
    },
    {
      title: "Medium Confidence Matches",
      value: stats.withMediumConfidence,
      subtitle: "70% province only match"
    },
    {
      title: "Unlinked Churches",
      value: stats.withoutLink,
      subtitle: "Require manual linking"
    }
  ]
}, [churchesWithAutoLink])
```

### 5. Debug Console Output

```typescript
useEffect(() => {
  if (churchesWithAutoLink.length === 0) return
  
  const stats = calculateAutoLinkStats(churchesWithAutoLink)
  
  console.log('\n🔗 AUTO-LINK STATISTICS')
  console.log('='.repeat(50))
  console.log(`Total: ${stats.total}`)
  console.log(`✅ Original links: ${stats.withOriginalLink}`)
  console.log(`🤖 Auto-linked: ${stats.withAutoLink}`)
  console.log(`   ├─ High confidence (100%): ${stats.withHighConfidence}`)
  console.log(`   └─ Medium confidence (70%): ${stats.withMediumConfidence}`)
  console.log(`❌ Without link: ${stats.withoutLink}`)
  console.log('='.repeat(50))
  
  // Listar churches auto-linked
  churchesWithAutoLink
    .filter(c => c.has_auto_link)
    .forEach(c => {
      console.log(`\n🤖 ${c.name}`)
      console.log(`   Region: ${c.suggested_region?.name}`)
      console.log(`   Confidence: ${c.link_confidence}%`)
      console.log(`   Location: ${c.contact?.city}, ${c.contact?.state}`)
    })
}, [churchesWithAutoLink])
```

---

## 🎨 Integração com Gráficos

### Chart.js / Recharts

```typescript
import { enrichChurchesWithAutoLink } from "@/lib/church-region-matcher"

function ChurchDistributionChart() {
  const { regions } = useRegions()
  const { data } = useQuery(GET_CHURCHES_QUERY)
  const churches = data?.churches || []
  
  const enriched = useMemo(() => {
    return enrichChurchesWithAutoLink(churches, regions)
  }, [churches, regions])
  
  // Agrupar por região
  const chartData = useMemo(() => {
    return regions.map(region => ({
      name: region.name,
      churches: enriched.filter(c => c.region_id === region.id).length,
      autoLinked: enriched.filter(c => 
        c.region_id === region.id && c.has_auto_link
      ).length,
      color: region.color
    }))
  }, [enriched, regions])
  
  return (
    <BarChart data={chartData}>
      <Bar dataKey="churches" fill="#8884d8" />
      <Bar dataKey="autoLinked" fill="#82ca9d" />
    </BarChart>
  )
}
```

### MapLibre GL (Markers)

```typescript
import { enrichChurchesWithAutoLink } from "@/lib/church-region-matcher"
import MapLibre from "@/components/maps/map-libre-refactored"

function ChurchesMap() {
  const enriched = enrichChurchesWithAutoLink(churches, regions)
  
  const markers = enriched.map(church => ({
    lngLat: [church.longitude, church.latitude],
    color: church.region?.color || '#gray',
    popupHTML: `
      <div>
        <h3>${church.name}</h3>
        ${church.has_auto_link ? 
          `<span>🤖 Auto-linked (${church.link_confidence}%)</span>` : 
          ''
        }
        <p>${church.region?.name || 'No region'}</p>
      </div>
    `
  }))
  
  return <MapLibre markers={markers} />
}
```

---

## 🧪 Testing

### Teste de Normalização

```typescript
import { normalizeProvinceCode, normalizeCityCode } from "@/lib/church-region-matcher"

// Província
expect(normalizeProvinceCode("Flevoland")).toBe("FL")
expect(normalizeProvinceCode("fl")).toBe("FL")
expect(normalizeProvinceCode("Invalid")).toBe(null)

// Cidade
expect(normalizeCityCode("Lelystad")).toBe("LEL")
expect(normalizeCityCode("Amsterdam")).toBe("AMS")
```

### Teste de Matching

```typescript
import { findMatchingRegion } from "@/lib/church-region-matcher"

const church = {
  id: "1",
  name: "Test Church",
  contact: {
    city: "Lelystad",
    state: "Flevoland"
  }
}

const regions = [
  {
    id: "region-1",
    name: "District #001 Flevoland",
    territory: JSON.stringify({
      NL: {
        FL: ["LEL", "ALM"]
      }
    })
  }
]

const match = findMatchingRegion(church, regions)

expect(match.confidence).toBe(100)
expect(match.matchType).toBe('city')
expect(match.region.id).toBe('region-1')
```

---

## 📝 Best Practices

### 1. **Sempre use useMemo**
```typescript
const enriched = useMemo(() => {
  return enrichChurchesWithAutoLink(churches, regions)
}, [churches, regions])
```

### 2. **Validar dados antes de processar**
```typescript
if (churches.length === 0 || regions.length === 0) {
  return <EmptyState />
}
```

### 3. **Separar visual feedback de dados**
```typescript
// ✅ BOM: Visual feedback explícito
{church.has_auto_link && <Badge>Auto-linked</Badge>}

// ❌ RUIM: Confundir auto-link com dados permanentes
{church.region_id && <Badge>Has Region</Badge>}
```

### 4. **Usar TypeScript para type safety**
```typescript
import type { EnrichedChurch, AutoLinkStats } from "@/lib/church-region-matcher"

const enriched: EnrichedChurch[] = enrichChurchesWithAutoLink(churches, regions)
const stats: AutoLinkStats = calculateAutoLinkStats(enriched)
```

### 5. **Debug com console.table**
```typescript
console.table(
  enriched.map(c => ({
    name: c.name,
    city: c.contact?.city,
    province: c.contact?.state,
    region: c.region?.name,
    autoLinked: c.has_auto_link,
    confidence: c.link_confidence
  }))
)
```

---

## 🔄 Workflow Completo

```typescript
// 1. Imports
import { useQuery } from "@apollo/client"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import { useRegions } from "@/hooks/use-regions"
import {
  enrichChurchesWithAutoLink,
  calculateAutoLinkStats
} from "@/lib/church-region-matcher"

// 2. Fetch data
const { regions } = useRegions()
const { data: churchesData } = useQuery(GET_CHURCHES_QUERY)
const churches = churchesData?.churches?.filter(c => !c.is_deleted) || []

// 3. Enrich
const enriched = useMemo(() => {
  return enrichChurchesWithAutoLink(churches, regions)
}, [churches, regions])

// 4. Stats
const stats = useMemo(() => {
  return calculateAutoLinkStats(enriched)
}, [enriched])

// 5. Render
return (
  <div>
    <KPICards data={[
      { title: "Total", value: stats.total },
      { title: "Auto-linked", value: stats.withAutoLink }
    ]} />
    
    <ChurchList churches={enriched} />
    
    <ChurchMap 
      churches={enriched}
      regions={regions}
    />
  </div>
)
```

---

## 🐛 Troubleshooting

### Problema: Auto-linking não funciona

**Possíveis causas:**
1. Territory JSON inválido na região
2. Church sem dados de contact
3. Província/cidade com nome incorreto

**Solução:**
```typescript
const match = findMatchingRegion(church, regions)
console.log(match.reason) // Ver motivo da falha
```

### Problema: Confidence sempre 0

**Verificar:**
1. `church.contact.state` não é null
2. `region.territory` está parseável
3. Province codes estão normalizados

```typescript
console.log('Church province:', church.contact?.state)
console.log('Normalized:', normalizeProvinceCode(church.contact?.state))
```

### Problema: Churches duplicadas em múltiplas regiões

**Causa:** Territórios sobrepostos

**Solução:** O algoritmo retorna o PRIMEIRO match. Revisar territories das regiões para evitar overlap.

---

## 📚 Referências

- **ERD**: AdventistGroei Data Model
- **GraphQL Schema**: `/graphql-schema.json`
- **Types**: `/types/graphql-global-types.ts`
- **Geocoding**: `/lib/geocoding.ts`
- **Map Component**: `/components/maps/map-libre-refactored.tsx`

---

## 🎯 Próximos Passos

1. **Admin Panel**: Interface para aprovar/rejeitar auto-links
2. **Bulk Update**: Mutation para salvar auto-links no banco
3. **Historical Tracking**: Log de mudanças de região
4. **Quality Dashboard**: Visualização de qualidade dos dados

---

**Documentação atualizada em:** 27/01/2026  
**Versão:** 1.0.0  
**Autor:** AdventistGroei Development Team
