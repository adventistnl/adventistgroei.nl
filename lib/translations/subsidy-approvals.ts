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
      documentsPending: "All documents must be validated first"
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
      documentsPending: "Alle documenten moeten eerst worden gevalideerd"
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
