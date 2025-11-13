# Add Church Modal - Nova Estrutura com Regiões e Localização

## Resumo das Alterações

Implementada nova estrutura do modal de criação de igrejas (`AddChurchModal`) com 5 steps:

### Steps Implementados

#### Step 1: Localização (Province & City)
- **Componente:** `ProvinceAndCitySelector`
- **Funcionalidade:** Seletor de província e cidade baseado no país da instituição
- **Dados:** Carregados de `geographicData.ts` (states e cities)
- **País:** Vem de `currentInstitutionData.contact.country` via `useInstitution()`
- **Validação:** Provincia obrigatória

#### Step 2: Região & Tipo de Igreja
- **Componente Principal:** `RegionSelector`
- **Funcionalidade:** Seletor de regiões da instituição
- **Dados:** Carregados via `useRegions()` hook
- **Features:**
  - Busca por nome ou descrição da região
  - Display da cor da região como indicador visual
  - Suporte a regiões opcionais/obrigatórias
- **Componente Secundário:** `ChurchTypeSelector`
  - Seletor opcional de tipo de igreja (Plant, Satellite, etc)
  - Apenas mostrado se "Special Church" for marcado

#### Step 3: Nome da Igreja
- **Validação:** 
  - Nome obrigatório
  - Mínimo 2 caracteres
- **Placeholders:** Traduzidas via `churchTranslations`

#### Step 4: Informações de Contato
- **Campos:** Contact name, email, phone, city
- **Tipo:** Opcional - usuario pode pular
- **Button:** "Skip Contacts" para ir direto ao review

#### Step 5: Review
- **Exibição:** Todos os dados em formato tabular (like department modal)
- **Seções:**
  - Basic Information (name, region, church type se aplicável)
  - Contact Information (se preenchida)
- **Action:** Final confirmation com button "Create Church"

## Componentes Criados

### 1. RegionSelector
**Arquivo:** `/components/modals/church/region-selector.tsx`

```typescript
interface RegionSelectorProps {
  value: string
  onChange: (value: string) => void
  regions: Regions_regions[]
  isLoading?: boolean
  error?: string
  isOptional?: boolean
}
```

**Features:**
- Combobox com busca em nome e descrição
- Display da cor da região
- Suporte a regiões nulas (orphaned churches)

### 2. ProvinceAndCitySelector
**Arquivo:** `/components/modals/church/province-and-city-selector.tsx`

```typescript
interface ProvinceAndCitySelectorProps {
  provinceValue: string
  onProvinceChange: (value: string) => void
  cityValue: string
  onCityChange: (value: string) => void
  countryCode: string
  isLoading?: boolean
  provinceError?: string
  cityError?: string
}
```

**Features:**
- Dois comboboxes em cascata (Province → City)
- Filtragem dinâmica de cidades baseada na provincia selecionada
- Animação fade-in quando cidade aparecer
- Desabilitado até provincia ser selecionada

## Mudanças no AddChurchModal

### Imports Adicionados
```typescript
import { useRegions } from "@/hooks/use-regions"
import { useInstitution } from "@/contexts/institution-context"
import { RegionSelector } from "./region-selector"
import { ProvinceAndCitySelector } from "./province-and-city-selector"
import { AlertCircle } from "lucide-react" // Icon adicional
```

### State Adicional
```typescript
const [province, setProvince] = useState("")
const { regions, regionsLoading } = useRegions()
const { currentInstitutionData } = useInstitution()
```

### Validação Atualizada
- Step 1: Valida province (obrigatório)
- Step 2: Valida region_id e type (se special church)
- Step 3: Valida name
- Step 5 (final): Re-valida todos os campos obrigatórios

### Fluxo de Steps
```
1. Location (Province/City) 
   ↓
2. Region Selection + Church Type
   ↓
3. Church Name
   ↓
4. Contact Info (Optional - pode usar "Skip Contacts")
   ↓
5. Review & Create
```

## Traduções Necessárias

As seguintes chaves são usadas nas traduções do `churchTranslations`:

### Region Selector
- `placeholders.region` - Texto padrão
- `placeholders.search_region` - Placeholder da busca
- `messages.no_regions_found` - Quando não há regiões
- `labels.regions` - Título do grupo

### Province & City Selector
- `fields.province` - Label da província
- `fields.city` - Label da cidade
- `placeholders.province` - Placeholder
- `placeholders.city` - Placeholder
- `placeholders.search_province` - Placeholder busca
- `placeholders.search_city` - Placeholder busca
- `messages.no_provinces_found` - Quando não há províncias
- `messages.no_cities_found` - Quando não há cidades
- `labels.provinces` - Título grupo
- `labels.cities` - Título grupo

### Validation
- `validation.province_required` - Validação de provincia
- `validation.region_required` - Validação de region

## Considerações Técnicas

1. **Country Code:** Vem de `institution.contact.country`. Padrão: 'NL'
2. **Regions:** Carregadas via GraphQL query `GET_REGIONS_QUERY` usando `useRegions()`
3. **Geographic Data:** Province/City data em `/data/geographicData.ts`
4. **Cascata:** City selector fica desabilitado até provincia ser selecionada
5. **Region Colors:** Exibidas como dot indicator no selector
6. **Optional Region:** `isOptional` prop permite regiões nulas (orphaned churches)

## Próximos Passos

1. Testar fluxo completo de criação de church
2. Validar salvamento de dados via GraphQL mutation
3. Atualizar traduções se necessário
4. Adicionar suporte para mais países além de NL se requerido
