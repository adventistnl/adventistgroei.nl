# ✅ AUDITORIA 100% DE TRADUÇÕES - Institutional Departments

## 📌 Chaves Faltando em `departments.ts`

### CRÍTICAS (Usadas na página, não existem)

```
❌ departments.kpi.budget_total.title
❌ departments.kpi.budget_total.subtitle
❌ departments.kpi.spent_amount.title
❌ departments.kpi.spent_amount.subtitle
❌ departments.kpi.members.title
❌ departments.kpi.members.subtitle
❌ departments.detail.info_card.header_title
❌ departments.detail.members_table.title
❌ departments.detail.members_table.description
❌ departments.breadcrumb.all_departments
❌ departments.create_department
❌ departments.edit_department
❌ departments.delete_department
❌ departments.messages.created_success
❌ departments.messages.updated_success
❌ departments.messages.deleted_success
```

### USADAS MAS NÃO EM departments.ts (estão em outros namespaces)

```
⚠️  common.loading
⚠️  common.data_loaded
⚠️  common.data_refreshed
⚠️  common.refreshing
⚠️  common.error_refreshing
⚠️  common.error
⚠️  common.name
⚠️  common.members
⚠️  common.status
⚠️  common.active
⚠️  common.inactive
⚠️  common.actions
⚠️  common.trend.vs_previous_month
⚠️  common.trend.vs_previous_year
⚠️  common.annual_budget

⚠️  churches.church

⚠️  annual_budget.table.headers.budget_total
⚠️  annual_budget.table.headers.spent_amount
⚠️  annual_budget.table.headers.usage_percentage
⚠️  annual_budget.table.budget_status_labels.completed
⚠️  annual_budget.table.budget_status_labels.missing
⚠️  annual_budget.messages.updated_success

⚠️  institutions.table.budget_status

⚠️  users.table.avatar
⚠️  users.table.name
⚠️  users.table.language
⚠️  users.table.roles
⚠️  users.table.no_roles
⚠️  users.table.gender
⚠️  users.gender.${user.gender}
⚠️  users.table.status
⚠️  users.table.active
⚠️  users.table.inactive
```

## 📋 QUE ESTÁ EM departments.ts MAS NÃO USA ESTRUTURA CORRETA

### Existe em departments.ts com estrutura diferente:

**Em departments.ts:**
```typescript
kpi: {
  budget_total: {
    title: "Budget Total",
    subtitle: "Total planned budget"
  },
  spent_amount: {
    title: "Spent Amount",
    subtitle: "Total expenses"
  },
  members: {
    title: "Members",
    subtitle: "Department members"
  }
}
```

✅ **ISSO ESTÁ CORRETO!** As chaves existem. O problema é que a página tá usando:
- `t('departments.kpi.budget_total.title')`  
- `t('departments.kpi.spent_amount.title')`
- `t('departments.kpi.members.title')`

E isso funciona! Então essas NÃO são faltando. Meu erro inicial.

---

## 🔴 PROBLEMAS REAIS ENCONTRADOS

### 1. Chaves que REALMENTE faltam em departments.ts

```typescript
// FALTAM:
❌ departments.breadcrumb.all_departments      // Linha 716
❌ departments.create_department               // Linha 753
❌ departments.edit_department                 // Linha 538
❌ departments.delete_department               // Linha 546
❌ departments.detail.info_card.header_title   // Linha 804
❌ departments.detail.members_table.title      // Linha 883
❌ departments.detail.members_table.description // Linha 886
❌ departments.messages.created_success        // Linha 298
❌ departments.messages.updated_success        // Linha 303
❌ departments.messages.deleted_success        // Linha 308
```

### 2. Chaves que EXISTEM EM departments.ts MAS ESTÃO EM OUTRO LUGAR

**Exemplo - `actions`:**

Em `departments.ts` usa:
```typescript
actions: {
  view_details: "View Details",
  edit_department: "Edit Department",
  manage_budget: "Manage Budget",
  delete_department: "Delete Department"
}
```

Mas a página acessa como:
- `t('departments.actions.view_details')` ✅ Correto
- `t('departments.edit_department')` ❌ Deveria ser `t('departments.actions.edit_department')`
- `t('departments.delete_department')` ❌ Deveria ser `t('departments.actions.delete_department')`
- `t('departments.actions.manage_budget')` ✅ Correto

### 3. Chaves em departments.ts que NUNCA são usadas

```typescript
// Definido em departments.ts mas não utilizado:
- fields (name, church, description, etc.)
- placeholders (name, church, etc.)
- department_type (institutional_tooltip, etc.)
- labels (department, contact, type, etc.)
- sections (basic_info, contact_info, review)
- buttons (previous, next, skip, cancel, save, etc.)
- validation (all validations)
- stats (church, volunteers, budgets, etc.)
- detail.info_card (no_description, institutional, active, inactive)
- detail.no_description
- filters (institutional)
```

**Estes são usados nos MODAIS, não na página!**

---

## 📊 RESUMO FINAL

### Chaves que FALTAM e PRECISAM ser adicionadas

```typescript
// Em departments.ts, adicionar:

breadcrumb: {
  all_departments: "See All Departments"   // Linha 716
},

create_department: "Create Department",     // Linha 753
edit_department: "Edit Department",        // Linha 538
delete_department: "Delete Department",    // Linha 546

detail: {
  info_card: {
    header_title: "Department Info",       // Linha 804
    no_description: "No description available",
    institutional: "Institutional",
    active: "Active",
    inactive: "Inactive"
  },
  members_table: {
    title: "Department Members",           // Linha 883
    description: "List of all members in {{name}}"  // Linha 886
  },
  title_suffix: "Details",
  no_description: "Department details and members"
},

messages: {
  created_success: "Department created successfully",  // Linha 298
  updated_success: "Department updated successfully",  // Linha 303
  deleted_success: "Department deleted successfully"   // Linha 308
},

entity_name: "Departments",
table_title: "Departments",
table_description: "Complete list of departments with management actions",

filters: {
  institutional: "Institutional"
}
```

### Chaves que DEVEM ser movidas/reorganizadas

Na página, mudar de:
```typescript
t('departments.edit_department')        → t('departments.actions.edit_department')
t('departments.delete_department')      → t('departments.actions.delete_department')
```

---

## 🎯 SOLUÇÃO

Adicionar as 17 chaves faltando em `lib/translations/departments.ts` em todas as 3 línguas.
