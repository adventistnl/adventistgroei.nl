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
      documents_plural: "docs"
    },
    
    // Budget distribution
    budget: {
      title: "Institution Contribution",
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
      institutionContribution: "Institution Contribution:",
      churchRemainder: "Remainder for Church:",
      
      // Limit info
      limitTitle: "Limit for this activity:",
      limitMaxAllowed: "Maximum allowed:",
      
      // View mode
      requestedValue: "Requested Value",
      requestedValueTooltip: "This is the amount that will be requested from the institution for this activity",
      percentOfTotal: "{{percent}}% of total budget",
      totalBudgetLabel: "Total Budget",
      churchRemainderLabel: "Remainder (Church)"
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
      warningNoDocuments: "It is necessary to attach at least one supporting document for each activity"
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
      documents_plural: "docs"
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
      institutionContribution: "Contribuição da Instituição:",
      churchRemainder: "Restante para a Igreja:",
      
      // Limit info
      limitTitle: "Limite para esta atividade:",
      limitMaxAllowed: "Máximo permitido:",
      
      // View mode
      requestedValue: "Valor Solicitado",
      requestedValueTooltip: "Este é o valor que será solicitado à instituição para esta atividade",
      percentOfTotal: "{{percent}}% do orçamento total",
      totalBudgetLabel: "Orçamento Total",
      churchRemainderLabel: "Restante (Igreja)"
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
      warningNoDocuments: "É necessário anexar pelo menos um documento comprobatório para cada atividade"
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
      institutionContribution: "Bijdrage Instelling:",
      churchRemainder: "Restant voor Kerk:",
      
      // Limit info
      limitTitle: "Limiet voor deze activiteit:",
      limitMaxAllowed: "Maximaal toegestaan:",
      
      // View mode
      requestedValue: "Aangevraagde Waarde",
      requestedValueTooltip: "Dit is het bedrag dat bij de instelling wordt aangevraagd voor deze activiteit",
      percentOfTotal: "{{percent}}% van totaal budget",
      totalBudgetLabel: "Totaal Budget",
      churchRemainderLabel: "Restant (Kerk)"
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
      warningNoDocuments: "Het is noodzakelijk om minimaal één ondersteunend document voor elke activiteit toe te voegen"
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
    }
  }
}
