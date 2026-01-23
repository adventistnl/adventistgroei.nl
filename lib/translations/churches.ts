export const churchTranslations = {
  en: {
    // Modal Titles
    modals: {
      create: {
        title: "Create Church",
        description: "Add a new church to your organization"
      },
      edit: {
        title: "Edit Church",
        description: "Update church information and contact details"
      },
      delete: {
        deactivate_title: "Deactivate Church",
        deactivate_description: "This action will deactivate the church and affect related data",
        deactivating: "Deactivating...",
        deactivate_church: "Deactivate Church",
        view_consequences: "View Consequences",
        affected_components: "Affected Components",
        understand_consequences: "I understand the consequences",
        acknowledge_text: "I acknowledge that this action will affect all related data",
        type_confirmation: "Type 'delete church' to confirm",
        confirmation_text: "delete church",
        confirmation_placeholder: "Type 'delete church' here",
        confirmation_help: "The church will be deactivated and members will lose access",
        consequences: {
          member_access: "Member Access",
          member_access_desc: "Members will lose access to church-specific features and data",
          data_preservation: "Data Preservation",
          data_preservation_desc: "All church data will be preserved but marked as inactive",
          department_impact: "Department Impact",
          department_impact_desc: "All departments under this church will also be deactivated",
          project_impact: "Project Impact",
          project_impact_desc: "All ongoing projects will be suspended and archived",
          direct_relationships: "Departments and Users",
          direct_relationships_desc: "All departments, users and budgets linked will be deleted in cascade",
          indirect_relationships: "Related Data",
          indirect_relationships_desc: "Projects, subsidies, reports and data related to departments will be removed",
          data_safety: "Data Preservation",
          data_safety_desc: "All records are marked as deleted (soft delete), allowing recovery if necessary"
        },
        soft_delete: {
          title: "Soft Delete",
          description: "The church will be marked as inactive but data will be preserved"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Step",
      of: "of",
      step_1_title: "Basic Information",
      step_1_description: "Enter the church name, select the province, and type",
      step_2_title: "Geographic Data",
      step_2_description: "Select province, city, and region (province and city required)",
      step_3_title: "Contact Details",
      step_3_description: "Add contact information for the church (optional)",
      step_3_description_create: "creating the church",
      step_3_description_update: "updating the church"
    },
    
    // Fields
    fields: {
      name: "Church Name",
      province: "Province",
      city: "City",
      region: "Region",
      leader: "Church Leader",
      contact_name: "Contact Name",
      contact_email: "Contact Email",
      contact_phone: "Phone",
      contact_city: "City",
      church_type: "Church Type",
      is_special_church: "Is this a special church?",
      special_church_help: "Select if Church Plant or Company"
    },
    
    // Church Types
    church_types: {
      plant: {
        label: "Church Plant",
        description: "A developing church, starting its activities"
      },
      company: {
        label: "Church Company",
        description: "An organized group, almost established as a church"
      }
    },
    
    // Placeholders
    placeholders: {
      name: "Enter church name",
      province: "Select province",
      city: "Select city",
      region: "Select region",
      leader: "Select a leader for the church",
      contact_name: "Enter contact name",
      contact_email: "Enter email address",
      contact_phone: "Enter phone number",
      contact_city: "Enter city"
    },
    
    // Labels
    labels: {
      church: "Church",
      contact: "Contact"
    },
    
    // Sections
    sections: {
      basic_info: "Basic Information",
      contact_info: "Contact Information"
    },
    
    // Buttons
    buttons: {
      previous: "Previous",
      next: "Next",
      skip_for_now: "Skip for now",
      create_church: "Create Church",
      update_church: "Update Church",
      creating: "Creating...",
      updating: "Updating...",
      clear: "Clear"
    },
    
    // Regions
    regions: {
      north: "North",
      east: "East",
      west: "West",
      south: "South"
    },
    
    // Province Selector
    province_selector: {
      search_placeholder: "Search province...",
      no_province_found: "No province found.",
      cities: "cities"
    },
    
    // Validation
    validation: {
      name_required: "Church name is required",
      name_min_length: "Church name must be at least 2 characters",
      province_required: "Province is required",
      region_required: "Region is required",
      type_required: "Church type is required",
      country_required: "Country is required",
      leader_required: "Church leader is required",
      email_invalid: "Please enter a valid email address",
      please_fix_errors: "Please fix the errors before continuing"
    },
    
    // Toasts
    toasts: {
      creating: "Creating church...",
      created: "Church created successfully",
      create_failed: "Failed to create church",
      updating: "Updating church...",
      updated: "Church updated successfully",
      update_failed: "Failed to update church",
      deactivating: "Deactivating church...",
      deactivated: "Church deactivated successfully",
      deactivate_failed: "Failed to deactivate church"
    },
    
    // Stats
    stats: {
      members: "Members",
      departments: "Departments",
      projects: "Projects",
      activities: "Activities",
      budget: "Budget",
      events: "Events"
    },

    // Page-level translations
    page: {
      title: "Churches",
      description: "Manage all churches in your institution",
      select_year: "Select Year",
      totalChurches: "Total Churches",
      totalMembers: "Total Members",
      departments: "Departments",
      totalProjects: "Total Projects",
      active_churches: "Active churches",
      total_members: "Total members",
      active_departments: "Active departments",
      active_projects: "Active projects",
      vs_last_month: "vs last month"
    },

    // Table columns
    table: {
      name: "Name",
      province: "Province",
      city: "City",
      region: "Region",
      contact: "Contact",
      type: "Type",
      status: "Status",
      members: "Members",
      departments: "Departments",
      action: "Action",
      actions: "Actions",
      orphaned: "Orphaned",
      orphaned_label: "Orphaned (No Region)",
      no_region: "No Region",
      no_email: "No email",
      no_roles: "No roles",
      no_description: "No description",
      avatar: "Avatar",
      language: "Language",
      roles: "Roles",
      gender: "Gender",
      projects: "Projects",
      department_name: "Department Name",
      church_members: "Church Members",
      church_departments: "Church Departments"
    },

    // Messages
    messages: {
      loading: "Loading churches...",
      empty: "No churches found",
      error_loading: "Error loading churches",
      refresh_success: "Churches refreshed successfully",
      refresh_failed: "Failed to refresh churches",
      view_details: "View Details",
      edit_church: "Edit Church",
      delete_church: "Delete Church",
      deactivate_church: "Deactivate Church"
    },

    // Filters
    filters: {
      filters: "Filters",
      selectRegion: "Select region",
      allRegions: "All Regions",
      selectType: "Select type",
      allTypes: "All Types",
      allStatus: "All Status",
      filtersCleared: "Filters cleared",
      addYear: "Add Year",
      yearAdded: "Year {{year}} added",
      yearExists: "Year {{year}} already exists",
      cannotAddBeyond: "Cannot add year beyond {{year}}",
      searchPlaceholder: "Search churches..."
    },

    // Charts
    charts: {
      projects: "Projects",
      projectsOverTime: {
        title: "Projects Created Over Time",
        description: "Project creation timeline by churches"
      },
      membersByChurch: {
        title: "Members by Church Over Time",
        description: "New members per month",
        filters: {
          all: "All",
          q1: "Q1",
          q2: "Q2",
          q3: "Q3",
          q4: "Q4"
        },
        footer: {
          newMembers: "new members",
          top: "Top",
          members: "members",
          yearView: "Year view",
          churches: "churches"
        },
        loading: {
          title: "Loading...",
          description: "Fetching member registration data"
        },
        noData: {
          title: "No Member Data Available",
          description: "Member registration data will appear here once members join churches in the selected period.",
          icon: "No members registered yet"
        }
      },
      projectsByChurch: {
        title: "Projects by Church",
        titleDepartments: "Projects by Department",
        description: "Which church has the most active projects",
        descriptionDepartments: "Which department has the most active projects",
        selectChurch: "Select a church",
        selectDepartment: "Select a department",
        selectPlaceholder: "Select church",
        selectPlaceholderDept: "Select department",
        allChurches: "All Churches",
        allDepartments: "All Departments",
        loading: {
          title: "Loading...",
          description: "Fetching project distribution data"
        },
        noData: {
          title: "No Project Data Available",
          description: "Projects will appear here once they are created in churches.",
          icon: "No projects created yet"
        },
        footer: {
          totalProjects: "Total Projects",
          selected: "Selected:",
          projects: "projects",
          status: "Status:",
          active: "active",
          completed: "completed"
        },
        chart: {
          projects: "Projects",
          activeLabel: "active"
        }
      },
      timeRanges: {
        last7Days: "Last 7 days",
        last30Days: "Last 30 days",
        last3Months: "Last 3 months",
        last6Months: "Last 6 months",
        last12Months: "Last 12 months"
      },
      noData: {
        title: "No Project Data Available",
        description: "Projects will appear here once they are created in the selected time period."
      }
    }
  },
  
  nl: {
    // Modal Titles
    modals: {
      create: {
        title: "Kerk Aanmaken",
        description: "Voeg een nieuwe kerk toe aan uw organisatie"
      },
      edit: {
        title: "Kerk Bewerken",
        description: "Update kerk informatie en contactgegevens"
      },
      delete: {
        deactivate_title: "Kerk Deactiveren",
        deactivate_description: "Deze actie zal de kerk deactiveren en gerelateerde gegevens beïnvloeden",
        deactivating: "Deactiveren...",
        deactivate_church: "Kerk Deactiveren",
        view_consequences: "Gevolgen Bekijken",
        affected_components: "Beïnvloede Componenten",
        understand_consequences: "Ik begrijp de gevolgen",
        acknowledge_text: "Ik erken dat deze actie alle gerelateerde gegevens zal beïnvloeden",
        type_confirmation: "Typ 'delete church' om te bevestigen",
        confirmation_text: "delete church",
        confirmation_placeholder: "Typ 'delete church' hier",
        confirmation_help: "De kerk wordt gedeactiveerd en leden verliezen toegang",
        consequences: {
          member_access: "Lid Toegang",
          member_access_desc: "Leden verliezen toegang tot kerkspecifieke functies en gegevens",
          data_preservation: "Gegevens Bewaring",
          data_preservation_desc: "Alle kerkgegevens worden bewaard maar gemarkeerd als inactief",
          department_impact: "Afdeling Impact",
          department_impact_desc: "Alle afdelingen onder deze kerk worden ook gedeactiveerd",
          project_impact: "Project Impact",
          project_impact_desc: "Alle lopende projecten worden opgeschort en gearchiveerd",
          direct_relationships: "Afdelingen en Gebruikers",
          direct_relationships_desc: "Alle gekoppelde afdelingen, gebruikers en budgetten worden in cascade verwijderd",
          indirect_relationships: "Gerelateerde Gegevens",
          indirect_relationships_desc: "Projecten, subsidies, rapporten en gerelateerde gegevens van afdelingen worden verwijderd",
          data_safety: "Gegevens Bewaring",
          data_safety_desc: "Alle records worden gemarkeerd als verwijderd (zachte verwijdering), wat herstel mogelijk maakt"
        },
        soft_delete: {
          title: "Zachte Verwijdering",
          description: "De kerk wordt gemarkeerd als inactief maar gegevens worden bewaard"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Stap",
      of: "van",
      step_1_title: "Basis Informatie",
      step_1_description: "Voer de kerknaam in, selecteer de provincie en type",
      step_2_title: "Geografische Gegevens",
      step_2_description: "Selecteer provincie, stad en regio (provincie en stad verplicht)",
      step_3_title: "Contactgegevens",
      step_3_description: "Voeg contactinformatie toe voor de kerk (optioneel)",
      step_3_description_create: "de kerk aanmaakt",
      step_3_description_update: "de kerk bijwerkt"
    },
    
    // Fields
    fields: {
      name: "Kerknaam",
      province: "Provincie",
      city: "Stad",
      region: "Regio",
      leader: "Kerkleider",
      contact_name: "Contactnaam",
      contact_email: "Contact E-mail",
      contact_phone: "Telefoon",
      contact_city: "Stad",
      church_type: "Kerktype",
      is_special_church: "Is dit een speciale kerk?",
      special_church_help: "Selecteer indien Church Plant of Company"
    },
    
    // Church Types
    church_types: {
      plant: {
        label: "Church Plant",
        description: "Een zich ontwikkelende kerk, die haar activiteiten start"
      },
      company: {
        label: "Church Company",
        description: "Een georganiseerde groep, bijna gevestigd als kerk"
      }
    },
    
    // Placeholders
    placeholders: {
      name: "Voer kerknaam in",
      province: "Selecteer provincie",
      city: "Selecteer stad",
      region: "Selecteer regio",
      leader: "Selecteer een leider voor de kerk",
      contact_name: "Voer contactnaam in",
      contact_email: "Voer e-mailadres in",
      contact_phone: "Voer telefoonnummer in",
      contact_city: "Voer stad in"
    },
    
    // Labels
    labels: {
      church: "Kerk",
      contact: "Contact"
    },
    
    // Sections
    sections: {
      basic_info: "Basis Informatie",
      contact_info: "Contact Informatie"
    },
    
    // Buttons
    buttons: {
      previous: "Vorige",
      next: "Volgende",
      skip_for_now: "Nu overslaan",
      create_church: "Kerk Aanmaken",
      update_church: "Kerk Bijwerken",
      creating: "Aanmaken...",
      updating: "Bijwerken...",
      clear: "Wissen"
    },
    
    // Regions
    regions: {
      north: "Noord",
      east: "Oost",
      west: "West",
      south: "Zuid"
    },
    
    // Province Selector
    province_selector: {
      search_placeholder: "Zoek provincie...",
      no_province_found: "Geen provincie gevonden.",
      cities: "steden"
    },
    
    // Validation
    validation: {
      name_required: "Kerknaam is verplicht",
      name_min_length: "Kerknaam moet minimaal 2 karakters zijn",
      province_required: "Provincie is verplicht",
      region_required: "Regio is verplicht",
      type_required: "Kerktype is verplicht",
      country_required: "Land is verplicht",
      leader_required: "Kerkleider is verplicht",
      email_invalid: "Voer een geldig e-mailadres in",
      please_fix_errors: "Los de fouten op voordat u doorgaat"
    },
    
    // Toasts
    toasts: {
      creating: "Kerk aanmaken...",
      created: "Kerk succesvol aangemaakt",
      create_failed: "Kon kerk niet aanmaken",
      updating: "Kerk bijwerken...",
      updated: "Kerk succesvol bijgewerkt",
      update_failed: "Kon kerk niet bijwerken",
      deactivating: "Kerk deactiveren...",
      deactivated: "Kerk succesvol gedeactiveerd",
      deactivate_failed: "Kon kerk niet deactiveren"
    },
    
    // Stats
    stats: {
      members: "Leden",
      departments: "Afdelingen",
      projects: "Projecten",
      activities: "Activiteiten",
      budget: "Budget",
      events: "Evenementen"
    },

    // Page-level translations
    page: {
      title: "Kerken",
      description: "Beheer alle kerken in uw instituut",
      select_year: "Selecteer Jaar",
      totalChurches: "Totaal Kerken",
      totalMembers: "Totaal Leden",
      departments: "Afdelingen",
      totalProjects: "Totaal Projecten",
      active_churches: "Actieve kerken",
      total_members: "Totaal leden",
      active_departments: "Actieve afdelingen",
      active_projects: "Actieve projecten",
      vs_last_month: "versus vorige maand"
    },

    // Table columns
    table: {
      name: "Naam",
      province: "Provincie",
      city: "Stad",
      region: "Regio",
      contact: "Contact",
      type: "Type",
      status: "Status",
      members: "Leden",
      departments: "Afdelingen",
      action: "Actie",
      actions: "Acties",
      orphaned: "Wees",
      orphaned_label: "Wees (Geen Regio)",
      no_region: "Geen Regio",
      no_email: "Geen email",
      no_roles: "Geen rollen",
      no_description: "Geen beschrijving",
      avatar: "Avatar",
      language: "Taal",
      roles: "Rollen",
      gender: "Geslacht",
      projects: "Projecten",
      department_name: "Afdeling Naam",
      church_members: "Kerkleden",
      church_departments: "Kerkafdelingen"
    },

    // Messages
    messages: {
      loading: "Kerken laden...",
      empty: "Geen kerken gevonden",
      error_loading: "Fout bij laden van kerken",
      refresh_success: "Kerken succesvol vernieuwd",
      refresh_failed: "Kon kerken niet vernieuwen",
      view_details: "Details Bekijken",
      edit_church: "Kerk Bewerken",
      delete_church: "Kerk Verwijderen",
      deactivate_church: "Kerk Deactiveren"
    },

    // Filters
    filters: {
      filters: "Filters",
      selectRegion: "Selecteer regio",
      allRegions: "Alle Regio's",
      selectType: "Selecteer type",
      allTypes: "Alle Types",
      allStatus: "Alle Status",
      filtersCleared: "Filters gewist",
      addYear: "Jaar Toevoegen",
      yearAdded: "Jaar {{year}} toegevoegd",
      yearExists: "Jaar {{year}} bestaat al",
      cannotAddBeyond: "Kan jaar niet toevoegen na {{year}}",
      searchPlaceholder: "Zoek kerken..."
    },

    // Charts
    charts: {
      projects: "Projecten",
      projectsOverTime: {
        title: "Projecten Aangemaakt in de Tijd",
        description: "Projectcreatie tijdlijn per kerken"
      },      membersByChurch: {
        title: "Leden per Kerk in de Loop der Tijd",
        description: "Nieuwe leden per maand",
        filters: {
          all: "Alle",
          q1: "K1",
          q2: "K2",
          q3: "K3",
          q4: "K4"
        },
        footer: {
          newMembers: "nieuwe leden",
          top: "Top",
          members: "leden",
          yearView: "Jaarweergave",
          churches: "kerken"
        },
        loading: {
          title: "Laden...",
          description: "Ledenregistratiegegevens ophalen"
        },
        noData: {
          title: "Geen Ledengegevens Beschikbaar",
          description: "Ledenregistratiegegevens verschijnen hier zodra leden zich aansluiten bij kerken in de geselecteerde periode.",
          icon: "Nog geen leden geregistreerd"
        }
      },      projectsByChurch: {
        title: "Projecten per Kerk",
        titleDepartments: "Projecten per Departement",
        description: "Welke kerk heeft de meeste actieve projecten",
        descriptionDepartments: "Welk departement heeft de meeste actieve projecten",
        selectChurch: "Selecteer een kerk",
        selectDepartment: "Selecteer een departement",
        selectPlaceholder: "Selecteer kerk",
        selectPlaceholderDept: "Selecteer departement",
        allChurches: "Alle Kerken",
        allDepartments: "Alle Departementen",
        loading: {
          title: "Laden...",
          description: "Projectdistributiegegevens ophalen"
        },
        noData: {
          title: "Geen Projectgegevens Beschikbaar",
          description: "Projecten verschijnen hier zodra ze zijn aangemaakt in kerken.",
          icon: "Nog geen projecten aangemaakt"
        },
        footer: {
          totalProjects: "Totaal Projecten",
          selected: "Geselecteerd:",
          projects: "projecten",
          status: "Status:",
          active: "actief",
          completed: "voltooid"
        },
        chart: {
          projects: "Projecten",
          activeLabel: "actief"
        }
      },
      timeRanges: {
        last7Days: "Laatste 7 dagen",
        last30Days: "Laatste 30 dagen",
        last3Months: "Laatste 3 maanden",
        last6Months: "Laatste 6 maanden",
        last12Months: "Laatste 12 maanden"
      },
      noData: {
        title: "Geen Projectgegevens Beschikbaar",
        description: "Projecten verschijnen hier zodra ze zijn aangemaakt in de geselecteerde periode."
      }    }
  },
  
  pt: {
    // Modal Titles
    modals: {
      create: {
        title: "Criar Igreja",
        description: "Adicione uma nova igreja à sua organização"
      },
      edit: {
        title: "Editar Igreja",
        description: "Atualize informações da igreja e dados de contato"
      },
      delete: {
        deactivate_title: "Desativar Igreja",
        deactivate_description: "Esta ação desativará a igreja e afetará dados relacionados",
        deactivating: "Desativando...",
        deactivate_church: "Desativar Igreja",
        view_consequences: "Ver Consequências",
        affected_components: "Componentes Afetados",
        understand_consequences: "Entendo as consequências",
        acknowledge_text: "Reconheço que esta ação afetará todos os dados relacionados",
        type_confirmation: "Digite 'delete church' para confirmar",
        confirmation_text: "delete church",
        confirmation_placeholder: "Digite 'delete church' aqui",
        confirmation_help: "A igreja será desativada e os membros perderão o acesso",
        consequences: {
          member_access: "Acesso de Membros",
          member_access_desc: "Membros perderão acesso a recursos e dados específicos da igreja",
          data_preservation: "Preservação de Dados",
          data_preservation_desc: "Todos os dados da igreja serão preservados mas marcados como inativos",
          department_impact: "Impacto nos Departamentos",
          department_impact_desc: "Todos os departamentos sob esta igreja também serão desativados",
          project_impact: "Impacto nos Projetos",
          project_impact_desc: "Todos os projetos em andamento serão suspensos e arquivados",
          direct_relationships: "Departamentos e Usuários",
          direct_relationships_desc: "Todos os departamentos, usuários e orçamentos vinculados serão deletados em cascata",
          indirect_relationships: "Dados Relacionados",
          indirect_relationships_desc: "Projetos, subsídios, relatórios e dados relacionados aos departamentos serão removidos",
          data_safety: "Preservação de Dados",
          data_safety_desc: "Todos os registros são marcados como deletados (soft delete), permitindo recuperação se necessário"
        },
        soft_delete: {
          title: "Exclusão Suave",
          description: "A igreja será marcada como inativa mas os dados serão preservados"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Passo",
      of: "de",
      step_1_title: "Informações Básicas",
      step_1_description: "Digite o nome da igreja, selecione a província e o tipo",
      step_2_title: "Detalhes de Contato",
      step_2_description: "Adicione informações de contato para a igreja (opcional)",
      step_3_title: "Revisar & Confirmar",
      step_3_description: "Revise as informações antes de",
      step_3_description_create: "criar a igreja",
      step_3_description_update: "atualizar a igreja"
    },
    
    // Fields
    fields: {
      name: "Nome da Igreja",
      province: "Província",
      city: "Cidade",
      region: "Região",
      leader: "Líder da Igreja",
      contact_name: "Nome do Contato",
      contact_email: "E-mail de Contato",
      contact_phone: "Telefone",
      contact_city: "Cidade",
      church_type: "Tipo de Igreja",
      is_special_church: "Esta é uma igreja especial?",
      special_church_help: "Selecione se for Church Plant ou Company"
    },
    
    // Church Types
    church_types: {
      plant: {
        label: "Church Plant",
        description: "Uma igreja em desenvolvimento, começando suas atividades"
      },
      company: {
        label: "Church Company",
        description: "Um grupo organizado, quase estabelecido como igreja"
      }
    },
    
    // Placeholders
    placeholders: {
      name: "Digite o nome da igreja",
      province: "Selecione a província",
      city: "Selecione a cidade",
      region: "Selecione a região",
      leader: "Selecione um líder para a igreja",
      contact_name: "Digite o nome do contato",
      contact_email: "Digite o endereço de e-mail",
      contact_phone: "Digite o número de telefone",
      contact_city: "Digite a cidade"
    },
    
    // Labels
    labels: {
      church: "Igreja",
      contact: "Contato"
    },
    
    // Sections
    sections: {
      basic_info: "Informações Básicas",
      contact_info: "Informações de Contato"
    },
    
    // Buttons
    buttons: {
      previous: "Anterior",
      next: "Próximo",
      skip_for_now: "Pular por agora",
      create_church: "Criar Igreja",
      update_church: "Atualizar Igreja",
      creating: "Criando...",
      updating: "Atualizando...",
      clear: "Limpar"
    },
    
    // Regions
    regions: {
      north: "Norte",
      east: "Leste",
      west: "Oeste",
      south: "Sul"
    },
    
    // Province Selector
    province_selector: {
      search_placeholder: "Pesquisar província...",
      no_province_found: "Nenhuma província encontrada.",
      cities: "cidades"
    },
    
    // Validation
    validation: {
      name_required: "Nome da igreja é obrigatório",
      name_min_length: "Nome da igreja deve ter pelo menos 2 caracteres",
      province_required: "Província é obrigatória",
      region_required: "Região é obrigatória",
      type_required: "Tipo de igreja é obrigatório",
      country_required: "País é obrigatório",
      leader_required: "Líder da igreja é obrigatório",
      email_invalid: "Digite um endereço de e-mail válido",
      please_fix_errors: "Corrija os erros antes de continuar"
    },
    
    // Toasts
    toasts: {
      creating: "Criando igreja...",
      created: "Igreja criada com sucesso",
      create_failed: "Falha ao criar igreja",
      updating: "Atualizando igreja...",
      updated: "Igreja atualizada com sucesso",
      update_failed: "Falha ao atualizar igreja",
      deactivating: "Desativando igreja...",
      deactivated: "Igreja desativada com sucesso",
      deactivate_failed: "Falha ao desativar igreja"
    },
    
    // Stats
    stats: {
      members: "Membros",
      departments: "Departamentos",
      projects: "Projetos",
      activities: "Atividades",
      budget: "Orçamento",
      events: "Eventos"
    },

    // Page-level translations
    page: {
      title: "Igrejas",
      description: "Gerencie todas as igrejas em sua instituição",
      select_year: "Selecionar Ano",
      totalChurches: "Total de Igrejas",
      totalMembers: "Total de Membros",
      departments: "Departamentos",
      totalProjects: "Total de Projetos",
      active_churches: "Igrejas ativas",
      total_members: "Total de membros",
      active_departments: "Departamentos ativos",
      active_projects: "Projetos ativos",
      vs_last_month: "vs mês anterior"
    },

    // Table columns
    table: {
      name: "Nome",
      province: "Província",
      city: "Cidade",
      region: "Região",
      contact: "Contato",
      type: "Tipo",
      status: "Status",
      members: "Membros",
      departments: "Departamentos",
      action: "Ação",
      actions: "Ações",
      orphaned: "Órfão",
      orphaned_label: "Órfão (Sem Região)",
      no_region: "Sem Região",
      no_email: "Sem email",
      no_roles: "Sem funções",
      no_description: "Sem descrição",
      avatar: "Avatar",
      language: "Idioma",
      roles: "Funções",
      gender: "Gênero",
      projects: "Projetos",
      department_name: "Nome do Departamento",
      church_members: "Membros da Igreja",
      church_departments: "Departamentos da Igreja"
    },

    // Messages
    messages: {
      loading: "Carregando igrejas...",
      empty: "Nenhuma igreja encontrada",
      error_loading: "Erro ao carregar igrejas",
      refresh_success: "Igrejas atualizadas com sucesso",
      refresh_failed: "Falha ao atualizar igrejas",
      view_details: "Ver Detalhes",
      edit_church: "Editar Igreja",
      delete_church: "Deletar Igreja",
      deactivate_church: "Desativar Igreja"
    },

    // Filters
    filters: {
      filters: "Filtros",
      selectRegion: "Selecione região",
      allRegions: "Todas as Regiões",
      selectType: "Selecione tipo",
      allTypes: "Todos os Tipos",
      allStatus: "Todos os Status",
      filtersCleared: "Filtros limpos",
      addYear: "Adicionar Ano",
      yearAdded: "Ano {{year}} adicionado",
      yearExists: "Ano {{year}} já existe",
      cannotAddBeyond: "Não é possível adicionar ano além de {{year}}",
      searchPlaceholder: "Pesquisar igrejas..."
    },

    // Charts
    charts: {
      projects: "Projetos",
      projectsOverTime: {
        title: "Projetos Criados ao Longo do Tempo",
        description: "Linha do tempo de criação de projetos por igrejas"
      },
      membersByChurch: {
        title: "Membros por Igreja ao Longo do Tempo",
        description: "Novos membros por mês",
        filters: {
          all: "Todos",
          q1: "T1",
          q2: "T2",
          q3: "T3",
          q4: "T4"
        },
        footer: {
          newMembers: "novos membros",
          top: "Top",
          members: "membros",
          yearView: "Visão anual",
          churches: "igrejas"
        },
        loading: {
          title: "Carregando...",
          description: "Buscando dados de registro de membros"
        },
        noData: {
          title: "Nenhum Dado de Membros Disponível",
          description: "Os dados de registro de membros aparecerão aqui assim que os membros se juntarem às igrejas no período selecionado.",
          icon: "Nenhum membro registrado ainda"
        }
      },
      projectsByChurch: {
        title: "Projetos por Igreja",
        titleDepartments: "Projetos por Departamento",
        description: "Qual igreja tem mais projetos ativos",
        descriptionDepartments: "Qual departamento tem mais projetos ativos",
        selectChurch: "Selecione uma igreja",
        selectDepartment: "Selecione um departamento",
        selectPlaceholder: "Selecionar igreja",
        selectPlaceholderDept: "Selecionar departamento",
        allChurches: "Todas as Igrejas",
        allDepartments: "Todos os Departamentos",
        loading: {
          title: "Carregando...",
          description: "Buscando dados de distribuição de projetos"
        },
        noData: {
          title: "Nenhum Dado de Projeto Disponível",
          description: "Os projetos aparecerão aqui assim que forem criados nas igrejas.",
          icon: "Nenhum projeto criado ainda"
        },
        footer: {
          totalProjects: "Total de Projetos",
          selected: "Selecionado:",
          projects: "projetos",
          status: "Status:",
          active: "ativos",
          completed: "concluídos"
        },
        chart: {
          projects: "Projetos",
          activeLabel: "ativos"
        }
      },
      timeRanges: {
        last7Days: "Últimos 7 dias",
        last30Days: "Últimos 30 dias",
        last3Months: "Últimos 3 meses",
        last6Months: "Últimos 6 meses",
        last12Months: "Últimos 12 meses"
      },
      noData: {
        title: "Nenhum Dado de Projeto Disponível",
        description: "Os projetos aparecerão aqui assim que forem criados no período selecionado."
      }
    }
  }
}
