export const subsidyRequestTranslations = {
  en: {
    // Modal header
    title: "Request Subsidy",
    selectedActivities: "{{count}} selected activity",
    selectedActivities_plural: "{{count}} selected activities",

    // Info section
    about: {
      title: "About Subsidy Request",
      howItWorks: "How it works:",
      description: "This request allows the church to request financial support from the institution for project activities.",
      distribution: "The amount is distributed between <strong>institution</strong> (up to 65% of subsidized budget or max. €5,000) and <strong>church</strong> (minimum 35%), ensuring shared responsibility in financing."
    },
    
    // Summary bar
    summary: {
      totalRequested: "Total Requested",
      institution: "Institution",
      church: "Church"
    },
    
    // Activity navigation
    activities: {
      title: "Selected Activities",
      tooltip: {
        title: "Activity Navigation",
        description: "Use the buttons to navigate between activities. Add supporting documents and define how much the institution will contribute for each activity."
      },
      previous: "Previous",
      next: "Next",
      ofTotal: "{{current}} of {{total}}",
      documents: "doc",
      documents_plural: "docs",
      addMore: "Add more activities"
    },
    
    // Budget distribution
    budget: {
      title: "Request Contribution",
      tooltip: {
        title: "Request Value",
        description: "This is the amount the institution will contribute. The rest of the budget will be covered by the church."
      },
      editButton: "Edit Value",
      cancelButton: "Cancel",
      saveButton: "Save Changes",
      
      // Funding policies
      policies: {
        maxPercent: "Max. {{percent}}%",
        maxPercentTooltip: "The institution can contribute up to {{percent}}% of the subsidized budget",
        maxAmount: "Max. {{amount}}",
        maxAmountTooltip: "Absolute maximum amount per activity: {{amount}}",
        minChurch: "Min. Church {{percent}}%",
        minChurchTooltip: "The church must contribute at least {{percent}}% of the budget"
      },
      
      // Edit mode
      requestedLabel: "Amount requested from institution",
      percentageLabel: "{{percent}}% of budget",
      maxButton: "Maximum",
      maxButtonTooltip: "Set maximum allowed value",
      placeholder: "0.00",
      
      // Calculated values
      totalBudget: "Total Activity Budget:",
      requestContribution: "Request Contribution:",
      selfFunded: "Remainder for Church:",
      selfRemainder: "Self Remainder",
      
      // Limit info
      limitTitle: "Limit for this activity:",
      limitMaxAllowed: "Maximum allowed:",
      
      // View mode
      requestedValue: "Requested Value",
      requestedValueTooltip: "This is the amount that will be requested from the institution for this activity",
      percentOfTotal: "{{percent}}% of total budget",
      totalBudgetLabel: "Total Budget",
      selfFundedLabel: "Remainder (Self-funded)",
      selfRemainderLabel: "Self Remainder"
    },
    
    // Activity notes
    activityNotes: {
      label: "Activity Notes",
      placeholder: "Add specific notes for this activity..."
    },
    
    // Documents section
    documents: {
      title: "Supporting Documents",
      tooltip: {
        title: "Required Documents",
        description: "Attach invoices, receipts, contracts or proof of payment that justify the subsidy request."
      },
      
      // Drop zone
      dropZone: {
        dragText: "Drag files or click to select",
        selectButton: "Select Files",
        acceptedFormats: "PDF, JPG, PNG, DOC (max. 10MB per file)"
      },
      
      // Document details
      typeLabel: "Document Type",
      amountLabel: "Amount (optional)",
      recipientLabel: "Recipient",
      recipientPlaceholder: "Recipient name",
      
      // Document types
      types: {
        invoice: "Invoice",
        receipt: "Receipt",
        contract: "Contract",
        proofOfPayment: "Proof of Payment",
        other: "Other"
      },
      
      // Warning
      warningNoDocuments: "It is necessary to attach at least one supporting document for each activity",
      amountCannotBeEdited: "Amount cannot be edited"
    },
    
    // General notes
    generalNotes: {
      label: "General Request Notes",
      tooltip: {
        title: "Additional Context",
        description: "Add general information about the request that applies to all activities, such as urgency, justification or special context."
      },
      placeholder: "Add general notes about this subsidy request..."
    },
    
    // Footer
    footer: {
      totalRequested: "Total Requested",
      activities: "Activities",
      documents: "Documents"
    },
    
    // Buttons
    buttons: {
      cancel: "Cancel",
      submit: "Submit Request"
    },
    
    // Validation messages
    validation: {
      institutionRequired: "Institution is required",
      activityRequired: "Select at least one activity",
      amountPositive: "Total requested amount must be greater than zero",
      documentsRequired: "All activities must have at least one document attached",
      maxAllowed: "Maximum allowed value: {{amount}}"
    },
    
    // Success messages
    success: {
      created: "Subsidy request created successfully"
    },
    
    // Validation badges
    validationBadges: {
      valueDefined: "Value Defined",
      documents: "Documents",
      valuesOk: "Values OK",
      totalDocs: "Total Docs",
      files: "file(s)"
    },
    
    // Toast messages
    toasts: {
      filesAdded: "{{count}} file(s) added",
      documentRemoved: "Document removed",
      activitiesAdded: "{{count}} activityies added",
      budgetExceeded: "The requested amount ({{requested}}) exceeds the available budget ({{available}})",
      documentAmountMismatch: "{{activity}}: Requested amount ({{requested}}) must equal the total of documents ({{total}})",
      documentsNeedAmount: "{{activity}}: All documents must have an amount filled in",
      requestUpdated: "Request updated successfully",
      uploadError: "Error uploading files. Please try again.",
      createError: "Error creating request or uploading files",
      maxValueSet: "{{label}}: {{amount}}",
      maxDocumentValueSet: "Maximum available value set: {{amount}}",
      documentLimitReached: "Limit already reached by other documents"
    },
    
    // Status labels
    status: {
      notInformed: "Not informed",
      loading: "Loading...",
      noChurchRegistered: "No church registered",
      activitiesAvailable: "{{count}} subsidized activityies available",
      noActivitiesAvailable: "No subsidized activities available",
      pendingValue: "Pending value",
      completed: "Completed",
      readyToSubmit: "Ready to submit",
      pendingValidation: "Pending validation",
      uploadingFile: "Uploading file...",
      uploading: "Uploading...",
      uploadingFiles: "Uploading files...",
      savingChanges: "Save changes"
    },
    
    // Labels
    labels: {
      department: "Department",
      churchDepartment: "Church Department",
      requestContribution: "Request Contribution",
      projectBudgetLimit: "Limit: Project Budget",
      selectType: "Select type",
      searchType: "Search type...",
      noTypeFound: "No type found",
      totalDocuments: "Total documents:",
      requestedValue: "Requested value:",
      difference: "Difference:"
    },
    
    // Modal titles
    modals: {
      addActivitiesTitle: "Add Subsidized Activities",
      addActivitiesDescription: "Select subsidized activities from the project to add to the subsidy request."
    },
    
    // Advance request
    advance: {
      title: "Request Advance Payment",
      description: "Request an advance payment up to 50% of the subsidized budget before full subsidy processing.",
      amount: "Advance Amount",
      maxAllowed: "Maximum allowed: {{amount}}",
      exceeds50Percent: "Advance amount cannot exceed 50% of the subsidized budget",
      button: "Request Advance",
      submit: "Submit Advance Request",
      success: "Advance request created successfully",
      statusAdvancedClosed: "Advanced Closed",
      advanceAmount: "Advance Amount",
      status: "Status",
      noActivitiesNote: "This advance request is not linked to specific activities. It provides upfront funding based on the project subsidized budget.",
      linkedActivitiesTitle: "Linked Activities",
      linkedActivitiesNote: "This advance request is associated with project activities that will be funded with this payment.",
      linkActivityTitle: "Link Activities",
      linkActivityDescription: "Select project activities to link to this advance request.",
      noActivitiesLinked: "No activities linked",
      linkActivityHint: "Use the + button to link activities.",
      noActivitiesStatus: "No activities registered.",
      maxButton: "MAX",
      confirmationRequired: "Please confirm that you understand the terms",
      confirmationLabel: "I understand the advance payment terms",
      confirmationText: "I understand that I am requesting 50% of the subsidized budget value before full subsidy processing. If the advance amount is not justified for project use, a refund of the unjustified amount may be requested."
    },

    // Refund
    refund: {
      requestRefund: "Request Refund",
      confirmRefundDone: "Confirm Refund Done",
      refundAmount: "Refund Amount",
      refundReason: "Refund Reason",
      refundPending: "Waiting refund",
      refundPendingTooltip: "Awaiting refund confirmation of {{amount}}",
      refundDone: "Refund Done",
      refundDoneTooltip: "Amount of {{amount}} has been refunded",
      waitingRefund: "Waiting Refund",
      refundRequestSuccess: "Refund request submitted successfully",
      refundConfirmSuccess: "Refund confirmed successfully",
      refundAmountRequired: "Refund amount is required",
      refundReasonRequired: "Refund reason is required",
      confirmRefundRequest: "Are you sure you want to request a refund?",
      confirmRefundDoneAction: "Are you sure you want to confirm that the refund has been processed?",
      refundAmountLabel: "Refund Amount",
      refundReasonPlaceholder: "Explain the reason for the refund...",
      refundModalTitle: "Request Refund",
      refundModalDescription: "Request a refund for this subsidy.",
      cancel: "Cancel",
      submit: "Request Refund",
      enterRefundAmount: "Enter refund amount",
      enterRefundReason: "Enter reason for refund",
      confirmButton: "Confirm Refund Done",
      confirmRefundWarning: "This action will return the refund amount to the annual budget. This cannot be undone.",
      // Modal sections
      projectInfo: "Project Information",
      refundDetails: "Refund Details",
      importantNotice: "Important Notice",
      awareness: "Confirmation",
      // KPIs
      subsidyAmount: "Subsidy Amount",
      // Confirm completion modal
      confirmCompletionIntro: "By confirming the completion of the refund:",
      completionNotice1: "The amount of {{amount}} will be considered returned to the department budget.",
      completionNotice2: "This action cannot be undone",
      completionNotice2Detail: "and will close the refund process.",
      completionNotice3: "The subsidy status will be updated to 'Closed'.",
      completionNotice4: "A record of this confirmation will be added to the history",
      completionNotice4Detail: "permanently.",
      confirmAwarenessLabel: "I confirm that I have received the refund of {{amount}}",
      confirmAwarenessDetail: "and I am aware that this action will permanently close the refund process and cannot be reversed.",
      processing: "Processing...",
      refundingAmount: "Refunding",
      maxButton: "MAX",
      maximum: "Maximum",
      // Project details
      project: "Project",
      department: "Department",
      responsibles: "Responsibles",
      // Notice bullets
      noticeIntro: "When requesting a refund:",
      noticeResponsibles: "Project responsibles will receive a notification",
      noticeResponsiblesDetail: "to make the payment of the requested amount.",
      noticeBudget: "The amount will be returned to the department budget",
      noticeHistory: "This action will generate a record in the subsidy history",
      noticeHistoryDetail: ".",
      // Awareness checkbox
      awarenessLabel: "I am aware that this action will notify the responsibles and request the refund of the amount from the project, returning the funds to the department budget.",
      // Validation
      characters: "characters",
      alert: {
        singlePending: "You have 1 subsidy waiting for refund processing",
        multiplePending: "You have {{count}} subsidies waiting for refund processing"
      },
      // Refund status indicators
      refundRequested: "Refund Requested",
      refundRequestedAmount: "Refund Amount",
      refundRequestedTooltip: "A refund of {{amount}} has been requested and is awaiting confirmation",
      statusWithRefund: "Status: Refund requested ({{amount}})",
      // Refund receipt upload
      uploadRefundReceiptTitle: "Proof of Refund Payment",
      uploadRefundReceiptDescription: "Upload the proof of payment for the refund amount.",
      uploadRefundReceiptButton: "Upload Proof",
      uploadNotePlaceholder: "Optional note (e.g. TED bank receipt)",
      refundReceiptPending: "Pending validation",
      refundReceiptApproved: "Approved",
      refundReceiptRejected: "Rejected",
      putInReviewButton: "Submit for Review",
      putInReviewTooltip: "Send the refund receipt for review so the subsidy can be finalized.",
      deleteRefundReceipt: "Delete",
      validateRefundReceipt: "Validate",
      validateNoteLabel: "Optional validation note:",
      validateNotePlaceholder: "e.g. Receipt accepted",
      noRefundReceiptYet: "No proof of payment uploaded yet.",
      cancel: "Cancel"
    },

    // Receipt hook messages
    receipts: {
      fetchError: "Error fetching receipts",
      uploadSuccess: "{{filename}} uploaded successfully!",
      uploadError: "Error uploading file",
      refundUploadError: "Error uploading refund receipt",
      deleteSuccess: "Receipt deleted successfully",
      deleteError: "Error deleting receipt",
      validateSuccess: "Receipt validated successfully",
      validateError: "Error validating receipt",
      rejectSuccess: "Receipt rejected",
      rejectError: "Error rejecting receipt",
      downloadSuccess: "Download started",
      downloadError: "Error downloading file",
      updateSuccess: "Receipt updated successfully!",
      updateError: "Error updating receipt",
      invalidFileType: "Invalid file type. Only JPG, PNG and PDF are allowed.",
      fileTooLarge: "File too large. Maximum size: 10MB.",
      invalidFileExtension: "Invalid file extension. Only .jpg, .jpeg, .png and .pdf are allowed."
    }
  },

  pt: {
    // Modal header
    title: "Solicitar Subsídio",
    selectedActivities: "{{count}} atividade selecionada",
    selectedActivities_plural: "{{count}} atividades selecionadas",
    
    // Info section
    about: {
      title: "Sobre a Solicitação de Subsídio",
      howItWorks: "Como funciona:",
      description: "Esta solicitação permite que a igreja solicite apoio financeiro da instituição para atividades do projeto.",
      distribution: "O valor é distribuído entre <strong>instituição</strong> (até 65% do orçamento subsidiado ou máx. €5.000) e <strong>igreja</strong> (mínimo 35%), garantindo responsabilidade compartilhada no financiamento."
    },
    
    // Summary bar
    summary: {
      totalRequested: "Total Solicitado",
      institution: "Instituição",
      church: "Igreja"
    },
    
    // Activity navigation
    activities: {
      title: "Atividades Selecionadas",
      tooltip: {
        title: "Navegação de Atividades",
        description: "Use os botões para navegar entre atividades. Adicione documentos comprobatórios e defina quanto a instituição contribuirá para cada atividade."
      },
      previous: "Anterior",
      next: "Próxima",
      ofTotal: "{{current}} de {{total}}",
      documents: "doc",
      documents_plural: "docs",
      addMore: "Adicionar mais atividades"
    },
    
    // Budget distribution
    budget: {
      title: "Contribuição da Instituição",
      tooltip: {
        title: "Valor da Solicitação",
        description: "Este é o valor que a instituição contribuirá. O restante do orçamento será coberto pela igreja."
      },
      editButton: "Editar Valor",
      cancelButton: "Cancelar",
      saveButton: "Salvar Alterações",
      
      // Funding policies
      policies: {
        maxPercent: "Máx. {{percent}}%",
        maxPercentTooltip: "A instituição pode contribuir até {{percent}}% do orçamento subsidiado",
        maxAmount: "Máx. {{amount}}",
        maxAmountTooltip: "Valor máximo absoluto por atividade: {{amount}}",
        minChurch: "Mín. Igreja {{percent}}%",
        minChurchTooltip: "A igreja deve contribuir no mínimo {{percent}}% do orçamento"
      },
      
      // Edit mode
      requestedLabel: "Valor solicitado à instituição",
      percentageLabel: "{{percent}}% do orçamento",
      maxButton: "Máximo",
      maxButtonTooltip: "Definir valor máximo permitido",
      placeholder: "0,00",
      
      // Calculated values
      totalBudget: "Orçamento Total da Atividade:",
      requestContribution: "Contribuição da Instituição:",
      selfFunded: "Restante para a Igreja:",      selfRemainder: "Restante da Igreja",      
      // Limit info
      limitTitle: "Limite para esta atividade:",
      limitMaxAllowed: "Máximo permitido:",
      
      // View mode
      requestedValue: "Valor Solicitado",
      requestedValueTooltip: "Este é o valor que será solicitado à instituição para esta atividade",
      percentOfTotal: "{{percent}}% do orçamento total",
      totalBudgetLabel: "Orçamento Total",
      selfFundedLabel: "Restante (Igreja)",
      selfRemainderLabel: "Restante da Igreja"
    },
    
    // Activity notes
    activityNotes: {
      label: "Observações da Atividade",
      placeholder: "Adicione observações específicas para esta atividade..."
    },
    
    // Documents section
    documents: {
      title: "Documentos Comprobatórios",
      tooltip: {
        title: "Documentos Necessários",
        description: "Anexe faturas, recibos, contratos ou comprovantes de pagamento que justifiquem a solicitação de subsídio."
      },
      
      // Drop zone
      dropZone: {
        dragText: "Arraste arquivos ou clique para selecionar",
        selectButton: "Selecionar Arquivos",
        acceptedFormats: "PDF, JPG, PNG, DOC (máx. 10MB por arquivo)"
      },
      
      // Document details
      typeLabel: "Tipo de Documento",
      amountLabel: "Valor (opcional)",
      recipientLabel: "Beneficiário",
      recipientPlaceholder: "Nome do beneficiário",
      
      // Document types
      types: {
        invoice: "Fatura",
        receipt: "Recibo",
        contract: "Contrato",
        proofOfPayment: "Comprovante",
        other: "Outro"
      },
      
      // Warning
      warningNoDocuments: "É necessário anexar pelo menos um documento comprobatório para cada atividade",
      amountCannotBeEdited: "Valor não pode ser editado"
    },
    
    // General notes
    generalNotes: {
      label: "Observações Gerais da Solicitação",
      tooltip: {
        title: "Contexto Adicional",
        description: "Adicione informações gerais sobre a solicitação que se aplicam a todas as atividades, como urgência, justificativa ou contexto especial."
      },
      placeholder: "Adicione observações gerais sobre esta solicitação de subsídio..."
    },
    
    // Footer
    footer: {
      totalRequested: "Total Solicitado",
      activities: "Atividades",
      documents: "Documentos"
    },
    
    // Buttons
    buttons: {
      cancel: "Cancelar",
      submit: "Enviar Solicitação"
    },
    
    // Validation messages
    validation: {
      institutionRequired: "Instituição é obrigatória",
      activityRequired: "Selecione pelo menos uma atividade",
      amountPositive: "O valor total solicitado deve ser maior que zero",
      documentsRequired: "Todas as atividades devem ter pelo menos um documento anexado",
      maxAllowed: "Valor máximo permitido: {{amount}}"
    },
    
    // Success messages
    success: {
      created: "Solicitação de subsídio criada com sucesso"
    },
    
    // Validation badges
    validationBadges: {
      valueDefined: "Valor Definido",
      documents: "Documentos",
      valuesOk: "Valores OK",
      totalDocs: "Total Docs",
      files: "arquivo(s)"
    },
    
    // Toast messages
    toasts: {
      filesAdded: "{{count}} arquivo(s) adicionado(s)",
      documentRemoved: "Documento removido",
      activitiesAdded: "{{count}} atividade(s) adicionada(s)",
      budgetExceeded: "O valor solicitado ({{requested}}) excede o orçamento disponível ({{available}})",
      documentAmountMismatch: "{{activity}}: Valor solicitado ({{requested}}) deve ser igual ao total dos documentos ({{total}})",
      documentsNeedAmount: "{{activity}}: Todos os documentos devem ter um valor preenchido",
      requestUpdated: "Solicitação atualizada com sucesso",
      uploadError: "Erro ao enviar arquivos. Tente novamente.",
      createError: "Erro ao criar solicitação ou enviar arquivos",
      maxValueSet: "{{label}}: {{amount}}",
      maxDocumentValueSet: "Valor máximo disponível definido: {{amount}}",
      documentLimitReached: "Limite já atingido pelos outros documentos"
    },
    
    // Status labels
    status: {
      notInformed: "Não informado",
      loading: "Carregando...",
      noChurchRegistered: "Sem igreja registrada",
      activitiesAvailable: "{{count}} atividade(s) subsidiada(s) disponível(is)",
      noActivitiesAvailable: "Nenhuma atividade subsidiada disponível",
      pendingValue: "Valor pendente",
      completed: "Completas",
      readyToSubmit: "Pronto para enviar",
      pendingValidation: "Pendente validação",
      uploadingFile: "Enviando arquivo...",
      uploading: "Enviando...",
      uploadingFiles: "Enviando arquivos...",
      savingChanges: "Salvar alterações"
    },
    
    // Labels
    labels: {
      department: "Departamento",
      churchDepartment: "Departamento da Igreja",
      requestContribution: "Contribuição da Instituição",
      projectBudgetLimit: "Limite: Orçamento do Projeto",
      selectType: "Selecionar tipo",
      searchType: "Buscar tipo...",
      noTypeFound: "Nenhum tipo encontrado",
      totalDocuments: "Total documentos:",
      requestedValue: "Valor solicitado:",
      difference: "Diferença:"
    },
    
    // Modal titles
    modals: {
      addActivitiesTitle: "Adicionar Atividades Subsidiadas",
      addActivitiesDescription: "Selecione atividades subsidiadas do projeto para adicionar à solicitação de subsídio."
    },
    
    // Advance request
    advance: {
      title: "Solicitar Adiantamento",
      description: "Solicite um adiantamento de até 50% do orçamento subsidiado antes do processamento completo do subsídio.",
      amount: "Valor do Adiantamento",
      maxAllowed: "Máximo permitido: {{amount}}",
      exceeds50Percent: "O valor do adiantamento não pode exceder 50% do orçamento subsidiado",
      button: "Solicitar Adiantamento",
      submit: "Enviar Solicitação de Adiantamento",
      success: "Solicitação de adiantamento criada com sucesso",
      statusAdvancedClosed: "Adiantamento Encerrado",
      status: "Status",
      advanceAmount: "Valor do Adiantamento",
      noActivitiesNote: "Esta solicitação de adiantamento não está vinculada a atividades específicas. Ela fornece financiamento antecipado com base no orçamento subsidiado do projeto.",
      linkedActivitiesTitle: "Atividades Vinculadas",
      linkedActivitiesNote: "Esta solicitação de adiantamento está associada a atividades do projeto que serão financiadas com este pagamento.",
      linkActivityTitle: "Vincular Atividades",
      linkActivityDescription: "Selecione as atividades do projeto para vincular a este adiantamento.",
      noActivitiesLinked: "Nenhuma atividade vinculada",
      linkActivityHint: "Use o + para vincular atividades.",
      noActivitiesStatus: "Nenhuma atividade registrada.",
      maxButton: "MÁXIMO",
      confirmationRequired: "Por favor, confirme que você entende os termos",
      confirmationLabel: "Compreendo os termos do pagamento antecipado",
      confirmationText: "Compreendo que estou solicitando 50% do valor do orçamento subsidiado antes do processamento completo do subsídio. Caso o valor do adiantamento não seja justificado para uso no projeto, poderá ser solicitado o reembolso do valor não justificado."
    },

    // Refund
    refund: {
      requestRefund: "Solicitar Reembolso",
      confirmRefundDone: "Confirmar Reembolso",
      refundAmount: "Valor do Reembolso",
      refundReason: "Motivo do Reembolso",
      refundPending: "Reembolso Pendente",
      refundPendingTooltip: "Aguardando confirmação de reembolso de {{amount}}",
      refundDone: "Reembolso Concluído",
      refundDoneTooltip: "Valor de {{amount}} foi reembolsado",
      waitingRefund: "Aguardando Reembolso",
      refundRequestSuccess: "Solicitação de reembolso enviada com sucesso",
      refundConfirmSuccess: "Reembolso confirmado com sucesso",
      refundAmountRequired: "Valor do reembolso é obrigatório",
      refundReasonRequired: "Motivo do reembolso é obrigatório",
      confirmRefundRequest: "Tem certeza que deseja solicitar um reembolso?",
      confirmRefundDoneAction: "Tem certeza que deseja confirmar que o reembolso foi processado?",
      refundAmountLabel: "Valor do Reembolso",
      refundReasonPlaceholder: "Explique o motivo do reembolso...",
      refundModalTitle: "Solicitar Reembolso",
      refundModalDescription: "Solicite um reembolso para este subsídio.",
      cancel: "Cancelar",
      submit: "Solicitar Reembolso",
      enterRefundAmount: "Digite o valor do reembolso",
      enterRefundReason: "Digite o motivo do reembolso",
      confirmButton: "Confirmar Reembolso Concluído",
      confirmRefundWarning: "Esta ação retornará o valor do reembolso ao orçamento anual. Isso não pode ser desfeito.",
      // Modal sections
      projectInfo: "Informações do Projeto",
      refundDetails: "Detalhes do Reembolso",
      importantNotice: "Aviso Importante",
      awareness: "Confirmação",
      // KPIs
      subsidyAmount: "Valor do Subsídio",
      // Confirm completion modal
      confirmCompletionIntro: "Ao confirmar a conclusão do reembolso:",
      completionNotice1: "O valor de {{amount}} será considerado devolvido ao orçamento do departamento.",
      completionNotice2: "Esta ação não pode ser desfeita",
      completionNotice2Detail: "e encerrará o processo de reembolso.",
      completionNotice3: "O status do subsídio será atualizado para 'Fechado'.",
      completionNotice4: "Um registro desta confirmação será adicionado ao histórico",
      completionNotice4Detail: "permanentemente.",
      confirmAwarenessLabel: "Confirmo que recebi o reembolso de {{amount}}",
      confirmAwarenessDetail: "e estou ciente de que esta ação encerrará definitivamente o processo de reembolso e não poderá ser revertida.",
      processing: "Processando...",
      refundingAmount: "Reembolsando",
      maxButton: "MÁXIMO",
      maximum: "Máximo",
      // Project details
      project: "Projeto",
      department: "Departamento",
      responsibles: "Responsáveis",
      // Notice bullets
      noticeIntro: "Ao solicitar o reembolso:",
      noticeResponsibles: "Os responsáveis pelo projeto receberão uma notificação",
      noticeResponsiblesDetail: "para efetuar o pagamento do valor solicitado.",
      noticeBudget: "O valor será devolvido ao orçamento do departamento",
      noticeHistory: "Esta ação gerará um registro no histórico",
      noticeHistoryDetail: "do subsídio.",
      // Awareness checkbox
      awarenessLabel: "Estou ciente de que esta ação irá notificar os responsáveis e solicitar o reembolso do valor ao projeto, devolvendo o montante ao orçamento do departamento.",
      // Validation
      characters: "caracteres",
      alert: {
        singlePending: "Você tem 1 subsídio aguardando processamento de reembolso",
        multiplePending: "Você tem {{count}} subsídios aguardando processamento de reembolso"
      },
      // Indicadores de status de reembolso
      refundRequested: "Reembolso Solicitado",
      refundRequestedAmount: "Valor de Reembolso",
      refundRequestedTooltip: "Um reembolso de {{amount}} foi solicitado e está aguardando confirmação",
      statusWithRefund: "Status: Reembolso solicitado ({{amount}})",
      // Upload de comprovante de reembolso
      uploadRefundReceiptTitle: "Comprovante de Pagamento do Reembolso",
      uploadRefundReceiptDescription: "Envie o comprovante de pagamento do valor do reembolso.",
      uploadRefundReceiptButton: "Enviar Comprovante",
      uploadNotePlaceholder: "Nota opcional (ex.: comprovante TED banco X)",
      refundReceiptPending: "Aguardando validação",
      refundReceiptApproved: "Aprovado",
      refundReceiptRejected: "Rejeitado",
      putInReviewButton: "Enviar para Revisão",
      putInReviewTooltip: "Envie o comprovante de reembolso para revisão para que o subsídio possa ser finalizado.",
      deleteRefundReceipt: "Excluir",
      validateRefundReceipt: "Validar",
      validateNoteLabel: "Nota de validação (opcional):",
      validateNotePlaceholder: "ex.: Comprovante aceito",
      noRefundReceiptYet: "Nenhum comprovante de pagamento enviado ainda.",
      cancel: "Cancelar"
    },

    // Mensagens do hook de recibos
    receipts: {
      fetchError: "Erro ao buscar recibos",
      uploadSuccess: "{{filename}} enviado com sucesso!",
      uploadError: "Erro ao fazer upload do arquivo",
      refundUploadError: "Erro ao fazer upload do comprovante de reembolso",
      deleteSuccess: "Recibo excluído com sucesso",
      deleteError: "Erro ao excluir recibo",
      validateSuccess: "Recibo validado com sucesso",
      validateError: "Erro ao validar recibo",
      rejectSuccess: "Recibo rejeitado",
      rejectError: "Erro ao rejeitar recibo",
      downloadSuccess: "Download iniciado",
      downloadError: "Erro ao fazer download do arquivo",
      updateSuccess: "Recibo atualizado com sucesso!",
      updateError: "Erro ao atualizar recibo",
      invalidFileType: "Tipo de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.",
      fileTooLarge: "Arquivo muito grande. Tamanho máximo: 10MB.",
      invalidFileExtension: "Extensão de arquivo inválida. Apenas .jpg, .jpeg, .png e .pdf são permitidos."
    }
  },
  
  nl: {
    // Modal header
    title: "Subsidie Aanvragen",
    selectedActivities: "{{count}} geselecteerde activiteit",
    selectedActivities_plural: "{{count}} geselecteerde activiteiten",
    
    // Info section
    about: {
      title: "Over Subsidieaanvraag",
      howItWorks: "Hoe het werkt:",
      description: "Met deze aanvraag kan de kerk financiële ondersteuning aanvragen bij de instelling voor projectactiviteiten.",
      distribution: "Het bedrag is verdeeld over <strong>instelling</strong> (tot 65% van het gesubsidieerde budget of max. €5.000) en <strong>kerk</strong> (minimaal 35%), waardoor gedeelde verantwoordelijkheid in financiering wordt gegarandeerd."
    },
    
    // Summary bar
    summary: {
      totalRequested: "Totaal Aangevraagd",
      institution: "Instelling",
      church: "Kerk"
    },
    
    // Activity navigation
    activities: {
      title: "Geselecteerde Activiteiten",
      tooltip: {
        title: "Activiteiten Navigatie",
        description: "Gebruik de knoppen om tussen activiteiten te navigeren. Voeg ondersteunende documenten toe en bepaal hoeveel de instelling zal bijdragen voor elke activiteit."
      },
      previous: "Vorige",
      next: "Volgende",
      ofTotal: "{{current}} van {{total}}",
      documents: "doc",
      documents_plural: "docs"
    },
    
    // Budget distribution
    budget: {
      title: "Bijdrage Instelling",
      tooltip: {
        title: "Aanvraagwaarde",
        description: "Dit is het bedrag dat de instelling zal bijdragen. De rest van het budget wordt gedekt door de kerk."
      },
      editButton: "Waarde Bewerken",
      cancelButton: "Annuleren",
      saveButton: "Wijzigingen Opslaan",
      
      // Funding policies
      policies: {
        maxPercent: "Max. {{percent}}%",
        maxPercentTooltip: "De instelling kan tot {{percent}}% van het gesubsidieerde budget bijdragen",
        maxAmount: "Max. {{amount}}",
        maxAmountTooltip: "Absoluut maximumbedrag per activiteit: {{amount}}",
        minChurch: "Min. Kerk {{percent}}%",
        minChurchTooltip: "De kerk moet minimaal {{percent}}% van het budget bijdragen"
      },
      
      // Edit mode
      requestedLabel: "Bedrag aangevraagd bij instelling",
      percentageLabel: "{{percent}}% van budget",
      maxButton: "Maximum",
      maxButtonTooltip: "Maximaal toegestane waarde instellen",
      placeholder: "0,00",
      
      // Calculated values
      totalBudget: "Totaal Activiteitenbudget:",
      requestContribution: "Bijdrage Instelling:",
      selfFunded: "Restant voor Kerk:",
      selfRemainder: "Restant Kerk",
      
      // Limit info
      limitTitle: "Limiet voor deze activiteit:",
      limitMaxAllowed: "Maximaal toegestaan:",
      
      // View mode
      requestedValue: "Aangevraagde Waarde",
      requestedValueTooltip: "Dit is het bedrag dat bij de instelling wordt aangevraagd voor deze activiteit",
      percentOfTotal: "{{percent}}% van totaal budget",
      totalBudgetLabel: "Totaal Budget",
      selfFundedLabel: "Restant (Kerk)",
      selfRemainderLabel: "Restant Kerk"
    },
    
    // Activity notes
    activityNotes: {
      label: "Activiteiten Notities",
      placeholder: "Voeg specifieke notities toe voor deze activiteit..."
    },
    
    // Documents section
    documents: {
      title: "Ondersteunende Documenten",
      tooltip: {
        title: "Vereiste Documenten",
        description: "Voeg facturen, kwitanties, contracten of betalingsbewijzen toe die de subsidieaanvraag rechtvaardigen."
      },
      
      // Drop zone
      dropZone: {
        dragText: "Sleep bestanden of klik om te selecteren",
        selectButton: "Bestanden Selecteren",
        acceptedFormats: "PDF, JPG, PNG, DOC (max. 10MB per bestand)"
      },
      
      // Document details
      typeLabel: "Documenttype",
      amountLabel: "Bedrag (optioneel)",
      recipientLabel: "Ontvanger",
      recipientPlaceholder: "Naam ontvanger",
      
      // Document types
      types: {
        invoice: "Factuur",
        receipt: "Kwitantie",
        contract: "Contract",
        proofOfPayment: "Betalingsbewijs",
        other: "Anders"
      },
      
      // Warning
      warningNoDocuments: "Het is noodzakelijk om minimaal één ondersteunend document voor elke activiteit toe te voegen",
      amountCannotBeEdited: "Bedrag kan niet worden bewerkt"
    },
    
    // General notes
    generalNotes: {
      label: "Algemene Aanvraag Notities",
      tooltip: {
        title: "Aanvullende Context",
        description: "Voeg algemene informatie toe over de aanvraag die van toepassing is op alle activiteiten, zoals urgentie, rechtvaardiging of speciale context."
      },
      placeholder: "Voeg algemene notities toe over deze subsidieaanvraag..."
    },
    
    // Footer
    footer: {
      totalRequested: "Totaal Aangevraagd",
      activities: "Activiteiten",
      documents: "Documenten"
    },
    
    // Buttons
    buttons: {
      cancel: "Annuleren",
      submit: "Aanvraag Indienen"
    },
    
    // Validation messages
    validation: {
      institutionRequired: "Instelling is verplicht",
      activityRequired: "Selecteer minimaal één activiteit",
      amountPositive: "Totaal aangevraagd bedrag moet groter zijn dan nul",
      documentsRequired: "Alle activiteiten moeten minimaal één document bijgevoegd hebben",
      maxAllowed: "Maximaal toegestane waarde: {{amount}}"
    },
    
    // Success messages
    success: {
      created: "Subsidieaanvraag succesvol aangemaakt"
    },
    
    // Validation badges
    validationBadges: {
      valueDefined: "Waarde Gedefinieerd",
      documents: "Documenten",
      valuesOk: "Waarden OK",
      totalDocs: "Totaal Docs",
      files: "bestand(en)"
    },
    
    // Toast messages
    toasts: {
      filesAdded: "{{count}} bestand(en) toegevoegd",
      documentRemoved: "Document verwijderd",
      activitiesAdded: "{{count}} activiteit(en) toegevoegd",
      budgetExceeded: "Het aangevraagde bedrag ({{requested}}) overschrijdt het beschikbare budget ({{available}})",
      documentAmountMismatch: "{{activity}}: Aangevraagd bedrag ({{requested}}) moet gelijk zijn aan het totaal van documenten ({{total}})",
      documentsNeedAmount: "{{activity}}: Alle documenten moeten een bedrag hebben ingevuld",
      requestUpdated: "Aanvraag succesvol bijgewerkt",
      uploadError: "Fout bij uploaden van bestanden. Probeer het opnieuw.",
      createError: "Fout bij aanmaken van aanvraag of uploaden van bestanden",
      maxValueSet: "{{label}}: {{amount}}",
      maxDocumentValueSet: "Maximale beschikbare waarde ingesteld: {{amount}}",
      documentLimitReached: "Limiet al bereikt door andere documenten"
    },
    
    // Status labels
    status: {
      notInformed: "Niet opgegeven",
      loading: "Laden...",
      noChurchRegistered: "Geen kerk geregistreerd",
      activitiesAvailable: "{{count}} gesubsidieerde activiteit(en) beschikbaar",
      noActivitiesAvailable: "Geen gesubsidieerde activiteiten beschikbaar",
      pendingValue: "Bedrag in behandeling",
      completed: "Voltooid",
      readyToSubmit: "Klaar om in te dienen",
      pendingValidation: "Validatie in behandeling",
      uploadingFile: "Bestand uploaden...",
      uploading: "Uploaden...",
      uploadingFiles: "Bestanden uploaden...",
      savingChanges: "Wijzigingen opslaan"
    },
    
    // Labels
    labels: {
      department: "Afdeling",
      churchDepartment: "Kerkafdeling",
      requestContribution: "Bijdrage Instelling",
      projectBudgetLimit: "Limiet: Projectbudget",
      selectType: "Type selecteren",
      searchType: "Type zoeken...",
      noTypeFound: "Geen type gevonden",
      totalDocuments: "Totaal documenten:",
      requestedValue: "Aangevraagde waarde:",
      difference: "Verschil:"
    },
    
    // Modal titles
    modals: {
      addActivitiesTitle: "Gesubsidieerde Activiteiten Toevoegen",
      addActivitiesDescription: "Selecteer gesubsidieerde activiteiten uit het project om toe te voegen aan de subsidieaanvraag."
    },
    
    // Advance request
    advance: {
      title: "Voorschot Aanvragen",
      description: "Vraag een voorschot aan tot 50% van het gesubsidieerde budget vóór volledige subsidieafhandeling.",
      amount: "Voorschotbedrag",
      maxAllowed: "Maximaal toegestaan: {{amount}}",
      exceeds50Percent: "Voorschotbedrag mag niet hoger zijn dan 50% van het gesubsidieerde budget",
      button: "Voorschot Aanvragen",
      submit: "Voorschotaanvraag Indienen",
      success: "Voorschotaanvraag succesvol aangemaakt",
      statusAdvancedClosed: "Voorschot Afgesloten",
      noActivitiesNote: "Deze voorschotaanvraag is niet gekoppeld aan specifieke activiteiten. Het biedt upfront financiering op basis van het gesubsidieerde projectbudget.",
      linkedActivitiesTitle: "Gekoppelde Activiteiten",
      linkedActivitiesNote: "Deze voorschotaanvraag is gekoppeld aan projectactiviteiten die met deze betaling worden gefinancierd.",
      linkActivityTitle: "Activiteiten Koppelen",
      linkActivityDescription: "Selecteer projectactiviteiten om te koppelen aan deze voorschotaanvraag.",
      noActivitiesLinked: "Geen activiteiten gekoppeld",
      linkActivityHint: "Gebruik de + knop om activiteiten te koppelen.",
      noActivitiesStatus: "Geen activiteiten geregistreerd.",
      advanceAmount: "Voorschotbedrag",
      advanceStatus: "Voorschotstatus",
      maxButton: "MAX",
      confirmationRequired: "Bevestig alstublieft dat u de voorwaarden begrijpt",
      confirmationLabel: "Ik begrijp de voorschotbetalingsvoorwaarden",
      confirmationText: "Ik begrijp dat ik 50% van het gesubsidieerde budgetbedrag aanvraag vóór volledige subsidieafhandeling. Als het voorschotbedrag niet gerechtvaardigd is voor projectgebruik, kan terugbetaling van het niet-gerechtvaardigde bedrag worden gevraagd."
    },

    // Refund
    refund: {
      requestRefund: "Terugbetaling Aanvragen",
      confirmRefundDone: "Bevestig Terugbetaling",
      refundAmount: "Terugbetalingsbedrag",
      refundReason: "Reden voor Terugbetaling",
      refundPending: "Terugbetaling In Behandeling",
      refundPendingTooltip: "Wacht op terugbetalingsbevestiging van {{amount}}",
      refundDone: "Terugbetaling Voltooid",
      refundDoneTooltip: "Bedrag van {{amount}} is terugbetaald",
      waitingRefund: "Wacht op Terugbetaling",
      refundRequestSuccess: "Terugbetalingsaanvraag succesvol ingediend",
      refundConfirmSuccess: "Terugbetaling succesvol bevestigd",
      refundAmountRequired: "Terugbetalingsbedrag is verplicht",
      refundReasonRequired: "Reden voor terugbetaling is verplicht",
      confirmRefundRequest: "Weet u zeker dat u een terugbetaling wilt aanvragen?",
      confirmRefundDoneAction: "Weet u zeker dat u wilt bevestigen dat de terugbetaling is verwerkt?",
      refundAmountLabel: "Terugbetalingsbedrag",
      refundReasonPlaceholder: "Leg de reden voor de terugbetaling uit...",
      refundModalTitle: "Terugbetaling Aanvragen",
      refundModalDescription: "Vraag een terugbetaling aan voor deze subsidie.",
      cancel: "Annuleren",
      submit: "Terugbetaling Aanvragen",
      enterRefundAmount: "Voer terugbetalingsbedrag in",
      enterRefundReason: "Voer reden voor terugbetaling in",
      confirmButton: "Bevestig Terugbetaling Voltooid",
      confirmRefundWarning: "Deze actie zal het terugbetalingsbedrag terugbrengen naar het jaarbudget. Dit kan niet ongedaan worden gemaakt.",
      // Modal sections
      projectInfo: "Projectinformatie",
      refundDetails: "Terugbetalingsdetails",
      importantNotice: "Belangrijke Kennisgeving",
      awareness: "Bevestiging",
      // KPIs
      subsidyAmount: "Subsidiebedrag",
      // Confirm completion modal
      confirmCompletionIntro: "Door het voltooien van de terugbetaling te bevestigen:",
      completionNotice1: "Het bedrag van {{amount}} wordt beschouwd als teruggebracht naar het afdelingsbudget.",
      completionNotice2: "Deze actie kan niet ongedaan worden gemaakt",
      completionNotice2Detail: "en zal het terugbetalingsproces afsluiten.",
      completionNotice3: "De subsidiestatus wordt bijgewerkt naar 'Gesloten'.",
      completionNotice4: "Een record van deze bevestiging wordt toegevoegd aan de geschiedenis",
      completionNotice4Detail: "permanent.",
      confirmAwarenessLabel: "Ik bevestig dat ik de terugbetaling van {{amount}} heb ontvangen",
      confirmAwarenessDetail: "en ik ben me ervan bewust dat deze actie het terugbetalingsproces permanent zal afsluiten en niet kan worden teruggedraaid.",
      processing: "Verwerken...",
      refundingAmount: "Terugbetalen",
      maxButton: "MAX",
      maximum: "Maximum",
      // Project details
      project: "Project",
      department: "Afdeling",
      responsibles: "Verantwoordelijken",
      // Notice bullets
      noticeIntro: "Bij het aanvragen van een terugbetaling:",
      noticeResponsibles: "Projectverantwoordelijken ontvangen een melding",
      noticeResponsiblesDetail: "om de betaling van het gevraagde bedrag te doen.",
      noticeBudget: "Het bedrag wordt teruggestort naar het afdelingsbudget",
      noticeHistory: "Deze actie genereert een record in de subsidiegeschiedenis",
      noticeHistoryDetail: ".",
      // Awareness checkbox
      awarenessLabel: "Ik ben me ervan bewust dat deze actie de verantwoordelijken zal waarschuwen en om terugbetaling van het bedrag aan het project zal vragen, waarbij de middelen naar het afdelingsbudget worden teruggebracht.",
      // Validation
      characters: "tekens",
      alert: {
        singlePending: "U heeft 1 subsidie die wacht op terugbetalingsverwerking",
        multiplePending: "U heeft {{count}} subsidies die wachten op terugbetalingsverwerking"
      },
      // Terugbetaling status indicatoren
      refundRequested: "Terugbetaling Aangevraagd",
      refundRequestedAmount: "Terugbetalingsbedrag",
      refundRequestedTooltip: "Een terugbetaling van {{amount}} is aangevraagd en wacht op bevestiging",
      statusWithRefund: "Status: Terugbetaling aangevraagd ({{amount}})",
      // Upload bewijs van terugbetaling
      uploadRefundReceiptTitle: "Bewijs van Terugbetalingsbetaling",
      uploadRefundReceiptDescription: "Upload het betalingsbewijs voor het terugbetalingsbedrag.",
      uploadRefundReceiptButton: "Bewijs Uploaden",
      uploadNotePlaceholder: "Optionele notitie (bijv. TED bankoverschrijving)",
      refundReceiptPending: "In afwachting van validatie",
      refundReceiptApproved: "Goedgekeurd",
      refundReceiptRejected: "Afgewezen",
      putInReviewButton: "Indienen ter Beoordeling",
      putInReviewTooltip: "Dien het terugbetalingsbewijs in ter beoordeling zodat de subsidie kan worden afgerond.",
      deleteRefundReceipt: "Verwijderen",
      validateRefundReceipt: "Valideren",
      validateNoteLabel: "Optionele validatienotitie:",
      validateNotePlaceholder: "bijv. Bewijs geaccepteerd",
      noRefundReceiptYet: "Nog geen betalingsbewijs geüpload.",
      cancel: "Annuleren"
    },

    // Berichten van de ontvangstbewijshaak
    receipts: {
      fetchError: "Fout bij ophalen van ontvangstbewijzen",
      uploadSuccess: "{{filename}} succesvol geüpload!",
      uploadError: "Fout bij uploaden van bestand",
      refundUploadError: "Fout bij uploaden van terugbetalingsbewijs",
      deleteSuccess: "Ontvangstbewijs succesvol verwijderd",
      deleteError: "Fout bij verwijderen van ontvangstbewijs",
      validateSuccess: "Ontvangstbewijs succesvol gevalideerd",
      validateError: "Fout bij valideren van ontvangstbewijs",
      rejectSuccess: "Ontvangstbewijs afgewezen",
      rejectError: "Fout bij afwijzen van ontvangstbewijs",
      downloadSuccess: "Download gestart",
      downloadError: "Fout bij downloaden van bestand",
      updateSuccess: "Ontvangstbewijs succesvol bijgewerkt!",
      updateError: "Fout bij bijwerken van ontvangstbewijs",
      invalidFileType: "Ongeldig bestandstype. Alleen JPG, PNG en PDF zijn toegestaan.",
      fileTooLarge: "Bestand te groot. Maximale grootte: 10MB.",
      invalidFileExtension: "Ongeldige bestandsextensie. Alleen .jpg, .jpeg, .png en .pdf zijn toegestaan."
    }
  }
}
