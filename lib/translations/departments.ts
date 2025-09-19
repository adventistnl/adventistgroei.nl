export const departmentTranslations = {
  en: {
    // Modal Titles
    modals: {
      create: {
        title: "Create Department",
        description: "Add a new department to your organization"
      },
      edit: {
        title: "Edit Department",
        description: "Update department information and contact details"
      },
      delete: {
        deactivate_title: "Deactivate Department",
        deactivate_description: "This action will deactivate the department and affect related data",
        deactivating: "Deactivating...",
        deactivate_department: "Deactivate Department",
        view_consequences: "View Consequences",
        affected_components: "Affected Components",
        understand_consequences: "I understand the consequences",
        acknowledge_text: "I acknowledge that this action will affect all related data",
        type_confirmation: "Type 'delete department' to confirm",
        confirmation_placeholder: "Type 'delete department' here",
        confirmation_help: "This action cannot be undone",
        consequences: {
          member_access: "Member Access",
          member_access_desc: "Members will lose access to this department",
          data_preservation: "Data Preservation",
          data_preservation_desc: "All data will be preserved but marked as inactive",
          budget_impact: "Budget Impact",
          budget_impact_desc: "Budget will be returned to the church",
          project_impact: "Project Impact",
          project_impact_desc: "Active projects will be reassigned or cancelled"
        },
        soft_delete: {
          title: "Soft Delete",
          description: "The department will be marked as inactive but data will be preserved"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Step",
      of: "of",
      step_1_title: "Basic Information",
      step_1_description: "Enter department details and select the church",
      step_2_title: "Contact Details",
      step_2_description: "Add contact information for the department"
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
      contact_city: "City"
    },
    
    // Placeholders
    placeholders: {
      name: "Enter department name",
      church: "Select church",
      description: "Enter department description",
      annual_budget: "Enter annual budget",
      contact_name: "Enter contact name",
      contact_email: "Enter email address",
      contact_phone: "Enter phone number",
      contact_city: "Enter city"
    },
    
    // Labels
    labels: {
      department: "Department",
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
      name_required: "Department name is required",
      name_min_length: "Department name must be at least 2 characters",
      church_required: "Church is required",
      description_required: "Description is required",
      description_min_length: "Description must be at least 10 characters",
      budget_required: "Annual budget is required and must be greater than 0",
      email_invalid: "Please enter a valid email address",
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
      deactivating: "Deactivating department...",
      deactivated: "Department deactivated successfully",
      deactivate_failed: "Failed to deactivate department"
    },
    
    // Stats
    stats: {
      church: "Church",
      members: "Members",
      budget: "Budget",
      projects: "Projects"
    }
  },
  
  nl: {
    // Modal Titles
    modals: {
      create: {
        title: "Afdeling Aanmaken",
        description: "Voeg een nieuwe afdeling toe aan uw organisatie"
      },
      edit: {
        title: "Afdeling Bewerken",
        description: "Update afdeling informatie en contactgegevens"
      },
      delete: {
        deactivate_title: "Afdeling Deactiveren",
        deactivate_description: "Deze actie zal de afdeling deactiveren en gerelateerde gegevens beïnvloeden",
        deactivating: "Deactiveren...",
        deactivate_department: "Afdeling Deactiveren",
        view_consequences: "Gevolgen Bekijken",
        affected_components: "Beïnvloede Componenten",
        understand_consequences: "Ik begrijp de gevolgen",
        acknowledge_text: "Ik erken dat deze actie alle gerelateerde gegevens zal beïnvloeden",
        type_confirmation: "Typ 'delete department' om te bevestigen",
        confirmation_placeholder: "Typ 'delete department' hier",
        confirmation_help: "Deze actie kan niet ongedaan worden gemaakt",
        consequences: {
          member_access: "Lid Toegang",
          member_access_desc: "Leden verliezen toegang tot deze afdeling",
          data_preservation: "Gegevens Bewaring",
          data_preservation_desc: "Alle gegevens worden bewaard maar gemarkeerd als inactief",
          budget_impact: "Budget Impact",
          budget_impact_desc: "Budget wordt teruggegeven aan de kerk",
          project_impact: "Project Impact",
          project_impact_desc: "Actieve projecten worden hertoegewezen of geannuleerd"
        },
        soft_delete: {
          title: "Zachte Verwijdering",
          description: "De afdeling wordt gemarkeerd als inactief maar gegevens worden bewaard"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Stap",
      of: "van",
      step_1_title: "Basis Informatie",
      step_1_description: "Voer afdeling details in en selecteer de kerk",
      step_2_title: "Contactgegevens",
      step_2_description: "Voeg contactinformatie toe voor de afdeling"
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
      contact_city: "Stad"
    },
    
    // Placeholders
    placeholders: {
      name: "Voer afdeling naam in",
      church: "Selecteer kerk",
      description: "Voer afdeling beschrijving in",
      annual_budget: "Voer jaarlijks budget in",
      contact_name: "Voer contactnaam in",
      contact_email: "Voer e-mailadres in",
      contact_phone: "Voer telefoonnummer in",
      contact_city: "Voer stad in"
    },
    
    // Labels
    labels: {
      department: "Afdeling",
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
      name_required: "Afdeling naam is verplicht",
      name_min_length: "Afdeling naam moet minimaal 2 karakters zijn",
      church_required: "Kerk is verplicht",
      description_required: "Beschrijving is verplicht",
      description_min_length: "Beschrijving moet minimaal 10 karakters zijn",
      budget_required: "Jaarlijks budget is verplicht en moet groter zijn dan 0",
      email_invalid: "Voer een geldig e-mailadres in",
      please_fix_errors: "Los de fouten op voordat u doorgaat"
    },
    
    // Toasts
    toasts: {
      creating: "Afdeling aanmaken...",
      created: "Afdeling succesvol aangemaakt",
      create_failed: "Kon afdeling niet aanmaken",
      updating: "Afdeling bijwerken...",
      updated: "Afdeling succesvol bijgewerkt",
      update_failed: "Kon afdeling niet bijwerken",
      deactivating: "Afdeling deactiveren...",
      deactivated: "Afdeling succesvol gedeactiveerd",
      deactivate_failed: "Kon afdeling niet deactiveren"
    },
    
    // Stats
    stats: {
      church: "Kerk",
      members: "Leden",
      budget: "Budget",
      projects: "Projecten"
    }
  },
  
  pt: {
    // Modal Titles
    modals: {
      create: {
        title: "Criar Departamento",
        description: "Adicione um novo departamento à sua organização"
      },
      edit: {
        title: "Editar Departamento",
        description: "Atualize informações do departamento e dados de contato"
      },
      delete: {
        deactivate_title: "Desativar Departamento",
        deactivate_description: "Esta ação desativará o departamento e afetará dados relacionados",
        deactivating: "Desativando...",
        deactivate_department: "Desativar Departamento",
        view_consequences: "Ver Consequências",
        affected_components: "Componentes Afetados",
        understand_consequences: "Entendo as consequências",
        acknowledge_text: "Reconheço que esta ação afetará todos os dados relacionados",
        type_confirmation: "Digite 'delete department' para confirmar",
        confirmation_placeholder: "Digite 'delete department' aqui",
        confirmation_help: "Esta ação não pode ser desfeita",
        consequences: {
          member_access: "Acesso de Membros",
          member_access_desc: "Membros perderão acesso a este departamento",
          data_preservation: "Preservação de Dados",
          data_preservation_desc: "Todos os dados serão preservados mas marcados como inativos",
          budget_impact: "Impacto no Orçamento",
          budget_impact_desc: "Orçamento será devolvido à igreja",
          project_impact: "Impacto em Projetos",
          project_impact_desc: "Projetos ativos serão reatribuídos ou cancelados"
        },
        soft_delete: {
          title: "Exclusão Suave",
          description: "O departamento será marcado como inativo mas os dados serão preservados"
        }
      }
    },
    
    // Steps
    steps: {
      step: "Passo",
      of: "de",
      step_1_title: "Informações Básicas",
      step_1_description: "Digite detalhes do departamento e selecione a igreja",
      step_2_title: "Detalhes de Contato",
      step_2_description: "Adicione informações de contato para o departamento"
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
      contact_city: "Cidade"
    },
    
    // Placeholders
    placeholders: {
      name: "Digite o nome do departamento",
      church: "Selecione a igreja",
      description: "Digite a descrição do departamento",
      annual_budget: "Digite o orçamento anual",
      contact_name: "Digite o nome do contato",
      contact_email: "Digite o endereço de e-mail",
      contact_phone: "Digite o número de telefone",
      contact_city: "Digite a cidade"
    },
    
    // Labels
    labels: {
      department: "Departamento",
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
      name_required: "Nome do departamento é obrigatório",
      name_min_length: "Nome do departamento deve ter pelo menos 2 caracteres",
      church_required: "Igreja é obrigatória",
      description_required: "Descrição é obrigatória",
      description_min_length: "Descrição deve ter pelo menos 10 caracteres",
      budget_required: "Orçamento anual é obrigatório e deve ser maior que 0",
      email_invalid: "Digite um endereço de e-mail válido",
      please_fix_errors: "Corrija os erros antes de continuar"
    },
    
    // Toasts
    toasts: {
      creating: "Criando departamento...",
      created: "Departamento criado com sucesso",
      create_failed: "Falha ao criar departamento",
      updating: "Atualizando departamento...",
      updated: "Departamento atualizado com sucesso",
      update_failed: "Falha ao atualizar departamento",
      deactivating: "Desativando departamento...",
      deactivated: "Departamento desativado com sucesso",
      deactivate_failed: "Falha ao desativar departamento"
    },
    
    // Stats
    stats: {
      church: "Igreja",
      members: "Membros",
      budget: "Orçamento",
      projects: "Projetos"
    }
  }
}
