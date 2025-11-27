export const departmentTranslations = {
  en: {
    // Page Header
    institution_department: "Institution Department",
    
    // Modal Titles
    modals: {
      create: {
        title: "Create Department",
        description: "Add a new department to your organization",
        title_institutional: "Create Institutional Department",
        description_institutional: "Create a department that operates at the institution level, managing resources and activities across all churches."
      },
      edit: {
        title: "Edit Department", 
        description: "Update department information and contact details",
        title_institutional: "Edit Institutional Department",
        description_institutional: "Update institutional department information and contact details"
      },
      delete: {
        deactivate_title: "Deactivate Department",
        deactivate_description: "This action will deactivate the department and all related data. Data is preserved and can be recovered.",
        deactivating: "Deactivating...",
        deactivate_department: "Deactivate Department",
        view_consequences: "View Consequences",
        affected_components: "Affected Data",
        affected_data: {
          projects: "Projects",
          volunteers: "Volunteers",
          budgets: "Budgets",
          documents: "Documents"
        },
        understand_consequences: "I understand the consequences",
        acknowledge_text: "I acknowledge that this action will deactivate the department and all related data",
        type_confirmation: "Type the confirmation text to proceed",
        confirmation_placeholder: 'Type: "delete department"',
        confirmation_text: 'delete department',
        confirmation_help: "This action cannot be easily undone without administrator intervention",
        consequences: {
          projects_deleted: "Projects & Activities Deleted",
          projects_deleted_desc: "All projects, activities, and related data will be marked as deleted",
          users_unlinked: "Users Unlinked from Department",
          users_unlinked_desc: "Department users will be removed from this department but remain in the institution",
          data_preservation: "Data Preservation & Recovery",
          data_preservation_desc: "All data remains in the database and can be recovered by administrators",
          budget_deleted: "Budget & Financial Data Deleted",
          budget_deleted_desc: "All budgets, subsidy requests, and financial records will be marked as deleted"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Step",
      of: "of",
      step_1_title: "Basic Information",
      step_1_description: "Enter department name and description",
      step_2_title: "Contact Information",
      step_2_description: "Add contact details for this department (optional)",
      step_3_title: "Review & Confirm",
      step_3_description: "Review the information before creating the department"
    },
    
    // Fields
    fields: {
      name: "Department Name",
      church: "Church", 
      description: "Description",
      annual_budget: "Annual Budget",
      contact_name: "Contact Name",
      contact_email: "Contact Email",
      contact_phone: "Phone",
      city: "City",
      is_institution_department: "Institutional Department",
      search_church: "Search church...",
      no_church_found: "No church found."
    },
    
    // Placeholders
    placeholders: {
      name: "Enter department name",
      church: "Select church",
      description: "Describe the department purpose and activities", 
      annual_budget: "Enter annual budget",
      contact_name: "Enter contact name",
      contact_email: "contact@example.com",
      contact_phone: "+31 123 456 789",
      city: "Enter city"
    },
    
    // Department Type
    department_type: {
      institutional_tooltip: "Department directly related to the institution",
      institutional_explanation_on: "Department is directly linked to the institution, not to a specific church",
      institutional_explanation_off: "Department must be linked to a specific church"
    },
    
    // Labels
    labels: {
      department: "Department",
      contact: "Contact",
      type: "Type",
      institutional: "Institutional",
      church_dept: "Church Department",
      name: "Name",
      description: "Description",
      church: "Church",
      email: "Email",
      phone: "Phone"
    },
    
    // Sections
    sections: {
      basic_info: "Basic Information",
      contact_info: "Contact Information",
      review: "Review & Confirm"
    },
    
    // Buttons
    buttons: {
      previous: "Back",
      next: "Continue",
      skip: "Skip for now",
      cancel: "Cancel",
      save: "Save",
      create: "Create Department",
      update: "Update Department",
      delete: "Delete Department",
      creating: "Creating...",
      updating: "Updating...",
      deleting: "Deleting..."
    },
    
    // Actions (Dropdown Menu)
    actions: {
      view_details: "View Details",
      edit_department: "Edit Department",
      manage_budget: "Manage Budget",
      delete_department: "Delete Department"
    },
    
    // Validation
    validation: {
      name_required: "Department name is required",
      name_min_length: "Department name must be at least 2 characters",
      church_required: "Church is required for church departments",
      description_required: "Description is required",
      description_min_length: "Description must be at least 10 characters",
      contact_name_required: "Contact name is required",
      email_required: "Email is required",
      email_invalid: "Please enter a valid email address",
      phone_required: "Phone number is required", 
      city_required: "City is required",
      please_fix_errors: "Please fix the errors before continuing"
    },
    
    // Toasts
    toasts: {
      creating: "Creating department...",
      created: "Department created successfully",
      create_failed: "Failed to create department",
      updating: "Updating department...",
      updated: "Department updated successfully",
      update_failed: "Failed to update department",
      deleting: "Deactivating department...",
      deleted: "Department deactivated successfully",
      delete_failed: "Failed to deactivate department"
    },
    
    // Stats
    stats: {
      church: "Church",
      volunteers: "Volunteers",
      budgets: "Budgets",
      projects: "Projects",
      documents: "Documents",
      members: "Members"
    },
    
    // KPI Cards
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
    
    // Charts
    charts: {
      activity_overview: {
        title: "Department Activity Overview",
        description: "Activity metrics based on real budget allocation and active users data",
        time_periods: {
          last_12_months: "Last 12 months",
          last_6_months: "Last 6 months",
          last_3_months: "Last 3 months"
        },
        categories: {
          finance: "Finance",
          education: "Education",  
          youth: "Youth",
          missions: "Missions"
        }
      }
    },
    
    // Detail View
    detail: {
      info_card: {
        header_title: "Department Info",
        no_description: "No description available",
        institutional: "Institutional",
        active: "Active",
        inactive: "Inactive"
      },
      members_table: {
        title: "Department Members",
        description: "List of all members in {{name}}"
      },
      title_suffix: "Details",
      no_description: "Department details and members"
    },

    // Page
    page: {
      title: "Institutional Departments",
      description: "Manage departments across your institution"
    },

    // Church Pages (alternative titles for church-departments)
    church_page: {
      title: "Church Departments",
      description: "Manage church-level departments and ministries",
      actions: "Actions",
      breadcrumb_all: "See All Church Departments",
      members_table: "Department Members",
      members_table_description: "List of all members in this department",
      departments_table: "Church Departments",
      departments_table_description: "Complete list of church departments with management actions",
      header_description: "Manage church-level departments and ministries",
      create_button: "Create Church Department",
      kpi_cards: {
        total_departments: "Church Departments",
        total_departments_subtitle: "Total church departments",
        total_churches: "Total Churches",
        total_churches_subtitle: "Churches with departments",
        total_projects: "Total Projects",
        total_projects_subtitle: "All registered projects",
        open_projects: "Open Projects",
        open_projects_subtitle: "Projects in progress",
        completed_projects: "Completed Projects",
        completed_projects_subtitle: "Successfully completed",
        members: "Members",
        members_subtitle: "Department members"
      },
      detail_view: {
        info_card_title: "Department Info",
        edit_action: "Edit Department",
        manage_budget_action: "Manage Budget",
        delete_action: "Delete Department"
      }
    },

    // Page-level strings
    title: "Details",
    subtitle: "Manage departments across institutions", 
    entity_name: "Church Departments",
    table_title: "Church Departments",
    table_description: "Complete list of church departments with management actions",
    breadcrumb: {
      all_departments: "See All Church Departments"
    },
    create_department: "Create Church Department",
    messages: {
      created_success: "Department created successfully",
      updated_success: "Department updated successfully",
      deleted_success: "Department deleted successfully"
    },
    filters: {
      institutional: "Institutional"
    },

    // Common translations (from other namespaces for convenience)
    common: {
      loading: "Loading...",
      data_loaded: "Data loaded successfully",
      data_refreshed: "Data refreshed",
      refreshing: "Refreshing...",
      error_refreshing: "Error refreshing",
      error: "An error occurred",
      name: "Name",
      members: "Members",
      status: "Status",
      active: "Active",
      inactive: "Inactive",
      actions: "Actions",
      annual_budget: "Annual Budget",
      trend: {
        vs_previous_month: "vs. previous month",
        vs_previous_year: "vs. previous year"
      }
    },

    // Annual Budget translations
    annual_budget: {
      messages: {
        updated_success: "Budget updated successfully"
      },
      table: {
        headers: {
          budget_total: "Budget Total",
          spent_amount: "Spent Amount",
          usage_percentage: "Usage %"
        },
        budget_status_labels: {
          completed: "Budget Set",
          missing: "No Budget"
        }
      }
    },

    // Users translations
    users: {
      table: {
        avatar: "Avatar",
        name: "Name",
        language: "Language",
        roles: "Roles",
        no_roles: "No roles",
        gender: "Gender",
        status: "Status",
        active: "Active",
        inactive: "Inactive"
      },
      gender: {
        male: "Male",
        female: "Female",
        other: "Other"
      }
    },

    // Churches translations
    churches: {
      church: "Church"
    },

    // Institutions translations
    institutions: {
      table: {
        budget_status: "Budget Status"
      }
    }
  },
  
  nl: {
    // Page Header
    institution_department: "Instituut Afdeling",
    
    // Modal Titles
    modals: {
      create: {
        title: "Afdeling Aanmaken",
        description: "Voeg een nieuwe afdeling toe aan uw organisatie",
        title_institutional: "Institutionele Afdeling Aanmaken",
        description_institutional: "Maak een afdeling die op instellingsniveau werkt, resources en activiteiten beherende over alle kerken."
      },
      edit: {
        title: "Afdeling Bewerken",
        description: "Bijwerken van afdeling informatie en contactgegevens",
        title_institutional: "Institutionele Afdeling Bewerken",
        description_institutional: "Bijwerken van institutionele afdeling informatie en contactgegevens"
      },
      delete: {
        deactivate_title: "Afdeling Deactiveren",
        deactivate_description: "Deze actie zal de afdeling en alle gerelateerde gegevens deactiveren. Gegevens blijven bewaard en kunnen worden hersteld.",
        deactivating: "Deactiveren...",
        deactivate_department: "Afdeling Deactiveren",
        view_consequences: "Gevolgen Bekijken",
        affected_components: "Beïnvloede Gegevens",
        affected_data: {
          projects: "Projecten",
          volunteers: "Vrijwilligers",
          budgets: "Budgetten",
          documents: "Documenten"
        },
        understand_consequences: "Ik begrijp de gevolgen",
        acknowledge_text: "Ik erken dat deze actie de afdeling en alle gerelateerde gegevens zal deactiveren",
        type_confirmation: "Typ de bevestigingstekst om door te gaan",
        confirmation_placeholder: 'Typ: "delete department"',
        confirmation_text: 'delete department',
        confirmation_help: "Deze actie kan niet gemakkelijk ongedaan worden gemaakt zonder tussenkomst van administrator",
        consequences: {
          projects_deleted: "Projecten & Activiteiten Verwijderd",
          projects_deleted_desc: "Alle projecten, activiteiten en gerelateerde gegevens worden gemarkeerd als verwijderd",
          users_unlinked: "Gebruikers Ontkoppeld van Afdeling",
          users_unlinked_desc: "Gebruikers van de afdeling worden uit deze afdeling verwijderd maar blijven in de instelling",
          data_preservation: "Gegevensbewaring & Herstel",
          data_preservation_desc: "Alle gegevens blijven in de database en kunnen door beheerders worden hersteld",
          budget_deleted: "Budget- & Financiële Gegevens Verwijderd",
          budget_deleted_desc: "Alle budgetten, subsidieverzoeken en financiële verslagen worden gemarkeerd als verwijderd"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Stap",
      of: "van",
      step_1_title: "Basis Informatie",
      step_1_description: "Voer afdeling naam en beschrijving in",
      step_2_title: "Contact Informatie",
      step_2_description: "Voeg contactgegevens toe voor deze afdeling (optioneel)",
      step_3_title: "Controleren & Bevestigen",
      step_3_description: "Controleer de informatie voordat u de afdeling aanmaakt"
    },
    
    // Fields
    fields: {
      name: "Afdeling Naam",
      church: "Kerk",
      description: "Beschrijving",
      annual_budget: "Jaarlijks Budget",
      contact_name: "Contactnaam",
      contact_email: "Contact E-mail",
      contact_phone: "Telefoon",
      city: "Stad",
      is_institution_department: "Institutionele Afdeling",
      search_church: "Zoek kerk...",
      no_church_found: "Geen kerk gevonden."
    },

    // Department Type
    department_type: {
      institutional_tooltip: "Afdeling direct gerelateerd aan de instelling",
      institutional_explanation_on: "Afdeling is direct gekoppeld aan de instelling, niet aan een specifieke kerk",
      institutional_explanation_off: "Afdeling moet gekoppeld worden aan een specifieke kerk"
    },
    
    // Placeholders
    placeholders: {
      name: "Voer afdeling naam in",
      church: "Selecteer kerk",
      description: "Beschrijf het doel en de activiteiten van de afdeling",
      annual_budget: "Voer jaarlijks budget in",
      contact_name: "Voer contactnaam in",
      contact_email: "contact@example.com",
      contact_phone: "+31 123 456 789",
      city: "Voer stad in"
    },
    
    // Labels
    labels: {
      department: "Afdeling",
      contact: "Contact",
      type: "Type",
      institutional: "Institutioneel",
      church_dept: "Kerkafdeling",
      name: "Naam",
      description: "Beschrijving",
      church: "Kerk",
      email: "E-mail",
      phone: "Telefoon"
    },
    
    // Sections
    sections: {
      basic_info: "Basis Informatie",
      contact_info: "Contact Informatie",
      review: "Controleren & Bevestigen"
    },
    
    // Buttons
    buttons: {
      previous: "Terug",
      next: "Doorgaan",
      skip: "Voorlopig overslaan",
      cancel: "Annuleren",
      save: "Opslaan",
      create: "Afdeling Aanmaken",
      update: "Afdeling Bijwerken",
      delete: "Afdeling Verwijderen",
      creating: "Aanmaken...",
      updating: "Bijwerken...",
      deleting: "Verwijderen..."
    },
    
    // Actions (Dropdown Menu)
    actions: {
      view_details: "Details Bekijken",
      edit_department: "Afdeling Bewerken",
      manage_budget: "Budget Beheren",
      delete_department: "Afdeling Verwijderen"
    },
    
    // Validation
    validation: {
      name_required: "Afdeling naam is verplicht",
      name_min_length: "Afdeling naam moet minimaal 2 karakters zijn",
      church_required: "Kerk is verplicht voor kerkafdeling",
      description_required: "Beschrijving is verplicht",
      description_min_length: "Beschrijving moet minimaal 10 karakters zijn",
      contact_name_required: "Contactnaam is verplicht",
      email_required: "E-mail is verplicht",
      email_invalid: "Voer een geldig e-mailadres in",
      phone_required: "Telefoonnummer is verplicht",
      city_required: "Stad is verplicht",
      please_fix_errors: "Corrigeer de fouten voordat je doorgaat"
    },
    
    // Toasts
    toasts: {
      creating: "Afdeling aanmaken...",
      created: "Afdeling succesvol aangemaakt",
      create_failed: "Kon afdeling niet aanmaken",
      updating: "Afdeling bijwerken...",
      updated: "Afdeling succesvol bijgewerkt",
      update_failed: "Kon afdeling niet bijwerken",
      deleting: "Afdeling deactiveren...",
      deleted: "Afdeling succesvol gedeactiveerd",
      delete_failed: "Kon afdeling niet deactiveren"
    },
    
    // Stats
    stats: {
      church: "Kerk",
      volunteers: "Vrijwilligers",
      budgets: "Budgetten",
      projects: "Projecten",
      documents: "Documenten",
      members: "Leden"
    },
    
    // KPI Cards
    kpi: {
      budget_total: {
        title: "Budget Totaal",
        subtitle: "Totaal geplande budget"
      },
      spent_amount: {
        title: "Uitgegeven Bedrag",
        subtitle: "Totale uitgaven"
      },
      members: {
        title: "Leden",
        subtitle: "Afdeling leden"
      }
    },
    
    // Charts
    charts: {
      activity_overview: {
        title: "Afdeling Activiteiten Overzicht",
        description: "Activiteitsmetrieken gebaseerd op echte budgettoewijzing en actieve gebruikersgegevens",
        time_periods: {
          last_12_months: "Afgelopen 12 maanden",
          last_6_months: "Afgelopen 6 maanden",
          last_3_months: "Afgelopen 3 maanden"
        },
        categories: {
          finance: "Financiën",
          education: "Onderwijs",  
          youth: "Jeugd",
          missions: "Missies"
        }
      }
    },
    
    // Detail View
    detail: {
      info_card: {
        header_title: "Afdeling Info",
        no_description: "Geen beschrijving beschikbaar",
        institutional: "Institutioneel",
        active: "Actief",
        inactive: "Inactief"
      },
      members_table: {
        title: "Afdeling Leden",
        description: "Lijst van alle leden in {{name}}"
      },
      title_suffix: "Details",
      no_description: "Afdeling details en leden"
    },

    // Page
    page: {
      title: "Institutionele Afdelingen",
      description: "Beheer afdelingen in uw instelling"
    },

    // Church Pages (alternative titles for church-departments)
    church_page: {
      title: "Kerkafdelingen",
      description: "Beheer afdelingen op kerkniveau",
      actions: "Acties",
      breadcrumb_all: "Alle Kerkafdelingen Zien",
      members_table: "Afdeling Leden",
      members_table_description: "Lijst van alle leden in deze afdeling",
      departments_table: "Kerkafdelingen",
      departments_table_description: "Volledige lijst van kerkafdelingen met beheersacties",
      header_description: "Beheer afdelingen en diensten op kerkniveau",
      create_button: "Kerkafdeling Aanmaken",
      kpi_cards: {
        total_departments: "Kerkafdelingen",
        total_departments_subtitle: "Totaal kerkafdelingen",
        total_churches: "Totaal Kerken",
        total_churches_subtitle: "Kerken met afdelingen",
        total_projects: "Totaal Projecten",
        total_projects_subtitle: "Alle geregistreerde projecten",
        open_projects: "Open Projecten",
        open_projects_subtitle: "Projecten in uitvoering",
        completed_projects: "Voltooide Projecten",
        completed_projects_subtitle: "Succesvol voltooid",
        members: "Leden",
        members_subtitle: "Afdeling leden"
      },
      detail_view: {
        info_card_title: "Afdeling Info",
        edit_action: "Afdeling Bewerken",
        manage_budget_action: "Budget Beheren",
        delete_action: "Afdeling Verwijderen"
      }
    },

    // Page-level strings
    title: "Details",
    subtitle: "Beheer afdelingen in uw instelling",
    entity_name: "Kerkafdelingen",
    table_title: "Kerkafdelingen",
    table_description: "Volledige lijst van kerkafdelingen met beheersacties",
    breadcrumb: {
      all_departments: "Alle Kerkafdelingen Zien"
    },
    create_department: "Kerkafdeling Aanmaken",
    messages: {
      created_success: "Afdeling succesvol aangemaakt",
      updated_success: "Afdeling succesvol bijgewerkt",
      deleted_success: "Afdeling succesvol gedeactiveerd"
    },
    filters: {
      institutional: "Institutioneel"
    },

    // Common translations (from other namespaces for convenience)
    common: {
      loading: "Laden...",
      data_loaded: "Gegevens succesvol geladen",
      data_refreshed: "Gegevens vernieuwd",
      refreshing: "Verversen...",
      error_refreshing: "Fout bij verversen",
      error: "Er is een fout opgetreden",
      name: "Naam",
      members: "Leden",
      status: "Status",
      active: "Actief",
      inactive: "Inactief",
      actions: "Acties",
      annual_budget: "Jaarlijks Budget",
      trend: {
        vs_previous_month: "vs. vorige maand",
        vs_previous_year: "vs. vorig jaar"
      }
    },

    // Annual Budget translations
    annual_budget: {
      messages: {
        updated_success: "Budget succesvol bijgewerkt"
      },
      table: {
        headers: {
          budget_total: "Budget Totaal",
          spent_amount: "Uitgegeven Bedrag",
          usage_percentage: "Gebruik %"
        },
        budget_status_labels: {
          completed: "Budget Ingesteld",
          missing: "Geen Budget"
        }
      }
    },

    // Users translations
    users: {
      table: {
        avatar: "Avatar",
        name: "Naam",
        language: "Taal",
        roles: "Rollen",
        no_roles: "Geen rollen",
        gender: "Geslacht",
        status: "Status",
        active: "Actief",
        inactive: "Inactief"
      },
      gender: {
        male: "Man",
        female: "Vrouw",
        other: "Anders"
      }
    },

    // Churches translations
    churches: {
      church: "Kerk"
    },

    // Institutions translations
    institutions: {
      table: {
        budget_status: "Budget Status"
      }
    }
  },
  
  pt: {
    // Page Header
    institution_department: "Departamento Institucional",
    
    // Modal Titles
    modals: {
      create: {
        title: "Criar Departamento",
        description: "Adicione um novo departamento à sua organização",
        title_institutional: "Criar Departamento Institucional",
        description_institutional: "Crie um departamento que opera no nível da instituição, gerenciando recursos e atividades em todas as igrejas."
      },
      edit: {
        title: "Editar Departamento",
        description: "Atualize informações do departamento e dados de contato",
        title_institutional: "Editar Departamento Institucional",
        description_institutional: "Atualize informações do departamento institucional e dados de contato"
      },
      delete: {
        deactivate_title: "Desativar Departamento",
        deactivate_description: "Esta ação irá desativar o departamento e todos os dados relacionados. Os dados serão preservados e podem ser recuperados.",
        deactivating: "Desativando...",
        deactivate_department: "Desativar Departamento",
        view_consequences: "Ver Consequências",
        affected_components: "Dados Afetados",
        affected_data: {
          projects: "Projetos",
          volunteers: "Voluntários",
          budgets: "Orçamentos",
          documents: "Documentos"
        },
        understand_consequences: "Compreendo as consequências",
        acknowledge_text: "Reconheço que esta ação desativará o departamento e todos os dados relacionados",
        type_confirmation: "Digite o texto de confirmação para continuar",
        confirmation_placeholder: 'Digite: "delete department"',
        confirmation_text: 'delete department',
        confirmation_help: "Esta ação não pode ser facilmente desfeita sem intervenção do administrador",
        consequences: {
          projects_deleted: "Projetos & Atividades Deletadas",
          projects_deleted_desc: "Todos os projetos, atividades e dados relacionados serão marcados como deletados",
          users_unlinked: "Usuários Desvinculados do Departamento",
          users_unlinked_desc: "Os usuários do departamento serão removidos deste departamento mas permanecerão na instituição",
          data_preservation: "Preservação & Recuperação de Dados",
          data_preservation_desc: "Todos os dados permanecem no banco de dados e podem ser recuperados por administradores",
          budget_deleted: "Orçamento & Dados Financeiros Deletados",
          budget_deleted_desc: "Todos os orçamentos, solicitações de subsídio e registros financeiros serão marcados como deletados"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Passo",
      of: "de",
      step_1_title: "Informações Básicas",
      step_1_description: "Digite o nome e descrição do departamento",
      step_2_title: "Informações de Contato",
      step_2_description: "Adicione dados de contato para este departamento (opcional)",
      step_3_title: "Revisar & Confirmar",
      step_3_description: "Revise as informações antes de criar o departamento"
    },
    
    // Fields
    fields: {
      name: "Nome do Departamento",
      church: "Igreja",
      description: "Descrição", 
      annual_budget: "Orçamento Anual",
      contact_name: "Nome do Contato",
      contact_email: "E-mail de Contato",
      contact_phone: "Telefone",
      city: "Cidade",
      is_institution_department: "Departamento Institucional",
      search_church: "Buscar igreja...",
      no_church_found: "Nenhuma igreja encontrada."
    },
    
    // Department Type
    department_type: {
      institutional_tooltip: "Departamento diretamente relacionado à instituição",
      institutional_explanation_on: "Departamento vinculado diretamente à instituição, não a uma igreja específica",
      institutional_explanation_off: "Departamento deve ser vinculado a uma igreja específica"
    },
    
    // Placeholders
    placeholders: {
      name: "Digite o nome do departamento",
      church: "Selecione a igreja",
      description: "Descreva o propósito e atividades do departamento",
      annual_budget: "Digite o orçamento anual",
      contact_name: "Digite o nome do contato",
      contact_email: "contato@example.com",
      contact_phone: "+55 11 9999-9999",
      city: "Digite a cidade"
    },
    
    // Labels
    labels: {
      department: "Departamento",
      contact: "Contato",
      type: "Tipo",
      institutional: "Institucional",
      church_dept: "Departamento da Igreja",
      name: "Nome",
      description: "Descrição",
      church: "Igreja",
      email: "E-mail",
      phone: "Telefone"
    },
    
    // Sections
    sections: {
      basic_info: "Informações Básicas",
      contact_info: "Informações de Contato",
      review: "Revisar & Confirmar"
    },
    
    // Buttons
    buttons: {
      previous: "Voltar",
      next: "Continuar",
      skip: "Pular por enquanto",
      cancel: "Cancelar",
      save: "Salvar",
      create: "Criar Departamento",
      update: "Atualizar Departamento",
      delete: "Deletar Departamento",
      creating: "Criando...",
      updating: "Atualizando...",
      deleting: "Deletando..."
    },
    
    // Actions (Dropdown Menu)
    actions: {
      view_details: "Ver Detalhes",
      edit_department: "Editar Departamento",
      manage_budget: "Gerenciar Orçamento",
      delete_department: "Deletar Departamento"
    },
    
    // Validation
    validation: {
      name_required: "Nome do departamento é obrigatório",
      name_min_length: "Nome do departamento deve ter no mínimo 2 caracteres",
      church_required: "Igreja é obrigatória para departamento de igreja",
      description_required: "Descrição é obrigatória",
      description_min_length: "Descrição deve ter no mínimo 10 caracteres",
      contact_name_required: "Nome do contato é obrigatório",
      email_required: "E-mail é obrigatório",
      email_invalid: "Digite um endereço de e-mail válido",
      phone_required: "Número de telefone é obrigatório",
      city_required: "Cidade é obrigatória",
      please_fix_errors: "Corrija os erros antes de continuar"
    },
    
    // Toasts
    toasts: {
      creating: "Criando departamento...",
      created: "Departamento criado com sucesso",
      create_failed: "Não foi possível criar o departamento",
      updating: "Atualizando departamento...",
      updated: "Departamento atualizado com sucesso",
      update_failed: "Não foi possível atualizar o departamento",
      deleting: "Deletando departamento...",
      deleted: "Departamento deletado com sucesso",
      delete_failed: "Não foi possível deletar o departamento"
    },
    
    // Stats
    stats: {
      church: "Igreja",
      volunteers: "Voluntários",
      budgets: "Orçamentos",
      projects: "Projetos",
      documents: "Documentos",
      members: "Membros"
    },
    
    // KPI Cards
    kpi: {
      budget_total: {
        title: "Orçamento Total",
        subtitle: "Orçamento total planejado"
      },
      spent_amount: {
        title: "Valor Gasto",
        subtitle: "Total de despesas"
      },
      members: {
        title: "Membros",
        subtitle: "Membros do departamento"
      }
    },
    
    // Charts
    charts: {
      activity_overview: {
        title: "Visão Geral de Atividades do Departamento",
        description: "Métricas de atividade baseadas em dados reais de alocação de orçamento e usuários ativos",
        time_periods: {
          last_12_months: "Últimos 12 meses",
          last_6_months: "Últimos 6 meses",
          last_3_months: "Últimos 3 meses"
        },
        categories: {
          finance: "Finanças",
          education: "Educação",  
          youth: "Juventude",
          missions: "Missões"
        }
      }
    },
    
    // Detail View
    detail: {
      info_card: {
        header_title: "Informações do Departamento",
        no_description: "Sem descrição disponível",
        institutional: "Institucional",
        active: "Ativo",
        inactive: "Inativo"
      },
      members_table: {
        title: "Membros do Departamento",
        description: "Lista de todos os membros em {{name}}"
      },
      title_suffix: "Detalhes",
      no_description: "Detalhes do departamento e membros"
    },

    // Page
    page: {
      title: "Departamentos Institucionais",
      description: "Gerencie departamentos em sua instituição"
    },

    // Church Pages (alternative titles for church-departments)
    church_page: {
      title: "Departamentos da Igreja",
      description: "Gerencie departamentos do nível da igreja",
      actions: "Ações",
      breadcrumb_all: "Ver Todos os Departamentos da Igreja",
      members_table: "Membros do Departamento",
      members_table_description: "Lista de todos os membros deste departamento",
      departments_table: "Departamentos da Igreja",
      departments_table_description: "Lista completa de departamentos da igreja com ações de gerenciamento",
      header_description: "Gerencie departamentos e ministérios do nível da igreja",
      create_button: "Criar Departamento da Igreja",
      kpi_cards: {
        total_departments: "Departamentos da Igreja",
        total_departments_subtitle: "Total de departamentos da igreja",
        total_churches: "Total de Igrejas",
        total_churches_subtitle: "Igrejas com departamentos",
        total_projects: "Total de Projetos",
        total_projects_subtitle: "Todos os projetos registrados",
        open_projects: "Projetos Abertos",
        open_projects_subtitle: "Projetos em progresso",
        completed_projects: "Projetos Concluídos",
        completed_projects_subtitle: "Concluídos com sucesso",
        members: "Membros",
        members_subtitle: "Membros do departamento"
      },
      detail_view: {
        info_card_title: "Informações do Departamento",
        edit_action: "Editar Departamento",
        manage_budget_action: "Gerenciar Orçamento",
        delete_action: "Deletar Departamento"
      }
    },

    // Page-level strings
    title: "Detalhes",
    subtitle: "Gerencie departamentos em sua instituição",
    entity_name: "Departamentos da Igreja",
    table_title: "Departamentos da Igreja",
    table_description: "Lista completa de departamentos da igreja com ações de gerenciamento",
    breadcrumb: {
      all_departments: "Ver Todos os Departamentos da Igreja"
    },
    create_department: "Criar Departamento da Igreja",
    messages: {
      created_success: "Departamento criado com sucesso",
      updated_success: "Departamento atualizado com sucesso",
      deleted_success: "Departamento deletado com sucesso"
    },
    filters: {
      institutional: "Institucional"
    },

    // Common translations (from other namespaces for convenience)
    common: {
      loading: "Carregando...",
      data_loaded: "Dados carregados com sucesso",
      data_refreshed: "Dados atualizados",
      refreshing: "Atualizando...",
      error_refreshing: "Erro ao atualizar",
      error: "Ocorreu um erro",
      name: "Nome",
      members: "Membros",
      status: "Status",
      active: "Ativo",
      inactive: "Inativo",
      actions: "Ações",
      annual_budget: "Orçamento Anual",
      trend: {
        vs_previous_month: "vs. mês anterior",
        vs_previous_year: "vs. ano anterior"
      }
    },

    // Annual Budget translations
    annual_budget: {
      messages: {
        updated_success: "Orçamento atualizado com sucesso"
      },
      table: {
        headers: {
          budget_total: "Orçamento Total",
          spent_amount: "Valor Gasto",
          usage_percentage: "Uso %"
        },
        budget_status_labels: {
          completed: "Orçamento Definido",
          missing: "Sem Orçamento"
        }
      }
    },

    // Users translations
    users: {
      table: {
        avatar: "Avatar",
        name: "Nome",
        language: "Idioma",
        roles: "Funções",
        no_roles: "Sem funções",
        gender: "Gênero",
        status: "Status",
        active: "Ativo",
        inactive: "Inativo"
      },
      gender: {
        male: "Masculino",
        female: "Feminino",
        other: "Outro"
      }
    },

    // Churches translations
    churches: {
      church: "Igreja"
    },

    // Institutions translations
    institutions: {
      table: {
        budget_status: "Status de Orçamento"
      }
    }
  }
}
