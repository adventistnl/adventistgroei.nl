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
    }
  }
}
