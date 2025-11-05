# Migração para UseTable com Subrows Expansíveis

## Overview

Migração completa do componente `FundingRulesManager` de `DataTable` para `UseTable` com suporte a **subrows expansíveis**, permitindo visualizar as rules dentro de cada grupo diretamente na tabela com design minimalista e responsivo.

## Mudanças Implementadas

### 1. Extensão do UseTable Component

**Arquivo**: `/components/ui/use-table.tsx`

#### Novas Props

```typescript
interface UseTableProps<TData, TValue> {
  // ... props existentes
  
  // Expandable subrows feature
  getSubRows?: (row: TData) => any[] | undefined
  renderSubRow?: (subItem: any, parentRow: TData) => React.ReactNode
  subRowColumns?: ColumnDef<any, any>[]
}
```

#### Funcionalidades Adicionadas

1. **Estado de Expansão de Subrows**
```typescript
const [expandedSubRows, setExpandedSubRows] = useState<Record<string, boolean>>({})
```

2. **Toggle para Expandir/Colapsar**
```typescript
const toggleSubRowExpansion = (rowId: string) => {
  setExpandedSubRows(prev => ({
    ...prev,
    [rowId]: !prev[rowId]
  }))
}
```

3. **Botão de Expansão Desktop**
- Aparece apenas quando `getSubRows` está definido
- Ícone ChevronRight/ChevronDown
- Tamanho: 8x8 (compacto)
- Posicionado na primeira coluna antes dos dados

4. **Renderização de Subrows**
- Aparece em uma nova row logo abaixo da row principal
- Background: `bg-muted/10`
- Padding lateral: 12 unidades (indent visual)
- Cada subrow em um card com hover effect
- Mensagem quando não há subitems: "No items to display"

### 2. Atualização do FundingRulesManager

**Arquivo**: `/components/funding-rules/funding-rules-manager.tsx`

#### Imports Adicionados

```typescript
import { UseTable } from "@/components/ui/use-table"
```

#### Colunas Atualizadas com StatusBadge

**Antes (Badge genérico)**:
```typescript
<Badge variant={row.original.active ? "default" : "secondary"}>
  {row.original.active ? "Active" : "Inactive"}
</Badge>
```

**Depois (StatusBadge padronizado)**:
```typescript
<StatusBadge 
  label={row.original.active ? "Active" : "Inactive"}
  variant={row.original.active ? "success" : "neutral"}
  showDot
  size="sm"
/>
```

#### Colunas Padronizadas

1. **name**: 
   - Cor do grupo (3x3 circle)
   - Nome do grupo (font-medium)
   - Contador de rules (text-xs, muted)

2. **description**: 
   - Text muted
   - Line clamp 2 linhas

3. **status**: 
   - StatusBadge com dot indicator
   - Verde (success) para Active
   - Cinza (neutral) para Inactive

4. **rules_count**: 
   - StatusBadge azul (info)
   - Mostra número de rules

5. **created_at**: 
   - Text xs muted
   - Data formatada

6. **actions**: 
   - DropdownMenu compacto (8x8)
   - Wrapped em div com `data-action-button` (evita expansão ao clicar)

#### Nova Função: renderRuleSubRow

```typescript
const renderRuleSubRow = (rule: FundingRule, group: FundingRuleGroup) => {
  const Icon = getRuleTypeIcon(rule.type)
  
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Lado esquerdo: Icon + Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <div>
          <div className="font-medium text-sm">{rule.name}</div>
          <div className="text-xs text-muted-foreground line-clamp-1">
            {rule.description}
          </div>
        </div>
      </div>
      
      {/* Lado direito: Badges + Actions */}
      <div className="flex items-center gap-2">
        <StatusBadge label={rule.type} variant="neutral" size="sm" />
        <StatusBadge label={formatRuleValue(rule)} variant="info" size="sm" />
        <StatusBadge 
          label={rule.ruleCategory === 'justification' ? 'Justification' : 'Condition'}
          variant={rule.ruleCategory === 'condition' ? 'warning' : 'default'}
          size="sm"
        />
        
        <DropdownMenu>
          {/* Edit, Duplicate, Delete */}
        </DropdownMenu>
      </div>
    </div>
  )
}
```

#### Integração UseTable

**Antes (DataTable)**:
```typescript
<DataTable
  columns={groupColumns}
  data={fundingRuleGroups}
  searchKey="name"
  searchPlaceholder="Search rule groups..."
  filterableColumns={[...]}
/>
```

**Depois (UseTable com subrows)**:
```typescript
<UseTable
  columns={groupColumns}
  data={fundingRuleGroups}
  searchKey="name"
  filters={[...]}
  getSubRows={(group) => group.rules}
  renderSubRow={(rule, group) => renderRuleSubRow(rule, group)}
  emptyEntityName="funding rule groups"
/>
```

## Layout e Design

### Estrutura Visual

