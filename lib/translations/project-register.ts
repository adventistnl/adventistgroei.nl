export const projectRegisterTranslations = {
  en: {
    title: {
      create: "Create New Project",
      edit: "Edit Project"
    },
    subtitle: {
      create: "Follow the steps to create a comprehensive project",
      edit: "Update project information and settings"
    },
    steps: {
      projectInfo: {
        title: "Project Information",
        description: "Basic project details",
        content: "Start by entering the essential project information. Choose a clear and descriptive title that reflects the project's purpose. Provide a detailed description of project goals and objectives. Select the responsible department that will oversee the project execution. Add at least one responsible person who will be accountable for project success. Set a realistic deadline that allows adequate time for completion while maintaining project momentum."
      },
      activities: {
        title: "Activities",
        description: "Add project activities",
        content: "Define the specific activities that comprise your project. Use predefined activities from the Quick Activities section to save time, or create custom activities tailored to your needs. Each activity can have its own funding type - choose between church-only funding, institution-only funding, or shared funding with customizable percentages. Add descriptive tags to categorize activities and assign responsible persons with realistic deadlines for each task."
      },
      funding: {
        title: "Funding Distribution",
        description: "Funding calculator",
        content: "This step automatically calculates the funding distribution based on your project activities. The system validates that all funding policies are respected, including the maximum institution contribution of 65% and the absolute limit of R$ 5,000 per project. Churches must contribute at least 35% of the total budget to ensure local commitment and sustainability."
      },
      review: {
        title: "Review & Submit",
        description: "Review and finalize",
        content: "This is your final opportunity to review all project details before submission. Please verify that all information is accurate, including project title, description, activities, and funding distribution. Once submitted, the project will be created in the system and stakeholders will be notified. You can always edit the project later if needed, but initial approval workflows may begin immediately after creation."
      }
    },
    fields: {
      projectTitle: "Project Title",
      projectDescription: "Project Description",
      department: "Department",
      deadline: "Project Deadline",
      responsiblePeople: "Responsible People",
      activityName: "Activity Name",
      activityDescription: "Activity Description",
      budgetAmount: "Budget Amount (R$)",
      responsiblePerson: "Responsible Person",
      activityDeadline: "Activity Deadline",
      fundingType: "Funding Type",
      fundingDistribution: "Funding Distribution",
      churchContribution: "Church Contribution",
      activityTags: "Activity Tags"
    },
    placeholders: {
      enterProjectTitle: "Enter project title",
      describeProject: "Describe the project objectives and scope",
      selectDepartment: "Select department",
      selectDeadline: "Select deadline",
      addResponsiblePerson: "Add responsible person",
      enterActivityName: "Enter activity name",
      describeActivity: "Describe the activity objectives",
      selectResponsible: "Select responsible",
      selectDate: "Select date"
    },
    buttons: {
      addActivity: "Add Activity",
      updateActivity: "Update Activity",
      editActivity: "Edit Activity",
      cancelEdit: "Cancel Edit",
      previous: "Previous",
      next: "Next",
      cancel: "Cancel",
      createProject: "Create Project",
      updateProject: "Update Project",
      backToProjects: "Back to Projects"
    },
    fundingTypes: {
      churchOnly: "Church Only",
      institutionOnly: "Institution Only",
      shared: "Shared Funding",
      fullChurch: "Full Church Coverage"
    },
    quickActivities: {
      title: "Quick Activities",
      select: "Select"
    },
    validation: {
      projectTitleRequired: "Project title is required",
      projectDescriptionRequired: "Project description is required",
      departmentRequired: "Department is required",
      responsiblePersonRequired: "At least one responsible person is required",
      activityRequired: "At least one activity is required",
      activityFieldsRequired: "Please fill all required activity fields",
      institutionExceedsAmount: "Institution contribution cannot exceed R$ {{amount}}",
      institutionExceedsPercent: "Institution percentage cannot exceed {{percent}}%",
      institutionAmountLimit: "Institution Amount Limit",
      institutionPercentLimit: "Institution Percentage Limit",
      maximum: "Maximum",
      valid: "Valid",
      exceeded: "Exceeded"
    },
    summary: {
      projectInfo: "Project Information",
      activities: "Activities",
      budgetDistribution: "Budget Distribution",
      totalBudget: "Total Budget",
      church: "Church",
      institution: "Institution",
      policyValidation: "Policy Validation"
    },
    toast: {
      activityAdded: "Activity added successfully!",
      activityUpdated: "Activity updated successfully!",
      activityRemoved: "Activity removed",
      activitySelected: "Selected: {{name}}",
      editingActivity: "Editing: {{name}}",
      projectCreated: "Project created successfully!",
      projectUpdated: "Project updated successfully!",
      creatingProject: "Creating project...",
      updatingProject: "Updating project...",
      failedToSave: "Failed to save project",
      institutionPercentExceeded: "Institution percentage cannot exceed {{percent}}%",
      institutionAmountExceeded: "Institution amount exceeds R$ {{amount}} limit"
    }
  },
  pt: {
    title: {
      create: "Criar Novo Projeto",
      edit: "Editar Projeto"
    },
    subtitle: {
      create: "Siga os passos para criar um projeto abrangente",
      edit: "Atualize as informações e configurações do projeto"
    },
    steps: {
      projectInfo: {
        title: "Dados do Projeto",
        description: "Informações básicas do projeto",
        content: "Comece inserindo as informações essenciais do projeto. Escolha um título claro e descritivo que reflita o propósito do projeto. Forneça uma descrição detalhada dos objetivos e metas do projeto. Selecione o departamento responsável que supervisionará a execução do projeto. Adicione pelo menos uma pessoa responsável que será responsabilizada pelo sucesso do projeto. Defina um prazo realista que permita tempo adequado para conclusão mantendo o momentum do projeto."
      },
      activities: {
        title: "Atividades",
        description: "Adicionar atividades do projeto",
        content: "Defina as atividades específicas que compõem seu projeto. Use atividades predefinidas da seção Atividades Rápidas para economizar tempo, ou crie atividades personalizadas adequadas às suas necessidades. Cada atividade pode ter seu próprio tipo de financiamento - escolha entre financiamento apenas da igreja, apenas da instituição, ou financiamento compartilhado com percentuais personalizáveis. Adicione tags descritivas para categorizar atividades e atribua pessoas responsáveis com prazos realistas para cada tarefa."
      },
      funding: {
        title: "Distribuição de Custeio",
        description: "Calculadora de financiamento",
        content: "Esta etapa calcula automaticamente a distribuição de financiamento com base nas atividades do seu projeto. O sistema valida que todas as políticas de financiamento são respeitadas, incluindo a contribuição máxima da instituição de 65% e o limite absoluto de R$ 5.000 por projeto. As igrejas devem contribuir com pelo menos 35% do orçamento total para garantir compromisso local e sustentabilidade."
      },
      review: {
        title: "Resumo e Validação",
        description: "Revisar e finalizar",
        content: "Esta é sua oportunidade final de revisar todos os detalhes do projeto antes da submissão. Por favor, verifique se todas as informações estão precisas, incluindo título do projeto, descrição, atividades e distribuição de financiamento. Uma vez submetido, o projeto será criado no sistema e as partes interessadas serão notificadas. Você sempre pode editar o projeto posteriormente se necessário, mas os fluxos de aprovação inicial podem começar imediatamente após a criação."
      }
    },
    fields: {
      projectTitle: "Título do Projeto",
      projectDescription: "Descrição do Projeto",
      department: "Departamento",
      deadline: "Prazo do Projeto",
      responsiblePeople: "Pessoas Responsáveis",
      activityName: "Nome da Atividade",
      activityDescription: "Descrição da Atividade",
      budgetAmount: "Valor do Orçamento (R$)",
      responsiblePerson: "Pessoa Responsável",
      activityDeadline: "Prazo da Atividade",
      fundingType: "Tipo de Financiamento",
      fundingDistribution: "Distribuição de Financiamento",
      churchContribution: "Contribuição da Igreja",
      activityTags: "Tags da Atividade"
    },
    placeholders: {
      enterProjectTitle: "Digite o título do projeto",
      describeProject: "Descreva os objetivos e escopo do projeto",
      selectDepartment: "Selecione o departamento",
      selectDeadline: "Selecione o prazo",
      addResponsiblePerson: "Adicionar pessoa responsável",
      enterActivityName: "Digite o nome da atividade",
      describeActivity: "Descreva os objetivos da atividade",
      selectResponsible: "Selecione o responsável",
      selectDate: "Selecione a data"
    },
    buttons: {
      addActivity: "Adicionar Atividade",
      updateActivity: "Atualizar Atividade",
      editActivity: "Editar Atividade",
      cancelEdit: "Cancelar Edição",
      previous: "Anterior",
      next: "Próximo",
      cancel: "Cancelar",
      createProject: "Criar Projeto",
      updateProject: "Atualizar Projeto",
      backToProjects: "Voltar aos Projetos"
    },
    fundingTypes: {
      churchOnly: "Apenas Igreja",
      institutionOnly: "Apenas Instituição",
      shared: "Financiamento Compartilhado",
      fullChurch: "Cobertura Total da Igreja"
    },
    quickActivities: {
      title: "Atividades Rápidas",
      select: "Selecionar"
    },
    validation: {
      projectTitleRequired: "Título do projeto é obrigatório",
      projectDescriptionRequired: "Descrição do projeto é obrigatória",
      departmentRequired: "Departamento é obrigatório",
      responsiblePersonRequired: "Pelo menos uma pessoa responsável é obrigatória",
      activityRequired: "Pelo menos uma atividade é obrigatória",
      activityFieldsRequired: "Por favor, preencha todos os campos obrigatórios da atividade",
      institutionExceedsAmount: "Contribuição da instituição não pode exceder R$ {{amount}}",
      institutionExceedsPercent: "Percentual da instituição não pode exceder {{percent}}%",
      institutionAmountLimit: "Limite de Valor da Instituição",
      institutionPercentLimit: "Limite de Percentual da Instituição",
      maximum: "Máximo",
      valid: "Válido",
      exceeded: "Excedido"
    },
    summary: {
      projectInfo: "Informações do Projeto",
      activities: "Atividades",
      budgetDistribution: "Distribuição do Orçamento",
      totalBudget: "Orçamento Total",
      church: "Igreja",
      institution: "Instituição",
      policyValidation: "Validação de Políticas"
    },
    toast: {
      activityAdded: "Atividade adicionada com sucesso!",
      activityUpdated: "Atividade atualizada com sucesso!",
      activityRemoved: "Atividade removida",
      activitySelected: "Selecionado: {{name}}",
      editingActivity: "Editando: {{name}}",
      projectCreated: "Projeto criado com sucesso!",
      projectUpdated: "Projeto atualizado com sucesso!",
      creatingProject: "Criando projeto...",
      updatingProject: "Atualizando projeto...",
      failedToSave: "Falha ao salvar projeto",
      institutionPercentExceeded: "Percentual da instituição não pode exceder {{percent}}%",
      institutionAmountExceeded: "Valor da instituição excede o limite de R$ {{amount}}"
    }
  },
  nl: {
    title: {
      create: "Nieuw Project Maken",
      edit: "Project Bewerken"
    },
    subtitle: {
      create: "Volg de stappen om een uitgebreid project te maken",
      edit: "Update projectinformatie en instellingen"
    },
    steps: {
      projectInfo: {
        title: "Projectinformatie",
        description: "Basis projectdetails",
        content: "Begin met het invoeren van de essentiële projectinformatie. Kies een duidelijke en beschrijvende titel die het doel van het project weergeeft. Geef een gedetailleerde beschrijving van projectdoelen en -doelstellingen. Selecteer het verantwoordelijke departement dat toezicht houdt op de projectuitvoering. Voeg ten minste één verantwoordelijke persoon toe die verantwoordelijk wordt gehouden voor projectsucces. Stel een realistische deadline in die voldoende tijd toestaat voor voltooiing terwijl het projectmomentum behouden blijft."
      },
      activities: {
        title: "Activiteiten",
        description: "Projectactiviteiten toevoegen",
        content: "Definieer de specifieke activiteiten die uw project vormen. Gebruik voorgedefinieerde activiteiten uit de sectie Snelle Activiteiten om tijd te besparen, of maak aangepaste activiteiten die zijn afgestemd op uw behoeften. Elke activiteit kan zijn eigen financieringstype hebben - kies tussen alleen kerkfinanciering, alleen instellingsfinanciering, of gedeelde financiering met aanpasbare percentages. Voeg beschrijvende tags toe om activiteiten te categoriseren en wijs verantwoordelijke personen toe met realistische deadlines voor elke taak."
      },
      funding: {
        title: "Financieringsverdeling",
        description: "Financieringscalculator",
        content: "Deze stap berekent automatisch de financieringsverdeling op basis van uw projectactiviteiten. Het systeem valideert dat alle financieringsbeleid wordt gerespecteerd, inclusief de maximale instellingsbijdrage van 65% en de absolute limiet van R$ 5.000 per project. Kerken moeten ten minste 35% van het totale budget bijdragen om lokale betrokkenheid en duurzaamheid te waarborgen."
      },
      review: {
        title: "Beoordeling & Indienen",
        description: "Beoordelen en voltooien",
        content: "Dit is uw laatste kans om alle projectdetails te beoordelen voor indiening. Controleer of alle informatie accuraat is, inclusief projecttitel, beschrijving, activiteiten en financieringsverdeling. Eenmaal ingediend, wordt het project aangemaakt in het systeem en worden belanghebbenden op de hoogte gesteld. U kunt het project later altijd bewerken indien nodig, maar initiële goedkeuringsworkflows kunnen onmiddellijk na aanmaak beginnen."
      }
    },
    fields: {
      projectTitle: "Projecttitel",
      projectDescription: "Projectbeschrijving",
      department: "Afdeling",
      deadline: "Projectdeadline",
      responsiblePeople: "Verantwoordelijke Personen",
      activityName: "Activiteitsnaam",
      activityDescription: "Activiteitsbeschrijving",
      budgetAmount: "Budgetbedrag (R$)",
      responsiblePerson: "Verantwoordelijke Persoon",
      activityDeadline: "Activiteitsdeadline",
      fundingType: "Financieringstype",
      fundingDistribution: "Financieringsverdeling",
      churchContribution: "Kerkbijdrage",
      activityTags: "Activiteitstags"
    },
    placeholders: {
      enterProjectTitle: "Voer projecttitel in",
      describeProject: "Beschrijf de projectdoelstellingen en reikwijdte",
      selectDepartment: "Selecteer afdeling",
      selectDeadline: "Selecteer deadline",
      addResponsiblePerson: "Voeg verantwoordelijke persoon toe",
      enterActivityName: "Voer activiteitsnaam in",
      describeActivity: "Beschrijf de activiteitsdoelstellingen",
      selectResponsible: "Selecteer verantwoordelijke",
      selectDate: "Selecteer datum"
    },
    buttons: {
      addActivity: "Activiteit Toevoegen",
      updateActivity: "Activiteit Bijwerken",
      editActivity: "Activiteit Bewerken",
      cancelEdit: "Bewerking Annuleren",
      previous: "Vorige",
      next: "Volgende",
      cancel: "Annuleren",
      createProject: "Project Maken",
      updateProject: "Project Bijwerken",
      backToProjects: "Terug naar Projecten"
    },
    fundingTypes: {
      churchOnly: "Alleen Kerk",
      institutionOnly: "Alleen Instelling",
      shared: "Gedeelde Financiering",
      fullChurch: "Volledige Kerkdekking"
    },
    quickActivities: {
      title: "Snelle Activiteiten",
      select: "Selecteren"
    },
    validation: {
      projectTitleRequired: "Projecttitel is verplicht",
      projectDescriptionRequired: "Projectbeschrijving is verplicht",
      departmentRequired: "Afdeling is verplicht",
      responsiblePersonRequired: "Ten minste één verantwoordelijke persoon is verplicht",
      activityRequired: "Ten minste één activiteit is verplicht",
      activityFieldsRequired: "Vul alle verplichte activiteitsvelden in",
      institutionExceedsAmount: "Instellingsbijdrage kan R$ {{amount}} niet overschrijden",
      institutionExceedsPercent: "Instellingspercentage kan {{percent}}% niet overschrijden",
      institutionAmountLimit: "Instellingsbedraglimiet",
      institutionPercentLimit: "Instellingspercentagelimiet",
      maximum: "Maximum",
      valid: "Geldig",
      exceeded: "Overschreden"
    },
    summary: {
      projectInfo: "Projectinformatie",
      activities: "Activiteiten",
      budgetDistribution: "Budgetverdeling",
      totalBudget: "Totaal Budget",
      church: "Kerk",
      institution: "Instelling",
      policyValidation: "Beleidsvalidatie"
    },
    toast: {
      activityAdded: "Activiteit succesvol toegevoegd!",
      activityUpdated: "Activiteit succesvol bijgewerkt!",
      activityRemoved: "Activiteit verwijderd",
      activitySelected: "Geselecteerd: {{name}}",
      editingActivity: "Bewerken: {{name}}",
      projectCreated: "Project succesvol aangemaakt!",
      projectUpdated: "Project succesvol bijgewerkt!",
      creatingProject: "Project aanmaken...",
      updatingProject: "Project bijwerken...",
      failedToSave: "Kan project niet opslaan",
      institutionPercentExceeded: "Instellingspercentage kan {{percent}}% niet overschrijden",
      institutionAmountExceeded: "Instellingsbedrag overschrijdt R$ {{amount}} limiet"
    }
  }
}
