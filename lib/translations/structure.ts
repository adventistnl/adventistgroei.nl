export const structureTranslations = {
  en: {
    // Common
    loading: "Loading...",
    refreshing: "Refreshing data...",
    error: "Error loading data",
    
    // Navigation
    // institutions: "Institutions",
    // regions: "Regions", 
    // churches: "Churches",
    // departments: "Departments",
    
    institutionsTitle: "Institutions Management",
    institutionsSubtitle: "Manage religious institutions and their organizational structure",
    createInstitution: "Create Institution",
    institutionDetails: "Institution Details",
    totalInstitutions: "Total Institutions",
    activeInstitutions: "Active Institutions",
    totalMembers: "Total Members",
    totalBudget: "Total Budget",
    
    // Regions
    regionsTitle: "Regions Management",
    regionsSubtitle: "Manage regional structure and organization",
    createRegion: "Create Region",
    regionDetails: "Region Details",
    totalRegions: "Total Regions",
    regionBudget: "Region Budget",
    budgetUtilization: "Budget Utilization",
    regionalBudgetDistribution: "Regional Budget Distribution",
    subsidyRequestsByRegion: "Subsidy Requests by Region",
    membersGrowthByRegion: "Members Growth by Region",
    
    // Churches
    churchesTitle: "Churches Management",
    churchesSubtitle: "Manage churches across all regions",
    createChurch: "Create Church",
    churchDetails: "Church Details",
    totalChurches: "Total Churches",
    activeChurches: "Active Churches",
    churchBudget: "Church Budget",
    pendingRequests: "Pending Requests",
    churchesByRegion: "Churches by Region",
    subsidyDistribution: "Subsidy Distribution",
    
    // Departments
    departmentsTitle: "Departments Management",
    departmentsSubtitle: "Manage departments and their budgets",
    createDepartment: "Create Department",
    departmentDetails: "Department Details",
    annualBudget: "Annual Budget",
    budgetUsed: "Budget Used",
    budgetRemaining: "Remaining",
    efficiency: "Efficiency",
    budgetUtilizationTrends: "Budget Utilization Trends",
    subsidyRequestsTimeline: "Subsidy Requests Timeline",
    budgetAllocation: "Budget Allocation",
    
    // Table headers
    name: "Name",
    region: "Region",
    church: "Church",
    members: "Members",
    budget: "Budget",
    used: "Used",
    available: "Available",
    remaining: "Remaining",
    utilization: "Utilization",
    requests: "Requests",
    contact: "Contact",
    actions: "Actions",
    
    // Actions
    view: "View",
    edit: "Edit",
    delete: "Delete",
    viewContact: "View Contact",
    manageBudget: "Manage Budget",
    editRegion: "Edit Region",
    deleteRegion: "Delete Region",
    editDepartment: "Edit Department",
    deleteDepartment: "Delete Department",
    
    // Search & Filters
    searchRegions: "Search regions...",
    searchChurches: "Search churches...",
    searchDepartments: "Search departments...",
    filterByRegion: "Filter by Region",
    filterByChurch: "Filter by Church",
    
    // Status
    active: "Active",
    inactive: "Inactive",
    high: "High",
    medium: "Medium",
    low: "Low",
    
    // Messages
    dataRefreshed: "Data refreshed successfully",
    errorRefreshing: "Error refreshing data",
    itemCreated: "Item created successfully",
    itemUpdated: "Item updated successfully",
    itemDeleted: "Item deleted successfully",

    // Sidebar
    sidebar: {
      dashboard: "Dashboard",
      platform: "Platform",
      structure: "Structure",
      management: "Management",
      structureOrganization: "Structure",
      institutions: "Institutions",
      instDepartments: "Inst. Departments",
      regions: "Regions",
      churches: "Churches",
      churchDepartments: "Church Departments",
      financeManagement: "Finance Management",
      annualBudget: "Annual Budget",
      subsidyApprovals: "Subsidy Approvals",
      usersAccess: "Users & Access",
      users: "Users",
      accessManagement: "Access Management",
      projects: "Projects",
    },
    
    // Navigation Loading Messages
    navigationMessages: {
      opening: "Opening {{title}}...",
      signingOut: "Signing out...",
      openingProfile: "Opening profile...",
      openingNotifications: "Opening notifications...",
      openingSettings: "Opening settings..."
    },

    // Common fields
    common: {
      cancel: "Cancel",
      save: "Save",
      create: "Create",
      update: "Update",
      delete: "Delete"
    },

    // Region Modal Translations
    regions: {
      labels: {
        region: "Region",
        contact: "Contact"
      },
      validation: {
        name_required: "Name is required",
        name_min_length: "Name must be at least 2 characters",
        email_invalid: "Invalid email format",
        please_fix_errors: "Please fix the errors before proceeding"
      },
      toasts: {
        creating: "Creating region...",
        created: "Region created successfully",
        create_failed: "Failed to create region",
        updating: "Updating region...",
        updated: "Region updated successfully",
        update_failed: "Failed to update region",
        deactivating: "Deactivating region...",
        deactivated: "Region deactivated successfully",
        deactivate_failed: "Failed to deactivate region"
      },
      modals: {
        create: {
          title: "Create New Region",
          description: "Add a new region to your organizational structure"
        },
        edit: {
          title: "Edit Region",
          description: "Update region information and settings"
        },
        delete: {
          title: "Delete Region",
          description: "This action cannot be undone",
          deactivate_title: "Deactivate Region",
          deactivate_description: "This will deactivate the region and its associated data",
          affected_components: "Affected Components",
          view_consequences: "View Full Consequences",
          understand_consequences: "I understand the consequences of this action",
          acknowledge_text: "I Acknowledge and Want to Proceed",
          type_confirmation: "To confirm this action, type 'delete region' below:",
          confirmation_placeholder: "Type 'delete region' to confirm",
          confirmation_help: "Please type the exact text to confirm deletion",
          deactivating: "Deactivating...",
          deactivate_region: "Deactivate Region",
          consequences: {
            church_access: "Church Access Impact",
            church_access_desc: "Churches in this region will lose regional management access",
            data_preservation: "Data Preservation",
            data_preservation_desc: "All historical data will be preserved but marked as inactive",
            member_impact: "Member Impact", 
            member_impact_desc: "Members will need to be reassigned to other regions",
            event_impact: "Event Impact",
            event_impact_desc: "Upcoming events will need regional reassignment"
          },
          soft_delete: {
            title: "Soft Delete Protection",
            description: "This is a soft delete - data can be recovered by administrators if needed"
          }
        }
      },
      fields: {
        name: "Region Name",
        parent_region: "Parent Region", 
        contact_name: "Contact Name",
        contact_email: "Contact Email",
        contact_phone: "Contact Phone",
        contact_mobile: "Contact Mobile",
        contact_country: "Country",
        contact_city: "City",
        contact_address: "Address",
        contact_postal_code: "Postal Code",
        contact_website: "Website"
      },
      placeholders: {
        name: "Enter region name",
        parent_region: "Select parent region",
        no_parent: "No parent region",
        contact_name: "Enter contact name",
        contact_email: "Enter email address",
        contact_phone: "Enter phone number",
        contact_mobile: "Enter mobile number",
        contact_country: "Enter country",
        contact_city: "Enter city",
        contact_address: "Enter address",
        contact_postal_code: "Enter postal code",
        contact_website: "Enter website URL"
      },
      sections: {
        basic_info: "Basic Information",
        contact_info: "Contact Information"
      },
      steps: {
        step: "Step",
        of: "of"
      },
      buttons: {
        next: "Next",
        previous: "Previous"
      },
      creating: "Creating...",
      updating: "Updating..."
    }
  },
  
  nl: {
    // Common
    loading: "Laden...",
    refreshing: "Gegevens vernieuwen...",
    error: "Fout bij het laden van gegevens",
    
    // Navigation
    // institutions: "Instellingen",
    // regions: "Regio's",
    // churches: "Kerken",
    // departments: "Afdelingen",
    
    
    // Sidebar
    sidebar: {
      dashboard: "Dashboard",
      platform: "Platform",
      structure: "Structuur",
      management: "Beheer",
      structureOrganization: "Structuur & Organisatie",
      institutions: "Instellingen",
      instDepartments: "Inst. Afdelingen",
      regions: "Regio's",
      churches: "Kerken",
      churchDepartments: "Kerk Afdelingen",
      financeManagement: "Financieel Beheer",
      annualBudget: "Jaarlijks Budget",
      subsidyApprovals: "Subsidie Goedkeuringen",
      usersAccess: "Gebruikers & Toegang",
      users: "Gebruikers",
      accessManagement: "Toegangsbeheer",
      projects: "Projecten",
    },
    
    // Institutions
    institutionsTitle: "Instellingen Beheer",
    institutionsSubtitle: "Beheer religieuze instellingen en hun organisatiestructuur",
    createInstitution: "Instelling Aanmaken",
    institutionDetails: "Instelling Details",
    totalInstitutions: "Totaal Instellingen",
    activeInstitutions: "Actieve Instellingen",
    totalMembers: "Totaal Leden",
    totalBudget: "Totaal Budget",
    
    // Regions
    regionsTitle: "Regio's Beheer",
    regionsSubtitle: "Beheer regionale structuur en organisatie",
    createRegion: "Regio Aanmaken",
    regionDetails: "Regio Details",
    totalRegions: "Totaal Regio's",
    regionBudget: "Regio Budget",
    budgetUtilization: "Budget Benutting",
    regionalBudgetDistribution: "Regionale Budget Verdeling",
    subsidyRequestsByRegion: "Subsidie Verzoeken per Regio",
    membersGrowthByRegion: "Ledengroei per Regio",
    
    // Churches
    churchesTitle: "Kerken Beheer",
    churchesSubtitle: "Beheer kerken in alle regio's",
    createChurch: "Kerk Aanmaken",
    churchDetails: "Kerk Details",
    totalChurches: "Totaal Kerken",
    activeChurches: "Actieve Kerken",
    churchBudget: "Kerk Budget",
    pendingRequests: "Openstaande Verzoeken",
    churchesByRegion: "Kerken per Regio",
    subsidyDistribution: "Subsidie Verdeling",
    
    // Departments
    departmentsTitle: "Afdelingen Beheer",
    departmentsSubtitle: "Beheer afdelingen en hun budgetten",
    createDepartment: "Afdeling Aanmaken",
    departmentDetails: "Afdeling Details",
    annualBudget: "Jaarlijks Budget",
    budgetUsed: "Budget Gebruikt",
    budgetRemaining: "Resterend",
    efficiency: "Efficiëntie",
    budgetUtilizationTrends: "Budget Benutting Trends",
    subsidyRequestsTimeline: "Subsidie Verzoeken Tijdlijn",
    budgetAllocation: "Budget Toewijzing",
    
    // Table headers
    name: "Naam",
    region: "Regio",
    church: "Kerk",
    members: "Leden",
    budget: "Budget",
    used: "Gebruikt",
    available: "Beschikbaar",
    remaining: "Resterend",
    utilization: "Benutting",
    requests: "Verzoeken",
    contact: "Contact",
    actions: "Acties",
    
    // Actions
    view: "Bekijken",
    edit: "Bewerken",
    delete: "Verwijderen",
    filterByChurch: "Filter op Kerk",
    
    // Status
    active: "Actief",
    inactive: "Inactief",
    high: "Hoog",
    medium: "Gemiddeld",
    low: "Laag",
    
    // Messages
    dataRefreshed: "Gegevens succesvol vernieuwd",
    errorRefreshing: "Fout bij vernieuwen gegevens",
    itemCreated: "Item succesvol aangemaakt",
    itemUpdated: "Item succesvol bijgewerkt",
    itemDeleted: "Item succesvol verwijderd",

    // Navigation Loading Messages
    navigationMessages: {
      opening: "{{title}} openen...",
      signingOut: "Uitloggen...",
      openingProfile: "Profiel openen...",
      openingNotifications: "Meldingen openen...",
      openingSettings: "Instellingen openen..."
    },

    // Common fields
    common: {
      cancel: "Annuleren",
      save: "Opslaan", 
      create: "Aanmaken",
      update: "Bijwerken",
      delete: "Verwijderen"
    },

    // Region Modal Translations
    regions: {
      labels: {
        region: "Regio",
        contact: "Contact"
      },
      validation: {
        name_required: "Naam is verplicht",
        name_min_length: "Naam moet minimaal 2 karakters zijn",
        email_invalid: "Ongeldig e-mail formaat",
        please_fix_errors: "Corrigeer de fouten voordat u doorgaat"
      },
      toasts: {
        creating: "Regio aanmaken...",
        created: "Regio succesvol aangemaakt",
        create_failed: "Regio aanmaken mislukt",
        updating: "Regio bijwerken...",
        updated: "Regio succesvol bijgewerkt",
        update_failed: "Regio bijwerken mislukt",
        deactivating: "Regio deactiveren...",
        deactivated: "Regio succesvol gedeactiveerd",
        deactivate_failed: "Regio deactiveren mislukt"
      },
      modals: {
        create: {
          title: "Nieuwe Regio Aanmaken",
          description: "Voeg een nieuwe regio toe aan uw organisatiestructuur"
        },
        edit: {
          title: "Regio Bewerken",
          description: "Werk regio-informatie en instellingen bij"
        },
        delete: {
          title: "Regio Verwijderen",
          description: "Deze actie kan niet ongedaan worden gemaakt",
          deactivate_title: "Regio Deactiveren",
          deactivate_description: "Dit zal de regio en bijbehorende gegevens deactiveren",
          affected_components: "Beïnvloede Componenten",
          view_consequences: "Volledige Gevolgen Bekijken",
          understand_consequences: "Ik begrijp de gevolgen van deze actie",
          acknowledge_text: "Ik Erken en Wil Doorgaan",
          type_confirmation: "Om deze actie te bevestigen, typ 'delete region' hieronder:",
          confirmation_placeholder: "Typ 'delete region' om te bevestigen",
          confirmation_help: "Typ de exacte tekst om verwijdering te bevestigen",
          deactivating: "Deactiveren...",
          deactivate_region: "Regio Deactiveren",
          consequences: {
            church_access: "Kerk Toegang Impact",
            church_access_desc: "Kerken in deze regio verliezen regionale beheertoegang",
            data_preservation: "Gegevensbehoud",
            data_preservation_desc: "Alle historische gegevens worden bewaard maar gemarkeerd als inactief",
            member_impact: "Leden Impact",
            member_impact_desc: "Leden moeten worden herverdeeld naar andere regio's",
            event_impact: "Evenement Impact", 
            event_impact_desc: "Aankomende evenementen hebben regionale herverdeling nodig"
          },
          soft_delete: {
            title: "Zachte Verwijdering Bescherming",
            description: "Dit is een zachte verwijdering - gegevens kunnen door beheerders worden hersteld indien nodig"
          }
        }
      },
      fields: {
        name: "Regio Naam",
        parent_region: "Bovenliggende Regio",
        contact_name: "Contact Naam",
        contact_email: "Contact E-mail",
        contact_phone: "Contact Telefoon",
        contact_mobile: "Contact Mobiel",
        contact_country: "Land",
        contact_city: "Stad",
        contact_address: "Adres",
        contact_postal_code: "Postcode",
        contact_website: "Website"
      },
      placeholders: {
        name: "Voer regio naam in",
        parent_region: "Selecteer bovenliggende regio",
        no_parent: "Geen bovenliggende regio",
        contact_name: "Voer contact naam in",
        contact_email: "Voer e-mail adres in",
        contact_phone: "Voer telefoonnummer in",
        contact_mobile: "Voer mobiel nummer in",
        contact_country: "Voer land in",
        contact_city: "Voer stad in",
        contact_address: "Voer adres in",
        contact_postal_code: "Voer postcode in",
        contact_website: "Voer website URL in"
      },
      sections: {
        basic_info: "Basis Informatie",
        contact_info: "Contact Informatie"
      },
      steps: {
        step: "Stap",
        of: "van"
      },
      buttons: {
        next: "Volgende",
        previous: "Vorige"
      },
      creating: "Aanmaken...",
      updating: "Bijwerken..."
    }
  },
  
  pt: {
    // Common
    loading: "Carregando...",
    refreshing: "Atualizando dados...",
    error: "Erro ao carregar dados",
    
    // Navigation
    // institutions: "Instituições",
    // regions: "Regiões",
    // churches: "Igrejas",
    // departments: "Departamentos",
    
    
    // Sidebar
    sidebar: {
      dashboard: "Dashboard",
      platform: "Plataforma",
      structure: "Estrutura",
      management: "Gestão",
      structureOrganization: "Estrutura & Organização",
      institutions: "Instituições",
      instDepartments: "Dept. Institucionais",
      regions: "Regiões",
      churches: "Igrejas",
      churchDepartments: "Dept. das Igrejas",
      financeManagement: "Gestão Financeira",
      annualBudget: "Orçamento Anual",
      subsidyApprovals: "Aprovações de Subsídio",
      usersAccess: "Usuários & Acesso",
      users: "Usuários",
      accessManagement: "Gestão de Acesso",
      projects: "Projetos",
    },
    
    // Institutions
    institutionsTitle: "Gestão de Instituições",
    institutionsSubtitle: "Gerencie instituições religiosas e sua estrutura organizacional",
    createInstitution: "Criar Instituição",
    institutionDetails: "Detalhes da Instituição",
    totalInstitutions: "Total de Instituições",
    activeInstitutions: "Instituições Ativas",
    totalMembers: "Total de Membros",
    totalBudget: "Orçamento Total",
    
    // Regions
    regionsTitle: "Gestão de Regiões",
    regionsSubtitle: "Gerencie estrutura regional e organização",
    createRegion: "Criar Região",
    regionDetails: "Detalhes da Região",
    totalRegions: "Total de Regiões",
    regionBudget: "Orçamento Regional",
    budgetUtilization: "Utilização do Orçamento",
    regionalBudgetDistribution: "Distribuição do Orçamento Regional",
    subsidyRequestsByRegion: "Solicitações de Subsídio por Região",
    membersGrowthByRegion: "Crescimento de Membros por Região",
    
    // Churches
    churchesTitle: "Gestão de Igrejas",
    churchesSubtitle: "Gerencie igrejas em todas as regiões",
    createChurch: "Criar Igreja",
    churchDetails: "Detalhes da Igreja",
    totalChurches: "Total de Igrejas",
    activeChurches: "Igrejas Ativas",
    churchBudget: "Orçamento da Igreja",
    pendingRequests: "Solicitações Pendentes",
    churchesByRegion: "Igrejas por Região",
    subsidyDistribution: "Distribuição de Subsídios",
    
    // Departments
    departmentsTitle: "Gestão de Departamentos",
    departmentsSubtitle: "Gerencie departamentos e seus orçamentos",
    createDepartment: "Criar Departamento",
    departmentDetails: "Detalhes do Departamento",
    annualBudget: "Orçamento Anual",
    budgetUsed: "Orçamento Usado",
    budgetRemaining: "Restante",
    efficiency: "Eficiência",
    budgetUtilizationTrends: "Tendências de Utilização do Orçamento",
    subsidyRequestsTimeline: "Cronograma de Solicitações de Subsídio",
    budgetAllocation: "Alocação de Orçamento",
    
    // Table headers
    name: "Nome",
    region: "Região",
    church: "Igreja",
    members: "Membros",
    budget: "Orçamento",
    used: "Usado",
    available: "Disponível",
    remaining: "Restante",
    utilization: "Utilização",
    requests: "Solicitações",
    contact: "Contato",
    actions: "Ações",
    
    // Actions
    view: "Visualizar",
    edit: "Editar",
    delete: "Excluir",
    viewContact: "Ver Contato",
    manageBudget: "Gerenciar Orçamento",
    editRegion: "Editar Região",
    deleteRegion: "Excluir Região",
    editChurch: "Editar Igreja",
    deleteChurch: "Excluir Igreja",
    editDepartment: "Editar Departamento",
    deleteDepartment: "Excluir Departamento",
    
    // Search & Filters
    searchRegions: "Buscar regiões...",
    searchChurches: "Buscar igrejas...",
    searchDepartments: "Buscar departamentos...",
    filterByRegion: "Filtrar por Região",
    filterByChurch: "Filtrar por Igreja",
    
    // Status
    active: "Ativo",
    inactive: "Inativo",
    high: "Alto",
    medium: "Médio",
    low: "Baixo",
    
    // Messages
    dataRefreshed: "Dados atualizados com sucesso",
    errorRefreshing: "Erro ao atualizar dados",
    itemCreated: "Item criado com sucesso",
    itemUpdated: "Item atualizado com sucesso",
    itemDeleted: "Item excluído com sucesso",

    // Navigation Loading Messages
    navigationMessages: {
      opening: "Abrindo {{title}}...",
      signingOut: "Saindo...",
      openingProfile: "Abrindo perfil...",
      openingNotifications: "Abrindo notificações...",
      openingSettings: "Abrindo configurações..."
    },

    // Common fields
    common: {
      cancel: "Cancelar",
      save: "Salvar",
      create: "Criar",
      update: "Atualizar",
      delete: "Excluir"
    },

    // Region Modal Translations
    regions: {
      labels: {
        region: "Região",
        contact: "Contato"
      },
      validation: {
        name_required: "Nome é obrigatório",
        name_min_length: "Nome deve ter pelo menos 2 caracteres",
        email_invalid: "Formato de e-mail inválido",
        please_fix_errors: "Corrija os erros antes de prosseguir"
      },
      toasts: {
        creating: "Criando região...",
        created: "Região criada com sucesso",
        create_failed: "Falha ao criar região",
        updating: "Atualizando região...",
        updated: "Região atualizada com sucesso",
        update_failed: "Falha ao atualizar região",
        deactivating: "Desativando região...",
        deactivated: "Região desativada com sucesso",
        deactivate_failed: "Falha ao desativar região"
      },
      modals: {
        create: {
          title: "Criar Nova Região",
          description: "Adicione uma nova região à sua estrutura organizacional"
        },
        edit: {
          title: "Editar Região",
          description: "Atualize informações e configurações da região"
        },
        delete: {
          title: "Excluir Região",
          description: "Esta ação não pode ser desfeita",
          deactivate_title: "Desativar Região",
          deactivate_description: "Isso desativará a região e seus dados associados",
          affected_components: "Componentes Afetados",
          view_consequences: "Ver Consequências Completas",
          understand_consequences: "Eu entendo as consequências desta ação",
          acknowledge_text: "Eu Reconheço e Quero Prosseguir",
          type_confirmation: "Para confirmar esta ação, digite 'delete region' abaixo:",
          confirmation_placeholder: "Digite 'delete region' para confirmar",
          confirmation_help: "Digite o texto exato para confirmar a exclusão",
          deactivating: "Desativando...",
          deactivate_region: "Desativar Região",
          consequences: {
            church_access: "Impacto no Acesso das Igrejas",
            church_access_desc: "Igrejas desta região perderão acesso ao gerenciamento regional",
            data_preservation: "Preservação de Dados",
            data_preservation_desc: "Todos os dados históricos serão preservados mas marcados como inativos",
            member_impact: "Impacto nos Membros",
            member_impact_desc: "Membros precisarão ser reatribuídos a outras regiões",
            event_impact: "Impacto nos Eventos",
            event_impact_desc: "Eventos futuros precisarão de reatribuição regional"
          },
          soft_delete: {
            title: "Proteção de Exclusão Suave",
            description: "Esta é uma exclusão suave - dados podem ser recuperados por administradores se necessário"
          }
        }
      },
      fields: {
        name: "Nome da Região",
        parent_region: "Região Pai",
        contact_name: "Nome do Contato",
        contact_email: "E-mail do Contato",
        contact_phone: "Telefone do Contato",
        contact_mobile: "Celular do Contato",
        contact_country: "País",
        contact_city: "Cidade",
        contact_address: "Endereço",
        contact_postal_code: "CEP",
        contact_website: "Website"
      },
      placeholders: {
        name: "Digite o nome da região",
        parent_region: "Selecione região pai",
        no_parent: "Nenhuma região pai",
        contact_name: "Digite o nome do contato",
        contact_email: "Digite o endereço de e-mail",
        contact_phone: "Digite o número de telefone",
        contact_mobile: "Digite o número do celular",
        contact_country: "Digite o país",
        contact_city: "Digite a cidade",
        contact_address: "Digite o endereço",
        contact_postal_code: "Digite o CEP",
        contact_website: "Digite a URL do website"
      },
      sections: {
        basic_info: "Informações Básicas",
        contact_info: "Informações de Contato"
      },
      steps: {
        step: "Passo",
        of: "de"
      },
      buttons: {
        next: "Próximo",
        previous: "Anterior"
      },
      creating: "Criando...",
      updating: "Atualizando..."
    }
  }
}
