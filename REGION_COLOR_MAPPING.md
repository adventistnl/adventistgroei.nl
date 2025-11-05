# 🎨 Coloração Dinâmica de Províncias por Região - Implementado

## ✅ Implementação Completa

### Sistema de Coloração Inteligente

Implementamos um sistema que **dinamicamente colore cada província** baseado na região à qual ela pertence, usando **Mapbox GL Expressions**.

## 🔧 Como Funciona

### 1. Expressão Mapbox "match"

Criamos uma expressão dinâmica que mapeia cada província ISO para a cor da sua região:

```typescript
const provinceColorExpression = [
  'match',
  ['get', 'iso_3166_2'],  // Pega o código ISO da província do GeoJSON
  'NL-FL', '#10b981',     // Flevoland -> cor da região Oeste (verde)
  'NL-FR', '#3b82f6',     // Friesland -> cor da região Norte (azul)
  'NL-DR', '#3b82f6',     // Drenthe -> cor da região Norte (azul)
  // ... todas as 12 províncias
  '#f3f4f6'               // Cor padrão (cinza claro)
]
```

### 2. Mapeamento Automático

O código automaticamente:
1. **Itera sobre todas as regiões** fornecidas
2. **Para cada região**, pega suas províncias
3. **Converte** códigos simplificados (`NLFL`) para ISO padrão (`NL-FL`)
4. **Cria** pares província-cor na expressão Mapbox

```typescript
regions.forEach((region) => {
  region.provinces.forEach((code) => {
    const isoCode = PROVINCE_CODES[code]  // NLFL -> NL-FL
    expression.push(isoCode)               // Adiciona província
    expression.push(region.color)          // Adiciona cor da região
  })
})
```

### 3. Exemplo de Dados de Entrada

```typescript
const mapRegionsData = [
  {
    id: 'region-norte',
    name: 'Distrito Norte',
    color: '#3b82f6',  // Azul
    provinces: ['NLGR', 'NLFR', 'NLDR'],
    churches_count: 8
  },
  {
    id: 'region-oeste',
    name: 'Distrito Oeste',
    color: '#10b981',  // Verde
    provinces: ['NLNH', 'NLZH', 'NLUT', 'NLFL'],
    churches_count: 15
  },
  // ... outras regiões
]
```

## 🎯 Funcionalidades Implementadas

### ✅ 1. Coloração Dinâmica
- Cada província é pintada com a cor da sua região
- Cores definidas nos dados de entrada
- Mapeamento automático e dinâmico

### ✅ 2. Hover Effects Inteligentes
- **Opacidade aumenta** quando mouse sobre província
- **Borda fica mais grossa** (1.5px → 3px)
- **Tooltip aparece** mostrando:
  - Nome da província
  - Região à qual pertence (com cor)
  - Número de igrejas na região

### ✅ 3. Tooltip de Hover
```
┌─────────────────────────┐
│ Noord-Holland           │
│ 🟢 Distrito Oeste       │
│ 15 churches             │
└─────────────────────────┘
```

### ✅ 4. Debug Completo
Console mostra:
```
🎨 Region to Province Mapping:
  Distrito Norte (#3b82f6): ['NL-GR', 'NL-FR', 'NL-DR']
  Distrito Oeste (#10b981): ['NL-NH', 'NL-ZH', 'NL-UT', 'NL-FL']
  Distrito Sul (#f59e0b): ['NL-ZL', 'NL-NB', 'NL-LI']
  Distrito Leste (#ef4444): ['NL-OV', 'NL-GE']
```

## 📊 Estrutura de Dados

### Entrada (Props)
```typescript
interface RegionData {
  id: string
  name: string
  color: string          // Cor hexadecimal
  provinces: string[]    // Códigos simplificados: ['NLFL', 'NLFR']
  churches_count?: number
  members_count?: number
}
```

### Mapeamento Interno
```typescript
const PROVINCE_CODES = {
  NLGR: "NL-GR",  // Groningen
  NLFR: "NL-FR",  // Friesland
  NLDR: "NL-DR",  // Drenthe
  NLNH: "NL-NH",  // Noord-Holland
  NLZH: "NL-ZH",  // Zuid-Holland
  NLUT: "NL-UT",  // Utrecht
  NLFL: "NL-FL",  // Flevoland
  NLZL: "NL-ZL",  // Zeeland
  NLNB: "NL-NB",  // Noord-Brabant
  NLLI: "NL-LI",  // Limburg
  NLOV: "NL-OV",  // Overijssel
  NLGE: "NL-GE",  // Gelderland
}
```

