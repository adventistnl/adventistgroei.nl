// Project-specific translations for batch actions and dynamic fields
// Language support: Portuguese (pt), English (en), Dutch (nl)

export const projectFieldsTranslations = {
  pt: {
    // Project-specific field labels
    projectStatus: "Status do Projeto",
    activityStatus: "Status da Atividade", 
    activityPriority: "Prioridade da Atividade",
    subsidizedStatus: "Status de Subsídio",
    
    // Project activity statuses (specific to projects)
    activityStatusOptions: {
      todo: "A Fazer",
      in_progress: "Em Andamento", 
      completed: "Concluído",
      on_hold: "Em Espera",
      blocked: "Bloqueado",
      cancelled: "Cancelado"
    },
    
    // Project priority levels
    activityPriorityOptions: {
      urgent: "Urgente",
      high: "Alta",
      medium: "Média", 
      low: "Baixa",
      critical: "Crítica"
    },
    
    // Batch actions specific to projects
    batchActions: {
      updateStatus: "Atualizar Status",
      changePriority: "Alterar Prioridade",
      markSubsidized: "Marcar como Subsidiado",
      unmarkSubsidized: "Desmarcar Subsídio",
      assignUsers: "Atribuir Usuários",
      setDeadline: "Definir Prazo",
      addTags: "Adicionar Tags",
      exportSelection: "Exportar Seleção",
      
      // Confirmation messages
      confirmStatusChange: "Confirmar alteração de status para {{count}} atividade(s)?",
      confirmPriorityChange: "Confirmar alteração de prioridade para {{count}} atividade(s)?",
      confirmSubsidyChange: "Confirmar alteração de status de subsídio para {{count}} atividade(s)?",
      
      // Success messages  
      statusUpdateSuccess: "Status atualizado para {{count}} atividade(s)",
      priorityUpdateSuccess: "Prioridade atualizada para {{count}} atividade(s)",
      subsidyUpdateSuccess: "Status de subsídio atualizado para {{count}} atividade(s)"
    },
    
    // Field tooltips specific to project context
    tooltips: {
      activityStatus: "Status atual da atividade no projeto",
      activityPriority: "Nível de prioridade da atividade",
      subsidizedActivity: "Ativar para marcar atividade como subsidiada - poderá receber apoio financeiro",
      batchUpdate: "Aplicar alterações a todas as atividades selecionadas",
      statusBadge: "Clique para filtrar por este status"
    },
    
    // Project batch editor specific
    batchEditor: {
      applyChanges: "Aplicar Alterações",
      selectField: "Selecione um campo para editar",
      noChanges: "Nenhuma alteração detectada",
      updating: "Atualizando atividades...",
      fieldRequired: "Selecione pelo menos um campo para atualizar"
    }
  },
  
  en: {
    // Project-specific field labels
    projectStatus: "Project Status",
    activityStatus: "Activity Status", 
    activityPriority: "Activity Priority",
    subsidizedStatus: "Subsidy Status",
    
    // Project activity statuses (specific to projects)
    activityStatusOptions: {
      todo: "To Do",
      in_progress: "In Progress", 
      completed: "Completed",
      on_hold: "On Hold",
      blocked: "Blocked",
      cancelled: "Cancelled"
    },
    
    // Project priority levels
    activityPriorityOptions: {
      urgent: "Urgent",
      high: "High",
      medium: "Medium", 
      low: "Low",
      critical: "Critical"
    },
    
    // Batch actions specific to projects
    batchActions: {
      updateStatus: "Update Status",
      changePriority: "Change Priority",
      markSubsidized: "Mark as Subsidized",
      unmarkSubsidized: "Unmark Subsidy",
      assignUsers: "Assign Users",
      setDeadline: "Set Deadline",
      addTags: "Add Tags",
      exportSelection: "Export Selection",
      
      // Confirmation messages
      confirmStatusChange: "Confirm status change for {{count}} activityies?",
      confirmPriorityChange: "Confirm priority change for {{count}} activityies?",
      confirmSubsidyChange: "Confirm subsidy status change for {{count}} activityies?",
      
      // Success messages  
      statusUpdateSuccess: "Status updated for {{count}} activityies",
      priorityUpdateSuccess: "Priority updated for {{count}} activityies",
      subsidyUpdateSuccess: "Subsidy status updated for {{count}} activityies"
    },
    
    // Field tooltips specific to project context
    tooltips: {
      activityStatus: "Current activity status in the project",
      activityPriority: "Activity priority level",
      subsidizedActivity: "Enable to mark activity as subsidized - may receive financial support",
      batchUpdate: "Apply changes to all selected activities",
      statusBadge: "Click to filter by this status"
    },
    
    // Project batch editor specific
    batchEditor: {
      applyChanges: "Apply Changes",
      selectField: "Select a field to edit",
      noChanges: "No changes detected",
      updating: "Updating activities...",
      fieldRequired: "Select at least one field to update"
    }
  },
  
  nl: {
    // Project-specific field labels
    projectStatus: "Projectstatus",
    activityStatus: "Activiteitsstatus", 
    activityPriority: "Activiteitsprioriteit",
    subsidizedStatus: "Subsidiestatus",
    
    // Project activity statuses (specific to projects)
    activityStatusOptions: {
      todo: "Te doen",
      in_progress: "Bezig", 
      completed: "Voltooid",
      on_hold: "In de wacht",
      blocked: "Geblokkeerd",
      cancelled: "Geannuleerd"
    },
    
    // Project priority levels
    activityPriorityOptions: {
      urgent: "Urgent",
      high: "Hoog",
      medium: "Gemiddeld", 
      low: "Laag",
      critical: "Kritiek"
    },
    
    // Batch actions specific to projects
    batchActions: {
      updateStatus: "Status Bijwerken",
      changePriority: "Prioriteit Wijzigen",
      markSubsidized: "Markeren als Gesubsidieerd",
      unmarkSubsidized: "Subsidie Verwijderen",
      assignUsers: "Gebruikers Toewijzen",
      setDeadline: "Deadline Instellen",
      addTags: "Tags Toevoegen",
      exportSelection: "Selectie Exporteren",
      
      // Confirmation messages
      confirmStatusChange: "Status wijziging bevestigen voor {{count}} activiteit(en)?",
      confirmPriorityChange: "Prioriteit wijziging bevestigen voor {{count}} activiteit(en)?",
      confirmSubsidyChange: "Subsidie status wijziging bevestigen voor {{count}} activiteit(en)?",
      
      // Success messages  
      statusUpdateSuccess: "Status bijgewerkt voor {{count}} activiteit(en)",
      priorityUpdateSuccess: "Prioriteit bijgewerkt voor {{count}} activiteit(en)",
      subsidyUpdateSuccess: "Subsidie status bijgewerkt voor {{count}} activiteit(en)"
    },
    
    // Field tooltips specific to project context
    tooltips: {
      activityStatus: "Huidige activiteitsstatus in het project",
      activityPriority: "Activiteit prioriteitsniveau",
      subsidizedActivity: "Inschakelen om activiteit te markeren als gesubsidieerd - kan financiële ondersteuning ontvangen",
      batchUpdate: "Wijzigingen toepassen op alle geselecteerde activiteiten",
      statusBadge: "Klik om te filteren op deze status"
    },
    
    // Project batch editor specific
    batchEditor: {
      applyChanges: "Wijzigingen Toepassen",
      selectField: "Selecteer een veld om te bewerken",
      noChanges: "Geen wijzigingen gedetecteerd",
      updating: "Activiteiten bijwerken...",
      fieldRequired: "Selecteer minstens één veld om bij te werken"
    }
  }
}