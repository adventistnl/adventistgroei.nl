// Batch Actions Translations for i18n
// Language support: Portuguese (pt), English (en), Dutch (nl)

export const batchActionsTranslations = {
  pt: {
    batchActions: {
      // Selection states
      itemSelected: "1 item selecionado",
      itemsSelected: "{{count}} itens selecionados",
      rowSelected: "linha selecionada",
      rowsSelected: "linhas selecionadas",
      
      // Actions
      clearSelection: "Limpar seleção",
      minimizePanel: "Minimizar painel",
      showPanel: "Mostrar painel",
      more: "Mais",
      moreActions: "Mais ações",
      
      // Status messages
      noItemsSelected: "Nenhum item selecionado",
      allItemsSelected: "Todos os itens selecionados",
      partialSelection: "Seleção parcial",
      
      // Common actions (can be overridden by specific implementations)
      delete: "Excluir",
      edit: "Editar",
      duplicate: "Duplicar",
      archive: "Arquivar",
      export: "Exportar",
      move: "Mover",
      copy: "Copiar",
      
      // Bulk operations
      bulkEdit: "Edição em lote",
      bulkDelete: "Excluir em lote",
      bulkArchive: "Arquivar em lote",
      bulkMove: "Mover em lote",
      
      // Confirmation messages
      confirmDelete: "Tem certeza de que deseja excluir {{count}} item(s)?",
      confirmArchive: "Tem certeza de que deseja arquivar {{count}} item(s)?",
      confirmMove: "Tem certeza de que deseja mover {{count}} item(s)?",
      
      // Success messages
      deletedSuccessfully: "{{count}} item(s) excluído(s) com sucesso",
      archivedSuccessfully: "{{count}} item(s) arquivado(s) com sucesso",
      movedSuccessfully: "{{count}} item(s) movido(s) com sucesso",
      editedSuccessfully: "{{count}} item(s) editado(s) com sucesso",
      
      // Error messages
      deleteError: "Erro ao excluir itens",
      archiveError: "Erro ao arquivar itens",
      moveError: "Erro ao mover itens",
      editError: "Erro ao editar itens",
      
      // Currency related (when using currency context)
      totalValue: "Valor total",
      averageValue: "Valor médio",
      selectedValue: "Valor selecionado"
    }
  },
  
  en: {
    batchActions: {
      // Selection states
      itemSelected: "1 item selected",
      itemsSelected: "{{count}} items selected",
      rowSelected: "row selected",
      rowsSelected: "rows selected",
      
      // Actions
      clearSelection: "Clear selection",
      minimizePanel: "Minimize panel",
      showPanel: "Show panel",
      more: "More",
      moreActions: "More actions",
      
      // Status messages
      noItemsSelected: "No items selected",
      allItemsSelected: "All items selected",
      partialSelection: "Partial selection",
      
      // Common actions (can be overridden by specific implementations)
      delete: "Delete",
      edit: "Edit",
      duplicate: "Duplicate",
      archive: "Archive",
      export: "Export",
      move: "Move",
      copy: "Copy",
      
      // Bulk operations
      bulkEdit: "Bulk edit",
      bulkDelete: "Bulk delete",
      bulkArchive: "Bulk archive",
      bulkMove: "Bulk move",
      
      // Confirmation messages
      confirmDelete: "Are you sure you want to delete {{count}} item(s)?",
      confirmArchive: "Are you sure you want to archive {{count}} item(s)?",
      confirmMove: "Are you sure you want to move {{count}} item(s)?",
      
      // Success messages
      deletedSuccessfully: "{{count}} item(s) deleted successfully",
      archivedSuccessfully: "{{count}} item(s) archived successfully",
      movedSuccessfully: "{{count}} item(s) moved successfully",
      editedSuccessfully: "{{count}} item(s) edited successfully",
      
      // Error messages
      deleteError: "Error deleting items",
      archiveError: "Error archiving items",
      moveError: "Error moving items",
      editError: "Error editing items",
      
      // Currency related (when using currency context)
      totalValue: "Total value",
      averageValue: "Average value",
      selectedValue: "Selected value"
    }
  },
  
  nl: {
    batchActions: {
      // Selection states
      itemSelected: "1 item geselecteerd",
      itemsSelected: "{{count}} items geselecteerd",
      rowSelected: "rij geselecteerd",
      rowsSelected: "rijen geselecteerd",
      
      // Actions
      clearSelection: "Selectie wissen",
      minimizePanel: "Paneel minimaliseren",
      showPanel: "Paneel tonen",
      more: "Meer",
      moreActions: "Meer acties",
      
      // Status messages
      noItemsSelected: "Geen items geselecteerd",
      allItemsSelected: "Alle items geselecteerd",
      partialSelection: "Gedeeltelijke selectie",
      
      // Common actions (can be overridden by specific implementations)
      delete: "Verwijderen",
      edit: "Bewerken",
      duplicate: "Dupliceren",
      archive: "Archiveren",
      export: "Exporteren",
      move: "Verplaatsen",
      copy: "Kopiëren",
      
      // Bulk operations
      bulkEdit: "Bulk bewerken",
      bulkDelete: "Bulk verwijderen",
      bulkArchive: "Bulk archiveren",
      bulkMove: "Bulk verplaatsen",
      
      // Confirmation messages
      confirmDelete: "Weet je zeker dat je {{count}} item(s) wilt verwijderen?",
      confirmArchive: "Weet je zeker dat je {{count}} item(s) wilt archiveren?",
      confirmMove: "Weet je zeker dat je {{count}} item(s) wilt verplaatsen?",
      
      // Success messages
      deletedSuccessfully: "{{count}} item(s) succesvol verwijderd",
      archivedSuccessfully: "{{count}} item(s) succesvol gearchiveerd",
      movedSuccessfully: "{{count}} item(s) succesvol verplaatst",
      editedSuccessfully: "{{count}} item(s) succesvol bewerkt",
      
      // Error messages
      deleteError: "Fout bij het verwijderen van items",
      archiveError: "Fout bij het archiveren van items",
      moveError: "Fout bij het verplaatsen van items",
      editError: "Fout bij het bewerken van items",
      
      // Currency related (when using currency context)
      totalValue: "Totale waarde",
      averageValue: "Gemiddelde waarde",
      selectedValue: "Geselecteerde waarde"
    }
  }
}

