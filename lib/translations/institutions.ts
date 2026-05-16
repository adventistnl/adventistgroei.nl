export const institutionTranslations = {
  en: {
    // Modal titles and descriptions
    registerInstitution: "Register New Institution",
    editInstitution: "Edit Institution",
    modalDescription: "Create a new religious institution in your organization",
    editInstitutionDesc: "Update institution information and settings",
    
    // Steps
    step: "Step",
    of: "of",
    basicInformation: "Basic Information",
    basicInformationDesc: "Enter the institution name, denomination and location",
    contactInformation: "Contact Information", 
    contactInformationDesc: "Add contact details for the institution",
    additionalDetails: "Additional Details",
    additionalDetailsDesc: "Add a description about the institution",
    
    // Form fields
    institutionName: "Institution Name",
    institutionNamePlaceholder: "Enter institution name",
    denomination: "Denomination",
    denominationPlaceholder: "e.g., SDA, Baptist, Methodist",
    country: "Country",
    countryPlaceholder: "Select country",
    searchCountry: "Search countries...",
    noCountryFound: "No country found.",
    state: "State/Province",
    selectState: "Select state",
    searchStates: "Search states...",
    noStateFound: "No state found.",
    city: "City",
    selectCity: "Select city",
    searchCities: "Search cities...",
    noCityFound: "No city found.",
    languagePreference: "Language Preference",
    languagePreferencePlaceholder: "Select language",
    searchLanguage: "Search languages...",
    noLanguageFound: "No language found.",
    contactEmail: "Contact Email",
    contactEmailPlaceholder: "contact@institution.org",
    phone: "Phone",
    phonePlaceholder: "+1 (555) 123-4567",
    website: "Website",
    websitePlaceholder: "https://www.institution.org",
    description: "Description",
    descriptionPlaceholder: "Brief description about the institution, its mission, and activities...",
    
    // Languages
    languages: {
      en: "English",
      nl: "Nederlands",
      es: "Español",
      fr: "Français", 
      de: "Deutsch",
      pt: "Português"
    },
    
    // Countries (sample - you can expand this)
    countries: {
      us: "United States",
      ca: "Canada", 
      gb: "United Kingdom",
      nl: "Netherlands",
      de: "Germany",
      fr: "France",
      br: "Brazil",
      pt: "Portugal",
      es: "Spain",
      it: "Italy",
      au: "Australia",
      nz: "New Zealand",
      za: "South Africa"
    },
    
    // Buttons
    previous: "Previous",
    next: "Next", 
    cancel: "Cancel",
    registerInstitutionBtn: "Register Institution",
    updateInstitution: "Update Institution",
    creating: "Creating...",
    updating: "Updating...",
    
    // Validation messages
    validation: {
      nameRequired: "Institution name is required",
      nameMinLength: "Institution name must be at least 2 characters",
      denominationRequired: "Denomination is required",
      denominationMinLength: "Denomination must be at least 2 characters",
      countryRequired: "Country is required",
      languageRequired: "Language preference is required",
      emailRequired: "Email is required",
      emailInvalid: "Please enter a valid email address",
      websiteInvalid: "Website must contain at least one dot (.)",
      fixErrors: "Please fix the errors before continuing"
    },
    
    // Toast messages
    toasts: {
      created: "created successfully!",
      updated: "updated successfully!",
      createError: "Failed to create institution",
      updateError: "Failed to update institution"
    }
    ,
    // Analytics
    analytics: {
      title: "Analytics",
      noData: "No data available",
      churchesByRegion: {
        title: "Churches by Region",
        description: "Distribution across regions",
        noData: "No church data available for this institution",
        noDataDescription: "No churches found in any region",
        churchesLabel: "Churches",
        noRegion: "No Region",
        unknownRegion: "Unknown Region",
        selectRegion: "Select region",
        churches: "churches"
      },
      userDistribution: {
        title: "User Distribution by Entity",
        description: "Top entities by user count",
        noData: "No user data available for this institution",
        users: "Users",
        institution: "Institution",
        footer: "Showing user distribution across entities"
      },
      totalChurches: "Total Churches",
      totalUsers: "Total Users",
      selected: "Selected",
      hierarchyTitle: "Hierarchical Structure",
      hierarchyDescription: "The institutional structure follows a clear hierarchy",
      hierarchyFlow: "Hierarchy Flow",
      institutionLevel: "Institution Level",
      institutionsWith: "institution(s) with",
      departments: "department(s)",
      institutionDetails: "Top-level organizational units managing all operations",
      regionsManaging: "region(s) managing",
      regionsDetails: "Geographic divisions containing provinces and churches",
      activeChurches: "active churches",
      with: "with",
      churchesDetails: "Local congregations with specialized ministry departments",
      usersByRole: {
        title: "Users by Role",
        description: "Distribution across all user types",
        noData: "No User Data Available",
        noDataDescription: "No users with roles found",
        users: "Users",
        total: "Total",
        showing: "Showing",
        of: "of",
        roles: "roles",
        page: "Page",
        allRoles: "All Roles",
        selectRole: "Select role",
        topN: {
          all: "All",
          top3: "Top 3",
          top5: "Top 5",
          top10: "Top 10"
        },
        sortOrder: {
          mostUsers: "Most Users",
          leastUsers: "Least Users"
        },
        noRole: "No Role",
        totalUsersAcross: "Total users",
        across: "across",
        trendingUp: "Trending up by",
        thisMonth: "this month",
        viewBar: "Bar",
        viewPie: "Pie"
      }
    },
    leadershipCard: {
      title: "Institution Leaders",
      description: "Formal positions assigned to this institution",
      no_leaders: "No institutional leaders found",
      no_permission: "You don't have permission to view this content",
      leadership_roles: "Leadership Roles",
      no_roles: "No leadership roles assigned",
      view_contact: "View Contact",
      assign: "Assign",
      replace: "Replace",
      remove: "Remove",
      unassigned: "Not assigned",
      select_user: "Select user...",
      search_user: "Search user...",
      no_users_available: "No users available",
      confirm_remove: "Remove position?",
      confirm: {
        assign_title: "Assign Leader",
        assign_description: "Are you sure you want to assign this person to the position?",
        replace_title: "Replace Leader",
        replace_description: "Are you sure you want to replace the current leader of this position? This action will assign a new person to the role.",
        remove_title: "Remove Leader",
        remove_description: "Are you sure you want to remove this leader from the position? The position will become unassigned.",
        confirm_btn: "Confirm",
        cancel_btn: "Cancel"
      },
      positions: {
        PRESIDENT: "President",
        SECRETARY: "Secretary",
        FINANCE_MANAGER: "Finance Manager"
      },
      toasts: {
        assigned: "Position assigned successfully",
        updated: "Position updated successfully",
        removed: "Position removed successfully",
        error_assign: "Error assigning position",
        error_update: "Error updating position",
        error_remove: "Error removing position"
      }
    },
    activityHeatmap: {
      title: "Activity Heatmap",
      description: "Daily activity intensity based on projects created and users registered",
      no_data: "No activity data available",
      less: "Less",
      more: "More",
      days_with_activity: "days with activity"
    }
  },
  nl: {
    // Modal titles and descriptions
    registerInstitution: "Nieuwe Instelling Registreren",
    editInstitution: "Instelling Bewerken",
    modalDescription: "Maak een nieuwe religieuze instelling in uw organisatie",
    editInstitutionDesc: "Werk instellingsinformatie en instellingen bij",
    
    // Steps
    step: "Stap",
    of: "van",
    basicInformation: "Basisinformatie",
    basicInformationDesc: "Voer de naam van de instelling, denominatie en locatie in",
    contactInformation: "Contactinformatie",
    contactInformationDesc: "Voeg contactgegevens voor de instelling toe",
    additionalDetails: "Aanvullende Details",
    additionalDetailsDesc: "Voeg een beschrijving van de instelling toe",
    
    // Form fields
    institutionName: "Naam Instelling",
    institutionNamePlaceholder: "Voer naam van instelling in",
    denomination: "Denominatie",
    denominationPlaceholder: "bijv., SDA, Baptist, Methodist",
    country: "Land",
    countryPlaceholder: "Selecteer land",
    searchCountry: "Zoek landen...",
    noCountryFound: "Geen land gevonden.",
    state: "Provincie",
    selectState: "Selecteer provincie",
    searchStates: "Zoek provincies...",
    noStateFound: "Geen provincie gevonden.",
    city: "Stad",
    selectCity: "Selecteer stad",
    searchCities: "Zoek steden...",
    noCityFound: "Geen stad gevonden.",
    languagePreference: "Taalvoorkeur",
    languagePreferencePlaceholder: "Selecteer taal",
    searchLanguage: "Zoek talen...",
    noLanguageFound: "Geen taal gevonden.",
    contactEmail: "Contact E-mail",
    contactEmailPlaceholder: "contact@instelling.org",
    phone: "Telefoon",
    phonePlaceholder: "+31 (20) 123-4567",
    website: "Website",
    websitePlaceholder: "https://www.instelling.org",
    description: "Beschrijving",
    descriptionPlaceholder: "Korte beschrijving over de instelling, missie en activiteiten...",
    
    // Languages
    languages: {
      en: "Engels",
      nl: "Nederlands",
      es: "Spaans",
      fr: "Frans",
      de: "Duits", 
      pt: "Portugees"
    },
    
    // Countries
    countries: {
      us: "Verenigde Staten",
      ca: "Canada",
      gb: "Verenigd Koninkrijk", 
      nl: "Nederland",
      de: "Duitsland",
      fr: "Frankrijk",
      br: "Brazilië",
      pt: "Portugal",
      es: "Spanje",
      it: "Italië",
      au: "Australië",
      nz: "Nieuw-Zeeland",
      za: "Zuid-Afrika"
    },
    
    // Buttons
    previous: "Vorige",
    next: "Volgende",
    cancel: "Annuleren", 
    registerInstitutionBtn: "Instelling Registreren",
    updateInstitution: "Instelling Bijwerken",
    creating: "Maken...",
    updating: "Bijwerken...",
    
    // Validation messages
    validation: {
      nameRequired: "Naam van instelling is verplicht",
      nameMinLength: "Naam van instelling moet minimaal 2 tekens lang zijn",
      denominationRequired: "Denominatie is verplicht",
      denominationMinLength: "Denominatie moet minimaal 2 tekens lang zijn",
      countryRequired: "Land is verplicht",
      languageRequired: "Taalvoorkeur is verplicht",
      emailRequired: "E-mail is verplicht",
      emailInvalid: "Voer een geldig e-mailadres in",
      websiteInvalid: "Website moet ten minste één punt (.) bevatten",
      fixErrors: "Corrigeer de fouten voordat u doorgaat"
    },
    
    // Toast messages
    toasts: {
      created: "succesvol aangemaakt!",
      updated: "succesvol bijgewerkt!",
      createError: "Instelling aanmaken mislukt",
      updateError: "Instelling bijwerken mislukt"
    },
    
    // Analytics
    analytics: {
      title: "Analyses",
      noData: "Geen gegevens beschikbaar",
      churchesByRegion: {
        title: "Kerken per Regio",
        description: "Verdeling over regio's",
        noData: "Geen kerkgegevens beschikbaar voor deze instelling",
        noDataDescription: "Geen kerken gevonden in welke regio dan ook",
        churchesLabel: "Kerken",
        noRegion: "Geen Regio",
        unknownRegion: "Onbekende Regio",
        selectRegion: "Selecteer regio",
        churches: "kerken"
      },
      userDistribution: {
        title: "Gebruikersverdeling per Entiteit",
        description: "Top entiteiten op gebruikersaantal",
        noData: "Geen gebruikersgegevens beschikbaar voor deze instelling",
        users: "Gebruikers",
        institution: "Instelling",
        footer: "Toont gebruikersverdeling over entiteiten"
      },
      totalChurches: "Totaal Kerken",
      totalUsers: "Totaal Gebruikers",
      selected: "Geselecteerd",
      hierarchyTitle: "Hiërarchische Structuur",
      hierarchyDescription: "De institutionele structuur volgt een duidelijke hiërarchie",
      hierarchyFlow: "Hiërarchie Stroom",
      institutionLevel: "Instellingsniveau",
      institutionsWith: "instelling(en) met",
      departments: "afdeling(en)",
      institutionDetails: "Organisatie-eenheden op topniveau die alle operaties beheren",
      regionsManaging: "regio('s) beheren",
      regionsDetails: "Geografische afdelingen met provincies en kerken",
      activeChurches: "actieve kerken",
      with: "met",
      churchesDetails: "Lokale gemeenten met gespecialiseerde bedieningen",
      usersByRole: {
        title: "Gebruikers per Rol",
        description: "Verdeling over alle gebruikerstypes",
        noData: "Geen Gebruikersgegevens Beschikbaar",
        noDataDescription: "Geen gebruikers met rollen gevonden",
        users: "Gebruikers",
        total: "Totaal",
        showing: "Tonen",
        of: "van",
        roles: "rollen",
        page: "Pagina",
        allRoles: "Alle Rollen",
        selectRole: "Selecteer rol",
        topN: {
          all: "Alle",
          top3: "Top 3",
          top5: "Top 5",
          top10: "Top 10"
        },
        sortOrder: {
          mostUsers: "Meeste Gebruikers",
          leastUsers: "Minste Gebruikers"
        },
        noRole: "Geen Rol",
        totalUsersAcross: "Totaal gebruikers",
        across: "over",
        trendingUp: "Stijgend met",
        thisMonth: "deze maand",
        viewBar: "Staaf",
        viewPie: "Cirkel"
      }
    },
    leadershipCard: {
      title: "Institutionele Leiders",
      description: "Formele functies toegewezen aan deze instelling",
      no_leaders: "Geen institutionele leiders gevonden",
      no_permission: "U heeft geen toestemming om deze inhoud te bekijken",
      leadership_roles: "Leiderschapsrollen",
      no_roles: "Geen leiderschapsrollen toegewezen",
      view_contact: "Contact Bekijken",
      assign: "Toewijzen",
      replace: "Vervangen",
      remove: "Verwijderen",
      unassigned: "Niet toegewezen",
      select_user: "Selecteer gebruiker...",
      search_user: "Zoek gebruiker...",
      no_users_available: "Geen gebruikers beschikbaar",
      confirm_remove: "Functie verwijderen?",
      confirm: {
        assign_title: "Leider Toewijzen",
        assign_description: "Weet u zeker dat u deze persoon aan de functie wilt toewijzen?",
        replace_title: "Leider Vervangen",
        replace_description: "Weet u zeker dat u de huidige leider van deze functie wilt vervangen? Deze actie wijst een nieuwe persoon toe aan de rol.",
        remove_title: "Leider Verwijderen",
        remove_description: "Weet u zeker dat u deze leider uit de functie wilt verwijderen? De functie wordt dan niet toegewezen.",
        confirm_btn: "Bevestigen",
        cancel_btn: "Annuleren"
      },
      positions: {
        PRESIDENT: "President",
        SECRETARY: "Secretaris",
        FINANCE_MANAGER: "Financieel Manager"
      },
      toasts: {
        assigned: "Functie succesvol toegewezen",
        updated: "Functie succesvol bijgewerkt",
        removed: "Functie succesvol verwijderd",
        error_assign: "Fout bij toewijzen van functie",
        error_update: "Fout bij bijwerken van functie",
        error_remove: "Fout bij verwijderen van functie"
      }
    },
    activityHeatmap: {
      title: "Activiteit Heatmap",
      description: "Dagelijkse activiteitsintensiteit op basis van gecreëerde projecten en geregistreerde gebruikers",
      no_data: "Geen activiteitsgegevens beschikbaar",
      less: "Minder",
      more: "Meer",
      days_with_activity: "dagen met activiteit"
    }
  },
  pt: {
    // Modal titles and descriptions
    registerInstitution: "Registrar Nova Instituição",
    editInstitution: "Editar Instituição",
    modalDescription: "Crie uma nova instituição religiosa em sua organização",
    editInstitutionDesc: "Atualizar informações e configurações da instituição",
    
    // Steps
    step: "Etapa",
    of: "de",
    basicInformation: "Informações Básicas",
    basicInformationDesc: "Digite o nome da instituição, denominação e localização",
    contactInformation: "Informações de Contato", 
    contactInformationDesc: "Adicione detalhes de contato para a instituição",
    additionalDetails: "Detalhes Adicionais",
    additionalDetailsDesc: "Adicione uma descrição sobre a instituição",
    
    // Form fields
    institutionName: "Nome da Instituição",
    institutionNamePlaceholder: "Digite o nome da instituição",
    denomination: "Denominação",
    denominationPlaceholder: "ex.: SDA, Batista, Metodista",
    country: "País",
    countryPlaceholder: "Selecione o país",
    searchCountry: "Buscar países...",
    noCountryFound: "Nenhum país encontrado.",
    state: "Estado/Província",
    selectState: "Selecionar estado",
    searchStates: "Buscar estados...",
    noStateFound: "Nenhum estado encontrado.",
    city: "Cidade",
    selectCity: "Selecionar cidade",
    searchCities: "Buscar cidades...",
    noCityFound: "Nenhuma cidade encontrada.",
    languagePreference: "Preferência de Idioma",
    languagePreferencePlaceholder: "Selecione o idioma",
    searchLanguage: "Buscar idiomas...",
    noLanguageFound: "Nenhum idioma encontrado.",
    contactEmail: "E-mail de Contato",
    contactEmailPlaceholder: "contato@instituicao.org",
    phone: "Telefone",
    phonePlaceholder: "+55 (11) 1234-5678",
    website: "Website",
    websitePlaceholder: "https://www.instituicao.org",
    description: "Descrição",
    descriptionPlaceholder: "Breve descrição sobre a instituição, sua missão e atividades...",
    
    // Languages
    languages: {
      en: "Inglês",
      nl: "Holandês",
      es: "Espanhol",
      fr: "Francês", 
      de: "Alemão",
      pt: "Português"
    },
    
    // Countries
    countries: {
      us: "Estados Unidos",
      ca: "Canadá",
      gb: "Reino Unido",
      nl: "Países Baixos",
      de: "Alemanha",
      fr: "França",
      br: "Brasil",
      pt: "Portugal",
      es: "Espanha",
      it: "Itália",
      au: "Austrália",
      nz: "Nova Zelândia",
      za: "África do Sul"
    },
    
    // Buttons
    previous: "Anterior",
    next: "Próximo", 
    cancel: "Cancelar",
    registerInstitutionBtn: "Registrar Instituição",
    updateInstitution: "Atualizar Instituição",
    creating: "Criando...",
    updating: "Atualizando...",
    
    // Validation messages
    validation: {
      nameRequired: "Nome da instituição é obrigatório",
      nameMinLength: "Nome da instituição deve ter pelo menos 2 caracteres",
      denominationRequired: "Denominação é obrigatória",
      denominationMinLength: "Denominação deve ter pelo menos 2 caracteres",
      countryRequired: "País é obrigatório",
      languageRequired: "Preferência de idioma é obrigatória",
      emailRequired: "E-mail é obrigatório",
      emailInvalid: "Digite um endereço de e-mail válido",
      websiteInvalid: "Website deve conter pelo menos um ponto (.)",
      fixErrors: "Corrija os erros antes de continuar"
    },

    // Toast messages
    toasts: {
      created: "criada com sucesso!",
      updated: "atualizada com sucesso!",
      createError: "Falha ao criar instituição",
      updateError: "Falha ao atualizar instituição"
    },

    // Analytics
    analytics: {
      title: "Análises",
      noData: "Nenhum dado disponível",
      churchesByRegion: {
        title: "Igrejas por Região",
        description: "Distribuição por regiões",
        noData: "Nenhum dado de igreja disponível para esta instituição",
        noDataDescription: "Nenhuma igreja encontrada em qualquer região",
        churchesLabel: "Igrejas",
        noRegion: "Sem Região",
        unknownRegion: "Região Desconhecida",
        selectRegion: "Selecionar região",
        churches: "igrejas"
      },
      userDistribution: {
        title: "Distribuição de Usuários por Entidade",
        description: "Top entidades por número de usuários",
        noData: "Nenhum dado de usuário disponível para esta instituição",
        users: "Usuários",
        institution: "Instituição",
        footer: "Mostrando distribuição de usuários entre entidades"
      },
      totalChurches: "Total de Igrejas",
      totalUsers: "Total de Usuários",
      selected: "Selecionado",
      hierarchyTitle: "Estrutura Hierárquica",
      hierarchyDescription: "A estrutura institucional segue uma hierarquia clara",
      hierarchyFlow: "Fluxo Hierárquico",
      institutionLevel: "Nível Institucional",
      institutionsWith: "instituição(ões) com",
      departments: "departamento(s)",
      institutionDetails: "Unidades organizacionais de alto nível gerenciando todas as operações",
      regionsManaging: "região(ões) gerenciando",
      regionsDetails: "Divisões geográficas contendo províncias e igrejas",
      activeChurches: "igrejas ativas",
      with: "com",
      churchesDetails: "Congregações locais com departamentos ministeriais especializados",
      usersByRole: {
        title: "Usuários por Função",
        description: "Distribuição entre todos os tipos de usuários",
        noData: "Nenhum Dado de Usuário Disponível",
        noDataDescription: "Nenhum usuário com funções encontrado",
        users: "Usuários",
        total: "Total",
        showing: "Mostrando",
        of: "de",
        roles: "funções",
        page: "Página",
        allRoles: "Todas as Funções",
        selectRole: "Selecionar função",
        topN: {
          all: "Todos",
          top3: "Top 3",
          top5: "Top 5",
          top10: "Top 10"
        },
        sortOrder: {
          mostUsers: "Mais Usuários",
          leastUsers: "Menos Usuários"
        },
        noRole: "Sem Função",
        totalUsersAcross: "Total de usuários",
        across: "entre",
        trendingUp: "Crescendo",
        thisMonth: "este mês",
        viewBar: "Barras",
        viewPie: "Pizza"
      }
    },
    leadershipCard: {
      title: "Líderes da Instituição",
      description: "Cargos formais atribuídos a esta instituição",
      no_leaders: "Nenhum líder institucional encontrado",
      no_permission: "Você não tem permissão para visualizar este conteúdo",
      leadership_roles: "Funções de Liderança",
      no_roles: "Nenhuma função de liderança atribuída",
      view_contact: "Ver Contato",
      assign: "Atribuir",
      replace: "Substituir",
      remove: "Remover",
      unassigned: "Não atribuído",
      select_user: "Selecionar usuário...",
      search_user: "Buscar usuário...",
      no_users_available: "Nenhum usuário disponível",
      confirm_remove: "Remover cargo?",
      confirm: {
        assign_title: "Atribuir Líder",
        assign_description: "Tem certeza que deseja atribuir esta pessoa ao cargo?",
        replace_title: "Substituir Líder",
        replace_description: "Tem certeza que deseja substituir o líder atual deste cargo? Esta ação atribuirá uma nova pessoa à função.",
        remove_title: "Remover Líder",
        remove_description: "Tem certeza que deseja remover este líder do cargo? O cargo ficará sem atribuição.",
        confirm_btn: "Confirmar",
        cancel_btn: "Cancelar"
      },
      positions: {
        PRESIDENT: "Presidente",
        SECRETARY: "Secretário",
        FINANCE_MANAGER: "Gestor Financeiro"
      },
      toasts: {
        assigned: "Cargo atribuído com sucesso",
        updated: "Cargo atualizado com sucesso",
        removed: "Cargo removido com sucesso",
        error_assign: "Erro ao atribuir cargo",
        error_update: "Erro ao atualizar cargo",
        error_remove: "Erro ao remover cargo"
      }
    },
    activityHeatmap: {
      title: "Mapa de Calor de Atividades",
      description: "Intensidade diária de atividades baseada em projetos criados e usuários registrados",
      no_data: "Nenhum dado de atividade disponível",
      less: "Menos",
      more: "Mais",
      days_with_activity: "dias com atividade"
    }
  }
}