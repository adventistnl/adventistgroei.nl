# Chaves de Tradução - Departamentos (i18n)

## 📋 Resumo da Análise

Todas as strings estáticas na página `app/institutional-departments/page.tsx` foram analisadas e configuradas com chaves de tradução apropriadas. Este documento lista todas as chaves necessárias para suportar múltiplos idiomas.

---

## 🔑 Estrutura Completa de Chaves

### 1. **common** (Chaves Compartilhadas)
```typescript
common: {
  name: "Name",
  status: "Status",
  active: "Active",
  inactive: "Inactive",
  members: "Members",
  actions: "Actions",
  loading: "Loading...",
  error: "An error occurred",
  data_loaded: "Data loaded successfully",
  refreshing: "Refreshing...",
  data_refreshed: "Data refreshed",
  error_refreshing: "Error refreshing",
  annual_budget: "Annual Budget",
  
  trend: {
    vs_previous_month: "vs. previous month",
    vs_previous_year: "vs. previous year"
  }
}
```

### 2. **departments** (Específico de Departamentos)
```typescript
departments: {
  title: "Institutional Departments",
  subtitle: "Manage departments across institutions",
  entity_name: "Departments",
  
  table_title: "Departments",
  table_description: "Complete list of departments with management actions",
  
  create_department: "Create Department",
  edit_department: "Edit Department",
  delete_department: "Delete Department",
  
  fields: {
    annual_budget: "Total annual budget"
  },
  
  breadcrumb: {
    all_departments: "See All Departments"
  },
  
  detail: {
    title_suffix: "Details",
    no_description: "Department details and members",
    
    info_card: {
      header_title: "Department Info",
      no_description: "No description available",
      institutional: "Institutional",
      members: "Members",
      active: "Active",
      inactive: "Inactive"
    },
    
    members_table: {
      title: "Department Members",
      description: "List of all members in {{name}}"
    }
  },
  
  actions: {
    view_details: "View Details",
    edit_department: "Edit Department",
    manage_budget: "Manage Budget",
    delete_department: "Delete Department"
  },
  
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
  },
  
  filters: {
    institutional: "Institutional"
  },
  
  messages: {
    created_success: "Department created successfully",
    updated_success: "Department updated successfully",
    deleted_success: "Department deleted successfully"
  }
}
```

### 3. **churches** (Referência a Igrejas)
```typescript
churches: {
  church: "Church"
}
```

### 4. **annual_budget** (Orçamentos Anuais)
```typescript
annual_budget: {
  table: {
    headers: {
      budget_total: "Budget Total",
      spent_amount: "Spent Amount",
      usage_percentage: "Usage %"
    },
    budget_status_labels: {
      completed: "Completed",
      missing: "Missing"
    }
  },
  
  messages: {
    updated_success: "Budget updated successfully"
  }
}
```

### 5. **institutions** (Instituições)
```typescript
institutions: {
  table: {
    budget_status: "Budget Status"
  }
}
```

### 6. **users** (Usuários)
```typescript
users: {
  table: {
    avatar: "Avatar",
    name: "Name",
    language: "Language",
    roles: "Roles",
    gender: "Gender",
    status: "Status",
    active: "Active",
    inactive: "Inactive",
    no_roles: "No roles"
  },
  
  gender: {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other"
  }
}
```

---

## ✅ Validação das Chaves

### Padrão Utilizado
Todas as chaves seguem o padrão:
```tsx
{t('namespace.key') || "Fallback Text"}
```

Este padrão garante que:
1. ✅ A tradução é carregada quando disponível
2. ✅ Um texto fallback é exibido se a tradução estiver faltando
3. ✅ A aplicação nunca mostra chaves vazias ou quebradas

### Locais Atualizados

#### **Cabeçalhos e Títulos**
- [x] Título da página (list/detail modes)
- [x] Subtítulo da página
- [x] Breadcrumb navigation
- [x] Card titles e descriptions

#### **Colunas da Tabela de Departamentos**
- [x] Name (header)
- [x] Church (header)
- [x] Members (header)
- [x] Budget Total (header)
- [x] Spent Amount (header)
- [x] Usage % (header)
- [x] Budget Status (header + labels)
- [x] Status (header + labels)
- [x] Actions (header)

#### **Colunas da Tabela de Usuários**
- [x] Avatar (header)
- [x] Name (header)
- [x] Language (header)
- [x] Roles (header + "No roles" fallback)
- [x] Gender (header + values)
- [x] Status (header + labels)

#### **KPI Cards**
- [x] Budget Total (title + subtitle)
- [x] Spent Amount (title + subtitle)
- [x] Members (title + subtitle)
- [x] Trend labels (vs. previous month/year)

#### **EntityInfoCard**
- [x] Header title
- [x] Description fallback
- [x] Badges (Institutional, Members, Active/Inactive)
- [x] Actions (Edit, Manage Budget, Delete)

