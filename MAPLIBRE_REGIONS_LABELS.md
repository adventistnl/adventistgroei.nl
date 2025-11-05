# MapLibre - Labels de Regiões

## ✅ Layers de Marcação Implementados

### 🏷️ Sistema de Labels para Regiões

O componente MapLibre agora inclui **labels automáticos** para cada região, posicionados no centro geográfico das províncias que compõem cada região.

## 📊 Como Funciona

### 1. **Cálculo Automático do Centróide**

Para cada região, o sistema:
1. Identifica todas as províncias da região
2. Busca as coordenadas centrais de cada província
3. Calcula a média das coordenadas (centróide)
4. Posiciona o label nesse ponto central

```typescript
// Exemplo: Distrito Norte com 3 províncias
Region: Distrito Norte
Provinces: ['NLGR', 'NLFR', 'NLDR']

Coordinates:
- NLGR (Groningen): [6.5665, 53.2194]
- NLFR (Friesland):  [5.7985, 53.1641]
- NLDR (Drenthe):    [6.5665, 52.9476]

Centroid (average): [6.3105, 53.1104] ← Label aqui!
```

### 2. **Layers Criados**

#### **Layer 1: Background Circle (`region-labels-background`)**
- **Tipo**: `circle`
- **Cor**: Mesma cor da região
- **Raio**: 35px
- **Opacidade**: 85%
- **Borda**: Branca, 2px
- **Propósito**: Fundo colorido para destacar o label

#### **Layer 2: Text Label (`region-labels-text`)**
- **Tipo**: `symbol`
- **Texto**: Nome da região
- **Fonte**: Open Sans Bold / Arial Unicode MS Bold
- **Tamanho**: 13px
- **Cor**: Branco `#ffffff`
- **Halo**: Preto com opacidade 0.8, espessura 1.5px
- **Propósito**: Texto legível sobre o fundo colorido

### 3. **Coordenadas das Províncias**

```typescript
const provinceCoords: Record<string, [number, number]> = {
  'NL-DR': [6.5665, 52.9476],  // Drenthe
  'NL-FL': [5.5222, 52.5269],  // Flevoland
  'NL-FR': [5.7985, 53.1641],  // Friesland
  'NL-GE': [5.8987, 52.0451],  // Gelderland
  'NL-GR': [6.5665, 53.2194],  // Groningen
  'NL-LI': [5.9699, 51.4427],  // Limburg
  'NL-NB': [5.3037, 51.6978],  // Noord-Brabant
  'NL-NH': [4.7903, 52.5208],  // Noord-Holland
  'NL-OV': [6.1604, 52.4387],  // Overijssel
  'NL-UT': [5.1214, 52.0907],  // Utrecht
  'NL-ZL': [3.6129, 51.4940],  // Zeeland
  'NL-ZH': [4.4777, 52.0115],  // Zuid-Holland
};
```

## 🎨 Exemplo Visual

### Região: Distrito Norte
- **Cor**: `#3b82f6` (Azul)
- **Províncias**: Groningen, Friesland, Drenthe
- **Centro Calculado**: `[6.3105, 53.1104]`

**Resultado no mapa:**
```
      ┌─────────────────┐
      │                 │
      │   ●────────●    │  ← Círculo azul
      │   │ NORTE  │    │  ← Texto branco
      │   ●────────●    │  ← com halo preto
      │                 │
      └─────────────────┘
```

## 📝 Estrutura do GeoJSON de Labels

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [6.3105, 53.1104]
      },
      "properties": {
        "name": "Distrito Norte",
        "color": "#3b82f6",
        "provinces_count": 3,
        "churches_count": 8,
        "members_count": 320
      }
    }
  ]
}
```

## 🔧 Configuração de Estilo

### Alterar Tamanho do Círculo

```typescript
// Linha ~485
'circle-radius': 35, // ← Altere aqui (padrão: 35px)
```

**Sugestões:**
- Pequeno: `25`
- Médio: `35` (padrão)
- Grande: `50`
- Extra Grande: `70`

### Alterar Tamanho do Texto

```typescript
// Linha ~502
'text-size': 13, // ← Altere aqui (padrão: 13px)
```

**Sugestões:**
- Pequeno: `11`
- Médio: `13` (padrão)
- Grande: `15`
- Extra Grande: `18`

### Alterar Opacidade do Fundo

```typescript
// Linha ~488
'circle-opacity': 0.85, // ← Altere aqui (padrão: 85%)
```

**Sugestões:**
- Transparente: `0.5` (50%)
- Semi-opaco: `0.7` (70%)
- Normal: `0.85` (85%) (padrão)
- Opaco: `1.0` (100%)

### Alterar Cor do Texto

```typescript
// Linha ~510
'text-color': '#ffffff', // ← Branco (padrão)
```

**Alternativas:**
- Preto: `#000000`
- Amarelo: `#fbbf24`
- Verde claro: `#86efac`

