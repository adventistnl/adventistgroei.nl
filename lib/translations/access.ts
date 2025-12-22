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
      all_cleared: "All permissions cleared"
    },
    messages: {
      unsaved_changes: "You have unsaved changes",
      role_not_found: "Role Not Found",
      essential_cannot_remove: "Essential permissions cannot be removed"
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
      all_cleared: "Todas as permissões limpas"
    },
    messages: {
      unsaved_changes: "Tem alterações não guardadas",
      role_not_found: "Função Não Encontrada",
      essential_cannot_remove: "Permissões essenciais não podem ser removidas"
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
      all_cleared: "Alle rechten gewist"
    },
    messages: {
      unsaved_changes: "U heeft niet-opgeslagen wijzigingen",
      role_not_found: "Rol Niet Gevonden",
      essential_cannot_remove: "Essentiële rechten kunnen niet worden verwijderd"
    }
  }
} as const;
