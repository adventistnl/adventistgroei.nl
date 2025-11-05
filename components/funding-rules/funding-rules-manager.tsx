"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Settings, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  DollarSign,
  Percent,
  Hash,
  Tag,
  RefreshCw,
  Eye,
  Copy,
  ToggleLeft,
  ToggleRight,
  LayoutGrid,
  List,
  Save,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { UseTable } from "@/components/ui/use-table"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { KanbanBoard, KanbanGroup, KanbanItem, KanbanAction } from "@/components/ui/kanban-board"
import { StatusBadge } from "@/components/ui/status-badge"
import { 
  CreateFundingRuleModal, 
  EditFundingRuleModal, 
  DeleteFundingRuleModal 
} from "@/components/modals/funding-rule"
import { DeleteFundingPolicyGroupModal } from "@/components/modals/funding-policy-group/delete-funding-policy-group-modal"
import { EditFundingPolicyGroupModal } from "@/components/modals/funding-policy-group/edit-funding-policy-group-modal"

// Charts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"

interface FundingRule {
  id: string
  name: string
  type: 'percentage' | 'amount' | 'number' | 'category' | 'boolean'
  condition: string
  value: any
  description: string
  ruleCategory: 'justification' | 'condition'
}

interface FundingRuleGroup {
  id: string
  name: string
  description: string
  color: string
  active: boolean
  created_at: string
  rules: FundingRule[]
}

interface FundingRulesManagerProps {
  /**
   * Context where the component is being used (institution, church, etc.)
   */
  context?: string
  /**
   * Entity ID for which rules are being managed
   */
  entityId?: string
  /**
   * Whether the component is in loading state
   */
  isLoading?: boolean
  /**
   * Callback for refresh action
   */
  onRefresh?: () => void
  /**
   * Custom title for the component
   */
  title?: string
  /**
   * Custom description for the component
   */
  description?: string
  /**
   * Whether to show charts section
   */
  showCharts?: boolean
  /**
   * Whether to show KPI cards
   */
  showKPICards?: boolean
}

