/**
 * EXEMPLO DE USO COMPLETO - BatchActionsPanel com Traduções i18n
 * 
 * Este exemplo demonstra como usar o BatchActionsPanel com traduções
 * completas para todos os campos dinâmicos, dropdowns e textos.
 */

import React, { useState } from "react"
import { Trash2, Edit, Archive, CheckCircle, AlertCircle } from "lucide-react"
import { BatchActionsPanel, BatchAction } from "@/components/shared/batch-actions-panel"
import { BatchEditField } from "@/components/shared/inline-batch-editor"

export function CompleteBatchActionsExample() {
  const [selectedItems, setSelectedItems] = useState<string[]>(["1", "2", "3"])
  const [selectedRows, setSelectedRows] = useState([
    { id: "1", name: "Igreja Central", status: "active", priority: "high", region: "north" },
    { id: "2", name: "Igreja Adventista do Oeste", status: "pending", priority: "medium", region: "west" },
    { id: "3", name: "Congregação Sul", status: "inactive", priority: "low", region: "south" }
  ])

  // Ações com traduções automáticas via i18n
  const batchActions: BatchAction[] = [
    {
      id: "edit",
      label: "Edit", // Será traduzido para "Editar" em PT
      icon: <Edit className="w-4 h-4" />,
      onClick: () => handleBulkEdit(),
    },
    {
      id: "archive", 
      label: "Archive", // Será traduzido para "Arquivar" em PT
      icon: <Archive className="w-4 h-4" />,
      onClick: () => handleBulkArchive(),
    }
  ]

  const primaryAction: BatchAction = {
    id: "delete",
    label: "Delete", // Será traduzido para "Excluir" em PT
    icon: <Trash2 className="w-4 h-4" />,
    onClick: () => handleBulkDelete(),
    variant: "destructive"
  }

  // Campos de edição em lote com traduções completas
  const editFields: BatchEditField[] = [
    {
      id: "status",
      label: "Status", // Label base (pode ser overridden por tradução)
      type: "select",
      translationKey: "status", // Chave para buscar tradução
      value: "",
      options: [
        { value: "active", label: "Active" },     // → "Ativo"
        { value: "inactive", label: "Inactive" }, // → "Inativo" 
        { value: "pending", label: "Pending" },   // → "Pendente"
        { value: "suspended", label: "Suspended" } // → "Suspenso"
      ],
      onChange: (value) => handleFieldChange("status", value),
      getBadgeVariant: (value) => {
        switch(value) {
          case 'active': return 'green'
          case 'pending': return 'yellow'
          case 'inactive': return 'gray'
          case 'suspended': return 'red'
          default: return 'gray'
        }
      },
      infoTooltip: "Current status of the selected churches"
    },
    {
      id: "priority",
      label: "Priority",
      type: "select",
      translationKey: "priority",
      value: "",
      options: [
        { value: "low", label: "Low" },         // → "Baixa"
        { value: "medium", label: "Medium" },   // → "Média"
        { value: "high", label: "High" },       // → "Alta"
        { value: "critical", label: "Critical" } // → "Crítica"
      ],
      onChange: (value) => handleFieldChange("priority", value),
      getBadgeVariant: (value) => {
        switch(value) {
          case 'low': return 'blue'
          case 'medium': return 'yellow'
          case 'high': return 'orange' 
          case 'critical': return 'red'
          default: return 'gray'
        }
      }
    },
    {
      id: "region",
      label: "Region",
      type: "select",
      translationKey: "region",
      value: "",
      options: [
        { value: "north", label: "North" },     // → "Norte"
        { value: "south", label: "South" },     // → "Sul"
        { value: "east", label: "East" },       // → "Leste"
        { value: "west", label: "West" },       // → "Oeste"
        { value: "central", label: "Central" }  // → "Central"
      ],
      onChange: (value) => handleFieldChange("region", value)
    },
    {
      id: "subsidized",
      label: "Subsidized", // → "Subsidiado"
      type: "switch",
      translationKey: "subsidized",
      value: false,
      onChange: (value) => handleFieldChange("subsidized", value),
      infoTooltip: "Enable financial support for these churches" // Tooltip traduzido automaticamente
    }
  ]

  // Handlers das ações
  const handleBulkEdit = () => {
    console.log("Bulk editing churches:", selectedItems)
    // Lógica de edição em lote
  }

  const handleBulkDelete = () => {
    console.log("Bulk deleting churches:", selectedItems)
    if (confirm(`Delete ${selectedItems.length} churches?`)) {
      // Lógica de exclusão
      setSelectedItems([])
      setSelectedRows([])
    }
  }

  const handleBulkArchive = () => {
    console.log("Bulk archiving churches:", selectedItems)
    // Lógica de arquivamento
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    console.log(`Updating field ${fieldId} to:`, value)
    // Aplicar mudança a todos os items selecionados
    setSelectedRows(prev => 
      prev.map(row => 
        selectedItems.includes(row.id) 
          ? { ...row, [fieldId]: value }
          : row
      )
    )
  }

  const handleClearSelection = () => {
    setSelectedItems([])
    setSelectedRows([])
  }

  // Resumo com currency (se necessário)
  const calculateSummary = () => {
    return `${selectedRows.length} churches selected from different regions`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Churches Management - Complete i18n Example</h1>
        
        {/* Informações de estado atual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Selected Churches</h3>
            <div className="mt-2 space-y-1">
              {selectedRows.map(row => (
                <div key={row.id} className="text-sm text-gray-600 flex justify-between">
                  <span>{row.name}</span>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row.status === 'active' ? 'bg-green-100 text-green-700' :
                      row.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {row.status}
                    </span>
                    <span className="text-xs text-gray-500">{row.region}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Translation Demo</h3>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>🌐 All labels auto-translate</p>
              <p>📝 Dropdown options translated</p>
              <p>💬 Tooltips in user language</p>
              <p>🔄 Dynamic field support</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-700">Supported Languages</h3>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <p>🇧🇷 Portuguese (pt)</p>
              <p>🇺🇸 English (en)</p>
              <p>🇳🇱 Dutch (nl)</p>
            </div>
          </div>
        </div>

        {/* Simulação de tabela */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Churches List</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Select churches above to see the BatchActionsPanel with complete i18n support.
              All field labels, dropdown options, and tooltips are automatically translated.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Translation Features Demonstrated:</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Status options: Active → Ativo, Pending → Pendente, etc.</li>
                <li>• Priority levels: High → Alta, Medium → Média, Low → Baixa</li>
                <li>• Region names: North → Norte, South → Sul, etc.</li>
                <li>• Field labels: Status → Status, Priority → Prioridade</li>
                <li>• Action buttons: Edit → Editar, Delete → Excluir</li>
                <li>• Tooltips and help text in user's language</li>
                <li>• Currency formatting when applicable</li>
                <li>• Pluralization support (1 item vs multiple items)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BatchActionsPanel com i18n completo */}
      <BatchActionsPanel
        selectedCount={selectedItems.length}
        onClearSelection={handleClearSelection}
        actions={batchActions}
        primaryAction={primaryAction}
        editFields={editFields}
        translationNamespace="churches" // Namespace específico
        summary={calculateSummary()}
        showCurrency={false}
        maxVisibleEditFields={3}
      />
    </div>
  )
}

/**
 * GUIA DE USO DAS TRADUÇÕES:
 * 
 * 1. translationNamespace: Define o namespace para as traduções
 *    - Exemplo: "churches", "users", "projects"
 *    - Fallback automático para "dynamicFields" se não especificado
 * 
 * 2. translationKey no BatchEditField:
 *    - Define a chave base para traduzir o campo
 *    - Exemplo: "status" → busca "churches.status" → fallback "dynamicFields.status"
 * 
 * 3. Opções de dropdown são traduzidas automaticamente:
 *    - "status" + "active" → "churches.statusOptions.active" → "dynamicFields.statusOptions.active"
 * 
 * 4. Tooltips usam traduções de "tooltips.{fieldKey}":
 *    - Exemplo: "tooltips.status" → "Status atual do item"
 * 
 * 5. Pluralização automática:
 *    - "{{count}} items selected" → "{{count}} itens selecionados"
 * 
 * 6. Namespace hierarchy:
 *    - Primeiro: campo específico translationNamespace (ex: "churches")
 *    - Segundo: namespace padrão "dynamicFields"
 *    - Terceiro: fallback hardcoded em inglês
 */