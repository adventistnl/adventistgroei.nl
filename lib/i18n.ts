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
      },
      access: {
        title: "Access Management",
        subtitle: "Manage users, roles, and permissions",
        overview: "Access Overview",
        kpis: {
          total_users: "Total Users",
          total_roles: "Total Roles",
          total_permissions: "Total Permissions",
          active_users: "Active Users",
          admin_users: "Admin Users",
          user_growth_rate: "User Growth Rate"
        },
        charts: {
          role_distribution: "Role Distribution",
          permissions_by_group: "Permissions by Group",
          user_activity: "User Activity Over Time"
        },
        tabs: {
          users: "Users",
          roles: "Roles",
          permissions: "Permissions"
        },
        users: {
          title: "User Management",
          subtitle: "Manage system users and their access",
          table: {
            name: "Name",
            email: "Email",
            institution: "Institution",
            church: "Church",
            roles: "Roles",
            created_at: "Created",
            actions: "Actions",
            search_placeholder: "Search users...",
            no_results: "No users found"
          },
          actions: {
            create_user: "Create User",
            view_details: "View Details",
            edit_user: "Edit User",
            assign_role: "Assign Role",
            remove_role: "Remove Role",
            delete_user: "Delete User"
          }
        },
        roles: {
          title: "Role Management",
          subtitle: "Manage roles and their permissions",
          table: {
            name: "Role Name",
            key_code: "Key Code",
            description: "Description",
            permissions_count: "Permissions",
            users_count: "Users",
            actions: "Actions"
          },
          actions: {
            create_role: "Create Role",
            edit_permissions: "Edit Permissions",
            duplicate_role: "Duplicate Role",
            delete_role: "Delete Role"
          },
          permissions: {
            title: "Role Permissions Configuration",
            subtitle: "Configure detailed permissions for this role",
            role_info: "Role Information",
            permissions_matrix: "Permissions Matrix",
            select_all: "Select All Permissions",
            select_none: "Clear All Permissions",
            select_group: "Select All in Group",
            clear_group: "Clear Group",
            selected_count: "{{count}} permissions selected",
            total_permissions: "{{total}} total permissions",
            unsaved_changes: "You have unsaved changes",
            groups: {
              USER: "User Management",
              ROLE: "Role Management", 
              PERMISSION: "Permission Management",
              INSTITUTION: "Institution Management",
              REGION: "Region Management",
              CHURCH: "Church Management"
            },
            group_descriptions: {
              USER: "Control user creation, editing, and access management",
              ROLE: "Manage system roles and role assignments",
              PERMISSION: "Configure system-wide permission settings",
              INSTITUTION: "Administer institutions and organizational structure",
              REGION: "Manage regional divisions and territories",
              CHURCH: "Oversee church operations and management"
            }
          }
        },
        permissions: {
          title: "System Permissions",
          subtitle: "View all available system permissions",
          table: {
            name: "Permission Name",
            key_code: "Key Code",
            description: "Description",
            group: "Group"
          }
        },
        modals: {
          create_user: {
            title: "Create New User",
            name: "Full Name",
            email: "Email Address",
            institution: "Institution",
            church: "Church",
            language: "Language Preference",
            roles: "Assign Roles",
            create: "Create User",
            cancel: "Cancel"
          },
          edit_role: {
            title: "Edit Role",
            name: "Role Name",
            key_code: "Key Code",
            description: "Description",
            permissions: "Permissions",
            save: "Save Changes",
            cancel: "Cancel"
          }
        },
        toasts: {
          user_created: "User created successfully",
          user_updated: "User updated successfully",
          user_deleted: "User deleted successfully",
          role_created: "Role created successfully",
          role_updated: "Role updated successfully",
          role_deleted: "Role deleted successfully",
          role_assigned: "Role assigned successfully",
          role_removed: "Role removed successfully",
          permissions_updated: "Permissions updated successfully",
          access_denied: "Access denied - insufficient permissions"
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
      },
      access: {
        title: "Toegangsbeheer",
        subtitle: "Beheer gebruikers, rollen en machtigingen",
        overview: "Toegangsoverzicht",
        kpis: {
          total_users: "Totaal Gebruikers",
          total_roles: "Totaal Rollen",
          total_permissions: "Totaal Machtigingen",
          active_users: "Actieve Gebruikers",
          admin_users: "Admin Gebruikers",
          user_growth_rate: "Gebruikersgroei"
        },
        charts: {
          role_distribution: "Rolverdeling",
          permissions_by_group: "Machtigingen per Groep",
          user_activity: "Gebruikersactiviteit in de Tijd"
        },
        tabs: {
          users: "Gebruikers",
          roles: "Rollen",
          permissions: "Machtigingen"
        },
        users: {
          title: "Gebruikersbeheer",
          subtitle: "Beheer systeemgebruikers en hun toegang",
          table: {
            name: "Naam",
            email: "E-mail",
            institution: "Instelling",
            church: "Kerk",
            roles: "Rollen",
            created_at: "Aangemaakt",
            actions: "Acties",
            search_placeholder: "Zoek gebruikers...",
            no_results: "Geen gebruikers gevonden"
          },
          actions: {
            create_user: "Gebruiker Aanmaken",
            view_details: "Details Bekijken",
            edit_user: "Gebruiker Bewerken",
            assign_role: "Rol Toewijzen",
            remove_role: "Rol Verwijderen",
            delete_user: "Gebruiker Verwijderen"
          }
        },
        roles: {
          title: "Rollenbeheer",
          subtitle: "Beheer rollen en hun machtigingen",
          table: {
            name: "Rolnaam",
            key_code: "Sleutelcode",
            description: "Beschrijving",
            permissions_count: "Machtigingen",
            users_count: "Gebruikers",
            actions: "Acties"
          },
          actions: {
            create_role: "Rol Aanmaken",
            edit_permissions: "Machtigingen Bewerken",
            duplicate_role: "Rol Dupliceren",
            delete_role: "Rol Verwijderen"
          },
          permissions: {
            title: "Rolmachtigingen Configuratie",
            subtitle: "Configureer gedetailleerde machtigingen voor deze rol",
            role_info: "Rolinformatie",
            permissions_matrix: "Machtigingenmatrix",
            select_all: "Alle Machtigingen Selecteren",
            select_none: "Alle Machtigingen Wissen",
            select_group: "Alles in Groep Selecteren",
            clear_group: "Groep Wissen",
            selected_count: "{{count}} machtigingen geselecteerd",
            total_permissions: "{{total}} totale machtigingen",
            unsaved_changes: "U heeft niet-opgeslagen wijzigingen",
            groups: {
              USER: "Gebruikersbeheer",
              ROLE: "Rollenbeheer",
              PERMISSION: "Machtigingenbeheer",
              INSTITUTION: "Instellingsbeheer",
              REGION: "Regiobeheer",
              CHURCH: "Kerkbeheer"
            },
            group_descriptions: {
              USER: "Beheer gebruikersaanmaak, bewerking en toegangsbeheer",
              ROLE: "Beheer systeemrollen en roltoewijzingen",
              PERMISSION: "Configureer systeembrede machtiginginstellingen",
              INSTITUTION: "Beheer instellingen en organisatiestructuur",
              REGION: "Beheer regionale afdelingen en gebieden",
              CHURCH: "Toezicht op kerkactiviteiten en -beheer"
            }
          }
        },
        permissions: {
          title: "Systeemmachtigingen",
          subtitle: "Bekijk alle beschikbare systeemmachtigingen",
          table: {
            name: "Machtigingsnaam",
            key_code: "Sleutelcode",
            description: "Beschrijving",
            group: "Groep"
          }
        },
        modals: {
          create_user: {
            title: "Nieuwe Gebruiker Aanmaken",
            name: "Volledige Naam",
            email: "E-mailadres",
            institution: "Instelling",
            church: "Kerk",
            language: "Taalvoorkeur",
            roles: "Rollen Toewijzen",
            create: "Gebruiker Aanmaken",
            cancel: "Annuleren"
          },
          edit_role: {
            title: "Rol Bewerken",
            name: "Rolnaam",
            key_code: "Sleutelcode",
            description: "Beschrijving",
            permissions: "Machtigingen",
            save: "Wijzigingen Opslaan",
            cancel: "Annuleren"
          }
        },
        toasts: {
          user_created: "Gebruiker succesvol aangemaakt",
          user_updated: "Gebruiker succesvol bijgewerkt",
          user_deleted: "Gebruiker succesvol verwijderd",
          role_created: "Rol succesvol aangemaakt",
          role_updated: "Rol succesvol bijgewerkt",
          role_deleted: "Rol succesvol verwijderd",
          role_assigned: "Rol succesvol toegewezen",
          role_removed: "Rol succesvol verwijderd",
          permissions_updated: "Machtigingen succesvol bijgewerkt",
          access_denied: "Toegang geweigerd - onvoldoende machtigingen"
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
