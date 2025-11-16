# 🔍 Análise de Traduções Faltando - Departamentos

## 📍 Localização 1: Modal de Adição (add-department-modal.tsx)

### Strings Faltando no Modal:

**Linha 365:**
```
"Enter the department name and description"
```
Deve ser: `t.steps.step_1_description`

**Linha 597:** 
```
'Create Institutional Department'
```
Deve ser: `t.modals.create.title_institutional`

---

## 📍 Localização 2: Dropdown Menu da Tabela (institutional-departments/page.tsx)

### Strings no DropdownMenu (linhas 533-548):

```tsx
{t('departments.actions.view_details') || "View Details"}
{t('departments.edit_department') || "Edit Department"}
{t('departments.actions.manage_budget') || "Manage Budget"}
{t('departments.delete_department') || "Delete Department"}
```

**Chaves Faltando:**
- `departments.actions.view_details` ❌
- `departments.edit_department` ❌
- `departments.actions.manage_budget` ❌
- `departments.delete_department` ❌

Devem ser:
- `departments.actions.view_details` → Usar chave existente em `departmentTranslations`
- `departments.edit_department` → Usar `t.buttons.update` ou criar `actions.edit_department`
- `departments.actions.manage_budget` → Criar nova chave
- `departments.delete_department` → Usar `t.buttons.delete` ou criar `actions.delete_department`

---

## 📍 Localização 3: KPI Cards do Detail View (institutional-departments/page.tsx, linhas 773-810)

### Strings dos KPI Cards:

```tsx
t('departments.kpi.budget_total.title') || "Budget Total"
t('departments.kpi.budget_total.subtitle') || "Total planned budget"
t('departments.kpi.spent_amount.title') || "Spent Amount"
t('departments.kpi.spent_amount.subtitle') || "Total expenses"
t('departments.kpi.members.title') || "Members"
t('departments.kpi.members.subtitle') || "Department members"
```

**Chaves Faltando:**
- `departments.kpi.budget_total.title` ❌
- `departments.kpi.budget_total.subtitle` ❌
- `departments.kpi.spent_amount.title` ❌
- `departments.kpi.spent_amount.subtitle` ❌
- `departments.kpi.members.title` ❌
- `departments.kpi.members.subtitle` ❌

### Strings do EntityInfoCard (linhas 808-823):

```tsx
t('departments.detail.info_card.header_title') || "Department Info"
t('departments.detail.info_card.no_description') || "No description available"
t('departments.detail.info_card.institutional') || "Institutional"
t('departments.detail.info_card.active') || "Active"
t('departments.detail.info_card.inactive') || "Inactive"
```

**Chaves Faltando:**
- `departments.detail.info_card.header_title` ❌
- `departments.detail.info_card.no_description` ❌
- `departments.detail.info_card.institutional` ❌
- `departments.detail.info_card.active` ❌
- `departments.detail.info_card.inactive` ❌

---

## 📍 Localização 4: Strings Adicionais no Modal de Adição

**Step Headers:**
- "Basic Information" → `t.steps.step_1_title` ✅ (já existe)
- "Contact Information" → `t.steps.step_2_title` ✅ (já existe)
- "Review & Confirm" → `t.steps.step_3_title` ✅ (já existe)

**Field Labels:**
- "Department Name *" → `t.fields.name` ✅ (já existe)
- "Description *" → `t.fields.description` ✅ (já existe)
- "Church *" → `t.fields.church` ✅ (já existe)
- "Contact Name" → `t.fields.contact_name` ✅ (já existe)
- "Email" → `t.fields.contact_email` ✅ (já existe)
- "Phone" → `t.fields.contact_phone` ✅ (já existe)

---

## 🎯 Resumo das Chaves Faltando

### Categoria: Actions (Menu Dropdown)
1. `actions.view_details`
2. `actions.edit_department`
3. `actions.manage_budget`
4. `actions.delete_department`

### Categoria: KPI Cards
5. `kpi.budget_total.title`
6. `kpi.budget_total.subtitle`
7. `kpi.spent_amount.title`
8. `kpi.spent_amount.subtitle`
9. `kpi.members.title`
10. `kpi.members.subtitle`

### Categoria: Detail View Info Card
11. `detail.info_card.header_title`
12. `detail.info_card.no_description`
13. `detail.info_card.institutional`
14. `detail.info_card.active`
15. `detail.info_card.inactive`

---

## ✅ Ações Necessárias

1. Adicionar todas as 15 chaves ao `departmentTranslations` em **EN, NL, PT**
2. Sincronizar com o arquivo `i18n.ts` se aplicável
3. Atualizar o modal para usar as chaves corretas
4. Validar que não há erros de compilação
