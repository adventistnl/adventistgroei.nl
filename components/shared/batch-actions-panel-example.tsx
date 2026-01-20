/**
 * BATCH ACTIONS PANEL - RESPONSIVE EXAMPLE USAGE
 * 
 * This file demonstrates how to use the new responsive BatchActionsPanel
 * with complete i18n support and currency integration.
 */

import React, { useState } from "react"
import { Trash2, Edit, Archive, Download, Copy, Move, Settings } from "lucide-react"
import { BatchActionsPanelResponsive, BatchAction } from "@/components/shared/batch-actions-panel-responsive"
import { BatchEditField } from "@/components/shared/inline-batch-editor"

// Example usage in a data table or list component
export function ExampleBatchActionsUsage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  // Define available actions with i18n support
  const batchActions: BatchAction[] = [
    {
      id: "edit",
      label: "Edit Items", // This will be replaced by translation
      icon: <Edit className="w-4 h-4" />,
      onClick: () => handleBulkEdit(),
    },
    {
      id: "duplicate",
      label: "Duplicate", // This will be replaced by translation
      icon: <Copy className="w-4 h-4" />,
      onClick: () => handleBulkDuplicate(),
    },
    {
      id: "archive",
      label: "Archive", // This will be replaced by translation
      icon: <Archive className="w-4 h-4" />,
      onClick: () => handleBulkArchive(),
    },
    {
      id: "export",
      label: "Export", // This will be replaced by translation
      icon: <Download className="w-4 h-4" />,
      onClick: () => handleBulkExport(),
    },
    {
      id: "move",
      label: "Move to Folder", // This will be replaced by translation
      icon: <Move className="w-4 h-4" />,
      onClick: () => handleBulkMove(),
    },
    {
      id: "settings",
      label: "Bulk Settings", // This will be replaced by translation
      icon: <Settings className="w-4 h-4" />,
      onClick: () => handleBulkSettings(),
    },
  ]

  // Primary action (most common action)
  const primaryAction: BatchAction = {
    id: "delete",
    label: "Delete Selected", // This will be replaced by translation
    icon: <Trash2 className="w-4 h-4" />,
    onClick: () => handleBulkDelete(),
    variant: "destructive"
  }

  // Define batch edit fields for inline editing
  const editFields: BatchEditField[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" }
      ],
      onBatchChange: (fieldId, value) => handleBatchFieldChange(fieldId, value)
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "project", label: "Project" },
        { value: "task", label: "Task" },
        { value: "event", label: "Event" }
      ],
      onBatchChange: (fieldId, value) => handleBatchFieldChange(fieldId, value)
    },
    {
      id: "priority",
      label: "Priority",
      type: "select",
      options: [
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" }
      ],
      onBatchChange: (fieldId, value) => handleBatchFieldChange(fieldId, value)
    },
    {
      id: "tags",
      label: "Tags",
      type: "text",
      placeholder: "Add tags...",
      onBatchChange: (fieldId, value) => handleBatchFieldChange(fieldId, value)
    }
  ]

  // Calculate summary with currency support
  const calculateSummary = () => {
    if (selectedRows.length === 0) return null
    
    // Example: Calculate total value of selected items
    const totalValue = selectedRows.reduce((sum, row) => sum + (row.value || 0), 0)
    const averageValue = totalValue / selectedRows.length
    
    return `Total: ${totalValue.toFixed(2)} • Average: ${averageValue.toFixed(2)}`
  }

  // Action handlers
  const handleBulkEdit = () => {
    console.log("Bulk editing items:", selectedItems)
    // Implement bulk edit logic
  }

  const handleBulkDelete = () => {
    console.log("Bulk deleting items:", selectedItems)
    // Implement bulk delete logic with confirmation
    if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      // Delete logic here
      setSelectedItems([])
      setSelectedRows([])
    }
  }

  const handleBulkDuplicate = () => {
    console.log("Bulk duplicating items:", selectedItems)
    // Implement bulk duplicate logic
  }

  const handleBulkArchive = () => {
    console.log("Bulk archiving items:", selectedItems)
    // Implement bulk archive logic
  }

  const handleBulkExport = () => {
    console.log("Bulk exporting items:", selectedItems)
    // Implement bulk export logic
  }

  const handleBulkMove = () => {
    console.log("Bulk moving items:", selectedItems)
    // Implement bulk move logic
  }

  const handleBulkSettings = () => {
    console.log("Bulk settings for items:", selectedItems)
    // Implement bulk settings logic
  }

  const handleBatchFieldChange = (fieldId: string, value: any) => {
    console.log("Batch field change:", { fieldId, value, selectedItems })
    // Implement batch field update logic
    // This should update all selected items with the new field value
  }

  const handleClearSelection = () => {
    setSelectedItems([])
    setSelectedRows([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your main content here */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Batch Actions Panel Example</h1>
        
        {/* Example: Simulate some selected items */}
        <div className="space-y-2">
          <button
            onClick={() => {
              setSelectedItems(["1", "2", "3"])
              setSelectedRows([
                { id: "1", name: "Item 1", value: 100 },
                { id: "2", name: "Item 2", value: 250 },
                { id: "3", name: "Item 3", value: 300 }
              ])
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Select 3 Items (with values)
          </button>
          
          <button
            onClick={() => {
              setSelectedItems(["1", "2", "3", "4", "5", "6", "7"])
              setSelectedRows([
                { id: "1", name: "Item 1", value: 100 },
                { id: "2", name: "Item 2", value: 250 },
                { id: "3", name: "Item 3", value: 300 },
                { id: "4", name: "Item 4", value: 150 },
                { id: "5", name: "Item 5", value: 200 },
                { id: "6", name: "Item 6", value: 175 },
                { id: "7", name: "Item 7", value: 225 }
              ])
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
          >
            Select 7 Items (test overflow)
          </button>
          
          <button
            onClick={handleClearSelection}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
          >
            Clear Selection
          </button>
        </div>
        
        {/* Show current selection */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Current Selection:</h3>
          <p>Selected IDs: {selectedItems.join(", ") || "None"}</p>
          <p>Selected Count: {selectedItems.length}</p>
        </div>
        
        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Select items above to see the batch actions panel appear</li>
            <li>• Test on different screen sizes (mobile, tablet, desktop)</li>
            <li>• On mobile: Panel takes 80% of screen height</li>
            <li>• Try the inline batch editor fields</li>
            <li>• Test the minimize/expand functionality</li>
            <li>• Check currency formatting in summary (if enabled)</li>
            <li>• Verify overflow menu behavior with many actions</li>
          </ul>
        </div>
      </div>

      {/* The Responsive Batch Actions Panel */}
      <BatchActionsPanelResponsive
        selectedCount={selectedItems.length}
        onClearSelection={handleClearSelection}
        actions={batchActions}
        primaryAction={primaryAction}
        editFields={editFields}
        maxVisibleEditFields={3}
        summary={calculateSummary()}
        showCurrency={true}
        translationNamespace="example" // Use custom namespace
        // forceMobileLayout={false} // Set to true to force mobile layout for testing
      />
    </div>
  )
}

/**
 * INTEGRATION EXAMPLES FOR DIFFERENT CONTEXTS
 */

// Example 1: Simple usage without inline editing
export function SimpleBatchActionsExample() {
  const [selectedCount, setSelectedCount] = useState(0)

  const simpleActions: BatchAction[] = [
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => console.log("Delete action")
    }
  ]

  return (
    <BatchActionsPanelResponsive
      selectedCount={selectedCount}
      onClearSelection={() => setSelectedCount(0)}
      actions={simpleActions}
    />
  )
}

// Example 2: With currency integration
export function CurrencyBatchActionsExample() {
  const [selectedCount, setSelectedCount] = useState(5)
  const totalValue = 1250.75

  return (
    <BatchActionsPanelResponsive
      selectedCount={selectedCount}
      onClearSelection={() => setSelectedCount(0)}
      actions={[]}
      summary={`Total selected value: ${totalValue}`}
      showCurrency={true}
      translationNamespace="finance"
    />
  )
}

// Example 3: Mobile-focused layout
export function MobileBatchActionsExample() {
  const [selectedCount, setSelectedCount] = useState(3)

  return (
    <BatchActionsPanelResponsive
      selectedCount={selectedCount}
      onClearSelection={() => setSelectedCount(0)}
      actions={[
        {
          id: "edit",
          label: "Edit",
          icon: <Edit className="w-4 h-4" />,
          onClick: () => console.log("Edit")
        }
      ]}
      forceMobileLayout={true} // Always use mobile layout
    />
  )
}