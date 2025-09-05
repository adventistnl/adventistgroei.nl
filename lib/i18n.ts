import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Recursos de tradução
const resources = {
  en: {
    translation: {
      dashboard: {
        title: "General Dashboard",
        subtitle: "Overview of key system metrics",
        growth_chart_title: "Growth of Institutions & Churches",
        users_by_institution_chart_title: "User Distribution by Institution",
        financial_chart_title: "Department Budget vs. Subsidy Requests",
        subsidy_status_chart_title: "Subsidy Request Status",
        events_chart_title: "Event Participation by Type",
        communications_chart_title: "Communication & Message Flow",
        recent_activities: "Recent Activities",
        quick_actions: "Quick Actions"
      },
      metrics: {
        total_users: "Total Users",
        total_institutions: "Total Institutions",
        total_churches: "Total Churches",
        pending_subsidies: "Pending Subsidies",
        active_regions: "Active Regions",
        monthly_growth: "Monthly Growth",
        budget_utilization: "Budget Utilization",
        event_participation: "Event Participation"
      },
      common: {
        language: "Language",
        english: "English",
        dutch: "Dutch",
        loading: "Loading...",
        error: "An error occurred",
        success: "Success",
        cancel: "Cancel",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        view: "View",
        filter: "Filter",
        search: "Search",
        export: "Export",
        refresh: "Refresh",
        columns: "Columns",
        clear_filters: "Clear Filters"
      },
      actions: {
        add_member: "Add Member",
        create_event: "Create Event",
        manage_subsidies: "Manage Subsidies",
        view_reports: "View Reports",
        send_communication: "Send Communication",
        manage_departments: "Manage Departments",
        view_details: "View Details",
        create_institution: "Create Institution"
      },
      institutions: {
        title: "Institutions",
        subtitle: "Manage institutions and their relationships",
        overview: "Overview",
        all_institutions: "All Institutions",
        filters: {
          institution: "Institution",
          denomination: "Denomination",
          country: "Country",
          language: "Language"
        },
        kpis: {
          total_institutions: "Total Institutions",
          total_regions: "Total Regions",
          total_churches: "Total Churches",
          total_users: "Total Users",
          total_budget: "Total Budget",
          annual_budget: "Annual Budget",
          pending_subsidies: "Pending Subsidies",
          budget_utilization: "Budget Utilization"
        },
        charts: {
          churches_by_region: "Churches by Region",
          users_by_role: "Users by Role",
          subsidy_over_time: "Subsidy Requests over Time",
          revenue_vs_budget: "Revenue vs Annual Budget",
          monthly_subsidies: "Monthly Subsidy Trends"
        },
        table: {
          name: "Institution Name",
          country: "Country",
          denomination: "Denomination",
          language: "Language",
          churches: "Churches",
          users: "Users",
          members: "Members",
          regions: "Regions",
          budget: "Budget",
          actions: "Actions",
          search_placeholder: "Search institutions...",
          no_results: "No institutions found",
          showing_results: "Showing {{from}} to {{to}} of {{total}} institutions"
        },
        modal: {
          create_title: "Create New Institution",
          edit_title: "Edit Institution",
          basic_info: "Basic Information",
          contact_info: "Contact Information",
          review: "Review",
          name: "Institution Name",
          name_placeholder: "Enter institution name",
          denomination: "Denomination",
          denomination_placeholder: "Select or enter denomination",
          language_preference: "Language Preference",
          country: "Country",
          country_placeholder: "Select country",
          city: "City",
          city_placeholder: "Enter city",
          address: "Address",
          address_placeholder: "Enter full address",
          email: "Email",
          email_placeholder: "Enter contact email",
          phone: "Phone",
          phone_placeholder: "Enter phone number",
          website: "Website",
          website_placeholder: "Enter website URL",
          next: "Next",
          back: "Back",
          create: "Create Institution",
          update: "Update Institution",
          cancel: "Cancel"
        },
        toasts: {
          loaded: "Institutions data loaded successfully",
          error_loading: "Error loading institutions data",
          institution_details_loaded: "Institution details loaded",
          institution_switched: "Institution filter changed",
          create_success: "Institution created successfully",
          create_error: "Error creating institution",
          update_success: "Institution updated successfully",
          update_error: "Error updating institution",
          delete_success: "Institution deleted successfully",
          delete_error: "Error deleting institution",
          language_switched: "Language switched successfully"
        }
      }
    }
  },
  nl: {
    translation: {
      dashboard: {
        title: "Algemeen Dashboard",
        subtitle: "Overzicht van belangrijke systeemstatistieken",
        growth_chart_title: "Groei van Instellingen & Kerken",
        users_by_institution_chart_title: "Gebruikersdistributie per Instelling",
        financial_chart_title: "Departementbudget vs. Subsidieaanvragen",
        subsidy_status_chart_title: "Status Subsidieaanvragen",
        events_chart_title: "Evenementdeelname per Type",
        communications_chart_title: "Communicatie & Berichtenstroom",
        recent_activities: "Recente Activiteiten",
        quick_actions: "Snelle Acties"
      },
      metrics: {
        total_users: "Totaal Gebruikers",
        total_institutions: "Totaal Instellingen",
        total_churches: "Totaal Kerken",
        pending_subsidies: "Wachtende Subsidies",
        active_regions: "Actieve Regio's",
        monthly_growth: "Maandelijkse Groei",
        budget_utilization: "Budgetbenutting",
        event_participation: "Evenementdeelname"
      },
      common: {
        language: "Taal",
        english: "Engels",
        dutch: "Nederlands",
        loading: "Laden...",
        error: "Er is een fout opgetreden",
        success: "Succes",
        cancel: "Annuleren",
        save: "Opslaan",
        edit: "Bewerken",
        delete: "Verwijderen",
        view: "Bekijken",
        filter: "Filter",
        search: "Zoeken",
        export: "Exporteren",
        refresh: "Vernieuwen",
        columns: "Kolommen",
        clear_filters: "Filters Wissen"
      },
      actions: {
        add_member: "Lid Toevoegen",
        create_event: "Evenement Maken",
        manage_subsidies: "Subsidies Beheren",
        view_reports: "Rapporten Bekijken",
        send_communication: "Communicatie Versturen",
        manage_departments: "Afdelingen Beheren",
        view_details: "Details Bekijken",
        create_institution: "Instelling Maken"
      },
      institutions: {
        title: "Instellingen",
        subtitle: "Beheer instellingen en hun relaties",
        overview: "Overzicht",
        all_institutions: "Alle Instellingen",
        filters: {
          institution: "Instelling",
          denomination: "Denominatie",
          country: "Land",
          language: "Taal"
        },
        kpis: {
          total_institutions: "Totaal Instellingen",
          total_regions: "Totaal Regio's",
          total_churches: "Totaal Kerken",
          total_users: "Totaal Gebruikers",
          total_budget: "Totaal Budget",
          annual_budget: "Jaarlijks Budget",
          pending_subsidies: "Wachtende Subsidies",
          budget_utilization: "Budgetbenutting"
        },
        charts: {
          churches_by_region: "Kerken per Regio",
          users_by_role: "Gebruikers per Rol",
          subsidy_over_time: "Subsidieaanvragen in de Tijd",
          revenue_vs_budget: "Inkomsten vs Jaarlijks Budget",
          monthly_subsidies: "Maandelijkse Subsidietrends"
        },
        table: {
          name: "Naam Instelling",
          country: "Land",
          denomination: "Denominatie",
          language: "Taal",
          churches: "Kerken",
          users: "Gebruikers",
          members: "Leden",
          regions: "Regio's",
          budget: "Budget",
          actions: "Acties",
          search_placeholder: "Zoek instellingen...",
          no_results: "Geen instellingen gevonden",
          showing_results: "{{from}} tot {{to}} van {{total}} instellingen weergegeven"
        },
        modal: {
          create_title: "Nieuwe Instelling Maken",
          edit_title: "Instelling Bewerken",
          basic_info: "Basisinformatie",
          contact_info: "Contactinformatie",
          review: "Beoordeling",
          name: "Naam Instelling",
          name_placeholder: "Voer naam instelling in",
          denomination: "Denominatie",
          denomination_placeholder: "Selecteer of voer denominatie in",
          language_preference: "Taalvoorkeur",
          country: "Land",
          country_placeholder: "Selecteer land",
          city: "Stad",
          city_placeholder: "Voer stad in",
          address: "Adres",
          address_placeholder: "Voer volledig adres in",
          email: "E-mail",
          email_placeholder: "Voer contact e-mail in",
          phone: "Telefoon",
          phone_placeholder: "Voer telefoonnummer in",
          website: "Website",
          website_placeholder: "Voer website URL in",
          next: "Volgende",
          back: "Terug",
          create: "Instelling Maken",
          update: "Instelling Bijwerken",
          cancel: "Annuleren"
        },
        toasts: {
          loaded: "Instellingsgegevens succesvol geladen",
          error_loading: "Fout bij laden van instellingsgegevens",
          institution_details_loaded: "Instellingsdetails geladen",
          institution_switched: "Instellingsfilter gewijzigd",
          create_success: "Instelling succesvol aangemaakt",
          create_error: "Fout bij aanmaken instelling",
          update_success: "Instelling succesvol bijgewerkt",
          update_error: "Fout bij bijwerken instelling",
          delete_success: "Instelling succesvol verwijderd",
          delete_error: "Fout bij verwijderen instelling",
          language_switched: "Taal succesvol gewijzigd"
        }
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // idioma padrão
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
