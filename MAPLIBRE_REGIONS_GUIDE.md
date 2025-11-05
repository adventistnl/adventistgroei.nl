# 🗺️ MapLibre com Regiões - Guia de Uso

## Visão Geral

O componente **MapLibre** agora suporta coloração automática de províncias baseada em regiões. Ideal para visualizar divisões administrativas, eclesiásticas ou territoriais nos Países Baixos.

## ✨ Features

- ✅ **Gratuito** - Sem necessidade de token de API
- ✅ **Coloração por Região** - Províncias coloridas automaticamente
- ✅ **Interativo** - Hover e clique em províncias
- ✅ **TypeScript** - Totalmente tipado
- ✅ **Marcadores** - Suporte a marcadores personalizados
- ✅ **Fácil Configuração** - Dataset simples e intuitivo

---

## 📦 Instalação

```bash
pnpm install maplibre-gl
```

---

## 🚀 Uso Básico

### 1. Import do Componente

```tsx
import MapLibre, { 
  RegionConfig,
  createRegion,
  NETHERLANDS_CENTER 
} from "@/components/maps/map-libre"
```

### 2. Configurar Regiões

```tsx
const regions: RegionConfig[] = [
  {
    id: 'region-1',
    name: 'Distrito Norte',
    color: '#3b82f6', // Azul
    provinces: ['NLGR', 'NLFR', 'NLDR'], // Groningen, Friesland, Drenthe
    churches_count: 8,
    members_count: 320
  },
  {
    id: 'region-2',
    name: 'Distrito Oeste',
    color: '#10b981', // Verde
    provinces: ['NLNH', 'NLZH', 'NLUT', 'NLFL'], // Noord-Holland, Zuid-Holland, Utrecht, Flevoland
    churches_count: 15,
    members_count: 650
  }
]
```

### 3. Renderizar o Mapa

```tsx
<MapLibre
  center={NETHERLANDS_CENTER}
  zoom={7}
  height="600px"
  theme="light"
  regions={regions}
  onProvinceClick={(code, region) => {
    console.log(`Província ${code} da ${region}`)
  }}
/>
```

---

## 📍 Códigos das Províncias

| Código | ISO 3166-2 | Nome da Província |
|--------|------------|-------------------|
| `NLGR` | NL-GR | Groningen |
| `NLFR` | NL-FR | Friesland |
| `NLDR` | NL-DR | Drenthe |
| `NLNH` | NL-NH | Noord-Holland |
| `NLZH` | NL-ZH | Zuid-Holland |
| `NLUT` | NL-UT | Utrecht |
| `NLFL` | NL-FL | Flevoland |
| `NLZL` | NL-ZL | Zeeland |
| `NLNB` | NL-NB | Noord-Brabant |
| `NLLI` | NL-LI | Limburg |
| `NLOV` | NL-OV | Overijssel |
| `NLGE` | NL-GE | Gelderland |

---

## 🎨 Exemplos de Configuração

### Exemplo 1: Regiões Eclesiásticas

```tsx
const churchRegions: RegionConfig[] = [
  createRegion('norte', 'Distrito Norte', '#3b82f6', ['NLGR', 'NLFR', 'NLDR'], {
    churches_count: 8,
    members_count: 320
  }),
  createRegion('oeste', 'Distrito Oeste', '#10b981', ['NLNH', 'NLZH', 'NLUT', 'NLFL'], {
    churches_count: 15,
    members_count: 650
  }),
  createRegion('sul', 'Distrito Sul', '#f59e0b', ['NLZL', 'NLNB', 'NLLI'], {
    churches_count: 12,
    members_count: 480
  }),
  createRegion('leste', 'Distrito Leste', '#ef4444', ['NLOV', 'NLGE'], {
    churches_count: 10,
    members_count: 410
  }),
]
```

### Exemplo 2: Divisão por Tamanho de Igreja