#### **Actions Menu**
- [x] View Details
- [x] Edit Department
- [x] Manage Budget
- [x] Delete Department

#### **Toast Messages**
- [x] Loading/Refreshing
- [x] Success messages (created/updated/deleted)
- [x] Error messages
- [x] Budget updated

#### **Filtros**
- [x] Church filter (title + "Institutional" option)
- [x] Budget Status filter (title + options)
- [x] Status filter (title + options)

---

## 🌍 Implementação Multi-idioma

### Estrutura de Arquivos Recomendada
```
lib/i18n/
├── locales/
│   ├── en/
│   │   ├── common.json
│   │   ├── departments.json
│   │   ├── churches.json
│   │   ├── annual_budget.json
│   │   ├── institutions.json
│   │   └── users.json
│   ├── pt/
│   │   ├── common.json
│   │   ├── departments.json
│   │   ├── churches.json
│   │   ├── annual_budget.json
│   │   ├── institutions.json
│   │   └── users.json
│   └── nl/
│       ├── common.json
│       ├── departments.json
│       ├── churches.json
│       ├── annual_budget.json
│       ├── institutions.json
│       └── users.json
```

### Exemplo de Arquivo JSON (departments.json)

**English (en/departments.json):**
```json
{
  "title": "Institutional Departments",
  "subtitle": "Manage departments across institutions",
  "entity_name": "Departments",
  "table_title": "Departments",
  "table_description": "Complete list of departments with management actions",
  "create_department": "Create Department",
  "edit_department": "Edit Department",
  "delete_department": "Delete Department",
  "fields": {
    "annual_budget": "Total annual budget"
  },
  "breadcrumb": {
    "all_departments": "See All Departments"
  },
  "detail": {
    "title_suffix": "Details",
    "no_description": "Department details and members",
    "info_card": {
      "header_title": "Department Info",
      "no_description": "No description available",
      "institutional": "Institutional",
      "members": "Members",
      "active": "Active",
      "inactive": "Inactive"
    },
    "members_table": {
      "title": "Department Members",
      "description": "List of all members in {{name}}"
    }
  },
  "actions": {
    "view_details": "View Details",
    "edit_department": "Edit Department",
    "manage_budget": "Manage Budget",
    "delete_department": "Delete Department"
  },
  "kpi": {
    "budget_total": {
      "title": "Budget Total",
      "subtitle": "Total planned budget"
    },
    "spent_amount": {
      "title": "Spent Amount",
      "subtitle": "Total expenses"
    },
    "members": {
      "title": "Members",
      "subtitle": "Department members"
    }
  },
  "filters": {
    "institutional": "Institutional"
  },
  "messages": {
    "created_success": "Department created successfully",
    "updated_success": "Department updated successfully",
    "deleted_success": "Department deleted successfully"
  }
}
```

**Portuguese (pt/departments.json):**
```json
{
  "title": "Departamentos Institucionais",
  "subtitle": "Gerir departamentos em instituições",
  "entity_name": "Departamentos",
  "table_title": "Departamentos",
  "table_description": "Lista completa de departamentos com ações de gestão",
  "create_department": "Criar Departamento",
  "edit_department": "Editar Departamento",
  "delete_department": "Excluir Departamento",
  "fields": {
    "annual_budget": "Orçamento anual total"
  },
  "breadcrumb": {
    "all_departments": "Ver Todos os Departamentos"
  },
  "detail": {
    "title_suffix": "Detalhes",
    "no_description": "Detalhes e membros do departamento",
    "info_card": {
      "header_title": "Informações do Departamento",
      "no_description": "Sem descrição disponível",
      "institutional": "Institucional",
      "members": "Membros",
      "active": "Ativo",
      "inactive": "Inativo"
    },
    "members_table": {
      "title": "Membros do Departamento",
      "description": "Lista de todos os membros em {{name}}"
    }
  },
  "actions": {
    "view_details": "Ver Detalhes",
    "edit_department": "Editar Departamento",
    "manage_budget": "Gerenciar Orçamento",
    "delete_department": "Excluir Departamento"
  },
  "kpi": {
    "budget_total": {
      "title": "Orçamento Total",
      "subtitle": "Orçamento total planejado"
    },
    "spent_amount": {
      "title": "Valor Gasto",
      "subtitle": "Despesas totais"
    },
    "members": {
      "title": "Membros",
      "subtitle": "Membros do departamento"
    }
  },
  "filters": {
    "institutional": "Institucional"
  },
  "messages": {
    "created_success": "Departamento criado com sucesso",
    "updated_success": "Departamento atualizado com sucesso",
    "deleted_success": "Departamento excluído com sucesso"
  }
}
```

