export const regionTranslations = {
  en: {
    // Modal Titles
    modals: {
      create: {
        title: "Create Region",
        description: "Add a new region to your organization"
      },
      edit: {
        title: "Edit Region",
        description: "Update region information and settings"
      },
      details: {
        title: "Region Details",
        description: "View detailed information about the region"
      },
      delete: {
        deactivate_title: "Deactivate Region",
        deactivate_description: "This action will deactivate the region and affect related data",
        deactivating: "Deactivating...",
        deactivate_region: "Deactivate Region",
        view_consequences: "View Consequences",
        affected_components: "Affected Components",
        understand_consequences: "I understand the consequences",
        acknowledge_text: "I acknowledge that this action will affect all related data",
        type_confirmation: "Type 'delete region' to confirm",
        confirmation_text: "delete region",
        confirmation_placeholder: "Type 'delete region' here",
        confirmation_help: "The region will be deactivated and churches will be affected",
        consequences_title: "What will happen?",
        consequences_intro: "Deleting this region will have the following consequences. Please review them carefully before proceeding.",
        churches_disconnected: "Churches will be disconnected",
        churches_disconnected_desc: "All churches assigned to this region will lose their region assignment",
        region_archived: "Region will be archived",
        region_archived_desc: "The region will be marked as deleted but not removed from the database",
        orphaned_churches: "Orphaned churches remain active",
        orphaned_churches_desc: "Churches without a region will continue to exist in the system and stay linked to their departments, users and projects",
        data_impact: "Data Impact",
        data_impact_desc: "Total regions count will decrease, but orphaned churches may show inconsistent data",
        consequences: {
          church_impact: "Church Impact",
          church_impact_desc: "All churches in this region will be affected and marked as orphaned",
          department_impact: "Department Impact",
          department_impact_desc: "All departments in churches within this region will be deactivated",
          data_safety: "Data Preservation",
          data_safety_desc: "All records are marked as deleted (soft delete), allowing recovery if necessary"
        },
        soft_delete: {
          title: "Soft Delete",
          description: "The region will be marked as inactive but data will be preserved"
        },
        final_confirmation: "Final Confirmation",
        recommendation_title: "Recommendation",
        detailed_consequences_title: "Detailed Consequences",
        data_will_be_preserved: "Data will be preserved",
        kpi_metrics_changes: "KPI and metrics changes",
        detailed_consequences: {
          what_happens: "What will happen",
          soft_delete_detail: "The region will be marked as deleted (soft delete) - not physically removed",
          churches_as_orphaned: "All churches remain in the system as orphaned churches",
          churches_orphaned_title: "Churches will be orphaned",
          orphaned_stay_linked: "Orphaned churches stay linked to departments, users, projects, and budgets",
          data_consistency: "But data consistency may be affected - queries filtering by region won't include orphaned churches",
          orphaned_risks: "Orphaned churches: May cause inconsistent counts in dashboards",
          recommendation: "Before deleting, consider reassigning the orphaned churches to another region or deleting them manually if they should not exist.",
          understand_consequences: "I understand the consequences and want to proceed",
          confirm_understand: "I confirm, continue to final confirmation",
          churches_region_id_clear: "All churches linked to this region will have their region_id set to null",
          churches_not_deleted: "Churches won't be deleted, only disconnected from this region",
          churches_visible: "They remain visible and editable in the system",
          all_data_preserved: "All church data, departments, members, and projects are preserved",
          nothing_physically_deleted: "Nothing is physically deleted from the database",
          total_regions_decrease: "Total Regions: Will decrease (deleted regions are excluded)",
          region_statistics_change: "Region statistics: Will no longer include this region's data"
        }
      }
    },

    // Steps
    steps: {
      step: "Step",
      of: "of",
      step_1_title: "Select Country",
      step_1_description: "Choose the country for this region",
      step_2_title: "Basic Information",
      step_2_description: "Enter the region name, description and color",
      step_3_title: "Select Provinces & Cities",
      step_3_description: "Choose the provinces and cities that are part of this region",
      step_4_title: "Review & Confirm",
      step_4_description: "Please review the information before creating the region"
    },

    // Fields
    fields: {
      name: "Region Name",
      description: "Description",
      color: "Color",
      country: "Country",
      countries: "Countries",
      province: "Province",
      provinces: "Provinces"
    },

    // Placeholders
    placeholders: {
      name: "Enter region name",
      description: "Enter region description (optional)",
      color: "Select a color for the region",
      country: "Select country",
      country_placeholder: "Select a country...",
      countries: "Select countries",
      province: "Select province",
      provinces: "Select provinces"
    },

    // Labels
    labels: {
      region: "Region",
      coverage: "Coverage"
    },

    // Sections
    sections: {
      basic_info: "Basic Information",
      geographic_coverage: "Geographic Coverage"
    },

    // Buttons
    buttons: {
      previous: "Previous",
      next: "Next",
      skip_for_now: "Skip for now",
      create_region: "Create Region",
      update_region: "Update Region",
      creating: "Creating...",
      updating: "Updating...",
      cancel: "Cancel",
      clear: "Clear"
    },

    // Validation
    validation: {
      name_required: "Region name is required",
      name_min_length: "Region name must have at least 2 characters",
      color_required: "Color is required",
      country_required: "Please select a country",
      province_required: "Please select at least one province",
      city_unique: "Each city can only belong to one region. Remove duplicate cities and try again.",
      please_fix_errors: "Please fix the errors before continuing"
    },

    // Toasts
    toasts: {
      creating: "Creating region...",
      created: "Region created successfully",
      create_failed: "Failed to create region. Check if cities are already assigned to another region.",
      updating: "Updating region...",
      updated: "Region updated successfully",
      update_failed: "Failed to update region",
      deactivating: "Deactivating region...",
      deactivated: "Region deactivated successfully",
      deactivate_failed: "Failed to deactivate region"
    },

    // Page-level translations
    page: {
      title: "Regions",
      description: "Manage all regions in your organization",
      totalRegions: "Total Regions",
      totalChurches: "Total Churches",
      totalProvinces: "Total Provinces",
      totalCities: "Total Cities",
      active_regions: "Active regions",
      churches_in_regions: "Churches in all regions",
      provinces_in_regions: "Provinces in all regions",
      cities_in_regions: "Cities in all regions",
      vs_last_month: "vs last month"
    },

    // Table columns
    table: {
      name: "Name",
      color: "Color",
      provinces: "Provinces",
      cities: "Cities",
      churches: "Churches",
      members: "Members",
      status: "Status",
      action: "Action"
    },

    // Messages
    messages: {
      loading: "Loading regions...",
      empty: "No regions found",
      error_loading: "Error loading regions",
      refresh_success: "Regions updated successfully",
      refresh_failed: "Failed to refresh regions",
      view_details: "View Details",
      edit_region: "Edit Region",
      delete_region: "Delete Region",
      no_country_found: "No country found",
      search_country: "Search country...",
      search_province_city: "Search province or city...",
      selected: "selected",
      cities: "cities"
    },

    // Map
    map: {
      title: "Netherlands Regions Map",
      description: "Interactive geographic visualization",
      refocus_button: "Refocus",
      refocus_success: "Map repositioned to Netherlands"
    }
  },

  nl: {
    // Modal Titles
    modals: {
      create: {
        title: "Regio Maken",
        description: "Voeg een nieuwe regio aan uw organisatie toe"
      },
      edit: {
        title: "Regio Bewerken",
        description: "Update regioinformatie en instellingen"
      },
      details: {
        title: "Regio Details",
        description: "Bekijk gedetailleerde informatie over de regio"
      },
      delete: {
        deactivate_title: "Regio Deactiveren",
        deactivate_description: "Deze actie zal de regio deactiveren en gerelateerde gegevens beïnvloeden",
        deactivating: "Deactiveren...",
        deactivate_region: "Regio Deactiveren",
        view_consequences: "Gevolgen Bekijken",
        affected_components: "Beïnvloede Componenten",
        understand_consequences: "Ik begrijp de gevolgen",
        acknowledge_text: "Ik erken dat deze actie alle gerelateerde gegevens zal beïnvloeden",
        type_confirmation: "Typ 'delete region' om te bevestigen",
        confirmation_text: "delete region",
        confirmation_placeholder: "Typ 'delete region' hier",
        confirmation_help: "De regio wordt gedeactiveerd en kerken worden beïnvloed",
        consequences_title: "Wat zal er gebeuren?",
        consequences_intro: "Het verwijderen van deze regio zal de volgende gevolgen hebben. Controleer deze zorgvuldig voordat u verdergaat.",
        churches_disconnected: "Kerken zullen worden verbroken",
        churches_disconnected_desc: "Alle kerken die aan deze regio zijn toegewezen, zullen hun regiotioewijzing verliezen",
        region_archived: "Regio zal worden gearchiveerd",
        region_archived_desc: "De regio wordt gemarkeerd als verwijderd maar niet uit de database verwijderd",
        orphaned_churches: "Wees kerken blijven actief",
        orphaned_churches_desc: "Kerken zonder regio blijven in het systeem bestaan en blijven gekoppeld aan hun afdelingen, gebruikers en projecten",
        data_impact: "Gegevensimpact",
        data_impact_desc: "Het totale aantal regio's neemt af, maar wees kerken kunnen inconsistente gegevens vertonen",
        consequences: {
          church_impact: "Kerk Impact",
          church_impact_desc: "Alle kerken in deze regio worden beïnvloed en gemarkeerd als wees",
          department_impact: "Afdeling Impact",
          department_impact_desc: "Alle afdelingen in kerken in deze regio worden gedeactiveerd",
          data_safety: "Gegevens Bewaring",
          data_safety_desc: "Alle records worden gemarkeerd als verwijderd (zachte verwijdering), wat herstel mogelijk maakt"
        },
        soft_delete: {
          title: "Zachte Verwijdering",
          description: "De regio wordt gemarkeerd als inactief maar gegevens worden bewaard"
        },
        final_confirmation: "Definitieve Bevestiging",
        recommendation_title: "Aanbeveling",
        detailed_consequences_title: "Gedetailleerde Gevolgen",
        data_will_be_preserved: "Gegevens zullen worden bewaard",
        kpi_metrics_changes: "KPI- en metriekwijzigingen",
        detailed_consequences: {
          what_happens: "Wat zal er gebeuren",
          soft_delete_detail: "De regio wordt gemarkeerd als verwijderd (zachte verwijdering) - niet fysiek verwijderd",
          churches_as_orphaned: "Alle kerken blijven in het systeem als wees kerken",
          churches_orphaned_title: "Kerken zullen wees worden",
          orphaned_stay_linked: "Wees kerken blijven gekoppeld aan afdelingen, gebruikers, projecten en budgetten",
          data_consistency: "Maar gegevensconsistentie kan worden beïnvloed - query's die filteren op regio zullen wees kerken niet opnemen",
          orphaned_risks: "Wees kerken: Kan inconsistente aantallen in dashboards veroorzaken",
          recommendation: "Voordat u verwijdert, kunt u de wees kerken opnieuw aan een ander gebied toewijzen of deze handmatig verwijderen als ze niet moeten bestaan.",
          understand_consequences: "Ik begrijp de gevolgen en wil doorgaan",
          confirm_understand: "Ik bevestig, verdergaan naar definitieve bevestiging",
          churches_region_id_clear: "Alle kerken die aan deze regio zijn gekoppeld, hebben hun region_id ingesteld op null",
          churches_not_deleted: "Kerken worden niet verwijderd, alleen losgekoppeld van deze regio",
          churches_visible: "Ze blijven zichtbaar en bewerkbaar in het systeem",
          all_data_preserved: "Alle kerkgegevens, afdelingen, leden en projecten worden bewaard",
          nothing_physically_deleted: "Niets wordt fysiek uit de database verwijderd",
          total_regions_decrease: "Totale Regio's: Zal afnemen (verwijderde regio's zijn uitgesloten)",
          region_statistics_change: "Regiostatistieken: Zal geen gegevens van deze regio meer bevatten"
        }
      }
    },

    // Steps
    steps: {
      step: "Stap",
      of: "van",
      step_1_title: "Selecteer Land",
      step_1_description: "Kies het land voor deze regio",
      step_2_title: "Basisgegevens",
      step_2_description: "Voer de regionaam, beschrijving en kleur in",
      step_3_title: "Selecteer Provincies & Steden",
      step_3_description: "Kies de provincies en steden die deel uitmaken van deze regio",
      step_4_title: "Controleren & Bevestigen",
      step_4_description: "Controleer de gegevens voordat u de regio maakt"
    },

    // Fields
    fields: {
      name: "Regionaam",
      description: "Beschrijving",
      color: "Kleur",
      country: "Land",
      countries: "Landen",
      province: "Provincie",
      provinces: "Provincies"
    },

    // Placeholders
    placeholders: {
      name: "Voer regionaam in",
      description: "Voer regiobeschrijving in (optioneel)",
      color: "Selecteer een kleur voor de regio",
      country: "Selecteer land",
      country_placeholder: "Selecteer een land...",
      countries: "Selecteer landen",
      province: "Selecteer provincie",
      provinces: "Selecteer provincies"
    },

    // Labels
    labels: {
      region: "Regio",
      coverage: "Dekking"
    },

    // Sections
    sections: {
      basic_info: "Basisgegevens",
      geographic_coverage: "Geografische Dekking"
    },

    // Buttons
    buttons: {
      previous: "Vorige",
      next: "Volgende",
      skip_for_now: "Voorlopig overslaan",
      create_region: "Regio Maken",
      update_region: "Regio Bijwerken",
      creating: "Bezig met maken...",
      updating: "Bezig met bijwerken...",
      cancel: "Annuleren",
      clear: "Wissen"
    },

    // Validation
    validation: {
      name_required: "Regionaam is vereist",
      name_min_length: "Regionaam moet minstens 2 karakters hebben",
      color_required: "Kleur is vereist",
      country_required: "Selecteer een land",
      province_required: "Selecteer ten minste één provincie",
      city_unique: "Elke stad mag slechts aan één regio gekoppeld zijn. Verwijder dubbele steden en probeer opnieuw.",
      please_fix_errors: "Corrigeer de fouten voordat u verdergaat"
    },

    // Toasts
    toasts: {
      creating: "Regio maken...",
      created: "Regio succesvol gemaakt",
      create_failed: "Mislukt om regio te maken. Controleer of steden al aan een andere regio zijn toegewezen.",
      updating: "Regio bijwerken...",
      updated: "Regio succesvol bijgewerkt",
      update_failed: "Mislukt om regio bij te werken",
      deactivating: "Regio deactiveren...",
      deactivated: "Regio succesvol gedeactiveerd",
      deactivate_failed: "Mislukt om regio te deactiveren"
    },

    // Page-level translations
    page: {
      title: "Regio's",
      description: "Beheer alle regio's in uw organisatie",
      totalRegions: "Totaal Regio's",
      totalChurches: "Totaal Kerken",
      totalProvinces: "Totaal Provincies",
      totalCities: "Totaal Steden",
      active_regions: "Actieve regio's",
      churches_in_regions: "Kerken in alle regio's",
      provinces_in_regions: "Provincies in alle regio's",
      cities_in_regions: "Steden in alle regio's",
      vs_last_month: "vs vorige maand"
    },

    // Table columns
    table: {
      name: "Naam",
      color: "Kleur",
      provinces: "Provincies",
      cities: "Steden",
      churches: "Kerken",
      members: "Leden",
      status: "Status",
      action: "Actie"
    },

    // Messages
    messages: {
      loading: "Regio's laden...",
      empty: "Geen regio's gevonden",
      error_loading: "Fout bij het laden van regio's",
      refresh_success: "Regio's succesvol bijgewerkt",
      refresh_failed: "Mislukt om regio's te verversen",
      view_details: "Details Bekijken",
      edit_region: "Regio Bewerken",
      delete_region: "Regio Verwijderen",
      no_country_found: "Geen land gevonden",
      search_country: "Land zoeken...",
      search_province_city: "Zoek provincie of stad...",
      selected: "geselecteerd",
      cities: "steden"
    },

    // Map
    map: {
      title: "Nederland Regio's Kaart",
      description: "Interactieve geografische visualisatie",
      refocus_button: "Herpositioneren",
      refocus_success: "Kaart herpositioneerd naar Nederland"
    }
  },

  pt: {
    // Modal Titles
    modals: {
      create: {
        title: "Criar Região",
        description: "Adicione uma nova região à sua organização"
      },
      edit: {
        title: "Editar Região",
        description: "Atualize as informações e configurações da região"
      },
      details: {
        title: "Detalhes da Região",
        description: "Veja informações detalhadas sobre a região"
      },
      delete: {
        deactivate_title: "Desativar Região",
        deactivate_description: "Esta ação irá desativar a região e afetará dados relacionados",
        deactivating: "Desativando...",
        deactivate_region: "Desativar Região",
        view_consequences: "Ver Consequências",
        affected_components: "Componentes Afetados",
        understand_consequences: "Entendo as consequências",
        acknowledge_text: "Confirmo que esta ação afetará todos os dados relacionados",
        type_confirmation: "Digite 'delete region' para confirmar",
        confirmation_text: "delete region",
        confirmation_placeholder: "Digite 'delete region' aqui",
        confirmation_help: "A região será desativada e as igrejas serão afetadas",
        consequences_title: "O que vai acontecer?",
        consequences_intro: "Deletar esta região terá as seguintes consequências. Revise-as cuidadosamente antes de prosseguir.",
        churches_disconnected: "Igrejas serão desconectadas",
        churches_disconnected_desc: "Todas as igrejas atribuídas a esta região perderão sua atribuição de região",
        region_archived: "A região será arquivada",
        region_archived_desc: "A região será marcada como deletada mas não removida do banco de dados",
        orphaned_churches: "Igrejas órfãs permanecem ativas",
        orphaned_churches_desc: "Igrejas sem região continuarão existindo no sistema e permanecerão vinculadas aos seus departamentos, usuários e projetos",
        data_impact: "Impacto de Dados",
        data_impact_desc: "O total de regiões diminuirá, mas as igrejas órfãs podem mostrar dados inconsistentes",
        consequences: {
          church_impact: "Impacto nas Igrejas",
          church_impact_desc: "Todas as igrejas nesta região serão afetadas e marcadas como órfãs",
          department_impact: "Impacto nos Departamentos",
          department_impact_desc: "Todos os departamentos em igrejas nesta região serão desativados",
          data_safety: "Preservação de Dados",
          data_safety_desc: "Todos os registros são marcados como deletados (soft delete), permitindo recuperação se necessário"
        },
        soft_delete: {
          title: "Exclusão Suave",
          description: "A região será marcada como inativa mas os dados serão preservados"
        },
        final_confirmation: "Confirmação Final",
        recommendation_title: "Recomendação",
        detailed_consequences_title: "Consequências Detalhadas",
        data_will_be_preserved: "Os dados serão preservados",
        kpi_metrics_changes: "Mudanças em KPI e métricas",
        detailed_consequences: {
          what_happens: "O que vai acontecer",
          soft_delete_detail: "A região será marcada como deletada (soft delete) - não removida fisicamente",
          churches_as_orphaned: "Todas as igrejas permanecem no sistema como igrejas órfãs",
          churches_orphaned_title: "Igrejas se tornarão órfãs",
          orphaned_stay_linked: "Igrejas órfãs permanecem vinculadas a departamentos, usuários, projetos e orçamentos",
          data_consistency: "Mas a consistência de dados pode ser afetada - consultas que filtram por região não incluirão igrejas órfãs",
          orphaned_risks: "Igrejas órfãs: Podem causar contagens inconsistentes nos painéis",
          recommendation: "Antes de deletar, considere reatribuir as igrejas órfãs a outra região ou deletá-las manualmente se não devem existir.",
          understand_consequences: "Entendo as consequências e desejo prosseguir",
          confirm_understand: "Confirmo, continuar para confirmação final",
          churches_region_id_clear: "Todas as igrejas vinculadas a esta região terão seu region_id definido como nulo",
          churches_not_deleted: "Igrejas não serão deletadas, apenas desconectadas desta região",
          churches_visible: "Elas permanecem visíveis e editáveis no sistema",
          all_data_preserved: "Todos os dados da igreja, departamentos, membros e projetos são preservados",
          nothing_physically_deleted: "Nada é fisicamente deletado do banco de dados",
          total_regions_decrease: "Total de Regiões: Diminuirá (regiões deletadas são excluídas)",
          region_statistics_change: "Estatísticas da região: Não incluirão mais dados desta região"
        }
      }
    },

    // Steps
    steps: {
      step: "Passo",
      of: "de",
      step_1_title: "Selecione País",
      step_1_description: "Escolha o país para esta região",
      step_2_title: "Informações Básicas",
      step_2_description: "Digite o nome da região, descrição e cor",
      step_3_title: "Selecione Províncias & Cidades",
      step_3_description: "Escolha as províncias e cidades que fazem parte desta região",
      step_4_title: "Revisar & Confirmar",
      step_4_description: "Revise as informações antes de criar a região"
    },

    // Fields
    fields: {
      name: "Nome da Região",
      description: "Descrição",
      color: "Cor",
      country: "País",
      countries: "Países",
      province: "Província",
      provinces: "Províncias"
    },

    // Placeholders
    placeholders: {
      name: "Digite o nome da região",
      description: "Digite a descrição da região (opcional)",
      color: "Selecione uma cor para a região",
      country: "Selecione país",
      country_placeholder: "Selecione um país...",
      countries: "Selecione países",
      province: "Selecione província",
      provinces: "Selecione províncias"
    },

    // Labels
    labels: {
      region: "Região",
      coverage: "Cobertura"
    },

    // Sections
    sections: {
      basic_info: "Informações Básicas",
      geographic_coverage: "Cobertura Geográfica"
    },

    // Buttons
    buttons: {
      previous: "Anterior",
      next: "Próximo",
      skip_for_now: "Pular por agora",
      create_region: "Criar Região",
      update_region: "Atualizar Região",
      creating: "Criando...",
      updating: "Atualizando...",
      cancel: "Cancelar",
      clear: "Limpar"
    },

    // Validation
    validation: {
      name_required: "Nome da região é obrigatório",
      name_min_length: "Nome da região deve ter pelo menos 2 caracteres",
      color_required: "Cor é obrigatória",
      country_required: "Selecione um país",
      province_required: "Por favor, selecione pelo menos uma província",
      please_fix_errors: "Corrija os erros antes de continuar"
    },

    // Toasts
    toasts: {
      creating: "Criando região...",
      created: "Região criada com sucesso",
      create_failed: "Falha ao criar região. Verifique se as cidades já estão atribuídas a outra região.",
      updating: "Atualizando região...",
      updated: "Região atualizada com sucesso",
      update_failed: "Falha ao atualizar região",
      deactivating: "Desativando região...",
      deactivated: "Região desativada com sucesso",
      deactivate_failed: "Falha ao desativar região"
    },

    // Page-level translations
    page: {
      title: "Regiões",
      description: "Gerencie todas as regiões em sua organização",
      totalRegions: "Total de Regiões",
      totalChurches: "Total de Igrejas",
      totalProvinces: "Total de Províncias",
      totalCities: "Total de Cidades",
      active_regions: "Regiões ativas",
      churches_in_regions: "Igrejas em todas as regiões",
      provinces_in_regions: "Províncias em todas as regiões",
      cities_in_regions: "Cidades em todas as regiões",
      vs_last_month: "vs mês anterior"
    },

    // Table columns
    table: {
      name: "Nome",
      color: "Cor",
      provinces: "Províncias",
      cities: "Cidades",
      churches: "Igrejas",
      members: "Membros",
      status: "Status",
      action: "Ação"
    },

    // Messages
    messages: {
      loading: "Carregando regiões...",
      empty: "Nenhuma região encontrada",
      error_loading: "Erro ao carregar regiões",
      refresh_success: "Regiões atualizadas com sucesso",
      refresh_failed: "Falha ao atualizar regiões",
      view_details: "Ver Detalhes",
      edit_region: "Editar Região",
      delete_region: "Deletar Região",
      no_country_found: "Nenhum país encontrado",
      search_country: "Pesquisar país...",
      search_province_city: "Pesquisar província ou cidade...",
      selected: "selecionada",
      cities: "cidades"
    },

    // Map
    map: {
      title: "Mapa de Regiões - Países Baixos",
      description: "Visualização geográfica interativa",
      refocus_button: "Reposicionar",
      refocus_success: "Mapa reposicionado para os Países Baixos"
    }
  }
}
