# Chaves de Tradução Faltantes - Diagnóstico

## 📍 Strings Hardcoded Encontradas

### AddDepartmentModal (`add-department-modal.tsx`)

**Step 1:**
- ❌ `"Basic Information"` - deveria ser `t.steps.step_1_title`
- ❌ `"Enter the department name and description"` - deveria ser `t.steps.step_1_description`
- ❌ `"Department Name *"` - deveria ser `${t.fields.name} *`
- ❌ `"Enter department name"` - deveria ser `t.placeholders.name`
- ❌ `"Description *"` - deveria ser `${t.fields.description} *`
- ❌ `"Describe the department purpose and activities"` - deveria ser `t.placeholders.description`
- ❌ `"Church *"` - deveria ser `${t.fields.church} *`
- ❌ `"Select church"` - deveria ser `t.placeholders.church`
- ❌ `"Search church..."` - deveria ser `t.fields.search_church`
- ❌ `"No church found"` - deveria ser `t.fields.no_church_found`

**Step 2:**
- ❌ `"Contact Information"` - deveria ser `t.steps.step_2_title`
- ❌ `"Add contact details for this department (optional)"` - deveria ser `t.steps.step_2_description`
- ❌ `"Contact Name"` - deveria ser `t.fields.contact_name`
- ❌ `"Enter contact name"` - deveria ser `t.placeholders.contact_name`
- ❌ `"Email"` - deveria ser `t.fields.contact_email`
- ❌ `"contact@example.com"` - deveria ser `t.placeholders.contact_email`
- ❌ `"Phone"` - deveria ser `t.fields.contact_phone`
- ❌ `"+31 123 456 789"` - deveria ser `t.placeholders.contact_phone`

**Step 3:**
- ❌ `"Review & Confirm"` - deveria ser `t.steps.step_3_title`
- ❌ `"Please review the information before creating the department"` - deveria ser `t.steps.step_3_description`
- ❌ `"Basic Information"` (section) - deveria ser `t.sections.basic_info`
- ❌ `"Name"` - precisa de chave `t.labels.name` ou usar `t.fields.name`
- ❌ `"Description"` (review) - deveria ser `t.fields.description`
- ❌ `"Church"` (review) - deveria ser `t.fields.church`
- ❌ `"Type"` - deveria ser `t.labels.type`
- ❌ `"Institutional"` - deveria ser `t.labels.institutional`
- ❌ `"Church"` (type) - deveria ser `t.labels.church_dept`
- ❌ `"Contact Information"` (section) - deveria ser `t.sections.contact_info`
- ❌ `"Email"` (review) - deveria ser `t.fields.contact_email`
- ❌ `"Phone"` (review) - deveria ser `t.fields.contact_phone`

**Dialog & Buttons:**
- ❌ `"Create Institutional Department"` - FALTA - precisa: `t.modals.create.title_institutional` ou similar
- ❌ `"Create a department that operates at the institution level, managing resources and activities across all churches."` - FALTA - precisa descrição institucional
- ❌ `"Back"` - deveria ser `t.buttons.previous`
- ❌ `"Cancel"` - deveria ser `t.buttons.cancel`
- ❌ `"Skip for now"` - deveria ser `t.buttons.skip`
- ❌ `"Continue"` - deveria ser `t.buttons.next`
- ❌ `"Creating..."` - deveria ser `t.buttons.creating`
- ❌ `"Create Department"` - deveria ser `t.buttons.create`

### EditDepartmentModal (`edit-department-modal.tsx`)

Falta verificação completa, mas provavelmente tem os mesmos strings hardcoded.

### DeleteDepartmentModal (`delete-department-modal.tsx`)

Falta verificação completa.

---

## ✅ Chaves que EXISTEM em `departments.ts`

```typescript
steps: {
  step_1_title: "Basic Information",
  step_1_description: "Enter department name and description",
  step_2_title: "Contact Information",
  step_2_description: "Add contact details for this department (optional)",
  step_3_title: "Review & Confirm",
  step_3_description: "Review the information before creating the department"
}

fields: {
  name, church, description, contact_name, contact_email, contact_phone
}

placeholders: {
  name, church, description, contact_name, contact_email, contact_phone
}

buttons: {
  previous: "Back",
  next: "Continue",
  skip: "Skip for now",
  cancel: "Cancel",
  creating: "Creating..."
}

labels: {
  department, contact, type, institutional, church_dept
}

sections: {
  basic_info, contact_info, review
}
```

---

## ⚠️ Chaves que FALTAM em `departments.ts`

- ❌ `labels.name` - não existe, usar `fields.name`
- ❌ `modals.create.title_institutional` - não existe
- ❌ `modals.create.description_institutional` - não existe
- ❌ Para os placeholders de campos vazios na revisão: "Name", "Email", "Phone" (labels de review)

---

## 🔧 Ação Necessária

1. **Adicionar chaves faltantes** em `departments.ts` para todas as 3 linguagens (EN, NL, PT):
   ```typescript
   modals: {
     create: {
       title: "Create Department",
       description: "Add a new department to your organization",
       title_institutional: "Create Institutional Department",
       description_institutional: "Create a department that operates at the institution level, managing resources and activities across all churches."
     }
   }
   ```

2. **Substituir strings hardcoded** nos modais por chamadas `t.chave` correspondentes

3. **Adicionar chaves de i18n.ts** para o dialog title também (que usa `useTranslation()` de react-i18next)

---

## 📊 Resumo

- **Total de strings hardcoded encontradas**: ~45+
- **Chaves que existem**: ~30
- **Chaves que faltam**: ~15
- **Prioridade**: ALTA - muitos textos não estão sendo traduzidos