### Alterar Halo do Texto

```typescript
// Linhas ~511-512
'text-halo-color': 'rgba(0, 0, 0, 0.8)', // Preto 80%
'text-halo-width': 1.5,                   // Espessura
```

**Sugestões:**
- Sutil: width `1.0`, opacity `0.5`
- Normal: width `1.5`, opacity `0.8` (padrão)
- Forte: width `2.5`, opacity `1.0`

## 🎯 Comportamento

### Sobreposição de Labels

```typescript
'text-allow-overlap': false,      // Não permite sobreposição
'text-ignore-placement': false,   // Respeita outras features
```

Se duas regiões estiverem muito próximas:
- ✅ MapLibre **automaticamente** decide qual label mostrar
- ✅ Prioriza labels mais importantes
- ✅ Evita texto sobreposto ilegível

Para **forçar todos os labels** (pode sobrepor):
```typescript
'text-allow-overlap': true,
'text-ignore-placement': true,
```

## 📊 Exemplo de Uso Completo

```typescript
const regions: RegionConfig[] = [
  {
    id: 'region-norte',
    name: 'Distrito Norte',
    color: '#3b82f6',
    provinces: ['NLGR', 'NLFR', 'NLDR'],
    churches_count: 8,
    members_count: 320,
  },
  {
    id: 'region-oeste',
    name: 'Distrito Oeste',
    color: '#10b981',
    provinces: ['NLNH', 'NLZH', 'NLUT', 'NLFL'],
    churches_count: 15,
    members_count: 650,
  },
];
```

**Resultado:**
- ✅ 2 círculos coloridos no centro de cada região
- ✅ Textos "Distrito Norte" e "Distrito Oeste"
- ✅ Cores automáticas baseadas nas regiões
- ✅ Posicionamento automático nos centróides

## 🧪 Testar

1. Abra `/regions-example`
2. Veja os labels no centro de cada região
3. Zoom in/out - os labels permanecem visíveis
4. Modifique as províncias de uma região
5. O label se reposiciona automaticamente!

## 📏 Ordem dos Layers (Z-Index)

```
┌────────────────────────────────────┐
│  7. region-labels-text (topo)     │ ← Texto sempre visível
├────────────────────────────────────┤
│  6. region-labels-background      │ ← Círculo colorido
├────────────────────────────────────┤
│  5. provinces-hover               │ ← Hover effect
├────────────────────────────────────┤
│  4. provinces-outline             │ ← Contornos brancos
├────────────────────────────────────┤
│  3. provinces-fill                │ ← Províncias coloridas
├────────────────────────────────────┤
│  2. Mapa base (Carto)             │ ← Fundo do mapa
└────────────────────────────────────┘
```

## 🔄 Atualização Automática

Os labels são **recalculados automaticamente** quando:
- ✅ Regiões são modificadas
- ✅ Províncias são adicionadas/removidas
- ✅ Cores são alteradas
- ✅ Componente é re-renderizado

**Não é necessário fazer nada manualmente!**

## ⚙️ Personalização Avançada

### Adicionar Informação Extra

```typescript
// Modificar o texto do label
'text-field': [
  'concat',
  ['get', 'name'],
  '\n',
  ['get', 'churches_count'],
  ' igrejas'
]
```

**Resultado:**
```
Distrito Norte
8 igrejas
```

### Usar Ícone em vez de Círculo

```typescript
// Substituir circle por image
map.current.addLayer({
  id: LABELS_BACKGROUND,
  type: 'symbol',
  source: LABELS_SOURCE_ID,
  layout: {
    'icon-image': 'custom-marker', // Carregue a imagem antes
    'icon-size': 1.5,
  },
});
```

### Mostrar Labels Apenas em Zoom Alto

```typescript
// Adicionar minzoom
map.current.addLayer({
  id: LABELS_LAYER,
  type: 'symbol',
  source: LABELS_SOURCE_ID,
  minzoom: 8, // Só mostra a partir do zoom 8
  layout: { /* ... */ },
});
```

## ✅ Vantagens do Sistema

1. **Automático**: Calcula centróide baseado nas províncias
2. **Dinâmico**: Atualiza quando regiões mudam
3. **Visual**: Círculo colorido + texto legível
4. **Responsivo**: Adapta a diferentes zooms
5. **Inteligente**: Evita sobreposição de labels
6. **Personaliz ável**: Fácil ajustar cores, tamanhos, fontes

---

**Status**: ✅ Funcionando perfeitamente  
**Última atualização**: 29 de outubro de 2025
