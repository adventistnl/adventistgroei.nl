# Annual Budget Modal

Modal reutilizável para gerenciar orçamentos anuais de instituições com interface step-by-step e suporte completo a i18n.

## Características

- ✅ **3 Steps de Cadastro**: Overview, Detalhes Financeiros, Informações Adicionais
- ✅ **Validação Completa**: Campos obrigatórios e validações de formato
- ✅ **Cálculo Automático**: Balance calculado automaticamente (Planned Budget - Total Expenses)
- ✅ **Status Management**: 4 status com ícones e cores (planned, approved, in_progress, closed)
- ✅ **Modo Add/Edit**: Reutilizável para criar e editar orçamentos
- ✅ **i18n Completo**: Suporte a EN/NL/PT com traduções completas
- ✅ **Design Monochromático**: Seguindo padrão visual estabelecido
- ✅ **Feedback Visual**: Badges, progress bars, summary cards

## Campos Suportados

```typescript
interface AnnualBudgetData {
  id?: string
  year: number                    // Ano do orçamento
  planned_budget: number          // Orçamento planejado
  total_expenses: number          // Total de despesas
  balance: number                 // Saldo calculado automaticamente
  notes?: string | null           // Observações opcionais
  approved_by?: string | null     // ID do usuário aprovador
  status: "planned" | "approved" | "in_progress" | "closed"
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}
```

## Como Usar

### 1. Importação

```typescript
import { AnnualBudgetModal } from '@/components/modals/annual-budget'
import type { AnnualBudgetData, AnnualBudgetFormData } from '@/components/modals/annual-budget'
```

### 2. Modo Add (Criar Novo Orçamento)

```typescript
import { AnnualBudgetModal } from '@/components/modals/annual-budget'

function MyComponent() {
  const handleSaveBudget = async (data: AnnualBudgetFormData) => {
    try {
      // Sua lógica para salvar no backend
      const result = await createAnnualBudget({
        variables: {
          institutionId: "123",
          year: parseInt(data.year),
          plannedBudget: parseFloat(data.planned_budget),
          totalExpenses: parseFloat(data.total_expenses),
          status: data.status,
          notes: data.notes
        }
      })
      console.log('Budget created:', result)
    } catch (error) {
      throw error // Modal will show error toast
    }
  }

  const handleSuccess = (budgetData: AnnualBudgetData) => {
    console.log('Budget saved successfully:', budgetData)
    // Atualizar lista, refechar dados, etc.
  }

  return (
    <AnnualBudgetModal
      mode="add"
      onSave={handleSaveBudget}
      onSuccess={handleSuccess}
      institutionId="123"
    >
      <Button>
        <DollarSign className="w-4 h-4 mr-2" />
        Add Annual Budget
      </Button>
    </AnnualBudgetModal>
  )
}
```

### 3. Modo Edit (Editar Orçamento Existente)

```typescript
function EditBudgetComponent() {
  const existingBudget: AnnualBudgetData = {
    id: "budget-456",
    year: 2024,
    planned_budget: 100000,
    total_expenses: 45000,
    balance: 55000,
    status: "approved",
    notes: "Annual budget for operations"
  }

  const handleUpdateBudget = async (id: string, data: AnnualBudgetFormData) => {
    try {
      await updateAnnualBudget({
        variables: {
          id,
          year: parseInt(data.year),
          plannedBudget: parseFloat(data.planned_budget),
          totalExpenses: parseFloat(data.total_expenses),
          status: data.status,
          notes: data.notes
        }
      })
    } catch (error) {
      throw error
    }
  }

  return (
    <AnnualBudgetModal
      mode="edit"
      budget={existingBudget}
      onUpdate={handleUpdateBudget}
      onSuccess={(updated) => console.log('Updated:', updated)}
    >
      <Button variant="outline">
        <Edit className="w-4 h-4 mr-2" />
        Edit Budget
      </Button>
    </AnnualBudgetModal>
  )
}
```

### 4. Integração com InstitutionProfileHeader

```typescript
import { InstitutionProfileHeader } from '@/components/shared/institution-profile-header'
import { AnnualBudgetModal } from '@/components/modals/annual-budget'

function InstitutionPage({ institution }) {
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  const handleManageAnnualBudgets = () => {
    // Pode abrir uma página dedicada ou modal
    setShowBudgetModal(true)
    // ou navegar para: router.push(`/institutions/${institution.id}/budgets`)
  }

  return (
    <>
      <InstitutionProfileHeader
        institution={institution}
        onManageAnnualBudgets={handleManageAnnualBudgets}
        // ... outras props
      />
      
      {showBudgetModal && (
        <AnnualBudgetModal
          mode="add"
          onSave={handleSaveBudget}
          onSuccess={() => setShowBudgetModal(false)}
          institutionId={institution.id}
        >
          <div></div> {/* Trigger não usado quando controlado via state */}
        </AnnualBudgetModal>
      )}
    </>
  )
}
```

## Validações Implementadas

### Step 1 - Overview
- **Year**: Obrigatório, deve ser >= 2000 e <= current year + 10
- **Planned Budget**: Obrigatório, deve ser > 0
- **Status**: Obrigatório, deve ser um dos 4 status válidos

### Step 2 - Financial Details
- **Total Expenses**: Opcional, mas se preenchido deve ser >= 0
- **Balance**: Calculado automaticamente, não editável

### Step 3 - Additional Info
- **Notes**: Opcional, texto livre para observações

## Status Options

| Status | Icon | Color | Descrição |
|--------|------|-------|-----------|
| `planned` | Calendar | Blue | Orçamento em planejamento |
| `approved` | CheckCircle | Green | Orçamento aprovado |
| `in_progress` | TrendingUp | Orange | Orçamento em execução |
| `closed` | AlertCircle | Gray | Orçamento finalizado |

## Traduções

O modal suporta completamente i18n com traduções em:
- **EN**: English
- **NL**: Nederlands  
- **PT**: Português

Todas as labels, placeholders, mensagens de validação e helper texts estão traduzidos.

## Interface Props

```typescript
interface AnnualBudgetModalProps {
  children: React.ReactNode              // Trigger element
  budget?: AnnualBudgetData | null      // Para modo edit
  mode?: "add" | "edit"                 // Modo do modal
  onSuccess?: (data: AnnualBudgetData) => void    // Callback sucesso
  onSave?: (data: AnnualBudgetFormData) => Promise<void>     // Para modo add
  onUpdate?: (id: string, data: AnnualBudgetFormData) => Promise<void>  // Para modo edit
  institutionId?: string                // ID da instituição
}
```

## Integração com GraphQL

O modal é agnóstico ao backend, você precisa implementar as funções `onSave` e `onUpdate` que fazem as chamadas para sua API/GraphQL.

Exemplo de mutations GraphQL:

```graphql
mutation CreateAnnualBudget($input: CreateAnnualBudgetInput!) {
  createAnnualBudget(input: $input) {
    id
    year
    planned_budget
    total_expenses
    balance
    status
    notes
    approved_by
  }
}

mutation UpdateAnnualBudget($id: ID!, $input: UpdateAnnualBudgetInput!) {
  updateAnnualBudget(id: $id, input: $input) {
    id
    year
    planned_budget
    total_expenses
    balance
    status
    notes
    approved_by
  }
}
```