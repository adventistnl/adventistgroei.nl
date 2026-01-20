/**
 * BATCH ACTIONS CONFIGURATION
 * 
 * This file contains configuration examples for different contexts
 * where the BatchActionsPanel might be used.
 */

import { BatchAction, BatchEditField } from "@/components/shared/batch-actions-panel-responsive"
import { 
  Trash2, Edit, Archive, Download, Copy, Move, Settings, 
  Users, Building, MapPin, Calendar, DollarSign, FileText,
  Mail, Phone, Globe, Lock, Unlock, Star, Heart, Flag
} from "lucide-react"

// Configuration for different application contexts
export const BatchActionsConfigurations = {
  // Churches Management
  churches: {
    actions: [
      {
        id: "edit",
        label: "Edit Churches",
        icon: <Edit className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Churches",
        icon: <Archive className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "export",
        label: "Export Data",
        icon: <Download className="w-4 h-4" />,
        onClick: () => {},
      },
    ] as BatchAction[],
    editFields: [
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "under_construction", label: "Under Construction" }
        ],
        onBatchChange: () => {}
      },
      {
        id: "region",
        label: "Region",
        type: "select",
        options: [
          { value: "north", label: "North Region" },
          { value: "south", label: "South Region" },
          { value: "east", label: "East Region" },
          { value: "west", label: "West Region" }
        ],
        onBatchChange: () => {}
      }
    ] as BatchEditField[],
    namespace: "churches"
  },

  // Users Management
  users: {
    actions: [
      {
        id: "activate",
        label: "Activate Users",
        icon: <Unlock className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "deactivate",
        label: "Deactivate Users",
        icon: <Lock className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "assign_role",
        label: "Assign Role",
        icon: <Users className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "send_email",
        label: "Send Email",
        icon: <Mail className="w-4 h-4" />,
        onClick: () => {},
      },
    ] as BatchAction[],
    editFields: [
      {
        id: "role",
        label: "Role",
        type: "select",
        options: [
          { value: "admin", label: "Administrator" },
          { value: "manager", label: "Manager" },
          { value: "user", label: "User" },
          { value: "viewer", label: "Viewer" }
        ],
        onBatchChange: () => {}
      },
      {
        id: "department",
        label: "Department",
        type: "select",
        options: [
          { value: "finance", label: "Finance" },
          { value: "hr", label: "Human Resources" },
          { value: "it", label: "Information Technology" },
          { value: "operations", label: "Operations" }
        ],
        onBatchChange: () => {}
      }
    ] as BatchEditField[],
    namespace: "users"
  },

  // Projects Management
  projects: {
    actions: [
      {
        id: "update_status",
        label: "Update Status",
        icon: <Flag className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "assign_manager",
        label: "Assign Manager",
        icon: <Users className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "set_budget",
        label: "Set Budget",
        icon: <DollarSign className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "export_report",
        label: "Export Report",
        icon: <FileText className="w-4 h-4" />,
        onClick: () => {},
      },
    ] as BatchAction[],
    editFields: [
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "planning", label: "Planning" },
          { value: "in_progress", label: "In Progress" },
          { value: "completed", label: "Completed" },
          { value: "on_hold", label: "On Hold" }
        ],
        onBatchChange: () => {}
      },
      {
        id: "priority",
        label: "Priority",
        type: "select",
        options: [
          { value: "high", label: "High Priority" },
          { value: "medium", label: "Medium Priority" },
          { value: "low", label: "Low Priority" }
        ],
        onBatchChange: () => {}
      },
      {
        id: "budget",
        label: "Budget",
        type: "text",
        placeholder: "Enter budget amount...",
        onBatchChange: () => {}
      }
    ] as BatchEditField[],
    namespace: "projects"
  },

  // Finance Management
  finance: {
    actions: [
      {
        id: "approve",
        label: "Approve Transactions",
        icon: <Star className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "reject",
        label: "Reject Transactions",
        icon: <Trash2 className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "export_statement",
        label: "Export Statement",
        icon: <Download className="w-4 h-4" />,
        onClick: () => {},
      },
    ] as BatchAction[],
    editFields: [
      {
        id: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "income", label: "Income" },
          { value: "expense", label: "Expense" },
          { value: "transfer", label: "Transfer" }
        ],
        onBatchChange: () => {}
      },
      {
        id: "approval_status",
        label: "Approval Status",
        type: "select",
        options: [
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" }
        ],
        onBatchChange: () => {}
      }
    ] as BatchEditField[],
    namespace: "finance"
  },

  // Events Management
  events: {
    actions: [
      {
        id: "publish",
        label: "Publish Events",
        icon: <Globe className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "schedule",
        label: "Schedule Events",
        icon: <Calendar className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "duplicate",
        label: "Duplicate Events",
        icon: <Copy className="w-4 h-4" />,
        onClick: () => {},
      },
    ] as BatchAction[],
    editFields: [
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
          { value: "cancelled", label: "Cancelled" }
        ],
        onBatchChange: () => {}
      },
      {
        id: "venue",
        label: "Venue",
        type: "select",
        options: [
          { value: "church", label: "Church" },
          { value: "community_center", label: "Community Center" },
          { value: "online", label: "Online" }
        ],
        onBatchChange: () => {}
      }
    ] as BatchEditField[],
    namespace: "events"
  },

  // Institutions Management
  institutions: {
    actions: [
      {
        id: "update_info",
        label: "Update Information",
        icon: <Building className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "set_location",
        label: "Set Location",
        icon: <MapPin className="w-4 h-4" />,
        onClick: () => {},
      },
      {
        id: "manage_contacts",
        label: "Manage Contacts",
        icon: <Phone className="w-4 h-4" />,
        onClick: () => {},
      },
    ] as BatchAction[],
    editFields: [
      {
        id: "type",
        label: "Institution Type",
        type: "select",
        options: [
          { value: "conference", label: "Conference" },
          { value: "union", label: "Union" },
          { value: "division", label: "Division" }
        ],
        onBatchChange: () => {}
      },
      {
        id: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" }
        ],
        onBatchChange: () => {}
      }
    ] as BatchEditField[],
    namespace: "institutions"
  }
}

