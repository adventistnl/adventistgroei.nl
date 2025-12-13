# BatchActionsPanel - Exemplo de Integração

## Design Minimalista Monocromático

O `BatchActionsPanel` foi redesenhado com:

### ✅ Características Implementadas

1. **Design Monocromático Minimalista**
   - Cores neutras: cinza/preto no light mode, cinza/branco no dark mode
   - Badges e botões com paleta de cinza
   - Sem gradientes ou cores vibrantes
   - Bordas sutis e sombras leves

2. **Renderização Adaptativa de Botões**
   - Calcula automaticamente quantos botões cabem no espaço disponível
   - Botões que não cabem vão para menu "More..."
   - Responsive: ajusta em resize da janela
   - Ícone MoreHorizontal com dropdown

3. **Menu "More..." para Overflow**
   - DropdownMenu com ações extras
   - Ícones preservados no menu
   - Estados disabled respeitados
   - Alinhamento à direita

4. **Ação "Export" Removida**
   - Apenas "Editar em Lote" fica visível
   - Outras ações podem ir para menu More...

5. **Tamanhos Reduzidos (Minimalista)**
   - Botões: h-8 (height 32px)
   - Badge: text-sm, px-3, py-1
   - Controles: h-7 (height 28px)
   - Ícones: h-3.5/w-3.5 ou h-4/w-4
   - Padding reduzido: px-6 py-3

## Exemplo de Uso

```typescript
import { BatchActionsPanel } from "@/components/shared/batch-actions-panel"
import { Edit, Download } from "lucide-react"

// No componente
const [selectedActivities, setSelectedActivities] = useState<ProjectActivityData[]>([])

const handleBatchEdit = () => {
  setIsBatchEditModalOpen(true)
}

const handleBatchSubsidy = () => {
  const subsidizedCount = selectedActivities.filter(a => a.is_subsidized).length
  const nonSubsidizedCount = selectedActivities.length - subsidizedCount
  
  toast.success(
    `Solicitando subsídio para ${selectedActivities.length} atividades (${subsidizedCount} já subsidiadas, ${nonSubsidizedCount} novas)`,
    { duration: 4000 }
  )
  setSelectedActivities([])
}

// Calcular sumário
const totalBudget = selectedActivities.reduce((sum, a) => sum + a.budget_amount, 0)
const subsidizedCount = selectedActivities.filter(a => a.is_subsidized).length

// No JSX
<BatchActionsPanel
  selectedCount={selectedActivities.length}
  onClearSelection={() => setSelectedActivities([])}
  summary={
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-700 dark:text-gray-300">
        Total: <span className="font-medium">R$ {totalBudget.toLocaleString()}</span>
      </span>
      <span className="text-gray-400">|</span>
      <span className="text-gray-700 dark:text-gray-300">
        Subsidiadas: <span className="font-medium">{subsidizedCount}</span>
      </span>
    </div>
  }
  actions={[
    {
      id: 'edit',
      label: 'Editar',
      icon: <Edit className="h-4 w-4" />,
      onClick: handleBatchEdit
    }
    // Outras ações irão automaticamente para o menu "More..." se não houver espaço
  ]}
  primaryAction={{
    id: 'subsidy',
    label: 'Solicitar Subsídio',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    onClick: handleBatchSubsidy
  }}
/>

// Na tabela
<ProjectActivitiesTable
  project={project}
  enableRowSelection={true}
  onSelectionChange={setSelectedActivities}
  // ... outros props
/>
```

## Paleta de Cores Monocromática

### Light Mode
- Background: `bg-white`
- Borders: `border-gray-200`
- Text Primary: `text-gray-900`
- Text Secondary: `text-gray-700`
- Text Muted: `text-gray-500`
- Badge: `bg-gray-900 text-white`
- Hover: `hover:bg-gray-100`

### Dark Mode
- Background: `dark:bg-gray-900`
- Borders: `dark:border-gray-800`
- Text Primary: `dark:text-white`
- Text Secondary: `dark:text-gray-300`
- Text Muted: `dark:text-gray-400`
- Badge: `dark:bg-gray-100 dark:text-gray-900`
- Hover: `dark:hover:bg-gray-800`

## Cálculo de Espaço

O componente calcula automaticamente:
- Espaço reservado: ~580px (badge + clear + summary + controls + more + primary)
- Espaço disponível = largura do container - espaço reservado
- Cada botão: ~120px
- Botões visíveis = Math.floor(espaço disponível / 120px)
- Resto vai para menu "More..."

## Props Interface

```typescript
interface BatchAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
  disabled?: boolean
}

interface BatchActionsPanelProps {
  selectedCount: number
  onClearSelection: () => void
  actions: BatchAction[]
  className?: string
  summary?: React.ReactNode
  primaryAction?: BatchAction
}
```
