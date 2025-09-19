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
        confirmation_placeholder: "Type 'delete church' here",
        confirmation_help: "This action cannot be undone",
        consequences: {
          member_access: "Member Access",
          member_access_desc: "Members will lose access to this church",
          data_preservation: "Data Preservation",
          data_preservation_desc: "All data will be preserved but marked as inactive",
          department_impact: "Department Impact",
          department_impact_desc: "Departments will be reassigned or deactivated",
          event_impact: "Event Impact",
          event_impact_desc: "Future events will be cancelled"
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
      step_1_description: "Enter the church name and select the region",
      step_2_title: "Contact Details",
      step_2_description: "Add contact information for the church"
    },
    
    // Fields
    fields: {
      name: "Church Name",
      region: "Region",
      contact_name: "Contact Name",
      contact_email: "Contact Email",
      contact_phone: "Phone",
      contact_city: "City"
    },
    
    // Placeholders
    placeholders: {
      name: "Enter church name",
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
      creating: "Creating...",
      updating: "Updating..."
    },
    
    // Validation
    validation: {
      name_required: "Church name is required",
      name_min_length: "Church name must be at least 2 characters",
      region_required: "Region is required",
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
        confirmation_placeholder: "Typ 'delete church' hier",
        confirmation_help: "Deze actie kan niet ongedaan worden gemaakt",
        consequences: {
          member_access: "Lid Toegang",
          member_access_desc: "Leden verliezen toegang tot deze kerk",
          data_preservation: "Gegevens Bewaring",
          data_preservation_desc: "Alle gegevens worden bewaard maar gemarkeerd als inactief",
          department_impact: "Afdeling Impact",
          department_impact_desc: "Afdelingen worden hertoegewezen of gedeactiveerd",
          event_impact: "Evenement Impact",
          event_impact_desc: "Toekomstige evenementen worden geannuleerd"
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
      step_1_description: "Voer de kerknaam in en selecteer de regio",
      step_2_title: "Contactgegevens",
      step_2_description: "Voeg contactinformatie toe voor de kerk"
    },
    
    // Fields
    fields: {
      name: "Kerknaam",
      region: "Regio",
      contact_name: "Contactnaam",
      contact_email: "Contact E-mail",
      contact_phone: "Telefoon",
      contact_city: "Stad"
    },
    
    // Placeholders
    placeholders: {
      name: "Voer kerknaam in",
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
      creating: "Aanmaken...",
      updating: "Bijwerken..."
    },
    
    // Validation
    validation: {
      name_required: "Kerknaam is verplicht",
      name_min_length: "Kerknaam moet minimaal 2 karakters zijn",
      region_required: "Regio is verplicht",
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
        confirmation_placeholder: "Digite 'delete church' aqui",
        confirmation_help: "Esta ação não pode ser desfeita",
        consequences: {
          member_access: "Acesso de Membros",
          member_access_desc: "Membros perderão acesso a esta igreja",
          data_preservation: "Preservação de Dados",
          data_preservation_desc: "Todos os dados serão preservados mas marcados como inativos",
          department_impact: "Impacto nos Departamentos",
          department_impact_desc: "Departamentos serão reatribuídos ou desativados",
          event_impact: "Impacto em Eventos",
          event_impact_desc: "Eventos futuros serão cancelados"
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
      step_1_description: "Digite o nome da igreja e selecione a região",
      step_2_title: "Detalhes de Contato",
      step_2_description: "Adicione informações de contato para a igreja"
    },
    
    // Fields
    fields: {
      name: "Nome da Igreja",
      region: "Região",
      contact_name: "Nome do Contato",
      contact_email: "E-mail de Contato",
      contact_phone: "Telefone",
      contact_city: "Cidade"
    },
    
    // Placeholders
    placeholders: {
      name: "Digite o nome da igreja",
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
      creating: "Criando...",
      updating: "Atualizando..."
    },
    
    // Validation
    validation: {
      name_required: "Nome da igreja é obrigatório",
      name_min_length: "Nome da igreja deve ter pelo menos 2 caracteres",
      region_required: "Região é obrigatória",
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
      budget: "Orçamento",
      events: "Eventos"
    }
  }
}