// Shared translations that are used across all namespaces
export const sharedBatchActionsTranslations = {
  pt: {
    shared: {
      batchActions: {
        itemSelected: "1 item selecionado",
        itemsSelected: "{{count}} itens selecionados",
        rowSelected: "linha selecionada",
        rowsSelected: "linhas selecionadas",
        clearSelection: "Limpar seleção",
        minimizePanel: "Minimizar painel",
        showPanel: "Mostrar painel",
        more: "Mais",
        moreActions: "Mais ações"
      }
    }
  },
  en: {
    shared: {
      batchActions: {
        itemSelected: "1 item selected",
        itemsSelected: "{{count}} items selected",
        rowSelected: "row selected",
        rowsSelected: "rows selected",
        clearSelection: "Clear selection",
        minimizePanel: "Minimize panel",
        showPanel: "Show panel",
        more: "More",
        moreActions: "More actions"
      }
    }
  },
  nl: {
    shared: {
      batchActions: {
        itemSelected: "1 item geselecteerd",
        itemsSelected: "{{count}} items geselecteerd",
        rowSelected: "rij geselecteerd",
        rowsSelected: "rijen geselecteerd",
        clearSelection: "Selectie wissen",
        minimizePanel: "Paneel minimaliseren",
        showPanel: "Paneel tonen",
        more: "Meer",
        moreActions: "Meer acties"
      }
    }
  }
}