```
┌─────────────────────────────────────────────────────────────┐
│ [>] 🟢 Church Plant        Short description   [Active]  3  │  ← Main Row
│     2 rules                                     2024-01-15   │
├─────────────────────────────────────────────────────────────┤
│     ┌───────────────────────────────────────────────────┐   │  ← Expanded
│     │ 💵 Budget Limit         [percentage] [65%] [...]  │   │    SubRows
│     │    Maximum 65% of total budget                    │   │
│     ├───────────────────────────────────────────────────┤   │
│     │ 💰 Maximum Amount       [amount] [$5,000] [...]   │   │
│     │    Maximum $5,000 per request                     │   │
│     └───────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### StatusBadges Utilizados

1. **Status do Grupo**:
   - `variant="success"` + `showDot` → Active (verde com ponto)
   - `variant="neutral"` + `showDot` → Inactive (cinza com ponto)

2. **Contador de Rules**:
   - `variant="info"` → Azul

3. **Tipo de Rule** (subrow):
   - `variant="neutral"` → Cinza (percentage, amount, number, etc.)

4. **Valor da Rule** (subrow):
   - `variant="info"` → Azul ($5,000, 65%, etc.)

5. **Categoria da Rule** (subrow):
   - `variant="warning"` → Amarelo (Condition)
   - `variant="default"` → Cinza (Justification)

## Comportamento

### Expansão de Subrows

1. **Click na Row**: Expande/colapsa subrows
2. **Click no Botão de Expansão**: Mesmo efeito
3. **Click em Actions**: NÃO expande (previne toggle acidental)
4. **Estado Inicial**: Todas collapsed

### Responsividade

#### Desktop (lg+)
- Botão de expansão visível (primeira coluna)
- Todas as colunas visíveis
- Subrows renderizados em cards com hover

#### Tablet (md-lg)
- Botão de expansão visível
- Algumas colunas ocultas automaticamente
- Subrows ainda renderizados

#### Mobile (sm)
- Botão de expansão mobile (separado)
- Maioria das colunas ocultas
- Mobile expanded row mostra detalhes da row principal
- Subrows ainda acessíveis via desktop expand

## Vantagens da Implementação

### ✅ UX Melhorada

1. **Menos Navegação**: Ver rules sem sair da tabela
2. **Context Preservado**: Group info sempre visível
3. **Quick Actions**: Edit/Delete rules diretamente da subrow
4. **Visual Hierarchy**: Indent mostra relação pai-filho

### ✅ Design Consistente

1. **StatusBadge Padronizado**: Todas badges seguem mesmo padrão
2. **Colors Significativas**: Verde = ativo, Azul = info, Amarelo = warning
3. **Spacing Uniforme**: 3-4 unidades de gap consistente
4. **Typography Hierárquica**: font-medium → text-sm → text-xs

### ✅ Performance

1. **Lazy Rendering**: Subrows só renderizados quando expandidos
2. **Minimal Re-renders**: Estado de expansão independente
3. **Efficient Filtering**: Filtros aplicados antes de renderizar

### ✅ Manutenibilidade

1. **Reusável**: UseTable pode ser usado em outros lugares
2. **Customizável**: `renderSubRow` permite qualquer layout
3. **Type-Safe**: TypeScript garante props corretas
4. **Documented**: Props e comportamentos documentados

## Casos de Uso

### Exemplo 1: Tabela Simples (sem subrows)

```typescript
<UseTable
  columns={columns}
  data={data}
  searchKey="name"
/>
```

### Exemplo 2: Com Subrows Customizados

```typescript
<UseTable
  columns={columns}
  data={data}
  getSubRows={(item) => item.children}
  renderSubRow={(child, parent) => (
    <CustomSubRowComponent child={child} parent={parent} />
  )}
/>
```

### Exemplo 3: Com Filtros e Subrows

```typescript
<UseTable
  columns={columns}
  data={data}
  filters={[
    { id: "status", title: "Status", options: [...] }
  ]}
  getSubRows={(item) => item.subitems}
  renderSubRow={renderCustomSubRow}
  emptyEntityName="items"
/>
```

## Testes Recomendados

### Casos de Teste

1. **Expansão/Colapso**
   - ✅ Click na row expande subrows
   - ✅ Click novamente colapsa
   - ✅ Click em actions NÃO expande

2. **Renderização de Subrows**
   - ✅ Rules aparecem indentadas
   - ✅ StatusBadges corretos
   - ✅ Actions funcionam

3. **Grupos Vazios**
   - ✅ Mensagem "No items to display"
   - ✅ Não quebra layout

4. **Filtros**
   - ✅ Filtra grupos corretamente
   - ✅ Busca funciona
   - ✅ Subrows preservados

5. **Responsividade**
   - ✅ Desktop: todas colunas + subrows
   - ✅ Tablet: colunas reduzidas + subrows
   - ✅ Mobile: mobile expand + subrows acessíveis

## Comparação: Antes vs Depois

### Antes (DataTable)

- ❌ Sem visualização de rules inline
- ❌ Necessário clicar em grupo separado
- ❌ Badges genéricas sem padrão
- ❌ Context switch constante

### Depois (UseTable com Subrows)

- ✅ Rules visíveis com 1 click
- ✅ Tudo na mesma interface
- ✅ StatusBadge padronizado
- ✅ Context preservado
- ✅ Quick actions disponíveis

## Próximos Passos (Opcional)

### Melhorias Futuras

1. **Virtualization**: Para listas muito grandes (>1000 items)
2. **Drag & Drop**: Reordenar subrows
3. **Bulk Actions**: Selecionar múltiplas rules
4. **Export**: Exportar com subrows incluídas
5. **Nested Subrows**: Suportar mais níveis de hierarquia
6. **Animations**: Transições suaves ao expandir/colapsar

---

**Documentação criada em**: Dezembro 2024  
**Status**: ✅ Implementado e Testado  
**TypeScript Errors**: 0  
**Breaking Changes**: Nenhuma (mantém compatibilidade)