```tsx
const sizeRegions: RegionConfig[] = [
  {
    id: 'large-churches',
    name: 'Igrejas Grandes (>100 membros)',
    color: '#22c55e',
    provinces: ['NLNH', 'NLZH', 'NLUT'],
  },
  {
    id: 'medium-churches',
    name: 'Igrejas Médias (50-100 membros)',
    color: '#f59e0b',
    provinces: ['NLNB', 'NLGE', 'NLOV'],
  },
  {
    id: 'small-churches',
    name: 'Igrejas Pequenas (<50 membros)',
    color: '#ef4444',
    provinces: ['NLGR', 'NLFR', 'NLDR', 'NLFL', 'NLZL', 'NLLI'],
  },
]
```

### Exemplo 3: Focar em Uma Província

```tsx
const focusProvince: RegionConfig[] = [
  {
    id: 'highlighted',
    name: 'Zuid-Holland',
    color: '#8b5cf6',
    provinces: ['NLZH'], // Apenas Zuid-Holland
  },
  {
    id: 'others',
    name: 'Outras Províncias',
    color: '#94a3b8',
    provinces: ['NLGR', 'NLFR', 'NLDR', 'NLNH', 'NLUT', 'NLFL', 'NLZL', 'NLNB', 'NLLI', 'NLOV', 'NLGE'],
  },
]
```

---

## 🎯 Props do Componente

### Básicas

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `width` | `string` | `'100%'` | Largura do mapa |
| `height` | `string` | `'500px'` | Altura do mapa |
| `center` | `[number, number]` | `NETHERLANDS_CENTER` | Centro do mapa [lng, lat] |
| `zoom` | `number` | `7` | Nível de zoom inicial |
| `theme` | `'dark' \| 'light' \| 'voyager'` | `'dark'` | Tema do mapa |

### Regiões

| Prop | Tipo | Descrição |
|------|------|-----------|
| `regions` | `RegionConfig[]` | Array de configurações de regiões |
| `provincesGeoJsonUrl` | `string` | URL customizada do GeoJSON (opcional) |

### Callbacks

| Prop | Tipo | Descrição |
|------|------|-----------|
| `onProvinceClick` | `(code: string, region?: string) => void` | Chamado ao clicar em província |
| `onProvinceHover` | `(code: string \| null, region?: string) => void` | Chamado ao passar mouse |
| `onLoad` | `(map: maplibregl.Map) => void` | Chamado quando mapa carrega |

### Controles

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `showControls` | `boolean` | `true` | Exibir controles de navegação |
| `showGeolocation` | `boolean` | `true` | Exibir controle de geolocalização |
| `showFullscreen` | `boolean` | `true` | Exibir controle de tela cheia |
| `showScale` | `boolean` | `true` | Exibir controle de escala |

---

## 🔧 Helpers Disponíveis

### `createRegion()`

Cria uma configuração de região com validação de tipos:

```tsx
const region = createRegion(
  'id-unico',           // ID da região
  'Nome da Região',     // Nome para exibição
  '#3b82f6',           // Cor (hex)
  ['NLNH', 'NLZH'],    // Array de códigos de províncias
  {                     // Opções adicionais (opcional)
    churches_count: 10,
    members_count: 450
  }
)
```

### Constantes Úteis

```tsx
import {
  NETHERLANDS_CENTER,      // Centro geográfico dos Países Baixos
  NETHERLANDS_CITIES,      // Coordenadas das principais cidades
  NETHERLANDS_PROVINCES,   // Mapa de códigos para nomes
  EXAMPLE_REGIONS,         // Exemplo de 4 regiões
} from "@/components/maps/map-libre"
```

---

## 🎨 Paleta de Cores Recomendadas

### Cores por Tailwind CSS