export function FundingRulesManager({
  context = "general",
  entityId,
  isLoading = false,
  onRefresh,
  showCharts = true,
  showKPICards = true
}: FundingRulesManagerProps) {
  const { t } = useTranslation()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<FundingRuleGroup | null>(null)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isCreateRuleModalOpen, setIsCreateRuleModalOpen] = useState(false)
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false)
  const [groupToEdit, setGroupToEdit] = useState<FundingRuleGroup | null>(null)
  const [isEditRuleModalOpen, setIsEditRuleModalOpen] = useState(false)
  const [isDeleteRuleModalOpen, setIsDeleteRuleModalOpen] = useState(false)
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false)
  const [ruleToEdit, setRuleToEdit] = useState<FundingRule | null>(null)
  const [ruleToDelete, setRuleToDelete] = useState<FundingRule | null>(null)
  const [groupToDelete, setGroupToDelete] = useState<FundingRuleGroup | null>(null)
  const [editRuleGroupId, setEditRuleGroupId] = useState<string | null>(null)
  const [deleteRuleGroupId, setDeleteRuleGroupId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null)

  // Mock data para grupos de funding rules
  const [fundingRuleGroups, setFundingRuleGroups] = useState<FundingRuleGroup[]>([
    {
      id: '1',
      name: 'Church Plant',
      description: 'Rules for new church plant funding requests',
      color: '#10b981',
      active: true,
      created_at: '2024-01-15',
      rules: [
        {
          id: '1',
          name: 'Budget Limit Percentage',
          type: 'percentage',
          condition: 'max_percentage',
          value: 65,
          description: 'Maximum 65% of total budget',
          ruleCategory: 'condition'
        },
        {
          id: '2',
          name: 'Maximum Amount',
          type: 'amount',
          condition: 'max_amount',
          value: 5000,
          description: 'Maximum $5,000 per request',
          ruleCategory: 'condition'
        },
        {
          id: '3',
          name: 'Minimum Activities',
          type: 'number',
          condition: 'min_activities',
          value: 2,
          description: 'At least 2 activities required',
          ruleCategory: 'condition'
        }
      ]
    },
    {
      id: '2',
      name: 'Youth Ministry',
      description: 'Special rules for youth ministry funding',
      color: '#3b82f6',
      active: true,
      created_at: '2024-02-10',
      rules: [
        {
          id: '4',
          name: 'Activity Type Restriction',
          type: 'category',
          condition: 'allowed_categories',
          value: ['education', 'recreation', 'outreach'],
          description: 'Only education, recreation, and outreach activities',
          ruleCategory: 'condition'
        },
        {
          id: '5',
          name: 'Maximum per Month',
          type: 'amount',
          condition: 'max_monthly',
          value: 1500,
          description: 'Maximum $1,500 per month',
          ruleCategory: 'condition'
        }
      ]
    },
    {
      id: '3',
      name: 'Emergency Fund',
      description: 'Rules for emergency funding requests',
      color: '#ef4444',
      active: true,
      created_at: '2024-03-05',
      rules: [
        {
          id: '6',
          name: 'Immediate Approval Limit',
          type: 'amount',
          condition: 'auto_approve_under',
          value: 1000,
          description: 'Auto-approve requests under $1,000',
          ruleCategory: 'condition'
        },
        {
          id: '7',
          name: 'Documentation Required',
          type: 'boolean',
          condition: 'requires_documentation',
          value: true,
          description: 'Documentation required for all requests',
          ruleCategory: 'justification'
        }
      ]
    }
  ])

  // Form states
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    color: '#10b981'
  })

  // KPI Data
  const kpiData = useMemo(() => {
    const totalGroups = fundingRuleGroups.length
    const activeGroups = fundingRuleGroups.filter(g => g.active).length
    const totalRules = fundingRuleGroups.reduce((sum, g) => sum + g.rules.length, 0)
    return {
      totalGroups,
      activeGroups,
      totalRules
    }
  }, [fundingRuleGroups])

  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_groups",
      title: "Rule Groups",
      value: kpiData.totalGroups,
      icon: Shield,
      subtitle: "Total funding rule groups",
      trend: {
        value: 12,
        isPositive: true,
        label: "vs. last month"
      }
    },
    {
      id: "active_groups",
      title: "Active Groups",
      value: kpiData.activeGroups,
      icon: Settings,
      subtitle: "Currently active groups",
      trend: {
        value: 8,
        isPositive: true,
        label: "vs. last month"
      }
    },
    {
      id: "total_rules",
      title: "Total Rules",
      value: kpiData.totalRules,
      icon: Tag,
      subtitle: "Individual rules across all groups",
      trend: {
        value: 15,
        isPositive: true,
        label: "vs. last month"
      }
    }
  ], [kpiData])

  // Chart data
  const chartData = useMemo(() => {
    return {
      rulesByGroup: fundingRuleGroups.map(g => ({
        group: g.name,
        rules: g.rules.length,
        active: g.active ? g.rules.length : 0
      })),
      rulesByType: [
        { type: 'Amount', count: fundingRuleGroups.flatMap(g => g.rules).filter(r => r.type === 'amount').length },
        { type: 'Percentage', count: fundingRuleGroups.flatMap(g => g.rules).filter(r => r.type === 'percentage').length },
        { type: 'Number', count: fundingRuleGroups.flatMap(g => g.rules).filter(r => r.type === 'number').length },
        { type: 'Category', count: fundingRuleGroups.flatMap(g => g.rules).filter(r => r.type === 'category').length },
        { type: 'Boolean', count: fundingRuleGroups.flatMap(g => g.rules).filter(r => r.type === 'boolean').length }
      ]
    }
  }, [fundingRuleGroups])

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("Refreshing funding rules...")
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (onRefresh) {
        onRefresh()
      }
      toast.success("Funding rules refreshed successfully", { duration: 2000 })
    } catch (error) {
      toast.error("Error refreshing funding rules")
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleCreateGroup = () => {
    if (!groupFormData.name || !groupFormData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const newGroup: FundingRuleGroup = {
      id: `group-${Date.now()}`,
      name: groupFormData.name,
      description: groupFormData.description,
      color: groupFormData.color,
      active: true,
      created_at: new Date().toISOString(),
      rules: []
    }

    setFundingRuleGroups([...fundingRuleGroups, newGroup])
    setIsCreateGroupModalOpen(false)
    resetGroupForm()
    toast.success('Funding rule group created successfully')
  }

  const handleCreateRule = (newRuleData: Omit<FundingRule, 'id'>) => {
    if (!selectedGroup) {
      toast.error('No group selected')
      return
    }

    const newRule: FundingRule = {
      id: `rule-${Date.now()}`,
      ...newRuleData
    }

    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === selectedGroup.id
        ? { ...group, rules: [...group.rules, newRule] }
        : group
    )

    setFundingRuleGroups(updatedGroups)
  }

  const handleToggleGroup = (groupId: string) => {
    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === groupId ? { ...group, active: !group.active } : group
    )
    setFundingRuleGroups(updatedGroups)
    const group = fundingRuleGroups.find(g => g.id === groupId)
    toast.success(`Group ${group?.active ? 'deactivated' : 'activated'} successfully`)
  }

  const handleDeleteGroup = (groupId: string) => {
    const group = fundingRuleGroups.find(g => g.id === groupId)
    if (!group) return
    
    setGroupToDelete(group)
    setIsDeleteGroupModalOpen(true)
  }

  const handleConfirmDeleteGroup = () => {
    if (!groupToDelete) return
    
    setFundingRuleGroups(fundingRuleGroups.filter(g => g.id !== groupToDelete.id))
    setGroupToDelete(null)
    setIsDeleteGroupModalOpen(false)
  }

  const handleUpdateGroup = (updatedGroupData: any) => {
    if (!groupToEdit) return
    
    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === groupToEdit.id
        ? {
            ...group,
            name: updatedGroupData.name,
            description: updatedGroupData.description || '',
            active: updatedGroupData.is_active
          }
        : group
    )
    
    setFundingRuleGroups(updatedGroups)
    setGroupToEdit(null)
    setIsEditGroupModalOpen(false)
  }

  const handleDuplicateRule = (ruleId: string, groupId: string) => {
    const group = fundingRuleGroups.find(g => g.id === groupId)
    const ruleToDuplicate = group?.rules.find(r => r.id === ruleId)
    
    if (!ruleToDuplicate) return

    const duplicatedRule: FundingRule = {
      ...ruleToDuplicate,
      id: `rule-${Date.now()}`,
      name: `${ruleToDuplicate.name} (Copy)`
    }

    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === groupId
        ? { ...group, rules: [...group.rules, duplicatedRule] }
        : group
    )

    setFundingRuleGroups(updatedGroups)
    toast.success('Rule duplicated successfully')
  }

  const handleDeleteRule = (ruleId: string, groupId: string) => {
    const group = fundingRuleGroups.find(g => g.id === groupId)
    const ruleToDelete = group?.rules.find(r => r.id === ruleId)
    
    if (!ruleToDelete || !group) return

    setRuleToDelete(ruleToDelete)
    setDeleteRuleGroupId(groupId)
    setIsDeleteRuleModalOpen(true)
  }

  const handleConfirmDeleteRule = () => {
    if (!ruleToDelete || !deleteRuleGroupId) return

    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === deleteRuleGroupId
        ? { ...group, rules: group.rules.filter(r => r.id !== ruleToDelete.id) }
        : group
    )

    setFundingRuleGroups(updatedGroups)
    setRuleToDelete(null)
    setDeleteRuleGroupId(null)
    toast.success('Rule deleted successfully')
  }

  const handleEditRule = (ruleId: string, groupId: string) => {
    const group = fundingRuleGroups.find(g => g.id === groupId)
    const ruleToEdit = group?.rules.find(r => r.id === ruleId)
    
    if (!ruleToEdit || !group) return

    setRuleToEdit(ruleToEdit)
    setEditRuleGroupId(groupId)
    setSelectedGroup(group)
    setIsEditRuleModalOpen(true)
  }

  const handleUpdateRule = (updatedRule: FundingRule) => {
    if (!editRuleGroupId) {
      toast.error('No group selected')
      return
    }

    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === editRuleGroupId
        ? { 
            ...group, 
            rules: group.rules.map(rule => 
              rule.id === updatedRule.id ? updatedRule : rule
            ) 
          }
        : group
    )

    setFundingRuleGroups(updatedGroups)
    setEditRuleGroupId(null)
  }

  const handleMoveRule = (ruleId: string, fromGroupId: string, toGroupId: string) => {
    const updatedGroups = fundingRuleGroups.map(group => {
      if (group.id === fromGroupId) {
        return {
          ...group,
          rules: group.rules.filter(rule => rule.id !== ruleId)
        }
      }
      if (group.id === toGroupId) {
        const ruleToMove = fundingRuleGroups
          .find(g => g.id === fromGroupId)
          ?.rules.find(r => r.id === ruleId)
        
        if (ruleToMove) {
          return {
            ...group,
            rules: [...group.rules, ruleToMove]
          }
        }
      }
      return group
    })
    
    setFundingRuleGroups(updatedGroups)
    toast.success('Rule moved successfully')
  }

  const resetGroupForm = () => {
    setGroupFormData({
      name: '',
      description: '',
      color: '#10b981'
    })
  }

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'amount': return DollarSign
      case 'percentage': return Percent
      case 'number': return Hash
      case 'category': return Tag
      case 'boolean': return Shield
      default: return Tag
    }
  }

  const formatRuleValue = (rule: FundingRule) => {
    switch (rule.type) {
      case 'amount': return `$${rule.value.toLocaleString()}`
      case 'percentage': return `${rule.value}%`
      case 'boolean': return rule.value ? 'Yes' : 'No'
      case 'category': return Array.isArray(rule.value) ? rule.value.join(', ') : rule.value
      default: return rule.value
    }
  }

  // Table columns for groups - Minimalista e Responsivo com UseTable
  const groupColumns: ColumnDef<FundingRuleGroup>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Group Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0" 
            style={{ backgroundColor: row.original.color }}
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">
              {row.original.rules.length} rule{row.original.rules.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-md truncate">
          {row.original.description || '—'}
        </div>
      ),
    },
    {
      id: "rules_count",
      accessorKey: "rules",
      header: "Rules",
      cell: ({ row }) => (
        <StatusBadge 
          label={`${row.original.rules.length}`}
          variant="neutral"
          size="sm"
        />
      ),
    },
    {
      id: "status",
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge 
          label={row.original.active ? "Active" : "Inactive"}
          variant={row.original.active ? "success" : "neutral"}
          showDot
          size="sm"
        />
      ),
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(row.original.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end" data-action-button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setSelectedGroup(row.original)
                setIsCreateRuleModalOpen(true)
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Rule
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleGroup(row.original.id)}>
                {row.original.active ? (
                  <ToggleLeft className="w-4 h-4 mr-2" />
                ) : (
                  <ToggleRight className="w-4 h-4 mr-2" />
                )}
                {row.original.active ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setGroupToEdit(row.original)
                setIsEditGroupModalOpen(true)
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Group
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteGroup(row.original.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  // Convert funding rule groups to Kanban groups
  const kanbanGroups: KanbanGroup[] = fundingRuleGroups.map(group => ({
    id: group.id,
    name: group.name,
    description: group.description,
    color: group.color,
    active: group.active
  }))

  // Convert funding rules to Kanban items
  const kanbanItems: KanbanItem[] = fundingRuleGroups.flatMap(group =>
    group.rules.map(rule => ({
      id: rule.id,
      groupId: group.id,
      title: rule.name,
      description: rule.description,
      icon: getRuleTypeIcon(rule.type),
      metadata: {
        type: rule.type,
        condition: rule.condition,
        value: formatRuleValue(rule),
        ruleCategory: rule.ruleCategory
      }
    }))
  )

  // Define Kanban actions
  const kanbanActions: KanbanAction[] = [
    {
      id: 'add-rule',
      label: 'Add Rule',
      icon: Plus,
      showInGroup: true,
      onClick: (group) => {
        const fundingGroup = fundingRuleGroups.find(g => g.id === group.id)
        if (fundingGroup) {
          setSelectedGroup(fundingGroup)
          setIsCreateRuleModalOpen(true)
        }
      }
    },
    {
      id: 'toggle-group',
      label: 'Toggle Status',
      icon: ToggleLeft,
      showInGroup: true,
      onClick: (group) => handleToggleGroup(group.id)
    },
    {
      id: 'edit-group',
      label: 'Edit Group',
      icon: Edit,
      showInGroup: true,
      onClick: (group) => {
        const fundingGroup = fundingRuleGroups.find(g => g.id === group.id)
        if (fundingGroup) {
          setGroupToEdit(fundingGroup)
          setIsEditGroupModalOpen(true)
        }
      }
    },
    {
      id: 'delete-group',
      label: 'Delete Group',
      icon: Trash2,
      variant: 'destructive',
      showInGroup: true,
      onClick: (group) => handleDeleteGroup(group.id)
    },
    {
      id: 'edit-rule',
      label: 'Edit Rule',
      icon: Edit,
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id && group?.id) {
          handleEditRule(item.id, group.id)
        }
      }
    },
    {
      id: 'duplicate-rule',
      label: 'Duplicate',
      icon: Copy,
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id && group?.id) {
          handleDuplicateRule(item.id, group.id)
        }
      }
    },
    {
      id: 'delete-rule',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id && group?.id) {
          handleDeleteRule(item.id, group.id)
        }
      }
    },
    {
      id: 'create-group',
      label: 'Create Group',
      icon: Plus,
      onClick: () => setIsCreateGroupModalOpen(true)
    }
  ]

  // Handle rule movement between groups
  const handleKanbanItemMove = (itemId: string, fromGroupId: string, toGroupId: string) => {
    handleMoveRule(itemId, fromGroupId, toGroupId)
  }

  // Custom Kanban Item Renderer with StatusBadge
  const renderKanbanItem = (item: KanbanItem, group: KanbanGroup, dragHandlers?: any) => {
    const IconComponent = item.icon
    const groupActions = kanbanActions.filter(action => action.showInItem)
    const ruleCategory = item.metadata?.ruleCategory || 'condition'
    
    return (
      <Card 
        key={item.id}
        className={`relative w-full p-3 border hover:border-foreground/20 transition-all duration-200 bg-card/50 cursor-grab active:cursor-grabbing hover:shadow-sm ${
          dragHandlers?.className || ''
        }`}
        {...dragHandlers}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {IconComponent && (
              <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0 space-y-1.5">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">{item.title}</h4>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Rule Type Badge - monocromático */}
                {item.metadata?.type && (
                  <StatusBadge 
                    label={item.metadata.type}
                    variant="neutral"
                    size="sm"
                  />
                )}
                
                {/* Rule Category Badge - monocromático */}
                <StatusBadge 
                  label={ruleCategory === 'justification' ? 'Justification' : 'Condition'}
                  variant="neutral"
                  size="sm"
                />
              </div>
            </div>
          </div>
          
          {groupActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {groupActions.map((action) => (
                  <DropdownMenuItem 
                    key={action.id}
                    onClick={() => action.onClick(group, item)}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </Card>
    )
  }

  // Handler for saving Kanban changes
  const handleSaveKanbanChanges = async (changes: Array<{
    itemId: string
    fromGroupId: string
    toGroupId: string
  }>) => {
    // Simulate API call to save rule movements
    // In production, this would update the backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update the state with the changes
    const updatedGroups = fundingRuleGroups.map(group => {
      const updatedRules = [...group.rules]
      
      changes.forEach(change => {
        // Remove rule from old group
        const ruleIndex = updatedRules.findIndex(r => r.id === change.itemId)
        if (ruleIndex >= 0 && group.id === change.fromGroupId) {
          updatedRules.splice(ruleIndex, 1)
        }
        
        // Add rule to new group
        if (group.id === change.toGroupId) {
          const rule = fundingRuleGroups
            .flatMap(g => g.rules)
            .find(r => r.id === change.itemId)
          if (rule) {
            updatedRules.push(rule)
          }
        }
      })
      
      return { ...group, rules: updatedRules }
    })
    
    setFundingRuleGroups(updatedGroups)
  }

  // View Toggle Component
  const ViewToggle = () => (
    <div className="flex items-center border rounded-md">
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('table')}
        className="rounded-r-none border-r"
      >
        <List className="w-4 h-4 mr-2" />
        Table
      </Button>
      <Button
        variant={viewMode === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('kanban')}
        className="rounded-l-none"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Kanban
      </Button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      {showKPICards && (
        <>
          <KPICards 
            data={kpiCardsData}
            isLoading={isLoading}
            minCardsForCarousel={3}
            showCarousel={true}
          />
          <Separator />
        </>
      )}

      {/* Charts Section */}
      {showCharts && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rules by Group Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Rules by Group
                </CardTitle>
                <CardDescription>Number of rules in each funding group</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  config={{
                    rules: { label: "Rules", color: "#10b981" },
                    active: { label: "Active Rules", color: "#3b82f6" }
                  }} 
                  className="h-[300px] w-full"
                >
                  <BarChart data={chartData.rulesByGroup}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="group" fontSize={11} />
                    <YAxis fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="rules" fill="#10b981" radius={4} />
                    <Bar dataKey="active" fill="#3b82f6" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Rules by Type Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Rules by Type
                </CardTitle>
                <CardDescription>Distribution of rule types across all groups</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  config={{
                    count: { label: "Count", color: "#8b5cf6" }
                  }} 
                  className="h-[300px] w-full"
                >
                  <RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={chartData.rulesByType}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {chartData.rulesByType.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <Separator />
        </div>
      )}

      {/* Funding Rule Groups - Table or Kanban View */}
      {viewMode === 'table' ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Funding Rule Groups
                </CardTitle>
                <CardDescription>
                  Manage funding rule groups and individual rules for subsidy requests
                </CardDescription>
              </div>
              
              <ViewToggle />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <UseTable
              columns={groupColumns}
              data={fundingRuleGroups}
              searchKey="name"
              filters={[
                {
                  id: "active",
                  title: "Status",
                  options: [
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]
                }
              ]}
              onRowClick={(row) => setSelectedGroup(row)}
              emptyEntityName="funding rule groups"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5" />
                  Funding Rule Groups - Kanban View
                </CardTitle>
                <CardDescription>
                  Drag and drop interface to manage rule groups and individual rules
                </CardDescription>
              </div>
              
              <ViewToggle />
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden">
            <div className="w-full overflow-hidden">
              <KanbanBoard
                groups={kanbanGroups}
                items={kanbanItems}
                actions={kanbanActions}
                onItemMove={handleKanbanItemMove}
                onSaveChanges={handleSaveKanbanChanges}
                renderItem={renderKanbanItem}
                isLoading={isLoading}
                maxHeight="calc(100vh - 300px)"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Group Rules */}
      {selectedGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: selectedGroup.color }}
              />
              Rules in "{selectedGroup.name}"
            </CardTitle>
            <CardDescription>
              Individual rules within the selected funding group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedGroup.rules.map((rule) => {
                const IconComponent = getRuleTypeIcon(rule.type)
                return (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {formatRuleValue(rule)}
                      </Badge>
                    </div>
                  </div>
                )
              })}
              {selectedGroup.rules.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No rules in this group yet. Click "Add Rule" to create the first rule.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Group Modal */}
      <Dialog open={isCreateGroupModalOpen} onOpenChange={setIsCreateGroupModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Funding Rule Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize related funding rules.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Group Name *</Label>
              <Input
                id="group-name"
                value={groupFormData.name}
                onChange={(e) => setGroupFormData({...groupFormData, name: e.target.value})}
                placeholder="e.g., Church Plant, Youth Ministry"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group-description">Description *</Label>
              <Textarea
                id="group-description"
                value={groupFormData.description}
                onChange={(e) => setGroupFormData({...groupFormData, description: e.target.value})}
                placeholder="Brief description of this rule group"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="group-color">Group Color</Label>
              <Input
                id="group-color"
                type="color"
                value={groupFormData.color}
                onChange={(e) => setGroupFormData({...groupFormData, color: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGroupModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Rule Modal */}
      <CreateFundingRuleModal
        isOpen={isCreateRuleModalOpen}
        onOpenChange={setIsCreateRuleModalOpen}
        onSuccess={handleCreateRule}
        groupName={selectedGroup?.name}
      />

      {/* Edit Rule Modal */}
      <EditFundingRuleModal
        isOpen={isEditRuleModalOpen}
        onOpenChange={setIsEditRuleModalOpen}
        onSuccess={handleUpdateRule}
        rule={ruleToEdit}
        groupName={selectedGroup?.name}
      />

      {/* Delete Rule Modal */}
      <DeleteFundingRuleModal
        isOpen={isDeleteRuleModalOpen}
        onOpenChange={setIsDeleteRuleModalOpen}
        onConfirm={handleConfirmDeleteRule}
        rule={ruleToDelete}
        groupName={fundingRuleGroups.find(g => g.id === deleteRuleGroupId)?.name}
      />

      {/* Delete Group Modal */}
      <DeleteFundingPolicyGroupModal
        isOpen={isDeleteGroupModalOpen}
        onOpenChange={setIsDeleteGroupModalOpen}
        group={groupToDelete ? {
          id: groupToDelete.id,
          name: groupToDelete.name,
          entity_id: entityId || null,
          description: groupToDelete.description || null,
          is_active: groupToDelete.active,
          created_at: groupToDelete.created_at,
          updated_at: groupToDelete.created_at,
          created_by: 'system'
        } : null}
        validations={groupToDelete?.rules.map(rule => ({
          id: rule.id,
          group_id: groupToDelete.id,
          field_name: rule.name.toLowerCase().replace(/\s+/g, '_'),
          field_label: rule.name,
          field_type: rule.type === 'amount' ? 'NUMBER' : rule.type === 'percentage' ? 'NUMBER' : rule.type === 'boolean' ? 'BOOLEAN' : 'TEXT',
          is_required: true,
          options: Array.isArray(rule.value) ? rule.value : null,
          created_at: groupToDelete.created_at,
          updated_at: groupToDelete.created_at,
          created_by: 'system'
        })) || []}
        usageCount={0}
        onSuccess={handleConfirmDeleteGroup}
      />

      {/* Edit Group Modal */}
      <EditFundingPolicyGroupModal
        isOpen={isEditGroupModalOpen}
        onOpenChange={setIsEditGroupModalOpen}
        group={groupToEdit ? {
          id: groupToEdit.id,
          name: groupToEdit.name,
          entity_id: entityId || null,
          description: groupToEdit.description || null,
          is_active: groupToEdit.active,
          created_at: groupToEdit.created_at,
          updated_at: groupToEdit.created_at,
          created_by: 'system'
        } : null}
        validations={groupToEdit?.rules.map(rule => ({
          id: rule.id,
          group_id: groupToEdit.id,
          field_name: rule.name.toLowerCase().replace(/\s+/g, '_'),
          field_label: rule.name,
          field_type: rule.type === 'amount' ? 'NUMBER' : rule.type === 'percentage' ? 'NUMBER' : rule.type === 'boolean' ? 'BOOLEAN' : 'TEXT',
          is_required: true,
          options: Array.isArray(rule.value) ? rule.value : null,
          created_at: groupToEdit.created_at,
          updated_at: groupToEdit.created_at,
          created_by: 'system'
        })) || []}
        onSuccess={handleUpdateGroup}
      />
    </div>
  )
}