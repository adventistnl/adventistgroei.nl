export const subsidyRequestTranslations = {
  en: {
    // Page title
    pageTitle: "Subsidy Requests",
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
      finalState: "This request is in a final state and can only be closed.",
      documentsPending: "All documents must be validated before proceeding.",
      mustBeAdvancedClosed: "Advance subsidies must be Advanced Closed first.",
      documentsRejected: "Cannot approve subsidy with rejected documents",
      onlyFinancialCanClose: "Only users with the Financial Manager role can close subsidy requests",
      refundNotRequested: "No refund has been requested for this subsidy"
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
      rejected: "Rejected",
      advanced_closed: "Advanced Closed",
      waiting_refund: "Waiting Refund",
      waiting_documents: "Waiting for Documents"
    },
    
    // Priority labels
    priority: {
      low: "Low",
      medium: "Medium",
      high: "High"
    },
    
    // Table columns
    table: {
      requestTitle: "Request",
      type: "Type",
      requested: "Requested",
      activities: "Activities",
      priority: "Priority",
      status: "Status",
      date: "Date",
      responsibles: "Responsibles",
      actions: "Actions"
    },
    types: {
      advance: "Advance",
      refund: "Refund",
      subsidy: "Subsidy"
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
    
    // Permissions
    permissions: {
      financeOnly: "Only finance users can approve or reject subsidy requests"
    },
    
    // UI Labels
    ui: {
      itemCountLabel: "requests"
    },
    
    // Filters
    filters: {
      showAllRequests: "Show only my requests",
      showingMyRequests: "Showing my requests only",
      clickToShowAll: "Click to show all requests",
      clickToFilter: "Click to filter by your responsibilities"
    },
    
    // Kanban
    kanban: {
      groups: {
        pending: "Pending",
        in_review: "In Review",
        approved: "Approved",
        closed: "Closed",
        rejected: "Rejected",
        advanced_closed: "Advanced Closed",
        waiting_refund: "Waiting Refund",
        waiting_documents: "Waiting for Documents"
      }
    },
    
    // Status Rules (tooltips)
    statusRules: {
      pending: "Initial status. Also used when there are pending items, such as needing to send a new receipt. Can transition to In Review, Approved, or Rejected, but never directly to Closed.",
      in_review: "Document under review. Indicates the request is being reviewed. Can return to Pending or move to Approved or Rejected, but never directly to Closed.",
      approved: "Subsidy has been approved and is released for payment. This is an irreversible action and can only transition to Closed. Updates to the subsidy or files are still possible.",
      rejected: "Subsidy has been rejected and will not be subsidized for some reason. This is an irreversible action and can only transition to Closed. Updates to the subsidy or files are still possible.",
      closed: "Final status, indicating that all necessary actions for the subsidy have been completed. From here, no update or deletion actions can be performed on the subsidy or files.",
      advanced_closed: "Final status for advance subsidies. Indicates the advance has been reconciled and closed.",
      waiting_refund: "Subsidy is waiting for refund processing. Funds will be returned to the annual budget after confirmation.",
      waiting_documents: "Advance has been paid. Waiting for the requester to upload receipt documents for validation."
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
          in_review: "in review",
          closed: "closed",
          advanced_closed: "advanced closed",
          waiting_refund: "waiting refund",
          waiting_documents: "waiting documents"
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
          closed: "Closed",
          advanced_closed: "Advanced Closed",
          waiting_refund: "Waiting Refund",
          waiting_documents: "Waiting for Documents"
        }
      }
    },
    
    // Roles
    roles: {
      requester: "Requester",
      projectOwner: "Project Owner",
      departmentLeader: "Department Leader",
      financeManager: "Finance Manager"
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
      mustBeAdvancedClosed: "Subsídios de adiantamento devem ser Adiantamento Fechado primeiro.",
      documentsRejected: "Não é possível aprovar subsídio com documentos rejeitados",
      onlyFinancialCanClose: "Apenas usuários com a função de Gerente Financeiro podem fechar solicitações de subsídio",
      refundNotRequested: "Nenhum reembolso foi solicitado para este subsídio"
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
      rejected: "Rejeitado",
      advanced_closed: "Adiantamento Fechado",
      waiting_refund: "Aguardando Reembolso",
      waiting_documents: "Aguardando Comprovantes"
    },
    
    // Priority labels
    priority: {
      low: "Baixa",
      medium: "Média",
      high: "Alta"
    },
    
    // Table columns
    table: {
      requestTitle: "Solicitação",
      type: "Tipo",
      requested: "Solicitado",
      activities: "Atividades",
      priority: "Prioridade",
      status: "Status",
      date: "Data",
      responsibles: "Responsáveis",
      actions: "Ações"
    },
    types: {
      advance: "Adiantamento",
      refund: "Reembolso",
      subsidy: "Subsídio"
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
    
    // Permissions
    permissions: {
      financeOnly: "Apenas usuários de finanças podem aprovar ou rejeitar solicitações de subsídio"
    },
    
    // UI Labels
    ui: {
      itemCountLabel: "solicitações"
    },
    
    // Filters
    filters: {
      showAllRequests: "Mostrar apenas meus pedidos",
      showingMyRequests: "Mostrando apenas meus pedidos",
      clickToShowAll: "Clique para mostrar todos os pedidos",
      clickToFilter: "Clique para filtrar por suas responsabilidades"
    },
    
    // Kanban
    kanban: {
      groups: {
        pending: "Pendente",
        in_review: "Em Revisão",
        approved: "Aprovado",
        closed: "Fechado",
        rejected: "Rejeitado",
        advanced_closed: "Adiantamento Fechado",
        waiting_refund: "Aguardando Reembolso",
        waiting_documents: "Aguardando Comprovantes"
      }
    },
    
    // Status Rules (tooltips)
    statusRules: {
      pending: "Status inicial. Também usado quando há itens pendentes, como necessidade de enviar um novo recibo. Pode transitar para Em Revisão, Aprovado ou Rejeitado, mas nunca diretamente para Fechado.",
      in_review: "Documento em revisão. Indica que a solicitação está sendo revisada. Pode retornar para Pendente ou avançar para Aprovado ou Rejeitado, mas nunca diretamente para Fechado.",
      approved: "Subsídio foi aprovado e está liberado para pagamento. Esta é uma ação irreversível e só pode transitar para Fechado. Atualizações no subsídio ou arquivos ainda são possíveis.",
      rejected: "Subsídio foi rejeitado e não será subsidiado por algum motivo. Esta é uma ação irreversível e só pode transitar para Fechado. Atualizações no subsídio ou arquivos ainda são possíveis.",
      closed: "Status final, indicando que todas as ações necessárias para o subsídio foram concluídas. A partir daqui, nenhuma atualização ou ação de exclusão pode ser realizada no subsídio ou arquivos.",
      advanced_closed: "Status final para subsídios adiantados. Indica que o adiantamento foi reconciliado e fechado.",
      waiting_refund: "Subsídio aguardando processamento de reembolso. Os fundos serão devolvidos ao orçamento anual após confirmação.",
      waiting_documents: "Adiantamento pago. Aguardando o solicitante fazer o upload dos comprovantes para validação."
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
          in_review: "em revisão",
          closed: "fechado",
          advanced_closed: "adiantamento fechado",
          waiting_refund: "aguardando reembolso",
          waiting_documents: "aguardando comprovantes"
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
          closed: "Fechado",
          advanced_closed: "Adiantamento Fechado",
          waiting_refund: "Aguardando Reembolso",
          waiting_documents: "Aguardando Comprovantes"
        }
      }    },
    
    // Roles
    roles: {
      requester: "Solicitante",
      projectOwner: "Proprietário do Projeto",
      departmentLeader: "Líder do Departamento",
      financeManager: "Gerente Financeiro"    }
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
      mustBeAdvancedClosed: "Voorschotsubsidies moeten eerst Geavanceerd Gesloten zijn.",
      documentsRejected: "Kan subsidie met afgewezen documenten niet goedkeuren",
      onlyFinancialCanClose: "Alleen gebruikers met de rol Financieel Manager kunnen subsidieaanvragen sluiten",
      refundNotRequested: "Er is geen terugbetaling aangevraagd voor deze subsidie"
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
      rejected: "Afgewezen",
      advanced_closed: "Geavanceerd Gesloten",
      waiting_refund: "Wacht op Terugbetaling",
      waiting_documents: "Wacht op Documenten"
    },
    
    // Priority labels
    priority: {
      low: "Laag",
      medium: "Gemiddeld",
      high: "Hoog"
    },
    
    // Table columns
    table: {
      requestTitle: "Aanvraag",
      type: "Type",
      requested: "Aangevraagd",
      activities: "Activiteiten",
      priority: "Prioriteit",
      status: "Status",
      date: "Datum",
      responsibles: "Verantwoordelijken",
      actions: "Acties"
    },
    types: {
      advance: "Voorschot",
      refund: "Terugbetaling",
      subsidy: "Subsidie"
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
    
    // Permissions
    permissions: {
      financeOnly: "Alleen financiële gebruikers kunnen subsidieaanvragen goedkeuren of afwijzen"
    },
    
    // UI Labels
    ui: {
      itemCountLabel: "aanvragen"
    },
    
    // Filters
    filters: {
      showAllRequests: "Toon alleen mijn aanvragen",
      showingMyRequests: "Toont alleen mijn aanvragen",
      clickToShowAll: "Klik om alle aanvragen te tonen",
      clickToFilter: "Klik om te filteren op uw verantwoordelijkheden"
    },
    
    // Kanban
    kanban: {
      groups: {
        pending: "In Behandeling",
        in_review: "In Beoordeling",
        approved: "Goedgekeurd",
        closed: "Gesloten",
        rejected: "Afgewezen",
        advanced_closed: "Geavanceerd Gesloten",
        waiting_refund: "Wacht op Terugbetaling",
        waiting_documents: "Wacht op Documenten"
      }
    },
    
    // Status Rules (tooltips)
    statusRules: {
      pending: "Initiële status. Ook gebruikt wanneer er openstaande items zijn, zoals het verzenden van een nieuwe kwitantie. Kan overgaan naar In Beoordeling, Goedgekeurd of Afgewezen, maar nooit direct naar Gesloten.",
      in_review: "Document in beoordeling. Geeft aan dat de aanvraag wordt beoordeeld. Kan teruggaan naar In Behandeling of overgaan naar Goedgekeurd of Afgewezen, maar nooit direct naar Gesloten.",
      approved: "Subsidie is goedgekeurd en vrijgegeven voor betaling. Dit is een onomkeerbare actie en kan alleen overgaan naar Gesloten. Updates aan de subsidie of bestanden zijn nog mogelijk.",
      rejected: "Subsidie is afgewezen en zal om een bepaalde reden niet worden gesubsidieerd. Dit is een onomkeerbare actie en kan alleen overgaan naar Gesloten. Updates aan de subsidie of bestanden zijn nog mogelijk.",
      closed: "Eindstatus, wat aangeeft dat alle noodzakelijke acties voor de subsidie zijn voltooid. Vanaf hier kunnen geen update- of verwijderacties meer worden uitgevoerd op de subsidie of bestanden.",
      advanced_closed: "Eindstatus voor voorschotsubsidies. Geeft aan dat het voorschot is verrekend en afgesloten.",
      waiting_refund: "Subsidie wacht op terugbetalingsverwerking. Fondsen worden na bevestiging teruggegeven aan het jaarbudget.",
      waiting_documents: "Voorschot is betaald. Wacht op de aanvrager om kassabonnen te uploaden voor validatie."
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
          in_review: "in beoordeling",
          closed: "gesloten",
          advanced_closed: "geavanceerd gesloten",
          waiting_refund: "wachtend op terugbetaling",
          waiting_documents: "wacht op documenten"
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
          closed: "Gesloten",
          advanced_closed: "Geavanceerd Gesloten",
          waiting_refund: "Wachtend op Terugbetaling",
          waiting_documents: "Wacht op Documenten"
        }
      }
    },
    
    // Roles
    roles: {
      requester: "Aanvrager",
      projectOwner: "Projecteigenaar",
      departmentLeader: "Afdelingshoofd",
      financeManager: "Financiël Manager"
    }
  }
}