// Responsive breakpoint configurations
export const ResponsiveConfigurations = {
  // Mobile-first configuration
  mobile: {
    maxVisibleActions: 2,
    maxVisibleEditFields: 2,
    showSummaryInHeader: true,
    minimizeByDefault: false,
    heightPercent: 80 // 80% of screen height
  },

  // Tablet configuration
  tablet: {
    maxVisibleActions: 4,
    maxVisibleEditFields: 3,
    showSummaryInHeader: false,
    minimizeByDefault: false,
    heightPercent: 60 // 60% of screen height
  },

  // Desktop configuration
  desktop: {
    maxVisibleActions: 6,
    maxVisibleEditFields: 4,
    showSummaryInHeader: false,
    minimizeByDefault: false,
    heightPercent: 40 // 40% of screen height
  }
}

// Currency configurations for different contexts
export const CurrencyConfigurations = {
  // Standard financial display
  standard: {
    showCurrency: true,
    currencyPosition: "prefix", // or "suffix"
    showCurrencySymbol: true,
    decimalPlaces: 2
  },

  // Budget/planning display
  budget: {
    showCurrency: true,
    currencyPosition: "prefix",
    showCurrencySymbol: true,
    decimalPlaces: 0, // Rounded for budget planning
    showThousandsSeparator: true
  },

  // Simple numeric display
  simple: {
    showCurrency: false,
    decimalPlaces: 0
  }
}

// Translation namespace configurations
export const TranslationNamespaces = {
  churches: "churches",
  users: "users", 
  projects: "projects",
  finance: "finance",
  events: "events",
  institutions: "institutions",
  general: "batch-actions" // Default namespace
}

// Usage example function
export function getBatchConfiguration(context: keyof typeof BatchActionsConfigurations) {
  const config = BatchActionsConfigurations[context]
  if (!config) {
    throw new Error(`Batch configuration not found for context: ${context}`)
  }
  return config
}

// Hook for responsive configuration
export function useResponsiveConfig() {
  // This would typically use a hook to detect screen size
  // For now, return desktop config as default
  return ResponsiveConfigurations.desktop
}