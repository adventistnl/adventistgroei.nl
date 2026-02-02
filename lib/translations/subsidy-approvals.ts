export const subsidyApprovalsTranslations = {
  en: {
    // Page title
    pageTitle: "Subsidy Approvals",
    pageDescription: "Review and approve subsidy requests from churches and institutions",
    
    // Toasts
    toasts: {
      loadingError: "Error loading subsidy requests",
      refreshing: "Refreshing data...",
      refreshSuccess: "Data refreshed successfully",
      refreshError: "Error refreshing data",
      approveSuccess: "Subsidy approved successfully",
      approveError: "Error approving: {{message}}",
      rejectSuccess: "Subsidy rejected",
      rejectError: "Error rejecting: {{message}}",
      statusUpdateSuccess: "Status updated successfully",
      statusUpdateError: "Error updating status: {{message}}",
      statusNotFound: "Status \"{{status}}\" not found",
      invalidStatus: "Invalid status",
      inReviewNotFound: "Status \"In Review\" not found",
      statusClosed: "Status Closed cannot be changed",
      inReviewToClosed: "Cannot close In Review requests",
      mustBeFinal: "Must be Approved or Rejected to Close",
      finalState: "Can only change to Closed",
      documentsPending: "All documents must be validated first",
      documentsRejected: "Cannot approve subsidy with rejected documents",
      onlyFinancialCanClose: "Only users with the Financial Manager role can close subsidy requests"
    },
    
    // Default values
    defaults: {
      untitledRequest: "Untitled request",
      rejectionReason: "Rejected by administrator",
      otherDepartment: "Other"
    },
    
    // KPI Cards
    kpis: {
      totalRequests: {
        title: "Total Requests",
        subtitle: "All subsidy requests"
      },
      pendingReview: {
        title: "Pending Review",
        subtitle: "Awaiting approval"
      },
      totalRequested: {
        title: "Total Requested",
        subtitle: "Sum of all requests"
      },
      totalApproved: {
        title: "Total Approved",
        subtitle: "Approved amount"
      },
      approvalRate: {
        title: "Approval Rate",
        subtitle: "Requests approved"
      },
      trend: {
        vsLastMonth: "vs. last month"
      }
    },
    
    // Status labels
    status: {
      changeStatus: "Change Status",
      pending: "Pending",
      in_review: "In Review",
      approved: "Approved",
      closed: "Closed",
      rejected: "Rejected"
    },
    
    // Priority labels
    priority: {
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    
    // Table columns
    table: {
      requestTitle: "Request Title",
      requested: "Requested",
      activities: "Activities",
      priority: "Priority",
      status: "Status",
      date: "Date",
      actions: "Actions"
    },
    
    // Actions
    actions: {
      manageSubsidy: "Manage Subsidy",
      approve: "Approve",
      reject: "Reject",
      viewToggle: {
        table: "Table",
        kanban: "Kanban"
      }
    },
    
    // Kanban
    kanban: {
      groups: {
        pending: "Pending",
        in_review: "In Review",
        approved: "Approved",
        closed: "Closed",
        rejected: "Rejected"
      }
    },
    
    // Status Rules (tooltips)
    statusRules: {
      pending: "Initial status. Also used when there are pending items, such as needing to send a new receipt. Can transition to In Review, Approved, or Rejected, but never directly to Closed.",
      in_review: "Document under review. Indicates the request is being reviewed. Can return to Pending or move to Approved or Rejected, but never directly to Closed.",
      approved: "Subsidy has been approved and is released for payment. This is an irreversible action and can only transition to Closed. Updates to the subsidy or files are still possible.",
      rejected: "Subsidy has been rejected and will not be subsidized for some reason. This is an irreversible action and can only transition to Closed. Updates to the subsidy or files are still possible.",
      closed: "Final status, indicating that all necessary actions for the subsidy have been completed. From here, no update or deletion actions can be performed on the subsidy or files."
    },
    
    // Card Header
    card: {
      title: "Subsidy Requests",
      description: "Manage and review all subsidy requests"
    },
    
    // Charts
    charts: {
      byDepartment: {
        title: "Requests Over Time by Department",
        description: "Monthly subsidy requests by all departments",
        descriptionWithYear: "Monthly subsidy requests by all departments - {{year}}",
        noData: "No department data available",
        departmentsTracked: "{{count}} departments tracked",
        top: "Top",
        chartTypes: {
          area: "Area",
          bar: "Bar"
        }
      },
      overTime: {
        title: "Requests Over Time",
        description: "Monthly subsidy request status - {{year}}",
        quarterFilters: {
          all: "All",
          q1: "Q1",
          q2: "Q2",
          q3: "Q3",
          q4: "Q4"
        },
        footer: {
          approvalRate: "Approval rate",
          totalRequests: "Total requests",
          approved: "approved",
          pending: "pending",
          rejected: "rejected",
          in_review: "in review"
        },
        statusLabels: {
          approved: "Approved",
          pending: "Pending",
          rejected: "Rejected"
        }
      },
      statusOverview: {
        title: "Status Overview",
        description: "Distribution of requests by current status",
        allDescription: "Showing all status distributions",
        selectStatus: "Select status",
        selectLabel: "Select a status",
        requests: "Requests",
        total: "Total",
        statusLabels: {
          pending: "Pending",
          in_review: "In Review",
          approved: "Approved",
          rejected: "Rejected",
          closed: "Closed"
        }
      }
    }
  },
  
  pt: {
    // Page title
    pageTitle: "Aprovações de Subsídios",
    pageDescription: "Revise e aprove solicitações de subsídios de igrejas e instituições",
    
    // Toasts
    toasts: {
      loadingError: "Erro ao carregar solicitações de subsídio",
      refreshing: "Atualizando dados...",
      refreshSuccess: "Dados atualizados com sucesso",
      refreshError: "Erro ao atualizar dados",
      approveSuccess: "Subsídio aprovado com sucesso",
      approveError: "Erro ao aprovar: {{message}}",
      rejectSuccess: "Subsídio rejeitado",
      rejectError: "Erro ao rejeitar: {{message}}",
      statusUpdateSuccess: "Status atualizado com sucesso",
      statusUpdateError: "Erro ao atualizar status: {{message}}",
      statusNotFound: "Status \"{{status}}\" não encontrado",
      invalidStatus: "Status inválido",
      inReviewNotFound: "Status \"Em Revisão\" não encontrado",
      statusClosed: "Status Fechado não pode ser alterado",
      inReviewToClosed: "Não é possível fechar solicitações Em Revisão",
      mustBeFinal: "Deve estar Aprovado ou Rejeitado para Fechar",
      finalState: "Só pode mudar para Fechado",
      documentsPending: "Todos os documentos devem ser validados primeiro",
      documentsRejected: "Não é possível aprovar subsídio com documentos rejeitados",
      onlyFinancialCanClose: "Apenas usuários com a função de Gerente Financeiro podem fechar solicitações de subsídio"
    },
    
    // Default values
    defaults: {
      untitledRequest: "Solicitação sem título",
      rejectionReason: "Rejeitado pelo administrador",
      otherDepartment: "Outro"
    },
    
    // KPI Cards
    kpis: {
      totalRequests: {
        title: "Total de Solicitações",
        subtitle: "Todas as solicitações de subsídio"
      },
      pendingReview: {
        title: "Pendente de Revisão",
        subtitle: "Aguardando aprovação"
      },
      totalRequested: {
        title: "Total Solicitado",
        subtitle: "Soma de todas as solicitações"
      },
      totalApproved: {
        title: "Total Aprovado",
        subtitle: "Valor aprovado"
      },
      approvalRate: {
        title: "Taxa de Aprovação",
        subtitle: "Solicitações aprovadas"
      },
      trend: {
        vsLastMonth: "vs. mês passado"
      }
    },
    
    // Status labels
    status: {
      changeStatus: "Alterar Status",
      pending: "Pendente",
      in_review: "Em Revisão",
      approved: "Aprovado",
      closed: "Fechado",
      rejected: "Rejeitado"
    },
    
    // Priority labels
    priority: {
      low: "Baixa",
      medium: "Média",
      high: "Alta"
    },
    
    // Table columns
    table: {
      requestTitle: "Título da Solicitação",
      requested: "Solicitado",
      activities: "Atividades",
      priority: "Prioridade",
      status: "Status",
      date: "Data",
      actions: "Ações"
    },
    
    // Actions
    actions: {
      manageSubsidy: "Gerenciar Subsídio",
      approve: "Aprovar",
      reject: "Rejeitar",
      viewToggle: {
        table: "Tabela",
        kanban: "Kanban"
      }
    },
    
    // Kanban
    kanban: {
      groups: {
        pending: "Pendente",
        in_review: "Em Revisão",
        approved: "Aprovado",
        closed: "Fechado",
        rejected: "Rejeitado"
      }
    },
    
    // Status Rules (tooltips)
    statusRules: {
      pending: "Status inicial. Também usado quando há itens pendentes, como necessidade de enviar um novo recibo. Pode transitar para Em Revisão, Aprovado ou Rejeitado, mas nunca diretamente para Fechado.",
      in_review: "Documento em revisão. Indica que a solicitação está sendo revisada. Pode retornar para Pendente ou avançar para Aprovado ou Rejeitado, mas nunca diretamente para Fechado.",
      approved: "Subsídio foi aprovado e está liberado para pagamento. Esta é uma ação irreversível e só pode transitar para Fechado. Atualizações no subsídio ou arquivos ainda são possíveis.",
      rejected: "Subsídio foi rejeitado e não será subsidiado por algum motivo. Esta é uma ação irreversível e só pode transitar para Fechado. Atualizações no subsídio ou arquivos ainda são possíveis.",
      closed: "Status final, indicando que todas as ações necessárias para o subsídio foram concluídas. A partir daqui, nenhuma atualização ou ação de exclusão pode ser realizada no subsídio ou arquivos."
    },
    
    // Card Header
    card: {
      title: "Solicitações de Subsídio",
      description: "Gerencie e revise todas as solicitações de subsídio"
    },
    
    // Charts
    charts: {
      byDepartment: {
        title: "Solicitações ao Longo do Tempo por Departamento",
        description: "Solicitações mensais de subsídio por todos os departamentos",
        descriptionWithYear: "Solicitações mensais de subsídio por todos os departamentos - {{year}}",
        noData: "Nenhum dado de departamento disponível",
        departmentsTracked: "{{count}} departamentos rastreados",
        top: "Top",
        chartTypes: {
          area: "Área",
          bar: "Barra"
        }
      },
      overTime: {
        title: "Solicitações ao Longo do Tempo",
        description: "Status mensal de solicitações de subsídio - {{year}}",
        quarterFilters: {
          all: "Todos",
          q1: "T1",
          q2: "T2",
          q3: "T3",
          q4: "T4"
        },
        footer: {
          approvalRate: "Taxa de aprovação",
          totalRequests: "Total de solicitações",
          approved: "aprovado",
          pending: "pendente",
          rejected: "rejeitado",
          in_review: "em revisão"
        },
        statusLabels: {
          approved: "Aprovado",
          pending: "Pendente",
          rejected: "Rejeitado"
        }
      },
      statusOverview: {
        title: "Visão Geral de Status",
        description: "Distribuição de solicitações por status atual",
        allDescription: "Mostrando todas as distribuições de status",
        selectStatus: "Selecionar status",
        selectLabel: "Selecione um status",
        requests: "Solicitações",
        total: "Total",
        statusLabels: {
          pending: "Pendente",
          in_review: "Em Revisão",
          approved: "Aprovado",
          rejected: "Rejeitado",
          closed: "Fechado"
        }
      }
    }
  },
  
  nl: {
    // Page title
    pageTitle: "Subsidie Goedkeuringen",
    pageDescription: "Beoordeel en keur subsidieaanvragen van kerken en instellingen goed",
    
    // Toasts
    toasts: {
      loadingError: "Fout bij laden van subsidieaanvragen",
      refreshing: "Gegevens verversen...",
      refreshSuccess: "Gegevens succesvol ververst",
      refreshError: "Fout bij verversen van gegevens",
      approveSuccess: "Subsidie succesvol goedgekeurd",
      approveError: "Fout bij goedkeuren: {{message}}",
      rejectSuccess: "Subsidie afgewezen",
      rejectError: "Fout bij afwijzen: {{message}}",
      statusUpdateSuccess: "Status succesvol bijgewerkt",
      statusUpdateError: "Fout bij bijwerken status: {{message}}",
      statusNotFound: "Status \"{{status}}\" niet gevonden",
      invalidStatus: "Ongeldige status",
      inReviewNotFound: "Status \"In Beoordeling\" niet gevonden",
      statusClosed: "Status Gesloten kan niet worden gewijzigd",
      inReviewToClosed: "Kan aanvragen In Beoordeling niet sluiten",
      mustBeFinal: "Moet Goedgekeurd of Afgewezen zijn om te sluiten",
      finalState: "Kan alleen wijzigen naar Gesloten",
      documentsPending: "Alle documenten moeten eerst worden gevalideerd",
      documentsRejected: "Kan subsidie met afgewezen documenten niet goedkeuren",
      onlyFinancialCanClose: "Alleen gebruikers met de rol Financieel Manager kunnen subsidieaanvragen sluiten"
    },
    
    // Default values
    defaults: {
      untitledRequest: "Naamloze aanvraag",
      rejectionReason: "Afgewezen door beheerder",
      otherDepartment: "Anders"
    },
    
    // KPI Cards
    kpis: {
      totalRequests: {
        title: "Totaal Aanvragen",
        subtitle: "Alle subsidieaanvragen"
      },
      pendingReview: {
        title: "In Behandeling",
        subtitle: "Wachtend op goedkeuring"
      },
      totalRequested: {
        title: "Totaal Aangevraagd",
        subtitle: "Som van alle aanvragen"
      },
      totalApproved: {
        title: "Totaal Goedgekeurd",
        subtitle: "Goedgekeurd bedrag"
      },
      approvalRate: {
        title: "Goedkeuringspercentage",
        subtitle: "Aanvragen goedgekeurd"
      },
      trend: {
        vsLastMonth: "vs. vorige maand"
      }
    },
    
    // Status labels
    status: {
      changeStatus: "Status Wijzigen",
      pending: "In Behandeling",
      in_review: "In Beoordeling",
      approved: "Goedgekeurd",
      closed: "Gesloten",
      rejected: "Afgewezen"
    },
    
    // Priority labels
    priority: {
      low: "Laag",
      medium: "Gemiddeld",
      high: "Hoog"
    },
    
    // Table columns
    table: {
      requestTitle: "Aanvraag Titel",
      requested: "Aangevraagd",
      activities: "Activiteiten",
      priority: "Prioriteit",
      status: "Status",
      date: "Datum",
      actions: "Acties"
    },
    
    // Actions
    actions: {
      manageSubsidy: "Subsidie Beheren",
      approve: "Goedkeuren",
      reject: "Afwijzen",
      viewToggle: {
        table: "Tabel",
        kanban: "Kanban"
      }
    },
    
    // Kanban
    kanban: {
      groups: {
        pending: "In Behandeling",
        in_review: "In Beoordeling",
        approved: "Goedgekeurd",
        closed: "Gesloten",
        rejected: "Afgewezen"
      }
    },
    
    // Status Rules (tooltips)
    statusRules: {
      pending: "Initiële status. Ook gebruikt wanneer er openstaande items zijn, zoals het verzenden van een nieuwe kwitantie. Kan overgaan naar In Beoordeling, Goedgekeurd of Afgewezen, maar nooit direct naar Gesloten.",
      in_review: "Document in beoordeling. Geeft aan dat de aanvraag wordt beoordeeld. Kan teruggaan naar In Behandeling of overgaan naar Goedgekeurd of Afgewezen, maar nooit direct naar Gesloten.",
      approved: "Subsidie is goedgekeurd en vrijgegeven voor betaling. Dit is een onomkeerbare actie en kan alleen overgaan naar Gesloten. Updates aan de subsidie of bestanden zijn nog mogelijk.",
      rejected: "Subsidie is afgewezen en zal om een bepaalde reden niet worden gesubsidieerd. Dit is een onomkeerbare actie en kan alleen overgaan naar Gesloten. Updates aan de subsidie of bestanden zijn nog mogelijk.",
      closed: "Eindstatus, wat aangeeft dat alle noodzakelijke acties voor de subsidie zijn voltooid. Vanaf hier kunnen geen update- of verwijderacties meer worden uitgevoerd op de subsidie of bestanden."
    },
    
    // Card Header
    card: {
      title: "Subsidie Aanvragen",
      description: "Beheer en beoordeel alle subsidieaanvragen"
    },
    
    // Charts
    charts: {
      byDepartment: {
        title: "Aanvragen Over Tijd per Afdeling",
        description: "Maandelijkse subsidieaanvragen per afdeling",
        descriptionWithYear: "Maandelijkse subsidieaanvragen per afdeling - {{year}}",
        noData: "Geen afdelingsgegevens beschikbaar",
        departmentsTracked: "{{count}} afdelingen gevolgd",
        top: "Top",
        chartTypes: {
          area: "Gebied",
          bar: "Staaf"
        }
      },
      overTime: {
        title: "Aanvragen Over Tijd",
        description: "Maandelijkse subsidieaanvraag status - {{year}}",
        quarterFilters: {
          all: "Alle",
          q1: "K1",
          q2: "K2",
          q3: "K3",
          q4: "K4"
        },
        footer: {
          approvalRate: "Goedkeuringspercentage",
          totalRequests: "Totaal aanvragen",
          approved: "goedgekeurd",
          pending: "in behandeling",
          rejected: "afgewezen",
          in_review: "in beoordeling"
        },
        statusLabels: {
          approved: "Goedgekeurd",
          pending: "In Behandeling",
          rejected: "Afgewezen"
        }
      },
      statusOverview: {
        title: "Status Overzicht",
        description: "Verdeling van aanvragen per huidige status",
        allDescription: "Alle status verdelingen weergegeven",
        selectStatus: "Selecteer status",
        selectLabel: "Selecteer een status",
        requests: "Aanvragen",
        total: "Totaal",
        statusLabels: {
          pending: "In Behandeling",
          in_review: "In Beoordeling",
          approved: "Goedgekeurd",
          rejected: "Afgewezen",
          closed: "Gesloten"
        }
      }
    }
  }
}
