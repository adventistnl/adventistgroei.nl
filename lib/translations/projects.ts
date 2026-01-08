export const projectTranslations = {
  en: {
    // Navigation
    projects: "Projects",
    reportsAndProjects: "Reports & Projects",
    
    // Page titles
    projectsPage: "Projects",
    projectDetails: "Project Details",
    createProject: "Create New Project",
    projectsOverview: "Projects Overview",
    projectsDashboard: "Projects Dashboard",
    
    // Dashboard KPIs
    kpis: {
      totalProjects: "Total Projects",
      activeProjects: "Active Projects",
      completedProjects: "Completed Projects",
      upcomingProjects: "Upcoming Projects",
      totalBudget: "Total Budget",
      totalSubsidyRequests: "Subsidy Requests",
      totalSubsidyAmount: "Total Subsidy Amount",
      averageProjectBudget: "Average Project Budget",
      projectsWithVolunteers: "Projects with Volunteers",
      departmentsInvolved: "Departments Involved",
      vsPreviousMonth: "vs previous month",
      activeDeactivted: "{{active}} active | {{completed}} completed",
      waitingToStart: "{{count}} waiting to start",
      newThisMonth: "new this month",
      average: "Average",
      percentUsed: "{{percent}}% used",
      subsidizedBudget: "Subsidized Budget",
      localContribution: "{{amount}} local contribution",
      ofTotalBudget: "of total budget",
      completionRate: "Completion Rate",
      finalizedOf: "{{completed}} of {{total}} finalized",
      requested: "requested",
      approvedPercent: "{{percent}}% approved",
      ofProjects: "{{percent}}% of projects",
      growingEngagement: "growing engagement"
    },
    
    // Charts
    charts: {
      projectsByDepartment: "Projects by Department",
      subsidyDistribution: "Subsidy Status Distribution",
      budgetVsSubsidies: "Budget vs Subsidies by Department",
      projectsTimeline: "Projects Timeline",
      monthlyProgress: "Monthly Progress",
      departmentBudgets: "Department Budget Analysis",
      subsidyStatusBreakdown: "Subsidy Status Breakdown",
      projectsCreatedOverTime: "Projects Created Over Time",
      monthlyProjectCreation: "Monthly project creation by department",
      noProjectData: "No project data available",
      projectsCreatedThisYear: "projects created this year",
      top: "Top",
      distributionByDepartment: "Distribution of projects across departments",
      selectDepartment: "Select department",
      projectsWithMostActivities: "Projects with Most Activities",
      top10Activities: "Top 10 projects by number of registered activities",
      projects: "Projects",
      activities: "Activities"
    },
    
    // Table columns
    table: {
      projectTitle: "Project Title",
      department: "Department",
      subsidyRequests: "Subsidy Requests",
      subsidyAmount: "Subsidy Amount",
      activities: "Activities",
      status: "Status",
      startDate: "Start Date",
      endDate: "End Date",
      volunteers: "Volunteers",
      actions: "Actions",
      budget: "Budget",
      period: "Period",
      timeline: "Timeline",
      daysLeft: "Days Left",
      daysOverdue: "{{days}}d overdue",
      daysRemaining: "{{days}}d",
      today: "Today",
      yes: "Yes",
      no: "No",
      clearFilters: "Clear filters",
      columns: "Columns",
      toggleColumns: "Toggle Columns",
      rowsPerPage: "Rows per page",
      showingResults: "Showing {{from}} to {{to}} of {{total}} results",
      previous: "Previous",
      next: "Next",
      noResults: "No results found",
      openMenu: "Open menu"
    },
    
    // Modal
    modal: {
      createProject: "Create New Project",
      editProject: "Edit Project",
      projectInformation: "Project Information",
      budgetInformation: "Budget Information",
      additionalSettings: "Additional Settings"
    },
    
    // Filters
    filters: {
      allDepartments: "All Departments",
      allStatuses: "All Statuses",
      allPeriods: "All Periods",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      last6Months: "Last 6 Months",
      lastYear: "Last Year",
      currentYear: "Current Year",
      filterByDepartment: "Filter by department"
    },
    
    // Toast messages
    toasts: {
      projectCreated: "Project created successfully!",
      projectUpdated: "Project updated successfully!",
      projectDeleted: "Project deleted successfully!",
      eventCreated: "Event created successfully!",
      communicationCreated: "Communication created successfully!",
      loadingData: "Loading projects data...",
      projectUpdating: "Updating project...",
      projectDeleting: "Deleting project...",
      dataRefreshing: "Data refreshing...",
      dataRefreshed: "Data refreshed successfully!",
      errorLoading: "Error loading projects data",
      filterApplied: "Filter applied successfully"
    },
    
    // Error messages
    errors: {
      cannotDeleteProjectWithApprovedSubsidies: "Cannot delete project with approved or closed subsidy requests. Please change the status of associated subsidies first.",
      cannotDeleteActivityWithApprovedSubsidies: "Cannot delete activity with approved or closed subsidy requests. Please change the status first.",
      cannotDeleteApprovedSubsidy: "Cannot delete approved or closed subsidy requests.",
      genericDeleteError: "Failed to delete. Please try again.",
      updateError: "Error updating project",
      departmentNotFound: "Department not found",
      titleRequired: "Title is required",
      descriptionRequired: "Description is required",
      departmentRequired: "Department is required",
      budgetPositive: "Budget must be greater than 0",
      endDateAfterStart: "End date must be after start date"
    },
    
    // Steps
    steps: {
      projectInfo: "Project Info",
      budgetDetails: "Budget & Timeline",
      additionalOptions: "Additional Options",
      review: "Review & Submit"
    },
    
    // Event modal
    event: {
      createEvent: "Create Event",
      eventTitle: "Event Title",
      eventDescription: "Event Description",
      eventType: "Event Type",
      maxParticipants: "Max Participants",
      ticketAmount: "Ticket Amount",
      location: "Location",
      subscriptionExpires: "Subscription Expires",
      targetType: "Target Type",
      targetId: "Target",
      evangelism: "Evangelism",
      show: "Show/Conference",
      institution: "Institution",
      region: "Region",
      department: "Department",
      church: "Church",
      user: "User",
      selectTarget: "Select Target",
      enterEventTitle: "Enter event title",
      describeEvent: "Describe the event details and objectives",
      enterLocation: "Enter event location",
      free: "Free",
      paid: "Paid"
    },
    
    // Communication modal
    communication: {
      createCommunication: "Create Communication",
      communicationTitle: "Communication Title",
      communicationContent: "Content",
      communicationType: "Type",
      priority: "Priority",
      scheduleAt: "Schedule At",
      recipients: "Recipients",
      announcement: "Announcement",
      notification: "Notification",
      newsletter: "Newsletter",
      high: "High",
      medium: "Medium",
      low: "Low",
      addRecipient: "Add Recipient",
      selectRecipients: "Select Recipients",
      enterTitle: "Enter communication title",
      enterContent: "Enter communication content",
      scheduleNow: "Send Now",
      scheduleLater: "Schedule Later"
    },
    
    // Budget tracking
    budget: {
      annualBudget: "Annual Budget",
      budgetUsed: "Budget Used",
      budgetUtilization: "Budget Utilization",
      remainingBudget: "Remaining Budget",
      budgetOverview: "Budget Overview"
    },
    
    // Action buttons
    actions: {
      createEvent: "Create Event",
      createCommunication: "Create Communication",
      viewDetails: "View Details",
      editProject: "Edit Project",
      duplicateProject: "Duplicate Project",
      loadingCreator: "🚀 Loading project creator..."
    },
    
    // Project Details Page
    details: {
      projectDetails: "Project Details",
      projectOverview: "Project Overview",
      budgetOverview: "Budget Overview",
      activitiesOverview: "Activities Overview",
      projectProgress: "Project Progress",
      subsidyActivities: "Subsidy Activities",
      projectTimeline: "Project Timeline",
      budgetDistribution: "Budget Distribution",
      monthlyProgress: "Monthly Progress",
      receiptsAndApprovals: "Receipts & Approvals",
      projectInformation: "Project Information",
      budgetInformation: "Budget Information",
      activityName: "Activity Name",
      activityBudget: "Activity Budget",
      activityStatus: "Activity Status",
      approvedAmount: "Approved Amount",
      receiptsCount: "Receipts",
      viewReceipts: "View Receipts",
      editActivity: "Edit Activity",
      deleteActivity: "Delete Activity",
      addActivity: "Add Activity",
      noActivities: "No activities found",
      noActivitiesDesc: "This project doesn't have any subsidy activities yet.",
      totalBudget: "Total Budget",
      usedBudget: "Used Budget",
      approvedBudget: "Approved Budget",
      pendingBudget: "Pending Budget",
      budgetProgress: "Budget Progress",
      completionRate: "Completion Rate",
      projectDuration: "Project Duration",
      daysRemaining: "Days Remaining",
      daysElapsed: "Days Elapsed"
    },
    
    // Subsidy Management
    subsidy: {
      subsidyRequests: "Subsidy Requests",
      addSubsidy: "Add Subsidy",
      editSubsidy: "Edit Subsidy",
      deleteSubsidy: "Delete Subsidy",
      approveSubsidy: "Approve Subsidy",
      rejectSubsidy: "Reject Subsidy",
      subsidyDescription: "Subsidy Description",
      totalBudget: "Total Budget",
      requestedAmount: "Requested Amount",
      approvedAmount: "Approved Amount",
      pendingAmount: "Pending Amount",
      subsidyStatus: "Subsidy Status",
      requester: "Requester",
      church: "Church",
      completionRate: "Completion Rate",
      expandActivities: "Expand Activities",
      collapseActivities: "Collapse Activities",
      noSubsidies: "No subsidies found",
      noSubsidiesDesc: "This project doesn't have any subsidy requests yet.",
      deleteConfirmTitle: "Delete Subsidy Request",
      deleteConfirmDesc: "This action will permanently delete the subsidy request and all related activities and receipts. This cannot be undone.",
      deleteEffects: "Effects of this action:",
      deleteEffect1: "All activities will be permanently deleted",
      deleteEffect2: "All uploaded receipts will be removed",
      deleteEffect3: "Approval history will be lost",
      deleteEffect4: "Budget allocations will be reset",
      enterDescription: "Enter subsidy description",
      selectChurch: "Select church",
      selectStatus: "Select status",
      subsidyCreated: "Subsidy request created successfully!",
      subsidyUpdated: "Subsidy request updated successfully!",
      subsidyDeleted: "Subsidy request deleted successfully!",
      subsidyApproved: "Subsidy request approved!",
      subsidyRejected: "Subsidy request rejected!"
    },
    
    // Activity Management
    activity: {
      addActivity: "Add Activity",
      editActivity: "Edit Activity",
      deleteActivity: "Delete Activity",
      activityName: "Activity Name",
      activityDescription: "Activity Description",
      budgetAmount: "Budget Amount",
      receiptsUploaded: "Receipts Uploaded",
      uploadReceipt: "Upload Receipt",
      viewReceipts: "View Receipts",
      noReceipts: "No receipts uploaded",
      receiptAmount: "Receipt Amount",
      receiptDescription: "Receipt Description",
      receiptDate: "Receipt Date",
      receiptFile: "Receipt File",
      dragDropText: "Drag and drop your receipt image here, or click to select",
      supportedFormats: "Supported formats: JPG, PNG, PDF (max 5MB)",
      uploadSuccess: "Receipt uploaded successfully!",
      receiptApproved: "Receipt approved!",
      receiptRejected: "Receipt rejected!",
      enterActivityName: "Enter activity name",
      describeActivity: "Describe the activity details and objectives",
      activityCreated: "Activity created successfully!",
      activityUpdated: "Activity updated successfully!",
      activityDeleted: "Activity deleted successfully!"
    },
    
    // Report Management
    report: {
      createReport: "Create Report",
      reportTitle: "Report Title",
      reportDescription: "Report Description",
      reportType: "Report Type",
      reportStatus: "Report Status",
      submissionDate: "Submission Date",
      reportPeriod: "Report Period",
      startDate: "Start Date",
      endDate: "End Date",
      reportNote: "Additional Notes",
      reviewerNotes: "Reviewer Notes",
      attachedFile: "Attached File",
      financial: "Financial Report",
      progress: "Progress Report",
      annual: "Annual Report",
      approved: "Approved",
      inReview: "In Review",
      onHold: "On Hold",
      needsAdjustment: "Needs Adjustment",
      rejected: "Rejected",
      enterTitle: "Enter report title",
      describeReport: "Describe the report content and objectives",
      selectType: "Select report type",
      selectStatus: "Select report status",
      addNotes: "Add any additional notes or comments",
      uploadFile: "Upload supporting file (optional)",
      reportCreated: "Report created successfully!",
      redirectingToReports: "Redirecting to reports page...",
      projectSummary: "Project Summary",
      budgetSummary: "Budget Summary",
      financialSummary: "Financial Summary",
      progressSummary: "Progress Summary",
      totalProjectBudget: "Total Project Budget",
      projectBudgetSpent: "Project Budget Spent",
      projectBudgetRemaining: "Project Budget Remaining",
      totalSubsidiesRequested: "Total Subsidies Requested",
      totalSubsidiesApproved: "Total Subsidies Approved",
      completionPercentage: "Completion Percentage",
      reportInformation: "Report Information",
      financialData: "Financial Data",
      progressData: "Progress Data",
      reportGenerated: "Report will be generated based on current project data",
      // Steps
      stepBasicInfo: "Basic Information",
      stepFinancialData: "Financial Data",
      stepProgressData: "Progress & Completion",
      stepReviewSubmit: "Review & Submit",
      // Export options
      exportOptions: "Export Options",
      downloadPDF: "Download PDF",
      downloadCSV: "Download CSV",
      downloadExcel: "Download Excel",
      exportDescription: "Choose how you want to export this report",
      reportPreview: "Report Preview",
      dataValidation: "Data Validation",
      allFieldsValid: "All fields are properly filled",
      readyToSubmit: "Report is ready to submit"
    },
    
    // Project status
    active: "Active",
    upcoming: "Upcoming", 
    completed: "Completed",
    
    // Project types
    public: "Public",
    private: "Private",
    
    // Actions
    newProject: "New Project",
    viewProject: "View Project",
    editProject: "Edit Project",
    deleteProject: "Delete Project",
    deleteProjectConfirmTitle: "Delete Project?",
    deleteProjectConfirmDesc: "Are you sure you want to delete this project? This action cannot be undone.",
    deleteProjectWarning: "This action cannot be undone",
    deleteProjectButton: "Delete Permanently",
    deleteProjectUnderstand: "I understand that this action is permanent and cannot be undone",
    deleteProjectTypeConfirm: "Type 'delete project' to confirm",
    deleteProjectDeleting: "Deleting...",
    deleteProjectAffectedComponents: "Affected Components",
    deleteProjectActivities: "Activities",
    deleteProjectSubsidies: "Subsidies",
    deleteProjectVolunteers: "Volunteers",
    deleteProjectDocuments: "Documents",
    deleteProjectViewConsequences: "View Consequences",
    deleteProjectConsequence1: "All activities will be removed",
    deleteProjectConsequence1Desc: "All activities associated with the project will be permanently deleted.",
    deleteProjectConsequence2: "Subsidies will be removed",
    deleteProjectConsequence2Desc: "All subsidy requests associated with the project will be removed.",
    deleteProjectConsequence3: "Volunteers will be unlinked",
    deleteProjectConsequence3Desc: "All volunteers linked to the project will lose access.",
    deleteProjectConsequence4: "Documents will be deleted",
    deleteProjectConsequence4Desc: "All documents associated with the project will be permanently removed.",
    deleteProjectAcknowledge: "I understand that this action cannot be undone and all data will be permanently removed.",
    deleteProjectTypeConfirmLabel: "Type the confirmation text to proceed",
    deleteProjectConfirmHelp: "Type \"delete project\" to confirm",
    shareProject: "Share Project",
    manageVolunteers: "Manage Volunteers",
    joinAsVolunteer: "Join as Volunteer",
    
    // Form fields
    projectTitle: "Project Title",
    projectDescription: "Project Description",
    startDate: "Start Date",
    endDate: "End Date",
    languagePreference: "Language Preference",
    department: "Department",
    privateProject: "Private Project",
    requestVolunteers: "Request Volunteers",
    
    // Form placeholders
    enterProjectTitle: "Enter project title",
    describeProject: "Describe your project goals, activities, and expected outcomes",
    selectDepartment: "Select department",
    selectLanguage: "Select language",
    unknown: "Unknown",
    
    // Form descriptions
    privateProjectDesc: "Only visible to authorized users",
    requestVolunteersDesc: "Allow volunteers to join this project",
    
    // Edit Modal
    editModalTitle: "Edit Project",
    editProjectInfo: "Edit project information",
    projectPeriod: "Project Period",
    projectPeriodDesc: "Define start and end dates",
    additionalConfig: "Additional Settings",
    additionalConfigDesc: "Additional project settings",
    projectType: "Project Type",
    selectType: "Select type",
    local: "Local",
    global: "Global",
    previous: "Previous",
    next: "Next",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    saving: "Saving...",
    step: "Step",
    of: "of",
    searchDepartment: "Search department...",
    noDepartmentFound: "No department found.",
    searchLanguage: "Search language...",
    noLanguageFound: "No language found.",
    selectDate: "Select date",
    basicInformation: "Basic Information",
    basicInformationDesc: "Basic project information",
    
    // Steps
    basicInfo: "Basic Info",
    settings: "Settings",
    review: "Review",
    
    // Stats
    organizationStats: "Organization Statistics",
    projectStats: "Project Details",
    duration: "Duration",
    volunteers: "Volunteers",
    language: "Language",
    
    // Messages
    noProjectsYet: "No projects yet",
    noProjectsFound: "No projects found",
    tryAdjustingFilters: "Try adjusting your search or filters",
    getStartedCreating: "Get started by creating your first project",
    projectNotFound: "Project Not Found",
    projectNotFoundDesc: "The project you're looking for doesn't exist.",
    
    // Search and filters
    searchProjects: "Search projects...",
    allStatus: "All Status",
    allProjects: "All Projects",
    
    // Project overview
    projectOverview: "Project Overview",
    projectTimeline: "Project Timeline",
    projectStart: "Project Start",
    projectEnd: "Project End",
    
    // Back navigation
    backToProjects: "Back to Projects",
    backToDashboard: "Back to Dashboard",
    
    // Volunteers
    volunteersWelcome: "Volunteers Welcome",
    thisProjectOpenVolunteers: "This project is open for volunteers to join.",
    
    // Required fields
    required: "Required",
    
    // Language options
    english: "English",
    dutch: "Nederlands",
    portuguese: "Português",

    // Year Filter
    yearFilter: {
      cannotAddBeyond: "Cannot add years beyond {{year}}",
      yearExists: "Year {{year}} already exists",
      yearAdded: "Year {{year}} added successfully",
      addYear: "Add Year"
    },
    
    // Page Header & navigation
    pageHeader: {
      subtitle: "Complete overview of projects and subsidy requests for the organization - {{year}}",
      manageDescription: "Manage and track all projects across departments"
    },
    
    navigation: {
      openingProject: "Opening {{title}}"
    },


  },
  nl: {
    // Navigation
    projects: "Projecten",
    reportsAndProjects: "Rapporten & Projecten",
    
    // Page titles
    projectsPage: "Projecten",
    projectDetails: "Project Details",
    createProject: "Nieuw Project Aanmaken",
    projectsOverview: "Projecten Overzicht",
    projectsDashboard: "Projecten Dashboard",
    
    // Dashboard KPIs
    kpis: {
      totalProjects: "Totaal Projecten",
      activeProjects: "Actieve Projecten",
      completedProjects: "Voltooide Projecten",
      upcomingProjects: "Aankomende Projecten",
      totalBudget: "Totaal Budget",
      totalSubsidyRequests: "Subsidie Aanvragen",
      totalSubsidyAmount: "Totaal Subsidie Bedrag",
      averageProjectBudget: "Gemiddeld Project Budget",
      projectsWithVolunteers: "Projecten met Vrijwilligers",
      departmentsInvolved: "Betrokken Afdelingen",
      vsPreviousMonth: "vs vorige maand",
      activeDeactivted: "{{active}} actief | {{completed}} voltooid",
      waitingToStart: "{{count}} wachtend op start",
      newThisMonth: "nieuw deze maand",
      average: "Gemiddeld",
      percentUsed: "{{percent}}% gebruikt",
      subsidizedBudget: "Gesubsidieerd Budget",
      localContribution: "{{amount}} lokale bijdrage",
      ofTotalBudget: "van totaal budget",
      completionRate: "Voltooiingspercentage",
      finalizedOf: "{{completed}} van {{total}} voltooid",
      requested: "aangevraagd",
      approvedPercent: "{{percent}}% goedgekeurd",
      ofProjects: "{{percent}}% van projecten",
      growingEngagement: "groeiende betrokkenheid"
    },
    
    // Charts
    charts: {
      projectsByDepartment: "Projecten per Afdeling",
      subsidyDistribution: "Subsidie Status Verdeling",
      budgetVsSubsidies: "Budget vs Subsidies per Afdeling",
      projectsTimeline: "Projecten Tijdlijn",
      monthlyProgress: "Maandelijkse Voortgang",
      departmentBudgets: "Afdeling Budget Analyse",
      subsidyStatusBreakdown: "Subsidie Status Uitsplitsing",
      projectsCreatedOverTime: "Projecten door de tijd heen gemaakt",
      monthlyProjectCreation: "Maandelijkse projectcreatie per afdeling",
      noProjectData: "Geen projectgegevens beschikbaar",
      projectsCreatedThisYear: "projecten gemaakt dit jaar",
      top: "Top",

      distributionByDepartment: "Verdeling van projecten per afdeling",
      selectDepartment: "Selecteer afdeling",
      projectsWithMostActivities: "Projecten met meeste activiteiten",
      top10Activities: "Top 10 projecten op basis van aantal geregistreerde activiteiten",
      projects: "Projecten",
      activities: "Activiteiten"
    },
    
    // Table columns
    table: {
      projectTitle: "Project Titel",
      department: "Afdeling",
      subsidyRequests: "Subsidie Aanvragen",
      subsidyAmount: "Subsidie Bedrag",
      activities: "Activiteiten",
      status: "Status",
      startDate: "Startdatum",
      endDate: "Einddatum",
      volunteers: "Vrijwilligers",
      actions: "Acties",
      budget: "Budget",
      period: "Periode",
      timeline: "Tijdlijn",
      daysLeft: "Dagen Over",
      daysOverdue: "{{days}}d achterstallig",
      daysRemaining: "{{days}}d",
      today: "Vandaag",
      yes: "Ja",
      no: "Nee",
      clearFilters: "Filters wissen",
      columns: "Kolommen",
      toggleColumns: "Kolommen in-/uitschakelen",
      rowsPerPage: "Rijen per pagina",
      showingResults: "Toont {{from}} tot {{to}} van {{total}} resultaten",
      previous: "Vorige",
      next: "Volgende",
      noResults: "Geen resultaten gevonden",
      openMenu: "Menu openen"
    },
    
    // Modal
    modal: {
      createProject: "Nieuw Project Aanmaken",
      editProject: "Project Bewerken",
      projectInformation: "Project Informatie",
      budgetInformation: "Budget Informatie",
      additionalSettings: "Aanvullende Instellingen"
    },
    
    // Filters
    filters: {
      allDepartments: "Alle Afdelingen",
      allStatuses: "Alle Statussen",
      allPeriods: "Alle Perioden",
      last30Days: "Laatste 30 Dagen",
      last90Days: "Laatste 90 Dagen",
      last6Months: "Laatste 6 Maanden",
      lastYear: "Vorig Jaar",
      currentYear: "Huidig Jaar",
      filterByDepartment: "Filteren op afdeling"
    },
    
    // Toast messages
    toasts: {
      projectCreated: "Project succesvol aangemaakt!",
      projectUpdated: "Project succesvol bijgewerkt!",
      projectDeleted: "Project succesvol verwijderd!",
      eventCreated: "Evenement succesvol aangemaakt!",
      communicationCreated: "Communicatie succesvol aangemaakt!",
      loadingData: "Projecten data laden...",
      projectUpdating: "Project bijwerken...",
      projectDeleting: "Project verwijderen...",
      dataRefreshing: "Data verversen...",
      dataRefreshed: "Data succesvol ververst!",
      errorLoading: "Fout bij laden van projecten data",
      filterApplied: "Filter succesvol toegepast"
    },
    
    // Error messages
    errors: {
      cannotDeleteProjectWithApprovedSubsidies: "Kan project niet verwijderen met goedgekeurde of afgesloten subsidie aanvragen. Wijzig eerst de status van de gekoppelde subsidies.",
      cannotDeleteActivityWithApprovedSubsidies: "Kan activiteit niet verwijderen met goedgekeurde of afgesloten subsidie aanvragen. Wijzig eerst de status.",
      cannotDeleteApprovedSubsidy: "Kan goedgekeurde of afgesloten subsidie aanvragen niet verwijderen.",
      genericDeleteError: "Verwijderen mislukt. Probeer het opnieuw.",
      updateError: "Fout bij bijwerken project",
      departmentNotFound: "Afdeling niet gevonden",
      titleRequired: "Titel is verplicht",
      descriptionRequired: "Beschrijving is verplicht",
      departmentRequired: "Afdeling is verplicht",
      budgetPositive: "Budget moet groter zijn dan 0",
      endDateAfterStart: "Einddatum moet na startdatum liggen"
    },
    
    // Steps
    steps: {
      projectInfo: "Project Info",
      budgetDetails: "Budget & Tijdlijn",
      additionalOptions: "Extra Opties",
      review: "Beoordelen & Verzenden"
    },
    
    // Event modal
    event: {
      createEvent: "Evenement Aanmaken",
      eventTitle: "Evenement Titel",
      eventDescription: "Evenement Beschrijving",
      eventType: "Evenement Type",
      maxParticipants: "Max Deelnemers",
      ticketAmount: "Ticket Prijs",
      location: "Locatie",
      subscriptionExpires: "Inschrijving Verloopt",
      targetType: "Doelgroep Type",
      targetId: "Doelgroep",
      evangelism: "Evangelisatie",
      show: "Show/Conferentie",
      institution: "Instituut",
      region: "Regio",
      department: "Afdeling",
      church: "Kerk",
      user: "Gebruiker",
      selectTarget: "Selecteer Doelgroep",
      enterEventTitle: "Voer evenement titel in",
      describeEvent: "Beschrijf de evenement details en doelstellingen",
      enterLocation: "Voer evenement locatie in",
      free: "Gratis",
      paid: "Betaald"
    },
    
    // Communication modal
    communication: {
      createCommunication: "Communicatie Aanmaken",
      communicationTitle: "Communicatie Titel",
      communicationContent: "Inhoud",
      communicationType: "Type",
      priority: "Prioriteit",
      scheduleAt: "Plannen Op",
      recipients: "Ontvangers",
      announcement: "Aankondiging",
      notification: "Notificatie",
      newsletter: "Nieuwsbrief",
      high: "Hoog",
      medium: "Gemiddeld",
      low: "Laag",
      addRecipient: "Ontvanger Toevoegen",
      selectRecipients: "Selecteer Ontvangers",
      enterTitle: "Voer communicatie titel in",
      enterContent: "Voer communicatie inhoud in",
      scheduleNow: "Nu Verzenden",
      scheduleLater: "Later Plannen"
    },
    
    // Budget tracking
    budget: {
      annualBudget: "Jaarlijks Budget",
      budgetUsed: "Budget Gebruikt",
      budgetUtilization: "Budget Benutting",
      remainingBudget: "Resterend Budget",
      budgetOverview: "Budget Overzicht"
    },
    
    // Action buttons
    actions: {
      createEvent: "Evenement Aanmaken",
      createCommunication: "Communicatie Aanmaken",
      viewDetails: "Details Bekijken",
      editProject: "Project Bewerken",
      duplicateProject: "Project Dupliceren",
      loadingCreator: "🚀 Projectmaker laden..."
    },
    
    // Project Details Page
    details: {
      projectDetails: "Project Details",
      projectOverview: "Project Overzicht",
      budgetOverview: "Budget Overzicht",
      activitiesOverview: "Activiteiten Overzicht",
      projectProgress: "Project Voortgang",
      subsidyActivities: "Subsidie Activiteiten",
      projectTimeline: "Project Tijdlijn",
      budgetDistribution: "Budget Verdeling",
      monthlyProgress: "Maandelijkse Voortgang",
      receiptsAndApprovals: "Bonnen & Goedkeuringen",
      projectInformation: "Project Informatie",
      budgetInformation: "Budget Informatie",
      activityName: "Activiteit Naam",
      activityBudget: "Activiteit Budget",
      activityStatus: "Activiteit Status",
      approvedAmount: "Goedgekeurd Bedrag",
      receiptsCount: "Bonnen",
      viewReceipts: "Bekijk Bonnen",
      editActivity: "Bewerk Activiteit",
      deleteActivity: "Verwijder Activiteit",
      addActivity: "Activiteit Toevoegen",
      noActivities: "Geen activiteiten gevonden",
      noActivitiesDesc: "Dit project heeft nog geen subsidie activiteiten.",
      totalBudget: "Totaal Budget",
      usedBudget: "Gebruikt Budget",
      approvedBudget: "Goedgekeurd Budget",
      pendingBudget: "Wachtend Budget",
      budgetProgress: "Budget Voortgang",
      completionRate: "Voltooiingspercentage",
      projectDuration: "Project Duur",
      daysRemaining: "Resterende Dagen",
      daysElapsed: "Verstreken Dagen"
    },
    
    // Subsidy Management
    subsidy: {
      subsidyRequests: "Subsidie Aanvragen",
      addSubsidy: "Subsidie Toevoegen",
      editSubsidy: "Subsidie Bewerken",
      deleteSubsidy: "Subsidie Verwijderen",
      approveSubsidy: "Subsidie Goedkeuren",
      rejectSubsidy: "Subsidie Afwijzen",
      subsidyDescription: "Subsidie Beschrijving",
      totalBudget: "Totaal Budget",
      requestedAmount: "Aangevraagd Bedrag",
      approvedAmount: "Goedgekeurd Bedrag",
      pendingAmount: "Wachtend Bedrag",
      subsidyStatus: "Subsidie Status",
      requester: "Aanvrager",
      church: "Kerk",
      completionRate: "Voltooiingspercentage",
      expandActivities: "Activiteiten Uitklappen",
      collapseActivities: "Activiteiten Inklappen",
      noSubsidies: "Geen subsidies gevonden",
      noSubsidiesDesc: "Dit project heeft nog geen subsidie aanvragen.",
      deleteConfirmTitle: "Subsidie Aanvraag Verwijderen",
      deleteConfirmDesc: "Deze actie zal de subsidie aanvraag en alle gerelateerde activiteiten en bonnen permanent verwijderen. Dit kan niet ongedaan worden gemaakt.",
      deleteEffects: "Gevolgen van deze actie:",
      deleteEffect1: "Alle activiteiten worden permanent verwijderd",
      deleteEffect2: "Alle geüploade bonnen worden verwijderd",
      deleteEffect3: "Goedkeuringsgeschiedenis gaat verloren",
      deleteEffect4: "Budget toewijzingen worden gereset",
      enterDescription: "Voer subsidie beschrijving in",
      selectChurch: "Selecteer kerk",
      selectStatus: "Selecteer status",
      subsidyCreated: "Subsidie aanvraag succesvol aangemaakt!",
      subsidyUpdated: "Subsidie aanvraag succesvol bijgewerkt!",
      subsidyDeleted: "Subsidie aanvraag succesvol verwijderd!",
      subsidyApproved: "Subsidie aanvraag goedgekeurd!",
      subsidyRejected: "Subsidie aanvraag afgewezen!"
    },
    
    // Activity Management
    activity: {
      addActivity: "Activiteit Toevoegen",
      editActivity: "Activiteit Bewerken",
      deleteActivity: "Activiteit Verwijderen",
      activityName: "Activiteit Naam",
      activityDescription: "Activiteit Beschrijving",
      budgetAmount: "Budget Bedrag",
      receiptsUploaded: "Bonnen Geüpload",
      uploadReceipt: "Bon Uploaden",
      viewReceipts: "Bekijk Bonnen",
      noReceipts: "Geen bonnen geüpload",
      receiptAmount: "Bon Bedrag",
      receiptDescription: "Bon Beschrijving",
      receiptDate: "Bon Datum",
      receiptFile: "Bon Bestand",
      dragDropText: "Sleep uw bon afbeelding hier naartoe, of klik om te selecteren",
      supportedFormats: "Ondersteunde formaten: JPG, PNG, PDF (max 5MB)",
      uploadSuccess: "Bon succesvol geüpload!",
      receiptApproved: "Bon goedgekeurd!",
      receiptRejected: "Bon afgewezen!",
      enterActivityName: "Voer activiteit naam in",
      describeActivity: "Beschrijf de activiteit details en doelstellingen",
      activityCreated: "Activiteit succesvol aangemaakt!",
      activityUpdated: "Activiteit succesvol bijgewerkt!",
      activityDeleted: "Activiteit succesvol verwijderd!"
    },
    
    // Report Management
    report: {
      createReport: "Rapport Aanmaken",
      reportTitle: "Rapport Titel",
      reportDescription: "Rapport Beschrijving",
      reportType: "Rapport Type",
      reportStatus: "Rapport Status",
      submissionDate: "Inzenddatum",
      reportPeriod: "Rapport Periode",
      startDate: "Startdatum",
      endDate: "Einddatum",
      reportNote: "Aanvullende Opmerkingen",
      reviewerNotes: "Beoordelaar Opmerkingen",
      attachedFile: "Bijgevoegd Bestand",
      financial: "Financieel Rapport",
      progress: "Voortgangsrapport",
      annual: "Jaarrapport",
      approved: "Goedgekeurd",
      inReview: "In Beoordeling",
      onHold: "Uitgesteld",
      needsAdjustment: "Aanpassing Nodig",
      rejected: "Afgewezen",
      enterTitle: "Voer rapport titel in",
      describeReport: "Beschrijf de rapport inhoud en doelstellingen",
      selectType: "Selecteer rapport type",
      selectStatus: "Selecteer rapport status",
      addNotes: "Voeg aanvullende opmerkingen toe",
      uploadFile: "Upload ondersteunend bestand (optioneel)",
      reportCreated: "Rapport succesvol aangemaakt!",
      redirectingToReports: "Doorverwijzen naar rapporten pagina...",
      projectSummary: "Project Samenvatting",
      budgetSummary: "Budget Samenvatting",
      financialSummary: "Financiële Samenvatting",
      progressSummary: "Voortgang Samenvatting",
      totalProjectBudget: "Totaal Project Budget",
      projectBudgetSpent: "Project Budget Uitgegeven",
      projectBudgetRemaining: "Project Budget Resterend",
      totalSubsidiesRequested: "Totaal Aangevraagde Subsidies",
      totalSubsidiesApproved: "Totaal Goedgekeurde Subsidies",
      completionPercentage: "Voltooiingspercentage",
      reportInformation: "Rapport Informatie",
      financialData: "Financiële Gegevens",
      progressData: "Voortgang Gegevens",
      reportGenerated: "Rapport wordt gegenereerd op basis van huidige projectgegevens",
      // Steps
      stepBasicInfo: "Basis Informatie",
      stepFinancialData: "Financiële Gegevens",
      stepProgressData: "Voortgang & Voltooiing",
      stepReviewSubmit: "Beoordelen & Verzenden",
      // Export options
      exportOptions: "Export Opties",
      downloadPDF: "Download PDF",
      downloadCSV: "Download CSV",
      downloadExcel: "Download Excel",
      exportDescription: "Kies hoe je dit rapport wilt exporteren",
      reportPreview: "Rapport Voorbeeld",
      dataValidation: "Data Validatie",
      allFieldsValid: "Alle velden zijn correct ingevuld",
      readyToSubmit: "Rapport is klaar om in te dienen"
    },
    
    // Project status
    active: "Actief",
    upcoming: "Aankomend",
    completed: "Voltooid",
    
    // Project types
    public: "Openbaar",
    private: "Privé",
    
    // Actions
    newProject: "Nieuw Project",
    viewProject: "Bekijk Project",
    editProject: "Bewerk Project",
    deleteProject: "Verwijder Project",
    deleteProjectConfirmTitle: "Project Verwijderen?",
    deleteProjectConfirmDesc: "Weet je zeker dat je dit project wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
    deleteProjectWarning: "Deze actie kan niet ongedaan worden gemaakt",
    deleteProjectButton: "Permanent Verwijderen",
    
    // Year Filter
    yearFilter: {
      cannotAddBeyond: "Kan geen jaren toevoegen na {{year}}",
      yearExists: "Jaar {{year}} bestaat al",
      yearAdded: "Jaar {{year}} succesvol toegevoegd",
      addYear: "Jaar Toevoegen"
    },
    
    // Page Header & navigation
    pageHeader: {
      subtitle: "Volledig overzicht van projecten en subsidieaanvragen van de organisatie - {{year}}",
      manageDescription: "Beheer en volg alle projecten over afdelingen heen"
    },
    
    navigation: {
      openingProject: "Opening {{title}}"
    },

    deleteProjectUnderstand: "Ik begrijp dat deze actie permanent is en niet ongedaan kan worden gemaakt",
    deleteProjectTypeConfirm: "Typ 'delete project' om te bevestigen",
    deleteProjectDeleting: "Verwijderen...",
    deleteProjectAffectedComponents: "Getroffen Componenten",
    deleteProjectActivities: "Activiteiten",
    deleteProjectSubsidies: "Subsidies",
    deleteProjectVolunteers: "Vrijwilligers",
    deleteProjectDocuments: "Documenten",
    deleteProjectViewConsequences: "Bekijk Consequenties",
    deleteProjectConsequence1: "Alle activiteiten worden verwijderd",
    deleteProjectConsequence1Desc: "Alle activiteiten die aan het project zijn gekoppeld, worden permanent verwijderd.",
    deleteProjectConsequence2: "Subsidies worden verwijderd",
    deleteProjectConsequence2Desc: "Alle subsidieaanvragen die aan het project zijn gekoppeld, worden verwijderd.",
    deleteProjectConsequence3: "Vrijwilligers worden ontkoppeld",
    deleteProjectConsequence3Desc: "Alle vrijwilligers die aan het project zijn gekoppeld, verliezen toegang.",
    deleteProjectConsequence4: "Documenten worden verwijderd",
    deleteProjectConsequence4Desc: "Alle documenten die aan het project zijn gekoppeld, worden permanent verwijderd.",
    deleteProjectAcknowledge: "Ik begrijp dat deze actie niet ongedaan kan worden gemaakt en alle gegevens permanent worden verwijderd.",
    deleteProjectTypeConfirmLabel: "Typ de bevestigingstekst om door te gaan",
    deleteProjectConfirmHelp: "Typ \"delete project\" om te bevestigen",
    shareProject: "Deel Project",
    manageVolunteers: "Beheer Vrijwilligers",
    joinAsVolunteer: "Word Vrijwilliger",
    
    // Form fields
    projectTitle: "Project Titel",
    projectDescription: "Project Beschrijving",
    startDate: "Startdatum",
    endDate: "Einddatum",
    languagePreference: "Taalvoorkeur",
    department: "Afdeling",
    privateProject: "Privé Project",
    requestVolunteers: "Vrijwilligers Vragen",
    
    // Form placeholders
    enterProjectTitle: "Voer project titel in",
    describeProject: "Beschrijf uw projectdoelen, activiteiten en verwachte resultaten",
    selectDepartment: "Selecteer afdeling",
    selectLanguage: "Selecteer taal",
    unknown: "Onbekend",
    
    // Form descriptions
    privateProjectDesc: "Alleen zichtbaar voor geautoriseerde gebruikers",
    requestVolunteersDesc: "Sta vrijwilligers toe om deel te nemen aan dit project",
    
    // Edit Modal
    editModalTitle: "Project Bewerken",
    editProjectInfo: "Projectinformatie bewerken",
    projectPeriod: "Projectperiode",
    projectPeriodDesc: "Definieer begin- en einddatum",
    additionalConfig: "Aanvullende Instellingen",
    additionalConfigDesc: "Aanvullende projectinstellingen",
    projectType: "Projecttype",
    selectType: "Selecteer type",
    local: "Lokaal",
    global: "Wereldwijd",
    previous: "Vorige",
    next: "Volgende",
    cancel: "Annuleren",
    saveChanges: "Wijzigingen Opslaan",
    saving: "Opslaan...",
    step: "Stap",
    of: "van",
    searchDepartment: "Zoek afdeling...",
    noDepartmentFound: "Geen afdeling gevonden.",
    searchLanguage: "Zoek taal...",
    noLanguageFound: "Geen taal gevonden.",
    selectDate: "Selecteer datum",
    basicInformation: "Basisinformatie",
    basicInformationDesc: "Basis projectinformatie",
    
    // Steps
    basicInfo: "Basis Info",
    settings: "Instellingen",
    review: "Beoordeling",
    
    // Stats
    organizationStats: "Organisatie Statistieken",
    projectStats: "Project Details",
    duration: "Duur",
    volunteers: "Vrijwilligers",
    language: "Taal",
    
    // Messages
    noProjectsYet: "Nog geen projecten",
    noProjectsFound: "Geen projecten gevonden",
    tryAdjustingFilters: "Probeer uw zoekopdracht of filters aan te passen",
    getStartedCreating: "Begin met het maken van uw eerste project",
    projectNotFound: "Project Niet Gevonden",
    projectNotFoundDesc: "Het project dat u zoekt bestaat niet.",
    
    // Search and filters
    searchProjects: "Zoek projecten...",
    allStatus: "Alle Statussen",
    allProjects: "Alle Projecten",
    
    // Project overview
    projectOverview: "Project Overzicht",
    projectTimeline: "Project Tijdlijn",
    projectStart: "Project Start",
    projectEnd: "Project Einde",
    
    // Back navigation
    backToProjects: "Terug naar Projecten",
    backToDashboard: "Terug naar Dashboard",
    
    // Volunteers
    volunteersWelcome: "Vrijwilligers Welkom",
    thisProjectOpenVolunteers: "Dit project staat open voor vrijwilligers om deel te nemen.",
    
    // Required fields
    required: "Verplicht",
    
    // Language options
    english: "Engels",
    dutch: "Nederlands",
    portuguese: "Português",
  },
  
  pt: {
    // Navigation
    projects: "Projetos",
    reportsAndProjects: "Relatórios & Projetos",
    
    // Page titles
    projectsPage: "Projetos",
    projectDetails: "Detalhes do Projeto",
    createProject: "Criar Novo Projeto",
    projectsOverview: "Visão Geral dos Projetos",
    projectsDashboard: "Dashboard de Projetos",
    
    // Dashboard KPIs
    kpis: {
      totalProjects: "Total de Projetos",
      activeProjects: "Projetos Ativos",
      completedProjects: "Projetos Concluídos",
      upcomingProjects: "Projetos Futuros",
      totalBudget: "Orçamento Total",
      totalSubsidyRequests: "Pedidos de Subsídio",
      totalSubsidyAmount: "Valor Total de Subsídios",
      averageProjectBudget: "Orçamento Médio por Projeto",
      projectsWithVolunteers: "Projetos com Voluntários",
      departmentsInvolved: "Departamentos Envolvidos",
      vsPreviousMonth: "vs mês anterior",
      activeDeactivted: "{{active}} ativos | {{completed}} concluídos",
      waitingToStart: "{{count}} aguardando início",
      newThisMonth: "novos este mês",
      average: "Média",
      percentUsed: "{{percent}}% utilizado",
      subsidizedBudget: "Orçamento Subsidiado",
      localContribution: "{{amount}} contribuição local",
      ofTotalBudget: "do orçamento total",
      completionRate: "Taxa de Conclusão",
      finalizedOf: "{{completed}} de {{total}} finalizados",
      requested: "solicitado",
      approvedPercent: "{{percent}}% aprovados",
      ofProjects: "{{percent}}% dos projetos",
      growingEngagement: "engajamento crescente"
    },
    
    // Charts
    charts: {
      projectsByDepartment: "Projetos por Departamento",
      subsidyDistribution: "Distribuição de Status de Subsídio",
      budgetVsSubsidies: "Orçamento vs Subsídios por Departamento",
      projectsTimeline: "Linha do Tempo dos Projetos",
      monthlyProgress: "Progresso Mensal",
      departmentBudgets: "Análise de Orçamento por Departamento",
      subsidyStatusBreakdown: "Detalhamento de Status de Subsídio",
      projectsCreatedOverTime: "Projetos Criados ao Longo do Tempo",
      monthlyProjectCreation: "Criação mensal de projetos por departamento",
      noProjectData: "Nenhum dado de projeto disponível",
      projectsCreatedThisYear: "projetos criados este ano",
      top: "Top",
      distributionByDepartment: "Distribuição de projetos por departamento",
      selectDepartment: "Selecione o departamento",
      projectsWithMostActivities: "Projetos com Mais Atividades",
      top10Activities: "Top 10 projetos por número de atividades registradas",
      projects: "Projetos",
      activities: "Atividades"
    },
    
    // Table columns
    table: {
      projectTitle: "Título do Projeto",
      department: "Departamento",
      subsidyRequests: "Pedidos de Subsídio",
      subsidyAmount: "Valor do Subsídio",
      activities: "Atividades",
      status: "Status",
      startDate: "Data de Início",
      endDate: "Data de Término",
      volunteers: "Voluntários",
      actions: "Ações",
      budget: "Orçamento",
      period: "Período",
      timeline: "Cronograma",
      daysLeft: "Dias Restantes",
      daysOverdue: "{{days}}d atrasado",
      daysRemaining: "{{days}}d",
      today: "Hoje",
      yes: "Sim",
      no: "Não",
      clearFilters: "Limpar filtros",
      columns: "Colunas",
      toggleColumns: "Alternar Colunas",
      rowsPerPage: "Linhas por página",
      showingResults: "Mostrando {{from}} até {{to}} de {{total}} resultados",
      previous: "Anterior",
      next: "Próximo",
      noResults: "Nenhum resultado encontrado",
      openMenu: "Abrir menu"
    },
    
    // Modal
    modal: {
      createProject: "Criar Novo Projeto",
      editProject: "Editar Projeto",
      projectInformation: "Informações do Projeto",
      budgetInformation: "Informações do Orçamento",
      additionalSettings: "Configurações Adicionais"
    },
    
    // Filters
    filters: {
      allDepartments: "Todos os Departamentos",
      allStatuses: "Todos os Status",
      allPeriods: "Todos os Períodos",
      last30Days: "Últimos 30 Dias",
      last90Days: "Últimos 90 Dias",
      last6Months: "Últimos 6 Meses",
      lastYear: "Ano Passado",
      currentYear: "Ano Atual",
      filterByDepartment: "Filtrar por departamento"
    },
    
    // Toast messages
    toasts: {
      projectCreated: "Projeto criado com sucesso!",
      projectUpdated: "Projeto atualizado com sucesso!",
      projectDeleted: "Projeto excluído com sucesso!",
      eventCreated: "Evento criado com sucesso!",
      communicationCreated: "Comunicação criada com sucesso!",
      loadingData: "Carregando dados dos projetos...",
      projectUpdating: "Atualizando projeto...",
      projectDeleting: "Excluindo projeto...",
      dataRefreshing: "Atualizando dados...",
      dataRefreshed: "Dados atualizados com sucesso!",
      errorLoading: "Erro ao carregar dados dos projetos",
      filterApplied: "Filtro aplicado com sucesso"
    },
    
    // Error messages
    errors: {
      cannotDeleteProjectWithApprovedSubsidies: "Não é possível excluir projeto com pedidos de subsídio aprovados ou concluídos. Altere o status dos subsídios associados primeiro.",
      cannotDeleteActivityWithApprovedSubsidies: "Não é possível excluir atividade com pedidos de subsídio aprovados ou concluídos. Altere o status primeiro.",
      cannotDeleteApprovedSubsidy: "Não é possível excluir pedidos de subsídio aprovados ou concluídos.",
      genericDeleteError: "Falha ao excluir. Tente novamente.",
      updateError: "Erro ao atualizar projeto",
      departmentNotFound: "Departamento não encontrado",
      titleRequired: "O título é obrigatório",
      descriptionRequired: "A descrição é obrigatória",
      departmentRequired: "O departamento é obrigatório",
      budgetPositive: "O orçamento deve ser maior que 0",
      endDateAfterStart: "A data de término deve ser após a data de início"
    },
    
    // Steps
    steps: {
      projectInfo: "Informações do Projeto",
      budgetDetails: "Orçamento e Cronograma",
      additionalOptions: "Opções Adicionais",
      review: "Revisar e Enviar"
    },
    
    // Event modal
    event: {
      createEvent: "Criar Evento",
      eventTitle: "Título do Evento",
      eventDescription: "Descrição do Evento",
      eventType: "Tipo de Evento",
      maxParticipants: "Máximo de Participantes",
      ticketAmount: "Valor do Ingresso",
      location: "Local",
      subscriptionExpires: "Inscrições Expiram",
      targetType: "Tipo de Público",
      targetId: "Público-Alvo",
      evangelism: "Evangelismo",
      show: "Show/Conferência",
      institution: "Instituição",
      region: "Região",
      department: "Departamento",
      church: "Igreja",
      user: "Usuário",
      selectTarget: "Selecionar Público",
      enterEventTitle: "Digite o título do evento",
      describeEvent: "Descreva os detalhes e objetivos do evento",
      enterLocation: "Digite o local do evento",
      free: "Gratuito",
      paid: "Pago"
    },
    
    // Communication modal
    communication: {
      createCommunication: "Criar Comunicação",
      communicationTitle: "Título da Comunicação",
      communicationContent: "Conteúdo",
      communicationType: "Tipo",
      priority: "Prioridade",
      scheduleAt: "Agendar Para",
      recipients: "Destinatários",
      announcement: "Anúncio",
      notification: "Notificação",
      newsletter: "Newsletter",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
      addRecipient: "Adicionar Destinatário",
      selectRecipients: "Selecionar Destinatários",
      enterTitle: "Digite o título da comunicação",
      enterContent: "Digite o conteúdo da comunicação",
      scheduleNow: "Enviar Agora",
      scheduleLater: "Agendar"
    },
    
    // Budget tracking
    budget: {
      annualBudget: "Orçamento Anual",
      budgetUsed: "Orçamento Usado",
      budgetUtilization: "Utilização do Orçamento",
      remainingBudget: "Orçamento Restante",
      budgetOverview: "Visão Geral do Orçamento"
    },
    
    // Action buttons
    actions: {
      createEvent: "Criar Evento",
      createCommunication: "Criar Comunicação",
      viewDetails: "Ver Detalhes",
      editProject: "Editar Projeto",
      duplicateProject: "Duplicar Projeto",
      loadingCreator: "🚀 Carregando criador de projeto..."
    },
    
    // Project Details Page
    details: {
      projectDetails: "Detalhes do Projeto",
      projectOverview: "Visão Geral do Projeto",
      budgetOverview: "Visão Geral do Orçamento",
      activitiesOverview: "Visão Geral das Atividades",
      projectProgress: "Progresso do Projeto",
      subsidyActivities: "Atividades de Subsídio",
      projectTimeline: "Cronograma do Projeto",
      budgetDistribution: "Distribuição do Orçamento",
      monthlyProgress: "Progresso Mensal",
      receiptsAndApprovals: "Recibos e Aprovações",
      projectInformation: "Informações do Projeto",
      budgetInformation: "Informações do Orçamento",
      activityName: "Nome da Atividade",
      activityBudget: "Orçamento da Atividade",
      activityStatus: "Status da Atividade",
      approvedAmount: "Valor Aprovado",
      receiptsCount: "Recibos",
      viewReceipts: "Ver Recibos",
      editActivity: "Editar Atividade",
      deleteActivity: "Excluir Atividade",
      addActivity: "Adicionar Atividade",
      noActivities: "Nenhuma atividade encontrada",
      noActivitiesDesc: "Este projeto ainda não possui atividades de subsídio.",
      totalBudget: "Orçamento Total",
      usedBudget: "Orçamento Usado",
      approvedBudget: "Orçamento Aprovado",
      pendingBudget: "Orçamento Pendente",
      budgetProgress: "Progresso do Orçamento",
      completionRate: "Taxa de Conclusão",
      projectDuration: "Duração do Projeto",
      daysRemaining: "Dias Restantes",
      daysElapsed: "Dias Decorridos"
    },
    
    // Subsidy Management
    subsidy: {
      subsidyRequests: "Pedidos de Subsídio",
      addSubsidy: "Adicionar Subsídio",
      editSubsidy: "Editar Subsídio",
      deleteSubsidy: "Excluir Subsídio",
      approveSubsidy: "Aprovar Subsídio",
      rejectSubsidy: "Rejeitar Subsídio",
      subsidyDescription: "Descrição do Subsídio",
      totalBudget: "Orçamento Total",
      requestedAmount: "Valor Solicitado",
      approvedAmount: "Valor Aprovado",
      pendingAmount: "Valor Pendente",
      subsidyStatus: "Status do Subsídio",
      requester: "Solicitante",
      church: "Igreja",
      completionRate: "Taxa de Conclusão",
      expandActivities: "Expandir Atividades",
      collapseActivities: "Recolher Atividades",
      noSubsidies: "Nenhum subsídio encontrado",
      noSubsidiesDesc: "Este projeto ainda não possui pedidos de subsídio.",
      deleteConfirmTitle: "Excluir Pedido de Subsídio",
      deleteConfirmDesc: "Esta ação irá excluir permanentemente o pedido de subsídio e todas as atividades e recibos relacionados. Isso não pode ser desfeito.",
      deleteEffects: "Efeitos desta ação:",
      deleteEffect1: "Todas as atividades serão excluídas permanentemente",
      deleteEffect2: "Todos os recibos enviados serão removidos",
      deleteEffect3: "O histórico de aprovações será perdido",
      deleteEffect4: "As alocações de orçamento serão resetadas",
      enterDescription: "Digite a descrição do subsídio",
      selectChurch: "Selecionar igreja",
      selectStatus: "Selecionar status",
      subsidyCreated: "Pedido de subsídio criado com sucesso!",
      subsidyUpdated: "Pedido de subsídio atualizado com sucesso!",
      subsidyDeleted: "Pedido de subsídio excluído com sucesso!",
      subsidyApproved: "Pedido de subsídio aprovado!",
      subsidyRejected: "Pedido de subsídio rejeitado!"
    },
    
    // Activity Management
    activity: {
      addActivity: "Adicionar Atividade",
      editActivity: "Editar Atividade",
      deleteActivity: "Excluir Atividade",
      activityName: "Nome da Atividade",
      activityDescription: "Descrição da Atividade",
      budgetAmount: "Valor do Orçamento",
      receiptsUploaded: "Recibos Enviados",
      uploadReceipt: "Enviar Recibo",
      viewReceipts: "Ver Recibos",
      noReceipts: "Nenhum recibo enviado",
      receiptAmount: "Valor do Recibo",
      receiptDescription: "Descrição do Recibo",
      receiptDate: "Data do Recibo",
      receiptFile: "Arquivo do Recibo",
      dragDropText: "Arraste e solte a imagem do seu recibo aqui, ou clique para selecionar",
      supportedFormats: "Formatos suportados: JPG, PNG, PDF (máx 5MB)",
      uploadSuccess: "Recibo enviado com sucesso!",
      receiptApproved: "Recibo aprovado!",
      receiptRejected: "Recibo rejeitado!",
      enterActivityName: "Digite o nome da atividade",
      describeActivity: "Descreva os detalhes e objetivos da atividade",
      activityCreated: "Atividade criada com sucesso!",
      activityUpdated: "Atividade atualizada com sucesso!",
      activityDeleted: "Atividade excluída com sucesso!"
    },
    
    // Report Management
    report: {
      createReport: "Criar Relatório",
      reportTitle: "Título do Relatório",
      reportDescription: "Descrição do Relatório",
      reportType: "Tipo de Relatório",
      reportStatus: "Status do Relatório",
      submissionDate: "Data de Submissão",
      reportPeriod: "Período do Relatório",
      startDate: "Data de Início",
      endDate: "Data de Término",
      reportNote: "Observações Adicionais",
      reviewerNotes: "Observações do Revisor",
      attachedFile: "Arquivo Anexado",
      financial: "Relatório Financeiro",
      progress: "Relatório de Progresso",
      annual: "Relatório Anual",
      approved: "Aprovado",
      inReview: "Em Análise",
      onHold: "Em Espera",
      needsAdjustment: "Precisa de Ajustes",
      rejected: "Rejeitado",
      enterTitle: "Digite o título do relatório",
      describeReport: "Descreva o conteúdo e objetivos do relatório",
      selectType: "Selecione o tipo de relatório",
      selectStatus: "Selecione o status do relatório",
      addNotes: "Adicione observações ou comentários adicionais",
      uploadFile: "Enviar arquivo de apoio (opcional)",
      reportCreated: "Relatório criado com sucesso!",
      redirectingToReports: "Redirecionando para a página de relatórios...",
      projectSummary: "Resumo do Projeto",
      budgetSummary: "Resumo do Orçamento",
      financialSummary: "Resumo Financeiro",
      progressSummary: "Resumo do Progresso",
      totalProjectBudget: "Orçamento Total do Projeto",
      projectBudgetSpent: "Orçamento Gasto do Projeto",
      projectBudgetRemaining: "Orçamento Restante do Projeto",
      totalSubsidiesRequested: "Total de Subsídios Solicitados",
      totalSubsidiesApproved: "Total de Subsídios Aprovados",
      completionPercentage: "Percentual de Conclusão",
      reportInformation: "Informações do Relatório",
      financialData: "Dados Financeiros",
      progressData: "Dados de Progresso",
      reportGenerated: "Relatório será gerado com base nos dados atuais do projeto",
      // Steps
      stepBasicInfo: "Informações Básicas",
      stepFinancialData: "Dados Financeiros",
      stepProgressData: "Progresso e Conclusão",
      stepReviewSubmit: "Revisar e Enviar",
      // Export options
      exportOptions: "Opções de Exportação",
      downloadPDF: "Baixar PDF",
      downloadCSV: "Baixar CSV",
      downloadExcel: "Baixar Excel",
      exportDescription: "Escolha como deseja exportar este relatório",
      reportPreview: "Prévia do Relatório",
      dataValidation: "Validação de Dados",
      allFieldsValid: "Todos os campos estão preenchidos corretamente",
      readyToSubmit: "Relatório pronto para envio"
    },
    
    // Project status
    active: "Ativo",
    upcoming: "Futuro", 
    completed: "Concluído",
    
    // Project types
    public: "Público",
    private: "Privado",
    
    // Actions
    newProject: "Novo Projeto",
    viewProject: "Ver Projeto",
    editProject: "Editar Projeto",
    deleteProject: "Excluir Projeto",
    deleteProjectConfirmTitle: "Excluir Projeto?",
    deleteProjectConfirmDesc: "Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.",
    deleteProjectWarning: "Esta ação não pode ser desfeita",
    deleteProjectButton: "Excluir Permanentemente",
    deleteProjectUnderstand: "Eu entendo que esta ação é permanente e não pode ser desfeita",
    deleteProjectTypeConfirm: "Digite 'delete project' para confirmar",
    deleteProjectDeleting: "Excluindo...",
    deleteProjectAffectedComponents: "Componentes Afetados",
    deleteProjectActivities: "Atividades",
    deleteProjectSubsidies: "Subsídios",
    deleteProjectVolunteers: "Voluntários",
    deleteProjectDocuments: "Documentos",
    deleteProjectViewConsequences: "Ver Consequências",
    deleteProjectConsequence1: "Todas as atividades serão removidas",
    deleteProjectConsequence1Desc: "Todas as atividades associadas ao projeto serão permanentemente deletadas.",
    deleteProjectConsequence2: "Subsídios serão removidos",
    deleteProjectConsequence2Desc: "Todos os pedidos de subsídio associados ao projeto serão removidos.",
    deleteProjectConsequence3: "Voluntários serão desvinculados",
    deleteProjectConsequence3Desc: "Todos os voluntários vinculados ao projeto perderão acesso.",
    deleteProjectConsequence4: "Documentos serão deletados",
    deleteProjectConsequence4Desc: "Todos os documentos associados ao projeto serão permanentemente removidos.",
    deleteProjectAcknowledge: "Eu entendo que esta ação não pode ser desfeita e todos os dados serão permanentemente removidos.",
    deleteProjectTypeConfirmLabel: "Digite o texto de confirmação para prosseguir",
    deleteProjectConfirmHelp: "Digite \"delete project\" para confirmar",
    shareProject: "Compartilhar Projeto",
    manageVolunteers: "Gerenciar Voluntários",
    joinAsVolunteer: "Participar como Voluntário",
    
    // Form fields
    projectTitle: "Título do Projeto",
    projectDescription: "Descrição do Projeto",
    startDate: "Data de Início",
    endDate: "Data de Término",
    languagePreference: "Preferência de Idioma",
    department: "Departamento",
    privateProject: "Projeto Privado",
    requestVolunteers: "Solicitar Voluntários",
    
    // Form placeholders
    enterProjectTitle: "Digite o título do projeto",
    describeProject: "Descreva os objetivos, atividades e resultados esperados do projeto",
    selectDepartment: "Selecione o departamento",
    selectLanguage: "Selecione o idioma",
    unknown: "Desconhecido",
    
    // Form descriptions
    privateProjectDesc: "Visível apenas para usuários autorizados",
    requestVolunteersDesc: "Permitir que voluntários participem deste projeto",
    
    // Edit Modal
    editModalTitle: "Editar Projeto",
    editProjectInfo: "Editar informações do projeto",
    projectPeriod: "Período do Projeto",
    projectPeriodDesc: "Defina as datas de início e término",
    additionalConfig: "Configurações Adicionais",
    additionalConfigDesc: "Configurações adicionais do projeto",
    projectType: "Tipo de Projeto",
    selectType: "Selecione o tipo",
    local: "Local",
    global: "Global",
    previous: "Anterior",
    next: "Próximo",
    cancel: "Cancelar",
    saveChanges: "Salvar Alterações",
    saving: "Salvando...",
    step: "Passo",
    of: "de",
    searchDepartment: "Buscar departamento...",
    noDepartmentFound: "Nenhum departamento encontrado.",
    searchLanguage: "Buscar idioma...",
    noLanguageFound: "Nenhum idioma encontrado.",
    selectDate: "Selecione a data",
    basicInformation: "Informações Básicas",
    basicInformationDesc: "Informações básicas do projeto",
    
    // Steps
    basicInfo: "Informações Básicas",
    settings: "Configurações",
    review: "Revisão",
    
    // Stats
    organizationStats: "Estatísticas da Organização",
    projectStats: "Detalhes do Projeto",
    duration: "Duração",
    volunteers: "Voluntários",
    language: "Idioma",
    
    // Messages
    noProjectsYet: "Ainda não há projetos",
    noProjectsFound: "Nenhum projeto encontrado",
    tryAdjustingFilters: "Tente ajustar sua busca ou filtros",
    getStartedCreating: "Comece criando seu primeiro projeto",
    projectNotFound: "Projeto Não Encontrado",
    projectNotFoundDesc: "O projeto que você está procurando não existe.",
    
    // Search and filters
    searchProjects: "Buscar projetos...",
    allStatus: "Todos os Status",
    allProjects: "Todos os Projetos",
    
    // Project overview
    projectOverview: "Visão Geral do Projeto",
    projectTimeline: "Cronograma do Projeto",
    projectStart: "Início do Projeto",
    projectEnd: "Fim do Projeto",
    
    // Back navigation
    backToProjects: "Voltar aos Projetos",
    backToDashboard: "Voltar ao Dashboard",
    
    // Volunteers
    volunteersWelcome: "Voluntários Bem-vindos",
    thisProjectOpenVolunteers: "Este projeto está aberto para voluntários participarem.",
    
    // Required fields
    required: "Obrigatório",
    
    // Language options
    english: "Inglês",
    dutch: "Holandês",
    portuguese: "Português",
    
    // Year Filter
    yearFilter: {
      cannotAddBeyond: "Não é possível adicionar anos além de {{year}}",
      yearExists: "Ano {{year}} já existe",
      yearAdded: "Ano {{year}} adicionado com sucesso",
      addYear: "Adicionar Ano"
    },
    
    // Page Header & navigation
    pageHeader: {
      subtitle: "Visão completa dos projetos e pedidos de subsídio da organização - {{year}}",
      manageDescription: "Gerencie e acompanhe todos os projetos entre departamentos"
    },
    
    navigation: {
      openingProject: "Abrindo {{title}}"
    }
  }
}
