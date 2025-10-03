export const annualBudgetTranslations = {
  en: {
    title: "Annual Budget",
    description: "Manage annual budget information",
    addTitle: "Add Annual Budget",
    addDescription: "Create a new annual budget for the institution",
    editTitle: "Edit Annual Budget",
    editDescription: "Update annual budget information",
    close: "Close",
    edit: "Edit",
    save: "Save Budget",
    update: "Update Budget",
    cancel: "Cancel",
    previous: "Previous",
    next: "Next",
    saving: "Saving...",
    updating: "Updating...",
    loading: "Loading...",
    saved: "Annual budget saved successfully!",
    updated: "Annual budget updated successfully!",
    saveFailed: "Failed to save annual budget",
    updateFailed: "Failed to update annual budget",
    
    // Step titles
    basicInformation: "Budget Overview",
    basicInformationDesc: "Year, planned budget, and current status",
    financialDetails: "Financial Details", 
    financialDetailsDesc: "Expenses, balance, and financial tracking",
    additionalInfo: "Additional Information",
    additionalInfoDesc: "Notes, approvals, and comments",
    
    // Form fields
    year: "Budget Year",
    yearPlaceholder: "Enter budget year (e.g., 2024)",
    plannedBudget: "Planned Budget",
    plannedBudgetPlaceholder: "Enter planned budget amount",
    totalExpenses: "Total Expenses",
    totalExpensesPlaceholder: "Enter total expenses to date",
    balance: "Current Balance", 
    balancePlaceholder: "Calculated automatically",
    status: "Budget Status",
    statusPlaceholder: "Select budget status",
    notes: "Notes",
    notesPlaceholder: "Additional notes or comments about this budget...",
    approvedBy: "Approved By",
    approvedByPlaceholder: "Select approving user",
    
    // Status options
    statusOptions: {
      planned: "Planned",
      approved: "Approved", 
      in_progress: "In Progress",
      closed: "Closed"
    },
    
    // Validation messages
    validation: {
      yearRequired: "Budget year is required",
      yearInvalid: "Please enter a valid year (e.g., 2024)",
      yearMin: "Year must be 2000 or later",
      yearMax: "Year cannot be more than 10 years in the future",
      plannedBudgetRequired: "Planned budget is required",
      plannedBudgetInvalid: "Please enter a valid budget amount",
      plannedBudgetMin: "Planned budget must be greater than 0",
      totalExpensesInvalid: "Please enter a valid expense amount",
      totalExpensesNegative: "Total expenses cannot be negative",
      statusRequired: "Budget status is required",
      fixErrors: "Please fix the errors before continuing"
    },
    
    // Helper texts
    balanceHelp: "Balance is calculated automatically as Planned Budget - Total Expenses",
    yearHelp: "The fiscal year this budget applies to",
    statusHelp: "Current stage of the budget process"
  },
  
  nl: {
    title: "Jaarbegroting",
    description: "Beheer jaarbegroting informatie",
    addTitle: "Jaarbegroting Toevoegen",
    addDescription: "Maak een nieuwe jaarbegroting voor de instelling",
    editTitle: "Jaarbegroting Bewerken", 
    editDescription: "Werk jaarbegroting informatie bij",
    close: "Sluiten",
    edit: "Bewerken",
    save: "Begroting Opslaan",
    update: "Begroting Bijwerken",
    cancel: "Annuleren",
    previous: "Vorige",
    next: "Volgende",
    saving: "Opslaan...",
    updating: "Bijwerken...",
    loading: "Laden...",
    saved: "Jaarbegroting succesvol opgeslagen!",
    updated: "Jaarbegroting succesvol bijgewerkt!",
    saveFailed: "Opslaan van jaarbegroting mislukt",
    updateFailed: "Bijwerken van jaarbegroting mislukt",
    
    // Step titles
    basicInformation: "Begroting Overzicht",
    basicInformationDesc: "Jaar, geplande begroting en huidige status",
    financialDetails: "Financiële Details",
    financialDetailsDesc: "Uitgaven, saldo en financiële tracking",
    additionalInfo: "Aanvullende Informatie", 
    additionalInfoDesc: "Opmerkingen, goedkeuringen en commentaren",
    
    // Form fields
    year: "Begrotingsjaar",
    yearPlaceholder: "Voer begrotingsjaar in (bijv. 2024)",
    plannedBudget: "Geplande Begroting",
    plannedBudgetPlaceholder: "Voer geplande begrotingsbedrag in",
    totalExpenses: "Totale Uitgaven", 
    totalExpensesPlaceholder: "Voer totale uitgaven tot nu toe in",
    balance: "Huidig Saldo",
    balancePlaceholder: "Automatisch berekend",
    status: "Begrotingsstatus",
    statusPlaceholder: "Selecteer begrotingsstatus",
    notes: "Opmerkingen",
    notesPlaceholder: "Aanvullende opmerkingen of commentaren over deze begroting...",
    approvedBy: "Goedgekeurd Door",
    approvedByPlaceholder: "Selecteer goedkeurende gebruiker",
    
    // Status options
    statusOptions: {
      planned: "Gepland",
      approved: "Goedgekeurd",
      in_progress: "In Uitvoering", 
      closed: "Afgesloten"
    },
    
    // Validation messages
    validation: {
      yearRequired: "Begrotingsjaar is verplicht",
      yearInvalid: "Voer een geldig jaar in (bijv. 2024)",
      yearMin: "Jaar moet 2000 of later zijn",
      yearMax: "Jaar kan niet meer dan 10 jaar in de toekomst zijn",
      plannedBudgetRequired: "Geplande begroting is verplicht", 
      plannedBudgetInvalid: "Voer een geldig begrotingsbedrag in",
      plannedBudgetMin: "Geplande begroting moet groter zijn dan 0",
      totalExpensesInvalid: "Voer een geldig uitgavenbedrag in",
      totalExpensesNegative: "Totale uitgaven kunnen niet negatief zijn",
      statusRequired: "Begrotingsstatus is verplicht",
      fixErrors: "Los de fouten op voordat u doorgaat"
    },
    
    // Helper texts
    balanceHelp: "Saldo wordt automatisch berekend als Geplande Begroting - Totale Uitgaven",
    yearHelp: "Het boekjaar waarop deze begroting betrekking heeft",
    statusHelp: "Huidige fase van het begrotingsproces"
  },
  
  pt: {
    title: "Orçamento Anual",
    description: "Gerenciar informações do orçamento anual",
    addTitle: "Adicionar Orçamento Anual",
    addDescription: "Criar um novo orçamento anual para a instituição",
    editTitle: "Editar Orçamento Anual",
    editDescription: "Atualizar informações do orçamento anual",
    close: "Fechar",
    edit: "Editar",
    save: "Salvar Orçamento",
    update: "Atualizar Orçamento",
    cancel: "Cancelar",
    previous: "Anterior",
    next: "Próximo",
    saving: "Salvando...",
    updating: "Atualizando...",
    loading: "Carregando...",
    saved: "Orçamento anual salvo com sucesso!",
    updated: "Orçamento anual atualizado com sucesso!",
    saveFailed: "Falha ao salvar orçamento anual",
    updateFailed: "Falha ao atualizar orçamento anual",
    
    // Step titles
    basicInformation: "Visão Geral do Orçamento",
    basicInformationDesc: "Ano, orçamento planejado e status atual",
    financialDetails: "Detalhes Financeiros",
    financialDetailsDesc: "Despesas, saldo e acompanhamento financeiro", 
    additionalInfo: "Informações Adicionais",
    additionalInfoDesc: "Notas, aprovações e comentários",
    
    // Form fields
    year: "Ano do Orçamento",
    yearPlaceholder: "Digite o ano do orçamento (ex: 2024)",
    plannedBudget: "Orçamento Planejado",
    plannedBudgetPlaceholder: "Digite o valor do orçamento planejado",
    totalExpenses: "Total de Despesas",
    totalExpensesPlaceholder: "Digite o total de despesas até o momento",
    balance: "Saldo Atual",
    balancePlaceholder: "Calculado automaticamente", 
    status: "Status do Orçamento",
    statusPlaceholder: "Selecione o status do orçamento",
    notes: "Observações",
    notesPlaceholder: "Observações ou comentários adicionais sobre este orçamento...",
    approvedBy: "Aprovado Por",
    approvedByPlaceholder: "Selecione o usuário aprovador",
    
    // Status options
    statusOptions: {
      planned: "Planejado",
      approved: "Aprovado",
      in_progress: "Em Andamento",
      closed: "Fechado"
    },
    
    // Validation messages
    validation: {
      yearRequired: "Ano do orçamento é obrigatório",
      yearInvalid: "Digite um ano válido (ex: 2024)",
      yearMin: "Ano deve ser 2000 ou posterior",
      yearMax: "Ano não pode ser mais de 10 anos no futuro",
      plannedBudgetRequired: "Orçamento planejado é obrigatório",
      plannedBudgetInvalid: "Digite um valor de orçamento válido",
      plannedBudgetMin: "Orçamento planejado deve ser maior que 0",
      totalExpensesInvalid: "Digite um valor de despesa válido", 
      totalExpensesNegative: "Total de despesas não pode ser negativo",
      statusRequired: "Status do orçamento é obrigatório",
      fixErrors: "Corrija os erros antes de continuar"
    },
    
    // Helper texts
    balanceHelp: "Saldo é calculado automaticamente como Orçamento Planejado - Total de Despesas",
    yearHelp: "O ano fiscal ao qual este orçamento se aplica", 
    statusHelp: "Estágio atual do processo orçamentário"
  }
}