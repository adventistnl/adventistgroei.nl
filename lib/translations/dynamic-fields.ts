// Dynamic Fields Translations for Batch Editor and Dropdowns
// Language support: Portuguese (pt), English (en), Dutch (nl)

export const dynamicFieldsTranslations = {
  pt: {
    // Generic field labels
    status: "Status",
    priority: "Prioridade", 
    category: "Categoria",
    type: "Tipo",
    department: "Departamento",
    role: "Função",
    region: "Região",
    location: "Localização",
    budget: "Orçamento",
    deadline: "Prazo",
    assignee: "Responsável",
    tags: "Etiquetas",
    visibility: "Visibilidade",
    approval: "Aprovação",
    subsidized: "Subsidiado",
    
    // Status options
    statusOptions: {
      label: "Status",
      active: "Ativo",
      inactive: "Inativo",
      pending: "Pendente",
      draft: "Rascunho",
      published: "Publicado",
      archived: "Arquivado",
      cancelled: "Cancelado",
      completed: "Concluído",
      inProgress: "Em Andamento",
      onHold: "Em Espera",
      underReview: "Em Análise",
      approved: "Aprovado",
      rejected: "Rejeitado",
      suspended: "Suspenso",
      // Project activity specific statuses
      todo: "A Fazer",
      in_progress: "Em Andamento",
      on_hold: "Em Espera"
    },
    
    // Priority options
    priorityOptions: {
      label: "Prioridade",
      low: "Baixa",
      medium: "Média",
      high: "Alta",
      critical: "Crítica",
      urgent: "Urgente"
    },
    
    // Subsidized options
    subsidizedOptions: {
      label: "Subsidiado",
      yes: "Sim",
      no: "Não"
    },
    
    // Category options
    categoryOptions: {
      project: "Projeto",
      task: "Tarefa",
      event: "Evento",
      meeting: "Reunião",
      report: "Relatório",
      document: "Documento",
      finance: "Financeiro",
      budget: "Orçamento",
      expense: "Despesa",
      income: "Receita",
      transfer: "Transferência"
    },
    
    // Department options
    departmentOptions: {
      administration: "Administração",
      finance: "Financeiro",
      hr: "Recursos Humanos",
      it: "Tecnologia da Informação",
      operations: "Operações",
      marketing: "Marketing",
      education: "Educação",
      youth: "Jovens",
      children: "Crianças",
      music: "Música",
      evangelism: "Evangelismo",
      stewardship: "Mordomia",
      health: "Saúde",
      communication: "Comunicação"
    },
    
    // Role options
    roleOptions: {
      admin: "Administrador",
      manager: "Gerente", 
      coordinator: "Coordenador",
      leader: "Líder",
      member: "Membro",
      volunteer: "Voluntário",
      user: "Usuário",
      viewer: "Visualizador",
      editor: "Editor",
      moderator: "Moderador"
    },
    
    // Region options
    regionOptions: {
      north: "Norte",
      south: "Sul",
      east: "Leste",
      west: "Oeste",
      central: "Central",
      northeast: "Nordeste",
      northwest: "Noroeste",
      southeast: "Sudeste",
      southwest: "Sudoeste"
    },
    
    // Institution types
    institutionTypes: {
      conference: "Associação",
      union: "União",
      division: "Divisão",
      church: "Igreja",
      school: "Escola",
      hospital: "Hospital",
      publishing: "Casa Publicadora",
      media: "Mídia"
    },
    
    // Church types
    churchTypes: {
      mother: "Igreja Mãe",
      branch: "Congregação",
      company: "Grupo",
      mission: "Missão",
      preaching_point: "Ponto de Pregação"
    },
    
    // Visibility options
    visibilityOptions: {
      public: "Público",
      private: "Privado",
      restricted: "Restrito",
      internal: "Interno",
      confidential: "Confidencial"
    },
    
    // Approval status
    approvalOptions: {
      pending: "Pendente",
      approved: "Aprovado",
      rejected: "Rejeitado",
      needsReview: "Precisa Revisar",
      conditional: "Condicional"
    },
    
    // Boolean/Switch options
    booleanOptions: {
      yes: "Sim",
      no: "Não",
      enabled: "Habilitado",
      disabled: "Desabilitado",
      active: "Ativo",
      inactive: "Inativo"
    },
    
    // Field placeholders
    placeholders: {
      selectOption: "Selecione uma opção",
      addTags: "Adicionar etiquetas...",
      enterAmount: "Digite o valor...",
      selectDate: "Selecionar data...",
      selectUser: "Selecionar usuário...",
      searchOptions: "Pesquisar opções..."
    },
    
    // Field tooltips
    tooltips: {
      status: "Status atual do item",
      priority: "Nível de prioridade do item",
      subsidized: "Ative esta opção para marcar como subsidiado",
      budget: "Valor orçamentário em moeda local",
      deadline: "Data limite para conclusão",
      visibility: "Quem pode ver este item",
      approval: "Status de aprovação atual"
    },
    
    // Inline batch editor
    inlineBatchEditor: {
      moreFields: "Mais Campos",
      applyToSelected: "Aplicar aos selecionados",
      fieldUpdated: "Campo atualizado",
      updatingFields: "Atualizando campos...",
      updateSuccess: "Campos atualizados com sucesso",
      updateError: "Erro ao atualizar campos"
    }
  },
  
  en: {
    // Generic field labels
    status: "Status",
    priority: "Priority", 
    category: "Category",
    type: "Type",
    department: "Department",
    role: "Role",
    region: "Region",
    location: "Location",
    budget: "Budget",
    deadline: "Deadline",
    assignee: "Assignee",
    tags: "Tags",
    visibility: "Visibility",
    approval: "Approval",
    subsidized: "Subsidized",
    
    // Status options
    statusOptions: {
      label: "Status",
      active: "Active",
      inactive: "Inactive",
      pending: "Pending",
      draft: "Draft",
      published: "Published",
      archived: "Archived",
      cancelled: "Cancelled",
      completed: "Completed",
      inProgress: "In Progress",
      onHold: "On Hold",
      underReview: "Under Review",
      approved: "Approved",
      rejected: "Rejected",
      suspended: "Suspended",
      // Project activity specific statuses
      todo: "To Do",
      in_progress: "In Progress",
      on_hold: "On Hold"
    },
    
    // Priority options
    priorityOptions: {
      label: "Priority",
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
      urgent: "Urgent"
    },
    
    // Subsidized options
    subsidizedOptions: {
      label: "Subsidized",
      yes: "Yes",
      no: "No"
    },
    
    // Category options
    categoryOptions: {
      project: "Project",
      task: "Task",
      event: "Event",
      meeting: "Meeting",
      report: "Report",
      document: "Document",
      finance: "Finance",
      budget: "Budget",
      expense: "Expense",
      income: "Income",
      transfer: "Transfer"
    },
    
    // Department options
    departmentOptions: {
      administration: "Administration",
      finance: "Finance",
      hr: "Human Resources",
      it: "Information Technology",
      operations: "Operations",
      marketing: "Marketing",
      education: "Education",
      youth: "Youth",
      children: "Children",
      music: "Music",
      evangelism: "Evangelism",
      stewardship: "Stewardship",
      health: "Health",
      communication: "Communication"
    },
    
    // Role options
    roleOptions: {
      admin: "Administrator",
      manager: "Manager", 
      coordinator: "Coordinator",
      leader: "Leader",
      member: "Member",
      volunteer: "Volunteer",
      user: "User",
      viewer: "Viewer",
      editor: "Editor",
      moderator: "Moderator"
    },
    
    // Region options
    regionOptions: {
      north: "North",
      south: "South",
      east: "East",
      west: "West",
      central: "Central",
      northeast: "Northeast",
      northwest: "Northwest",
      southeast: "Southeast",
      southwest: "Southwest"
    },
    
    // Institution types
    institutionTypes: {
      conference: "Conference",
      union: "Union",
      division: "Division",
      church: "Church",
      school: "School",
      hospital: "Hospital",
      publishing: "Publishing House",
      media: "Media"
    },
    
    // Church types
    churchTypes: {
      mother: "Mother Church",
      branch: "Branch",
      company: "Company",
      mission: "Mission",
      preaching_point: "Preaching Point"
    },
    
    // Visibility options
    visibilityOptions: {
      public: "Public",
      private: "Private",
      restricted: "Restricted",
      internal: "Internal",
      confidential: "Confidential"
    },
    
    // Approval status
    approvalOptions: {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      needsReview: "Needs Review",
      conditional: "Conditional"
    },
    
    // Boolean/Switch options
    booleanOptions: {
      yes: "Yes",
      no: "No",
      enabled: "Enabled",
      disabled: "Disabled",
      active: "Active",
      inactive: "Inactive"
    },
    
    // Field placeholders
    placeholders: {
      selectOption: "Select an option",
      addTags: "Add tags...",
      enterAmount: "Enter amount...",
      selectDate: "Select date...",
      selectUser: "Select user...",
      searchOptions: "Search options..."
    },
    
    // Field tooltips
    tooltips: {
      status: "Current item status",
      priority: "Item priority level",
      subsidized: "Enable this option to mark as subsidized",
      budget: "Budget amount in local currency",
      deadline: "Completion deadline",
      visibility: "Who can see this item",
      approval: "Current approval status"
    },
    
    // Inline batch editor
    inlineBatchEditor: {
      moreFields: "More Fields",
      applyToSelected: "Apply to Selected",
      fieldUpdated: "Field Updated",
      updatingFields: "Updating Fields...",
      updateSuccess: "Fields updated successfully",
      updateError: "Error updating fields"
    }
  },
  
  nl: {
    // Generic field labels
    status: "Status",
    priority: "Prioriteit", 
    category: "Categorie",
    type: "Type",
    department: "Afdeling",
    role: "Rol",
    region: "Regio",
    location: "Locatie",
    budget: "Budget",
    deadline: "Deadline",
    assignee: "Toegewezen",
    tags: "Tags",
    visibility: "Zichtbaarheid",
    approval: "Goedkeuring",
    subsidized: "Gesubsidieerd",
    
    // Status options
    statusOptions: {
      active: "Actief",
      inactive: "Inactief",
      pending: "In afwachting",
      draft: "Concept",
      published: "Gepubliceerd",
      archived: "Gearchiveerd",
      cancelled: "Geannuleerd",
      completed: "Voltooid",
      inProgress: "Bezig",
      onHold: "In de wacht",
      underReview: "Onder beoordeling",
      approved: "Goedgekeurd",
      rejected: "Afgewezen",
      suspended: "Opgeschort",
      // Project activity specific statuses
      todo: "Te doen",
      in_progress: "Bezig",
      on_hold: "In de wacht"
    },
    
    // Priority options
    priorityOptions: {
      label: "Prioriteit",
      low: "Laag",
      medium: "Gemiddeld",
      high: "Hoog",
      critical: "Kritiek",
      urgent: "Urgent"
    },
    
    // Subsidized options
    subsidizedOptions: {
      label: "Gesubsidieerd",
      yes: "Ja",
      no: "Nee"
    },
    
    // Category options
    categoryOptions: {
      project: "Project",
      task: "Taak",
      event: "Evenement",
      meeting: "Vergadering",
      report: "Rapport",
      document: "Document",
      finance: "Financiën",
      budget: "Budget",
      expense: "Uitgave",
      income: "Inkomsten",
      transfer: "Overdracht"
    },
    
    // Department options
    departmentOptions: {
      administration: "Administratie",
      finance: "Financiën",
      hr: "Human Resources",
      it: "Informatietechnologie",
      operations: "Operaties",
      marketing: "Marketing",
      education: "Onderwijs",
      youth: "Jeugd",
      children: "Kinderen",
      music: "Muziek",
      evangelism: "Evangelisatie",
      stewardship: "rentmeesterschap",
      health: "Gezondheid",
      communication: "Communicatie"
    },
    
    // Role options
    roleOptions: {
      admin: "Beheerder",
      manager: "Manager", 
      coordinator: "Coördinator",
      leader: "Leider",
      member: "Lid",
      volunteer: "Vrijwilliger",
      user: "Gebruiker",
      viewer: "Kijker",
      editor: "Editor",
      moderator: "Moderator"
    },
    
    // Region options
    regionOptions: {
      north: "Noord",
      south: "Zuid",
      east: "Oost",
      west: "West",
      central: "Centraal",
      northeast: "Noordoost",
      northwest: "Noordwest",
      southeast: "Zuidoost",
      southwest: "Zuidwest"
    },
    
    // Institution types
    institutionTypes: {
      conference: "Vereniging",
      union: "Unie",
      division: "Divisie",
      church: "Kerk",
      school: "School",
      hospital: "Ziekenhuis",
      publishing: "Uitgeverij",
      media: "Media"
    },
    
    // Church types
    churchTypes: {
      mother: "Moederkerk",
      branch: "Filiaal",
      company: "Gezelschap",
      mission: "Zending",
      preaching_point: "Preekpunt"
    },
    
    // Visibility options
    visibilityOptions: {
      public: "Openbaar",
      private: "Privé",
      restricted: "Beperkt",
      internal: "Intern",
      confidential: "Vertrouwelijk"
    },
    
    // Approval status
    approvalOptions: {
      pending: "In afwachting",
      approved: "Goedgekeurd",
      rejected: "Afgewezen",
      needsReview: "Moet beoordelen",
      conditional: "Voorwaardelijk"
    },
    
    // Boolean/Switch options
    booleanOptions: {
      yes: "Ja",
      no: "Nee",
      enabled: "Ingeschakeld",
      disabled: "Uitgeschakeld",
      active: "Actief",
      inactive: "Inactief"
    },
    
    // Field placeholders
    placeholders: {
      selectOption: "Selecteer een optie",
      addTags: "Tags toevoegen...",
      enterAmount: "Bedrag invoeren...",
      selectDate: "Datum selecteren...",
      selectUser: "Gebruiker selecteren...",
      searchOptions: "Zoek opties..."
    },
    
    // Field tooltips
    tooltips: {
      status: "Huidige item status",
      priority: "Item prioriteitsniveau",
      subsidized: "Schakel deze optie in om te markeren als gesubsidieerd",
      budget: "Budgetbedrag in lokale valuta",
      deadline: "Voltooiingsdeadline",
      visibility: "Wie kan dit item zien",
      approval: "Huidige goedkeuringsstatus"
    },
    
    // Inline batch editor
    inlineBatchEditor: {
      moreFields: "Meer Velden",
      applyToSelected: "Toepassen op Geselecteerd",
      fieldUpdated: "Veld Bijgewerkt",
      updatingFields: "Velden Bijwerken...",
      updateSuccess: "Velden succesvol bijgewerkt",
      updateError: "Fout bij het bijwerken van velden"
    }
  }
}