**Dutch (nl/departments.json):**
```json
{
  "title": "Institutionele Afdelingen",
  "subtitle": "Beheer afdelingen in instellingen",
  "entity_name": "Afdelingen",
  "table_title": "Afdelingen",
  "table_description": "Volledige lijst van afdelingen met beheeracties",
  "create_department": "Afdeling Aanmaken",
  "edit_department": "Afdeling Bewerken",
  "delete_department": "Afdeling Verwijderen",
  "fields": {
    "annual_budget": "Totaal jaarbudget"
  },
  "breadcrumb": {
    "all_departments": "Alle Afdelingen Bekijken"
  },
  "detail": {
    "title_suffix": "Details",
    "no_description": "Afdelingsdetails en leden",
    "info_card": {
      "header_title": "Afdelingsinformatie",
      "no_description": "Geen beschrijving beschikbaar",
      "institutional": "Institutioneel",
      "members": "Leden",
      "active": "Actief",
      "inactive": "Inactief"
    },
    "members_table": {
      "title": "Afdelingsleden",
      "description": "Lijst van alle leden in {{name}}"
    }
  },
  "actions": {
    "view_details": "Details Bekijken",
    "edit_department": "Afdeling Bewerken",
    "manage_budget": "Budget Beheren",
    "delete_department": "Afdeling Verwijderen"
  },
  "kpi": {
    "budget_total": {
      "title": "Totaal Budget",
      "subtitle": "Totaal gepland budget"
    },
    "spent_amount": {
      "title": "Uitgegeven Bedrag",
      "subtitle": "Totale uitgaven"
    },
    "members": {
      "title": "Leden",
      "subtitle": "Afdelingsleden"
    }
  },
  "filters": {
    "institutional": "Institutioneel"
  },
  "messages": {
    "created_success": "Afdeling succesvol aangemaakt",
    "updated_success": "Afdeling succesvol bijgewerkt",
    "deleted_success": "Afdeling succesvol verwijderd"
  }
}
```

---

## 🧪 Testes de Validação

### Checklist de Testes
- [ ] Alternar entre idiomas (EN/PT/NL)
- [ ] Verificar se todos os textos traduzem corretamente
- [ ] Confirmar que fallbacks funcionam quando traduções faltam
- [ ] Testar interpolação (ex: `{{name}}` em descriptions)
- [ ] Validar toast messages em diferentes idiomas
- [ ] Verificar filtros e labels das tabelas
- [ ] Testar breadcrumb navigation
- [ ] Confirmar KPI cards traduzidos
- [ ] Validar EntityInfoCard badges e actions

### Comandos de Teste
```bash
# Verificar erros de compilação
npm run build

# Testar em desenvolvimento
npm run dev

# Verificar tipos TypeScript
npm run type-check
```

---

## 📊 Estatísticas

| Categoria | Quantidade de Chaves |
|-----------|---------------------|
| **common** | 13 chaves |
| **departments** | 35 chaves |
| **churches** | 1 chave |
| **annual_budget** | 5 chaves |
| **institutions** | 1 chave |
| **users** | 12 chaves |
| **TOTAL** | **67 chaves** |

---

## ✨ Benefícios da Implementação

1. **Internacionalização Completa**: Suporte para múltiplos idiomas
2. **Manutenibilidade**: Chaves organizadas por namespace
3. **Segurança**: Fallbacks garantem que nenhum texto fique vazio
4. **Escalabilidade**: Estrutura preparada para novos idiomas
5. **Consistência**: Padrão uniforme em toda a aplicação
6. **UX Melhorada**: Usuários podem usar o sistema em seu idioma preferido

---

## 🔄 Próximos Passos

1. ✅ Análise completa de todas as strings (CONCLUÍDO)
2. ✅ Implementação de todas as chaves i18n (CONCLUÍDO)
3. ⏳ Criar arquivos JSON de tradução para EN/PT/NL
4. ⏳ Testar mudança de idiomas na aplicação
5. ⏳ Validar interpolação de variáveis (ex: `{{name}}`)
6. ⏳ Documentar processo para adicionar novos idiomas
7. ⏳ Criar testes automatizados para i18n

---

## 📝 Notas Técnicas

### Interpolação de Variáveis
Para strings com variáveis dinâmicas, use:
```tsx
{t('departments.detail.members_table.description', { name: selectedDepartmentDetail.name })}
```

### Pluralização
Para textos que variam com quantidade:
```json
{
  "members_count": "{{count}} Member",
  "members_count_plural": "{{count}} Members"
}
```

### Contexto
Para textos que mudam conforme contexto:
```tsx
{t('common.status', { context: isActive ? 'active' : 'inactive' })}
```

---

**Documento Criado**: 26/10/2025  
**Versão**: 1.0  
**Status**: ✅ Análise Completa  
**Última Atualização**: 26/10/2025

