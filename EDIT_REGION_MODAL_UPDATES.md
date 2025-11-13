# 🗺️ Edit Region Modal - Atualização Completa (4 Steps)

## Resumo das Mudanças

O modal de edição de regiões (`edit-region-modal.tsx`) foi **completamente atualizado** para refletir a mesma estrutura de 4 passos do modal de criação, incluindo:

- ✅ **Step 1: Seleção de País** (novo)
- ✅ **Step 2: Informações Básicas** (nome, descrição, cor)
- ✅ **Step 3: Seleção de Províncias & Cidades** 
- ✅ **Step 4: Review & Confirmação**

---

## 📋 Fluxo do Modal (4 Steps)

### **Step 1: Seleção de País** ✨ NOVO
- Combobox com busca para seleção de país
- Usa dados de `countries` do `geographicData.ts`
- Reseta províncias e cidades quando o país muda
- Validação: país obrigatório
- Comportamento idêntico ao `add-region-modal`

### **Step 2: Informações Básicas**
- **Nome da Região** (obrigatório, min 2 caracteres)
- **Descrição** (opcional)
- **Cor da Região** (usando novo componente `ColorPicker`)
  - 20 cores pré-definidas (tons escuros)
  - Seletor de cor customizado
  - Preview em tempo real

### **Step 3: Seleção de Províncias & Cidades**
- Busca em tempo real de províncias e cidades
- Seleção de província com auto-seleção de todas as cidades
- Grid expandível com todas as cidades por província
- Resumo horizontal das províncias selecionadas
- Validação: pelo menos 1 província obrigatória

### **Step 4: Review & Confirmação** ✨ NOVO
- Exibe todas as informações a serem atualizadas
- Mostra país, províncias e cidades selecionadas
- Preview da cor e informações básicas
- Botão final para atualizar a região

---

## 🔄 Comparação com Add Region Modal

| Aspecto | Add Region | Edit Region |
|---------|-----------|------------|
| **Steps** | 4 | 4 |
| **Step 1** | Seleção de País | Seleção de País |
| **Step 2** | Info Básica + Cor | Info Básica + Cor |
| **Step 3** | Províncias/Cidades | Províncias/Cidades |
| **Step 4** | Review | Review |
| **Color Picker** | ✅ ColorPicker | ✅ ColorPicker |
| **Validação** | 4 steps | 4 steps |

---

## 📊 Tipos de Dados

### Input (FormData)
```typescript
interface RegionUpdateDto {
  name: string
  description?: string | null
  color?: string | null
  territory?: TerritoryMap
}
```

### Territory Structure
```typescript
interface TerritoryMap {
  [country: string]: {
    [provinceCode: string]: string[] // array de city codes
  }
}
```

### Parsing do Territory Existente
```typescript
// Ao abrir o modal com região existente:
if (region.territory) {
  const firstCountry = Object.keys(region.territory)[0] || "NL"
  setSelectedCountry(firstCountry)
  
  // Parse provinces and cities
  Object.entries(region.territory[firstCountry] || {}).forEach(([provinceCode, cityCodes]) => {
    provinces.add(provinceCode)
    citiesMap[provinceCode] = new Set(cityCodes)
  })
}
```

---

## 🎨 Componentes Reutilizados

### ColorPicker Component
Substituiu toda a implementação manual de seletor de cores:
```tsx
<ColorPicker
  value={formData.color || "#475569"}
  onChange={(color) => handleInputChange('color', color)}
  disabled={isLoading}
  label="Region Color (Optional)"
  showPreview={true}
/>
```

---

## ✅ Validações Progressivas

```typescript
validateStep(step: number) {
  if (step === 1) {
    // Validar país obrigatório
    if (!selectedCountry) errors.country = "Please select a country"
  }
  
  if (step === 2) {
    // Validar nome obrigatório
    if (!formData.name?.trim()) errors.name = "Region name is required"
    if (formData.name.trim().length < 2) errors.name = "Must be at least 2 characters"
  }
  
  if (step === 3) {
    // Validar pelo menos 1 província
    if (selectedProvinces.size === 0) errors.territory = "Please select at least one province"
  }
}
```

---

## 📡 Integração com GraphQL

O modal envia dados no formato correto para `UpdateRegionVariables`:

```typescript
await updateRegion({
  variables: {
    id: region.id,
    name: "São Paulo Region",
    description: "Main region in São Paulo state",
    color: "#3b82f6",
    territory: {
      "NL": {
        "NH": ["AMS", "HAA"],
        "ZH": ["DHA", "ROT"]
      }
    }
  }
})
```

---

## 🔧 Mudanças Técnicas

### Estados Adicionados
```typescript
const [isCountryPopoverOpen, setIsCountryPopoverOpen] = useState(false)
// Já existentes:
// const [selectedCountry, setSelectedCountry] = useState<string>("NL")
// const [selectedProvinces, setSelectedProvinces] = useState<Set<string>>(new Set())
// const [selectedCities, setSelectedCities] = useState<Record<string, Set<string>>>({})
```

### Imports Novos
```typescript
import { ChevronsUpDown } from "lucide-react"
import { ColorPicker } from "@/components/ui/color-picker"
```

### Fluxo de Inicialização
1. Modal abre com região existente
2. Parse do `territory` existente
3. Seleção de país baseada no primeiro país do territory
4. Carregamento de províncias/cidades para esse país
5. Pre-seleção de províncias/cidades existentes

---

## ✨ Melhorias Aplicadas

✅ **Consistência**: Same workflow as add-region-modal
✅ **UX**: Country selector prevents invalid territory combinations
✅ **Type-Safety**: Territory parsing com cast seguro
✅ **Validação**: 4 progressive validations
✅ **Reutilização**: ColorPicker component
✅ **Localização**: Pronto para i18n

---

## ✅ Compilação

```
✓ Compiled successfully
Route (app) Size  First Load JS
├ ○ /regions    4.83 kB    324 kB
└ ... (36 routes total)

ƒ Middleware   33.5 kB
```

---

**Status**: ✅ Implementado e compilado com sucesso
**Data**: 12 de Novembro de 2025
**Versão**: 4 Steps com Country Selector