## 🎨 Sistema de Cores

### Regiões de Exemplo
| Região | Cor | Províncias | Hex |
|--------|-----|------------|-----|
| Distrito Norte | Azul | Groningen, Friesland, Drenthe | `#3b82f6` |
| Distrito Oeste | Verde | Noord-Holland, Zuid-Holland, Utrecht, Flevoland | `#10b981` |
| Distrito Sul | Âmbar | Zeeland, Noord-Brabant, Limburg | `#f59e0b` |
| Distrito Leste | Vermelho | Overijssel, Gelderland | `#ef4444` |

## 🔍 Verificação Visual

### No Mapa Você Verá:
1. **Províncias coloridas** conforme suas regiões
2. **Legendas** mostrando cada região com sua cor
3. **Hover tooltip** ao passar mouse
4. **Debug panel** mostrando status

### No Console (F12):
```
🗺️ Mapbox Token: pk.eyJ1IjoiZGFuaWVsbW...
🗺️ Regions: 4
🗺️ View State: {longitude: 5.2913, latitude: 52.5, zoom: 6.5, ...}
🎨 Region to Province Mapping:
  Distrito Norte (#3b82f6): ['NL-GR', 'NL-FR', 'NL-DR']
  ...
🎨 Province Color Expression: ['match', ['get', 'iso_3166_2'], 'NL-GR', '#3b82f6', ...]
✅ Map loaded successfully
```

## 🚀 Teste Agora

1. **Reinicie o servidor**:
```bash
pnpm run dev
```

2. **Acesse**:
```
http://localhost:3000/regions-example
```

3. **Verifique**:
   - ✅ Províncias com cores diferentes
   - ✅ Groningen, Friesland, Drenthe em AZUL
   - ✅ Noord-Holland, Zuid-Holland, Utrecht, Flevoland em VERDE
   - ✅ Zeeland, Noord-Brabant, Limburg em ÂMBAR
   - ✅ Overijssel, Gelderland em VERMELHO

4. **Interaja**:
   - Passe mouse sobre províncias
   - Veja tooltip com nome e região
   - Clique nas províncias
   - Clique nos badges das regiões na legenda

## 🎯 Vantagens da Implementação

### ✅ Dinâmico
- Não precisa editar código para mudar cores
- Apenas atualizar dados de entrada

### ✅ Escalável
- Adicione quantas regiões quiser
- Sistema se adapta automaticamente

### ✅ Performático
- Usa expressões nativas do Mapbox
- Renderização otimizada via GPU

### ✅ Manutenível
- Código limpo e documentado
- Separação clara de dados e lógica

## 🔧 Customização

### Mudar Cores de Regiões
```typescript
const mapRegionsData = [
  {
    id: 'region-norte',
    name: 'Norte',
    color: '#FF0000',  // Mude para vermelho
    provinces: ['NLGR', 'NLFR', 'NLDR']
  }
]
```

### Adicionar Nova Região
```typescript
{
  id: 'region-centro',
  name: 'Distrito Centro',
  color: '#9333ea',  // Roxo
  provinces: ['NLUT'],  // Utrecht sozinha
  churches_count: 5
}
```

### Reorganizar Províncias
Simplesmente mova códigos de província entre regiões:
```typescript
// Antes: Utrecht no Oeste
provinces: ['NLNH', 'NLZH', 'NLUT', 'NLFL']

// Depois: Utrecht no Norte
provinces: ['NLGR', 'NLFR', 'NLDR', 'NLUT']
```

## 📝 Notas Técnicas

### Por que funciona?
1. **GeoJSON externo** tem propriedade `iso_3166_2` com código ISO
2. **Expressão match** do Mapbox compara valores dinamicamente
3. **GPU renderiza** cores em tempo real
4. **React memo** otimiza recalculos

### Limitações
- Depende do GeoJSON ter propriedade `iso_3166_2`
- Códigos ISO devem corresponder ao mapeamento
- Cor padrão (#f3f4f6) para províncias não mapeadas

---

**Status**: ✅ Coloração dinâmica implementada e funcionando!
**Teste**: Reinicie servidor e acesse `/regions-example`
