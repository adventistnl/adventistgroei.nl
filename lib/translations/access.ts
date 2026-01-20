/**
 * Access Management Translations
 * Translations for access control, roles, and permissions pages
 */

export const accessTranslations = {
  en: {
    page_title: "Access Management",
    role_permissions: "Role Permission Configuration",
    breadcrumb: {
      access_management: "Access Management",
      role_permissions: "Role Permissions"
    },
    roles: {
      title: "Roles",
      description: "Manage system roles and their permissions",
      create: "Create Role",
      edit: "Edit Role",
      delete: "Delete Role"
    },
    permissions: {
      title: "Permissions",
      configuration: "Permission Configuration",
      select_all: "Select All",
      clear_all: "Clear All",
      selected: "Selected",
      available: "Available",
      coverage: "Coverage",
      matrix: "Permission Matrix",
      groups: "Permission Groups"
    },
    status: {
      saved: "Saved",
      modified: "Modified",
      active: "Active",
      essential: "Essential",
      new: "New",
      removed: "Removed"
    },
    actions: {
      save_changes: "Save Changes",
      cancel: "Cancel",
      back: "Back to Access Management"
    },
    toasts: {
      permissions_updated: "Permissions updated successfully!",
      permissions_update_failed: "Failed to update permissions",
      permission_added: "Permission added",
      permission_removed: "Permission removed",
      all_selected: "All permissions selected",
      all_cleared: "All permissions cleared",
      all_closed: "All groups closed",
      all_opened: "All groups opened"
    },
    search: {
      placeholder: "Search permissions...",
      crud_type: "CRUD Type",
      all_types: "All Types",
      create: "Create",
      read_view: "Read/View",
      update_edit: "Update/Edit",
      delete: "Delete"
    },
    filters: {
      quick_tags: "Quick Tags",
      showing: "Showing",
      of: "of",
      groups: "groups"
    },
    groups: {
      user_management: "User Management",
      role_management: "Role Management",
      permission_management: "Permission Management",
      institution_management: "Institution Management",
      region_management: "Region Management",
      church_management: "Church Management",
      department_management: "Department Management",
      close_permissions: "Close Permissions",
      open_permissions: "Open Permissions"
    },
    confirmation: {
      unsaved_changes_title: "Unsaved Changes",
      unsaved_changes_message: "You have unsaved changes. Are you sure you want to leave?",
      all_essential_error: "All permissions are essential and cannot be modified",
      all_essential_remove_error: "All permissions are essential and cannot be removed",
      preserved_essential: "preserved essential permission(s)"
    },
    buttons: {
      select: "Select",
      clear: "Clear",
      close: "Close",
      open: "Open",
      save: "Save",
      back: "Back",
      close_all: "Close All",
      open_all: "Open All"
    },
    messages: {
      unsaved_changes: "You have unsaved changes",
      role_not_found: "Role Not Found",
      essential_cannot_remove: "Essential permissions cannot be removed"
    },
    charts: {
      role_distribution: {
        title: "Role Distribution",
        description_with_users: "roles with assigned users",
        select_role: "Select a role",
        no_users: "No users found",
        no_users_description: "Assign roles to users to see distribution",
        no_roles: "No roles assigned",
        no_roles_description: "Users don't have roles assigned yet",
        stats: {
          total_users: "Users",
          total_roles: "Roles",
          avg_users: "Avg"
        }
      },
      role_permissions: {
        title: "Role Permissions Distribution",
        description_top: "Roles with most permissions",
        description_least: "Roles with least permissions",
        sort_by: "Sort by",
        top_roles: "Top Roles",
        least_permissions: "Least Permissions",
        no_permissions: "No permissions assigned",
        no_permissions_description: "Configure role permissions to see distribution",
        showing: "Showing",
        of: "of",
        page: "Page",
        stats: {
          total: "Total",
          avg: "Avg",
          max: "Max",
          total_permissions: "Total Permissions",
          avg_per_role: "Avg per Role",
          max_assigned: "Max Assigned"
        }
      }
    }
  },
  pt: {
    page_title: "Gestão de Acesso",
    role_permissions: "Configuração de Permissões de Função",
    breadcrumb: {
      access_management: "Gestão de Acesso",
      role_permissions: "Permissões de Função"
    },
    roles: {
      title: "Funções",
      description: "Gerir funções do sistema e suas permissões",
      create: "Criar Função",
      edit: "Editar Função",
      delete: "Eliminar Função"
    },
    permissions: {
      title: "Permissões",
      configuration: "Configuração de Permissões",
      select_all: "Selecionar Tudo",
      clear_all: "Limpar Tudo",
      selected: "Selecionadas",
      available: "Disponíveis",
      coverage: "Cobertura",
      matrix: "Matriz de Permissões",
      groups: "Grupos de Permissões"
    },
    status: {
      saved: "Guardado",
      modified: "Modificado",
      active: "Ativo",
      essential: "Essencial",
      new: "Novo",
      removed: "Removido"
    },
    actions: {
      save_changes: "Guardar Alterações",
      cancel: "Cancelar",
      back: "Voltar à Gestão de Acesso"
    },
    toasts: {
      permissions_updated: "Permissões atualizadas com sucesso!",
      permissions_update_failed: "Falha ao atualizar permissões",
      permission_added: "Permissão adicionada",
      permission_removed: "Permissão removida",
      all_selected: "Todas as permissões selecionadas",
      all_cleared: "Todas as permissões limpas",
      all_closed: "Todos os grupos fechados",
      all_opened: "Todos os grupos abertos"
    },
    search: {
      placeholder: "Pesquisar permissões...",
      crud_type: "Tipo CRUD",
      all_types: "Todos os Tipos",
      create: "Criar",
      read_view: "Ler/Ver",
      update_edit: "Atualizar/Editar",
      delete: "Eliminar"
    },
    filters: {
      quick_tags: "Etiquetas Rápidas",
      showing: "Mostrando",
      of: "de",
      groups: "grupos"
    },
    groups: {
      user_management: "Gestão de Utilizadores",
      role_management: "Gestão de Funções",
      permission_management: "Gestão de Permissões",
      institution_management: "Gestão de Instituições",
      region_management: "Gestão de Regiões",
      church_management: "Gestão de Igrejas",
      department_management: "Gestão de Departamentos",
      close_permissions: "Fechar Permissões",
      open_permissions: "Abrir Permissões"
    },
    confirmation: {
      unsaved_changes_title: "Alterações Não Guardadas",
      unsaved_changes_message: "Tem alterações não guardadas. Tem certeza que quer sair?",
      all_essential_error: "Todas as permissões são essenciais e não podem ser modificadas",
      all_essential_remove_error: "Todas as permissões são essenciais e não podem ser removidas",
      preserved_essential: "permissões essenciais preservadas"
    },
    buttons: {
      select: "Selecionar",
      clear: "Limpar",
      close: "Fechar",
      open: "Abrir",
      save: "Guardar",
      back: "Voltar",
      close_all: "Fechar Tudo",
      open_all: "Abrir Tudo"
    },
    messages: {
      unsaved_changes: "Tem alterações não guardadas",
      role_not_found: "Função Não Encontrada",
      essential_cannot_remove: "Permissões essenciais não podem ser removidas"
    },
    charts: {
      role_distribution: {
        title: "Distribuição de Funções",
        description_with_users: "funções com utilizadores atribuídos",
        select_role: "Selecionar função",
        no_users: "Nenhum utilizador encontrado",
        no_users_description: "Atribua funções aos utilizadores para ver distribuição",
        no_roles: "Nenhuma função atribuída",
        no_roles_description: "Utilizadores ainda não têm funções atribuídas",
        stats: {
          total_users: "Utilizadores",
          total_roles: "Funções",
          avg_users: "Média"
        }
      },
      role_permissions: {
        title: "Distribuição de Permissões por Função",
        description_top: "Funções com mais permissões",
        description_least: "Funções com menos permissões",
        sort_by: "Ordenar por",
        top_roles: "Principais Funções",
        least_permissions: "Menos Permissões",
        no_permissions: "Nenhuma permissão atribuída",
        no_permissions_description: "Configure permissões de função para ver distribuição",
        showing: "Mostrando",
        of: "de",
        page: "Página",
        stats: {
          total: "Total",
          avg: "Média",
          max: "Máx",
          total_permissions: "Total de Permissões",
          avg_per_role: "Média por Função",
          max_assigned: "Máximo Atribuído"
        }
      }
    }
  },
  nl: {
    page_title: "Toegangsbeheer",
    role_permissions: "Rolrechten Configuratie",
    breadcrumb: {
      access_management: "Toegangsbeheer",
      role_permissions: "Rolrechten"
    },
    roles: {
      title: "Rollen",
      description: "Beheer systeemrollen en hun rechten",
      create: "Rol Aanmaken",
      edit: "Rol Bewerken",
      delete: "Rol Verwijderen"
    },
    permissions: {
      title: "Rechten",
      configuration: "Rechten Configuratie",
      select_all: "Alles Selecteren",
      clear_all: "Alles Wissen",
      selected: "Geselecteerd",
      available: "Beschikbaar",
      coverage: "Dekking",
      matrix: "Rechten Matrix",
      groups: "Rechten Groepen"
    },
    status: {
      saved: "Opgeslagen",
      modified: "Gewijzigd",
      active: "Actief",
      essential: "Essentieel",
      new: "Nieuw",
      removed: "Verwijderd"
    },
    actions: {
      save_changes: "Wijzigingen Opslaan",
      cancel: "Annuleren",
      back: "Terug naar Toegangsbeheer"
    },
    toasts: {
      permissions_updated: "Rechten succesvol bijgewerkt!",
      permissions_update_failed: "Fout bij bijwerken van rechten",
      permission_added: "Recht toegevoegd",
      permission_removed: "Recht verwijderd",
      all_selected: "Alle rechten geselecteerd",
      all_cleared: "Alle rechten gewist",
      all_closed: "Alle groepen gesloten",
      all_opened: "Alle groepen geopend"
    },
    search: {
      placeholder: "Zoek rechten...",
      crud_type: "CRUD Type",
      all_types: "Alle Types",
      create: "Aanmaken",
      read_view: "Lezen/Bekijken",
      update_edit: "Bijwerken/Bewerken",
      delete: "Verwijderen"
    },
    filters: {
      quick_tags: "Snelle Tags",
      showing: "Tonen",
      of: "van",
      groups: "groepen"
    },
    groups: {
      user_management: "Gebruikersbeheer",
      role_management: "Rollenbeheer",
      permission_management: "Rechtenbeheer",
      institution_management: "Institutiebeheer",
      region_management: "Regiobeheer",
      church_management: "Kerkbeheer",
      department_management: "Afdelingsbeheer",
      close_permissions: "Rechten Sluiten",
      open_permissions: "Rechten Openen"
    },
    confirmation: {
      unsaved_changes_title: "Niet-opgeslagen Wijzigingen",
      unsaved_changes_message: "U heeft niet-opgeslagen wijzigingen. Weet u zeker dat u wilt vertrekken?",
      all_essential_error: "Alle rechten zijn essentieel en kunnen niet worden gewijzigd",
      all_essential_remove_error: "Alle rechten zijn essentieel en kunnen niet worden verwijderd",
      preserved_essential: "essentiële rechten behouden"
    },
    buttons: {
      select: "Selecteren",
      clear: "Wissen",
      close: "Sluiten",
      open: "Openen",
      save: "Opslaan",
      back: "Terug",
      close_all: "Alles Sluiten",
      open_all: "Alles Openen"
    },
    messages: {
      unsaved_changes: "U heeft niet-opgeslagen wijzigingen",
      role_not_found: "Rol Niet Gevonden",
      essential_cannot_remove: "Essentiële rechten kunnen niet worden verwijderd"
    },
    charts: {
      role_distribution: {
        title: "Rolverdeling",
        description_with_users: "rollen met toegewezen gebruikers",
        select_role: "Selecteer een rol",
        no_users: "Geen gebruikers gevonden",
        no_users_description: "Wijs rollen toe aan gebruikers om verdeling te zien",
        no_roles: "Geen rollen toegewezen",
        no_roles_description: "Gebruikers hebben nog geen rollen toegewezen",
        stats: {
          total_users: "Gebruikers",
          total_roles: "Rollen",
          avg_users: "Gem"
        }
      },
      role_permissions: {
        title: "Verdeling van Rolrechten",
        description_top: "Rollen met de meeste rechten",
        description_least: "Rollen met de minste rechten",
        sort_by: "Sorteren op",
        top_roles: "Top Rollen",
        least_permissions: "Minste Rechten",
        no_permissions: "Geen rechten toegewezen",
        no_permissions_description: "Configureer rolrechten om verdeling te zien",
        showing: "Tonen",
        of: "van",
        page: "Pagina",
        stats: {
          total: "Totaal",
          avg: "Gem",
          max: "Max",
          total_permissions: "Totaal Rechten",
          avg_per_role: "Gem per Rol",
          max_assigned: "Max Toegewezen"
        }
      }
    }
  }
} as const;
