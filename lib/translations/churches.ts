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
          project_impact_desc: "All ongoing projects will be suspended and archived"
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
          project_impact_desc: "Alle lopende projecten worden opgeschort en gearchiveerd"
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
    }
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
          project_impact_desc: "Todos os projetos em andamento serão suspensos e arquivados"
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
    }
  }
}
