export const budgetTranslations = {
  en: {
    // Common
    loading: "Loading...",
    refreshing: "Refreshing data...",
    error: "Error loading data",
    
    // Entity Types
    entity_types: {
      institution: "Institution",
      region: "Region", 
      church: "Church",
      department: "Department"
    },
    
    // Status
    status: {
      planned: "Planned",
      approved: "Approved",
      in_progress: "In Progress",
      closed: "Closed"
    },
    
    // Fields
    fields: {
      year: "Year",
      planned_budget: "Planned Budget",
      planned_budget_description: "Total budget allocated for this year",
      total_expenses: "Total Expenses",
      total_expenses_description: "Total expenses incurred so far",
      balance: "Balance",
      notes: "Notes",
      notes_placeholder: "Add any additional notes or comments...",
      notes_description: "Optional notes about this budget",
      status: "Status",
      status_placeholder: "Select status"
    },
    
    // Buttons
      buttons: {
        cancel: "Cancel",
        create: "Create Budget",
        update: "Update Budget",
        creating: "Creating...",
        updating: "Updating...",
        view: "View Budget",
        edit: "Edit Budget",
        delete: "Delete Budget",
        next: "Next",
        previous: "Previous"
      },
    
    // Modals
    modals: {
      annual: {
        create_title: "Create Annual Budget",
        edit_title: "Edit Annual Budget",
        title_institution: "Institution Annual Budget",
        title_region: "Region Annual Budget",
        title_church: "Church Annual Budget", 
        title_department: "Department Annual Budget",
        description_institution: "Manage the annual budget for this institution",
        description_region: "Manage the annual budget for this region",
        description_church: "Manage the annual budget for this church",
        description_department: "Manage the annual budget for this department",
        subtitle_institution: "Institution Budget Information",
        subtitle_region: "Region Budget Information",
        subtitle_church: "Church Budget Information",
        subtitle_department: "Department Budget Information",
        financial_values: "Financial Values",
        balance_positive: "Budget is within planned limits",
        balance_negative: "Expenses exceed planned budget",
        last_updated: "Last updated",
        step: "Step",
        of: "of",
        step_1_title: "Basic Information",
        step_1_description: "Set the year and status for this budget",
        step_2_title: "Financial Values",
        step_2_description: "Define planned budget and track expenses",
        step_3_title: "Additional Notes",
        step_3_description: "Add any additional information or comments"
      }
    },
    
    // Toasts
    toasts: {
      created: "Budget created successfully",
      updated: "Budget updated successfully",
      deleted: "Budget deleted successfully",
      create_failed: "Failed to create budget",
      update_failed: "Failed to update budget",
      delete_failed: "Failed to delete budget"
    },

    // Table
    table: {
      actions_menu: {
        manage: "Manage",
        lock: "Lock",
        unlock: "Unlock",
        approve: "Approve",
        reject: "Reject",
        request_revision: "Request Revision",
        delete: "Delete"
      }
    },

    // Messages
    messages: {
      lock_success: "Budget locked successfully",
      unlock_success: "Budget unlocked successfully",
      approve_success: "Budget approved successfully",
      reject_success: "Budget rejected successfully",
      revision_success: "Revision requested successfully",
      delete_success: "Budget deleted successfully",
      lock_error: "Failed to toggle budget lock",
      approve_error: "Failed to approve budget",
      reject_error: "Failed to reject budget",
      revision_error: "Failed to request revision",
      delete_error: "Failed to delete budget"
    },

    // Validation
    validation: {
      year_required: "Year is required",
      year_min: "Year must be at least 2020",
      year_max: "Year cannot exceed 2030",
      planned_budget_required: "Planned budget is required",
      planned_budget_min: "Planned budget must be at least 0",
      total_expenses_required: "Total expenses is required",
      total_expenses_min: "Total expenses must be at least 0",
      total_expenses_below_allocated: "Cannot be less than allocated amount: {{allocated}}",
      total_expenses_required_allocated: "Minimum required (already allocated): {{allocated}}",
      reserved_below_allocated: "Cannot be less than allocated amount: {{allocated}}",
      reserved_required_allocated: "Minimum required (already allocated): {{allocated}}",
      status_required: "Status is required"
    },
    
    // Fields
    fields: {
      already_allocated: "Already allocated to departments"
    },
    
    // Ledger History
    history: {
      title: "Ledger History",
      subtitle: "Detailed history of financial transactions and transfers",
      filter_type: "Type",
      categories: {
        transaction: "Department Transactions",
        transfer: "Institutional Transfers"
      },
      filters: {
        year: "Year",
        institution: "Institution",
        department: "Department",
        church: "Church",
        region: "Region",
        type: "Type",
        all_types: "All Types",
        entity: "Entity"
      },
      table: {
        date: "Date",
        entity: "Entity",
        description: "Description",
        type: "Type",
        reference: "Reference",
        amount: "Amount",
        balance: "Balance After"
      },
      types: {
        transaction: "Transaction",
        transfer: "Transfer",
        allocation_reserved: "Allocation Reserved",
        allocation_released: "Allocation Released",
        expense_approved: "Expense Approved",
        manual_adjustment: "Manual Adjustment",
        initial_funding: "Initial Funding",
        distribution: "Distribution",
        reallocation: "Reallocation",
        reduction: "Reduction",
        transfer_in: "Transfer In",
        transfer_out: "Transfer Out"
      },
      empty: "No ledger entries found for the selected criteria",
      summary: {
        inflows: "Total Inflows",
        outflows: "Total Outflows",
        net: "Net Period Balance"
      }
    }
  },
  
  nl: {
    // Common
    loading: "Laden...",
    refreshing: "Gegevens vernieuwen...",
    error: "Fout bij het laden van gegevens",
    
    // Entity Types
    entity_types: {
      institution: "Instelling",
      region: "Regio",
      church: "Kerk", 
      department: "Afdeling"
    },
    
    // Status
    status: {
      planned: "Gepland",
      approved: "Goedgekeurd",
      in_progress: "In Uitvoering",
      closed: "Gesloten"
    },
    
    // Fields
    fields: {
      year: "Jaar",
      planned_budget: "Gepland Budget",
      planned_budget_description: "Totaal budget toegewezen voor dit jaar",
      total_expenses: "Totale Uitgaven",
      total_expenses_description: "Totale uitgaven tot nu toe",
      balance: "Saldo",
      notes: "Notities",
      notes_placeholder: "Voeg aanvullende notities of opmerkingen toe...",
      notes_description: "Optionele notities over dit budget",
      status: "Status",
      status_placeholder: "Selecteer status"
    },
    
    // Buttons
      buttons: {
        cancel: "Annuleren",
        create: "Budget Aanmaken",
        update: "Budget Bijwerken",
        creating: "Aanmaken...",
        updating: "Bijwerken...",
        view: "Budget Bekijken",
        edit: "Budget Bewerken",
        delete: "Budget Verwijderen",
        next: "Volgende",
        previous: "Vorige"
      },
    
    // Modals
    modals: {
      annual: {
        create_title: "Jaarlijks Budget Aanmaken",
        edit_title: "Jaarlijks Budget Bewerken",
        title_institution: "Instelling Jaarlijks Budget",
        title_region: "Regio Jaarlijks Budget",
        title_church: "Kerk Jaarlijks Budget",
        title_department: "Afdeling Jaarlijks Budget",
        description_institution: "Beheer het jaarlijkse budget voor deze instelling",
        description_region: "Beheer het jaarlijkse budget voor deze regio",
        description_church: "Beheer het jaarlijkse budget voor deze kerk",
        description_department: "Beheer het jaarlijkse budget voor deze afdeling",
        subtitle_institution: "Instelling Budget Informatie",
        subtitle_region: "Regio Budget Informatie",
        subtitle_church: "Kerk Budget Informatie",
        subtitle_department: "Afdeling Budget Informatie",
        financial_values: "Financiële Waarden",
        balance_positive: "Budget is binnen geplande limieten",
        balance_negative: "Uitgaven overschrijden gepland budget",
        last_updated: "Laatst bijgewerkt",
        step: "Stap",
        of: "van",
        step_1_title: "Basis Informatie",
        step_1_description: "Stel het jaar en status in voor dit budget",
        step_2_title: "Financiële Waarden",
        step_2_description: "Definieer gepland budget en volg uitgaven",
        step_3_title: "Aanvullende Notities",
        step_3_description: "Voeg aanvullende informatie of opmerkingen toe"
      }
    },
    
    // Toasts
    toasts: {
      created: "Budget succesvol aangemaakt",
      updated: "Budget succesvol bijgewerkt",
      deleted: "Budget succesvol verwijderd",
      create_failed: "Budget aanmaken mislukt",
      update_failed: "Budget bijwerken mislukt",
      delete_failed: "Budget verwijderen mislukt"
    },

    // Table
    table: {
      actions_menu: {
        manage: "Beheren",
        lock: "Vergrendelen",
        unlock: "Ontgrendelen",
        approve: "Goedkeuren",
        reject: "Afwijzen",
        request_revision: "Revisie Aanvragen",
        delete: "Verwijderen"
      }
    },

    // Messages
    messages: {
      lock_success: "Budget succesvol vergrendeld",
      unlock_success: "Budget succesvol ontgrendeld",
      approve_success: "Budget succesvol goedgekeurd",
      reject_success: "Budget succesvol afgewezen",
      revision_success: "Revisie succesvol aangevraagd",
      delete_success: "Budget succesvol verwijderd",
      lock_error: "Budget vergrendeling wijzigen mislukt",
      approve_error: "Budget goedkeuren mislukt",
      reject_error: "Budget afwijzen mislukt",
      revision_error: "Revisie aanvragen mislukt",
      delete_error: "Budget verwijderen mislukt"
    },

    // Validation
    validation: {
      year_required: "Jaar is verplicht",
      year_min: "Jaar moet minimaal 2020 zijn",
      year_max: "Jaar kan niet hoger zijn dan 2030",
      planned_budget_required: "Gepland budget is verplicht",
      planned_budget_min: "Gepland budget moet minimaal 0 zijn",
      total_expenses_required: "Totale uitgaven is verplicht",
      total_expenses_min: "Totale uitgaven moet minimaal 0 zijn",
      total_expenses_below_allocated: "Mag niet lager zijn dan toegewezen bedrag: {{allocated}}",
      total_expenses_required_allocated: "Minimum vereist (reeds toegewezen): {{allocated}}",
      reserved_below_allocated: "Mag niet lager zijn dan toegewezen bedrag: {{allocated}}",
      reserved_required_allocated: "Minimum vereist (reeds toegewezen): {{allocated}}",
      status_required: "Status is verplicht"
    },
    
    // Fields  
    fields: {
      already_allocated: "Reeds toegewezen aan afdelingen"
    },
    
    // Ledger History
    history: {
      title: "Grootboek Historie",
      subtitle: "Gedetailleerde historie van financiële transacties en overboekingen",
      filter_type: "Type",
      categories: {
        transaction: "Afdeling Transacties",
        transfer: "Institutionele Overboekingen"
      },
      filters: {
        year: "Jaar",
        institution: "Instelling",
        department: "Afdeling",
        church: "Kerk",
        region: "Regio",
        type: "Type",
        all_types: "Alle Typen",
        entity: "Entiteit"
      },
      table: {
        date: "Datum",
        entity: "Entiteit",
        description: "Omschrijving",
        type: "Type",
        reference: "Referentie",
        amount: "Bedrag",
        balance: "Saldo Na"
      },
      types: {
        transaction: "Transactie",
        transfer: "Overboeking",
        allocation_reserved: "Allocatie Gereserveerd",
        allocation_released: "Allocatie Vrijgegeven",
        expense_approved: "Uitgave Goedgekeurd",
        manual_adjustment: "Handmatige Aanpassing",
        initial_funding: "Initiële Financiering",
        distribution: "Distributie",
        reallocation: "Herallocatie",
        reduction: "Reductie",
        transfer_in: "Inkomende Overboeking",
        transfer_out: "Uitgaande Overboeking"
      },
      empty: "Geen grootboekmutaties gevonden voor de geselecteerde criteria",
      summary: {
        inflows: "Totaal Inkomend",
        outflows: "Totaal Uitgaand",
        net: "Netto Saldo Periode"
      }
    }
  },
  
  pt: {
    // Common
    loading: "Carregando...",
    refreshing: "Atualizando dados...",
    error: "Erro ao carregar dados",
    
    // Entity Types
    entity_types: {
      institution: "Instituição",
      region: "Região",
      church: "Igreja",
      department: "Departamento"
    },
    
    // Status
    status: {
      planned: "Planejado",
      approved: "Aprovado",
      in_progress: "Em Andamento",
      closed: "Fechado"
    },
    
    // Fields
    fields: {
      year: "Ano",
      planned_budget: "Orçamento Planejado",
      planned_budget_description: "Orçamento total alocado para este ano",
      total_expenses: "Total de Despesas",
      total_expenses_description: "Total de despesas incorridas até agora",
      balance: "Saldo",
      notes: "Observações",
      notes_placeholder: "Adicione observações ou comentários adicionais...",
      notes_description: "Observações opcionais sobre este orçamento",
      status: "Status",
      status_placeholder: "Selecione o status"
    },
    
    // Buttons
      buttons: {
        cancel: "Cancelar",
        create: "Criar Orçamento",
        update: "Atualizar Orçamento",
        creating: "Criando...",
        updating: "Atualizando...",
        view: "Ver Orçamento",
        edit: "Editar Orçamento",
        delete: "Excluir Orçamento",
        next: "Próximo",
        previous: "Anterior"
      },
    
    // Modals
    modals: {
      annual: {
        create_title: "Criar Orçamento Anual",
        edit_title: "Editar Orçamento Anual",
        title_institution: "Orçamento Anual da Instituição",
        title_region: "Orçamento Anual da Região",
        title_church: "Orçamento Anual da Igreja",
        title_department: "Orçamento Anual do Departamento",
        description_institution: "Gerencie o orçamento anual para esta instituição",
        description_region: "Gerencie o orçamento anual para esta região",
        description_church: "Gerencie o orçamento anual para esta igreja",
        description_department: "Gerencie o orçamento anual para este departamento",
        subtitle_institution: "Informações do Orçamento da Instituição",
        subtitle_region: "Informações do Orçamento da Região",
        subtitle_church: "Informações do Orçamento da Igreja",
        subtitle_department: "Informações do Orçamento do Departamento",
        financial_values: "Valores Financeiros",
        balance_positive: "Orçamento está dentro dos limites planejados",
        balance_negative: "Despesas excedem o orçamento planejado",
        last_updated: "Última atualização",
        step: "Passo",
        of: "de",
        step_1_title: "Informações Básicas",
        step_1_description: "Defina o ano e status para este orçamento",
        step_2_title: "Valores Financeiros",
        step_2_description: "Defina orçamento planejado e acompanhe despesas",
        step_3_title: "Observações Adicionais",
        step_3_description: "Adicione informações ou comentários adicionais"
      }
    },
    
    // Toasts
    toasts: {
      created: "Orçamento criado com sucesso",
      updated: "Orçamento atualizado com sucesso",
      deleted: "Orçamento excluído com sucesso",
      create_failed: "Falha ao criar orçamento",
      update_failed: "Falha ao atualizar orçamento",
      delete_failed: "Falha ao excluir orçamento"
    },

    // Table
    table: {
      actions_menu: {
        manage: "Gerenciar",
        lock: "Bloquear",
        unlock: "Desbloquear",
        approve: "Aprovar",
        reject: "Rejeitar",
        request_revision: "Solicitar Revisão",
        delete: "Excluir"
      }
    },

    // Messages
    messages: {
      lock_success: "Orçamento bloqueado com sucesso",
      unlock_success: "Orçamento desbloqueado com sucesso",
      approve_success: "Orçamento aprovado com sucesso",
      reject_success: "Orçamento rejeitado com sucesso",
      revision_success: "Revisão solicitada com sucesso",
      delete_success: "Orçamento excluído com sucesso",
      lock_error: "Falha ao alterar bloqueio do orçamento",
      approve_error: "Falha ao aprovar orçamento",
      reject_error: "Falha ao rejeitar orçamento",
      revision_error: "Falha ao solicitar revisão",
      delete_error: "Falha ao excluir orçamento"
    },

    // Validation
    validation: {
      year_required: "Ano é obrigatório",
      year_min: "Ano deve ser pelo menos 2020",
      year_max: "Ano não pode exceder 2030",
      planned_budget_required: "Orçamento planejado é obrigatório",
      planned_budget_min: "Orçamento planejado deve ser pelo menos 0",
      total_expenses_required: "Total de despesas é obrigatório",
      total_expenses_min: "Total de despesas deve ser pelo menos 0",
      total_expenses_below_allocated: "Não pode ser menor que o valor alocado: {{allocated}}",
      total_expenses_required_allocated: "Mínimo requerido (já alocado): {{allocated}}",
      reserved_below_allocated: "Não pode ser menor que o valor alocado: {{allocated}}",
      reserved_required_allocated: "Mínimo requerido (já alocado): {{allocated}}",
      status_required: "Status é obrigatório"
    },
    
    // Fields
    fields: {
      already_allocated: "Já alocado para departamentos"
    },
    
    // Ledger History
    history: {
      title: "Extrato Financeiro",
      subtitle: "Histórico detalhado de transações e transferências",
      filter_type: "Tipo",
      categories: {
        transaction: "Transações Departamentais",
        transfer: "Transferências Institucionais"
      },
      filters: {
        year: "Ano",
        institution: "Instituição",
        department: "Departamento",
        church: "Igreja",
        region: "Região",
        type: "Tipo",
        all_types: "Todos os Tipos",
        entity: "Entidade"
      },
      table: {
        date: "Data",
        entity: "Entidade",
        description: "Descrição",
        type: "Tipo",
        reference: "Referência",
        amount: "Valor",
        balance: "Saldo Após"
      },
      types: {
        transaction: "Transação",
        transfer: "Transferência",
        allocation_reserved: "Alocação Reservada",
        allocation_released: "Alocação Liberada",
        expense_approved: "Despesa Aprovada",
        manual_adjustment: "Ajuste Manual",
        initial_funding: "Aporte Inicial",
        distribution: "Distribuição",
        reallocation: "Realocação",
        reduction: "Redução",
        transfer_in: "Transferência Recebida",
        transfer_out: "Transferência Enviada"
      },
      empty: "Nenhuns lançamentos encontrados para os critérios selecionados",
      summary: {
        inflows: "Total de Entradas",
        outflows: "Total de Saídas",
        net: "Saldo Líquido no Período"
      }
    }
  }
}
