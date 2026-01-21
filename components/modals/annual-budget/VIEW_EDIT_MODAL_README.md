# Annual Budget View/Edit Modal

Modal reutilizável para visualizar e editar orçamentos anuais com modo view/edit alternável, seguindo o mesmo padrão do ContactViewEditModal.

## ✅ **Funcionalidades Principais**

### **Modo View (Visualização)**
- ✅ **Seções Colapsáveis**: Overview, Financial Details, Additional Info, System Info
- ✅ **Copy to Clipboard**: Todos os campos podem ser copiados
- ✅ **Formatação de Moeda**: Valores monetários formatados automaticamente
- ✅ **Status com Badges**: Visual indicators para cada status
- ✅ **Balance Indicator**: Badge de Positive/Deficit baseado no saldo
- ✅ **Design Monochromático**: Consistente com o padrão estabelecido

### **Modo Edit (Edição)**
- ✅ **3 Steps de Edição**: Overview → Financial → Additional
- ✅ **Validação Completa**: Campos obrigatórios e validações de formato
- ✅ **Cálculo Automático**: Balance atualizado em tempo real
- ✅ **Status Selection**: Interface intuitiva para seleção de status
- ✅ **Progress Tracking**: Barra de progresso entre steps

## 🎯 **Diferenças do Modal Original**

| Recurso | AnnualBudgetModal | AnnualBudgetViewEditModal |
|---------|------------------|-------------------------|
| **Modo Principal** | Sempre em edição | View/Edit alternável |
| **Trigger** | Precisa de children | Controlado via props |
| **Interface** | Steps sempre visíveis | View mode limpo |
| **Copy Fields** | ❌ Não suporta | ✅ Todos os campos |
| **Collapsible** | ❌ Não suporta | ✅ Seções colapsáveis |
| **Currency Format** | ❌ Básico | ✅ Formatação completa |
| **Uso Principal** | Criar novos orçamentos | Ver/editar existentes |

## 📋 **Interface Props**

```typescript
interface AnnualBudgetViewEditModalProps {
  isOpen: boolean                                    // Controla abertura
  onOpenChange: (open: boolean) => void             // Callback de mudança
  budget: AnnualBudgetData | null                   // Dados do orçamento
  entityName?: string                               // Nome da entidade
  entityType?: string                               // Tipo da entidade
  onSave?: (budget: AnnualBudgetData) => void      // Callback ao salvar
  readonly?: boolean                                // Modo somente leitura
}
```

## 🔧 **Como Usar**

### 1. **Modo View/Edit Básico**

```typescript
import { AnnualBudgetViewEditModal } from '@/components/modals/annual-budget'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  const budgetData: AnnualBudgetData = {
    id: "budget-2024",
    year: 2024,
    planned_budget: 150000,
    total_expenses: 85000,
    balance: 65000,
    status: "approved",
    notes: "Annual operational budget..."
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        View Budget
      </Button>
      
      <AnnualBudgetViewEditModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        budget={budgetData}
        entityName="My Institution"
        entityType="Institution"
        onSave={(updated) => {
          console.log('Budget updated:', updated)
          // Sua lógica de salvamento
        }}
      />
    </>
  )
}
```

### 2. **Modo Read-Only**

```typescript
<AnnualBudgetViewEditModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  budget={budgetData}
  readonly={true}  // Desabilita edição
  entityName="Institution Name"
/>
```

### 3. **Integração com InstitutionProfileHeader**

O modal já está integrado no header das instituições:

```typescript
// O header já inclui automaticamente:
const [showBudgetModal, setShowBudgetModal] = useState(false)

// Botão no dropdown abre o modal:
<DropdownMenuItem onClick={() => setShowBudgetModal(true)}>
  <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
  Manage Annual Budgets
</DropdownMenuItem>

// Modal é renderizado condicionalmente:
<AnnualBudgetViewEditModal
  isOpen={showBudgetModal}
  onOpenChange={setShowBudgetModal}
  budget={exampleBudget}
  // ...outras props
/>
```

## 🎨 **Seções do View Mode**

### **1. Overview Section**
- **Year**: Ano do orçamento
- **Planned Budget**: Valor planejado formatado
- **Status**: Badge com ícone e cor do status

### **2. Financial Details**
- **Total Expenses**: Despesas totais 
- **Balance**: Saldo com badge Positive/Deficit
- **Budget Summary Card**: Resumo visual completo

### **3. Additional Information**
- **Notes**: Observações com quebras de linha
- **Approved By**: Usuário aprovador (se houver)

### **4. System Information**
- **Created At / Updated At**: Datas formatadas
- **Metadata**: Informações do sistema

## ⚡ **Recursos Avançados**

### **Copy to Clipboard**
```typescript
// Todos os campos têm botão de cópia no hover
const copyToClipboard = async (text: string, field: string) => {
  await navigator.clipboard.writeText(text)
  // Feedback visual com toast e ícone check
}
```

### **Currency Formatting**
```typescript
// Formatação automática de valores monetários
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}
```

### **Balance Calculation**
```typescript
// Cálculo automático em tempo real
const calculateBalance = (planned: number, expenses: number) => {
  return planned - expenses
}
```

### **Status Management**
```typescript
// Status com ícones e cores definidos
const statusOptions = [
  { value: "planned", label: "Planned", icon: Calendar, color: "text-blue-600" },
  { value: "approved", label: "Approved", icon: CheckCircle, color: "text-green-600" },
  { value: "in_progress", label: "In Progress", icon: TrendingUp, color: "text-orange-600" },
  { value: "closed", label: "Closed", icon: AlertCircle, color: "text-gray-600" }
]
```

## 🌍 **i18n Support**

Suporte completo a internacionalização com traduções em:
- **EN**: English (padrão)
- **NL**: Nederlands 
- **PT**: Português

Todas as labels, placeholders, mensagens de validação e textos de ajuda estão traduzidos.

## 🔄 **Ciclo de Vida**

1. **Abertura**: Modal abre em view mode
2. **View Mode**: Usuário visualiza dados com seções colapsáveis
3. **Edit Mode**: Clique em "Edit" ativa modo de edição
4. **Steps**: 3 etapas de edição com validação
5. **Save**: Dados salvos e modal volta ao view mode
6. **Close**: Modal fecha e state é limpo

## 🎯 **Casos de Uso**

- ✅ **Visualizar orçamento existente**: Modo view com copy fields
- ✅ **Editar orçamento**: Modo edit com 3 steps 
- ✅ **Modo somente leitura**: readonly=true para visualização
- ✅ **Integração em headers**: Botão de acesso rápido
- ✅ **Dashboards financeiros**: Widget de orçamento
- ✅ **Relatórios**: Exibição de dados orçamentários

O modal está totalmente funcional e pronto para uso! 🎉