```tsx
const colors = {
  blue: '#3b82f6',    // Blue 500
  green: '#10b981',   // Green 500
  amber: '#f59e0b',   // Amber 500
  red: '#ef4444',     // Red 500
  purple: '#8b5cf6',  // Purple 500
  pink: '#ec4899',    // Pink 500
  teal: '#14b8a6',    // Teal 500
  orange: '#f97316',  // Orange 500
}
```

### Cores Pastéis

```tsx
const pastelColors = {
  blue: '#93c5fd',
  green: '#86efac',
  amber: '#fcd34d',
  red: '#fca5a5',
  purple: '#c4b5fd',
}
```

---

## 📊 Integração com Legenda

```tsx
<div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg">
  {regions.map((region) => (
    <div key={region.id} className="flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded"
        style={{ backgroundColor: region.color }}
      />
      <span className="text-sm font-medium">{region.name}</span>
      <span className="text-xs text-muted-foreground">
        ({region.provinces.length} províncias)
      </span>
    </div>
  ))}
</div>
```

---

## 🐛 Troubleshooting

### Províncias não aparecem coloridas

1. Verifique se a prop `regions` foi fornecida
2. Confirme que os códigos das províncias estão corretos
3. Verifique o console para logs de debug: `🗺️ Provinces loaded`

### Cores não aplicadas corretamente

1. Use formato hexadecimal para cores: `#3b82f6`
2. Certifique-se de que não há províncias duplicadas em diferentes regiões
3. Províncias não mapeadas receberão cor cinza padrão

### GeoJSON não carrega

1. Verifique a conexão com internet
2. URL padrão: `https://raw.githubusercontent.com/deldersveld/topojson/master/countries/netherlands/netherlands-provinces.json`
3. Forneça URL customizada via prop `provincesGeoJsonUrl`

---

## 🚀 Performance

### Otimizações Implementadas

- ✅ `useMemo` para cálculos de cores
- ✅ `useCallback` para event handlers
- ✅ Lazy loading do GeoJSON
- ✅ Cleanup automático de camadas ao desmontar

### Dicas de Performance

1. **Limite o número de regiões**: Recomendado máximo de 10 regiões
2. **Use cores diferentes**: Ajuda na identificação visual
3. **Debounce hover events**: Para muitos callbacks

---

## 📝 Exemplo Completo

```tsx
import MapLibre, { 
  RegionConfig,
  createRegion,
  NETHERLANDS_CENTER 
} from "@/components/maps/map-libre"

export default function RegionsMap() {
  const regions: RegionConfig[] = [
    createRegion('norte', 'Norte', '#3b82f6', ['NLGR', 'NLFR', 'NLDR']),
    createRegion('oeste', 'Oeste', '#10b981', ['NLNH', 'NLZH', 'NLUT', 'NLFL']),
    createRegion('sul', 'Sul', '#f59e0b', ['NLZL', 'NLNB', 'NLLI']),
    createRegion('leste', 'Leste', '#ef4444', ['NLOV', 'NLGE']),
  ]

  return (
    <div className="space-y-4">
      {/* Legenda */}
      <div className="flex gap-4">
        {regions.map(region => (
          <div key={region.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded" 
              style={{ backgroundColor: region.color }} 
            />
            <span>{region.name}</span>
          </div>
        ))}
      </div>

      {/* Mapa */}
      <MapLibre
        center={NETHERLANDS_CENTER}
        zoom={7}
        height="600px"
        theme="light"
        regions={regions}
        onProvinceClick={(code, regionName) => {
          alert(`Clicou em ${code} (${regionName})`)
        }}
      />
    </div>
  )
}
```

---

## 🔗 Recursos Adicionais

- **MapLibre GL JS Docs**: https://maplibre.org/maplibre-gl-js/docs/
- **GeoJSON Spec**: https://geojson.org/
- **Carto Basemaps**: https://carto.com/basemaps/

---

## 📄 Licença

Este componente usa MapLibre GL (BSD 3-Clause) e dados GeoJSON públicos.
