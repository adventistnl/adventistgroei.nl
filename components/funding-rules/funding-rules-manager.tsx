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
  List
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
import { DataTable } from "@/components/ui/data-table"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { KanbanBoard, KanbanGroup, KanbanItem, KanbanAction } from "@/components/ui/kanban-board"

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
  title = "Funding Rules",
  description = "Manage funding rules and groups for subsidy requests",
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
  const [ruleToEdit, setRuleToEdit] = useState<FundingRule | null>(null)
  const [editRuleGroupId, setEditRuleGroupId] = useState<string | null>(null)
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
          description: 'Maximum 65% of total budget'
        },
        {
          id: '2',
          name: 'Maximum Amount',
          type: 'amount',
          condition: 'max_amount',
          value: 5000,
          description: 'Maximum $5,000 per request'
        },
        {
          id: '3',
          name: 'Minimum Activities',
          type: 'number',
          condition: 'min_activities',
          value: 2,
          description: 'At least 2 activities required'
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
          description: 'Only education, recreation, and outreach activities'
        },
        {
          id: '5',
          name: 'Maximum per Month',
          type: 'amount',
          condition: 'max_monthly',
          value: 1500,
          description: 'Maximum $1,500 per month'
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
          description: 'Auto-approve requests under $1,000'
        },
        {
          id: '7',
          name: 'Documentation Required',
          type: 'boolean',
          condition: 'requires_documentation',
          value: true,
          description: 'Documentation required for all requests'
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

  const [ruleFormData, setRuleFormData] = useState<{
    name: string
    type: 'percentage' | 'amount' | 'number' | 'category' | 'boolean'
    condition: string
    value: string
    description: string
  }>({
    name: '',
    type: 'amount',
    condition: '',
    value: '',
    description: ''
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

  const handleCreateRule = () => {
    if (!selectedGroup || !ruleFormData.name || !ruleFormData.condition || !ruleFormData.value) {
      toast.error('Please fill in all required fields')
      return
    }

    const newRule: FundingRule = {
      id: `rule-${Date.now()}`,
      name: ruleFormData.name,
      type: ruleFormData.type,
      condition: ruleFormData.condition,
      value: ['number', 'amount', 'percentage'].includes(ruleFormData.type)
        ? Number(ruleFormData.value) 
        : ruleFormData.type === 'boolean' 
          ? ruleFormData.value === 'true' 
          : ruleFormData.value,
      description: ruleFormData.description
    }

    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === selectedGroup.id
        ? { ...group, rules: [...group.rules, newRule] }
        : group
    )

    setFundingRuleGroups(updatedGroups)
    setIsCreateRuleModalOpen(false)
    resetRuleForm()
    toast.success('Rule added to group successfully')
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
    setFundingRuleGroups(fundingRuleGroups.filter(g => g.id !== groupId))
    toast.success('Funding rule group deleted successfully')
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
    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === groupId
        ? { ...group, rules: group.rules.filter(r => r.id !== ruleId) }
        : group
    )

    setFundingRuleGroups(updatedGroups)
    toast.success('Rule deleted successfully')
  }

  const handleEditRule = (ruleId: string, groupId: string) => {
    const group = fundingRuleGroups.find(g => g.id === groupId)
    const ruleToEdit = group?.rules.find(r => r.id === ruleId)
    
    if (!ruleToEdit || !group) return

    setRuleToEdit(ruleToEdit)
    setEditRuleGroupId(groupId)
    setSelectedGroup(group)
    
    // Populate edit form with existing values
    setRuleFormData({
      name: ruleToEdit.name,
      type: ruleToEdit.type,
      condition: ruleToEdit.condition,
      value: ruleToEdit.type === 'boolean' 
        ? ruleToEdit.value.toString() 
        : Array.isArray(ruleToEdit.value) 
          ? ruleToEdit.value.join(',') 
          : ruleToEdit.value.toString(),
      description: ruleToEdit.description
    })
    
    setIsEditRuleModalOpen(true)
  }

  const handleUpdateRule = () => {
    if (!ruleToEdit || !editRuleGroupId || !ruleFormData.name || !ruleFormData.condition || !ruleFormData.value) {
      toast.error('Please fill in all required fields')
      return
    }

    const updatedRule: FundingRule = {
      ...ruleToEdit,
      name: ruleFormData.name,
      type: ruleFormData.type,
      condition: ruleFormData.condition,
      value: ['number', 'amount', 'percentage'].includes(ruleFormData.type)
        ? Number(ruleFormData.value) 
        : ruleFormData.type === 'boolean' 
          ? ruleFormData.value === 'true' 
          : ruleFormData.type === 'category'
            ? ruleFormData.value.split(',').map(v => v.trim())
            : ruleFormData.value,
      description: ruleFormData.description
    }

    const updatedGroups = fundingRuleGroups.map(group =>
      group.id === editRuleGroupId
        ? { 
            ...group, 
            rules: group.rules.map(rule => 
              rule.id === ruleToEdit.id ? updatedRule : rule
            ) 
          }
        : group
    )

    setFundingRuleGroups(updatedGroups)
    setIsEditRuleModalOpen(false)
    setRuleToEdit(null)
    setEditRuleGroupId(null)
    resetRuleForm()
    toast.success('Rule updated successfully')
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

  const resetRuleForm = () => {
    setRuleFormData({
      name: '',
      type: 'amount',
      condition: '',
      value: '',
      description: ''
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

  // Table columns for groups
  const groupColumns: ColumnDef<FundingRuleGroup>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Group Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full flex-shrink-0" 
            style={{ backgroundColor: row.original.color }}
          />
          <div>
            <div className="font-medium">{row.original.name}</div>
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
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "default" : "secondary"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "rules_count",
      header: "Rules",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.rules.length}</span>
      ),
    },
    {
      id: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        value: formatRuleValue(rule)
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {description}
          </p>
        </div>
        

      </div>

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
          <CardHeader>
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
          <CardContent className="overflow-hidden">
            <DataTable
              columns={groupColumns}
              data={fundingRuleGroups}
              searchKey="name"
              searchPlaceholder="Search rule groups..."
              filterableColumns={[
                {
                  id: "active",
                  title: "Status",
                  options: [
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]
                }
              ]}
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
          <CardContent className="overflow-hidden">
            <KanbanBoard
              groups={kanbanGroups}
              items={kanbanItems}
              actions={kanbanActions}
              onItemMove={handleKanbanItemMove}
              isLoading={isLoading}
              maxHeight="calc(100vh - 300px)"
            />
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
      <Dialog open={isCreateRuleModalOpen} onOpenChange={setIsCreateRuleModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Rule to "{selectedGroup?.name}"</DialogTitle>
            <DialogDescription>
              Add a new funding rule to this group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rule-name">Rule Name *</Label>
              <Input
                id="rule-name"
                value={ruleFormData.name}
                onChange={(e) => setRuleFormData({...ruleFormData, name: e.target.value})}
                placeholder="e.g., Maximum Budget Percentage"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-type">Rule Type *</Label>
              <Select 
                value={ruleFormData.type} 
                onValueChange={(value: any) => setRuleFormData({...ruleFormData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount ($)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-condition">Condition *</Label>
              <Input
                id="rule-condition"
                value={ruleFormData.condition}
                onChange={(e) => setRuleFormData({...ruleFormData, condition: e.target.value})}
                placeholder="e.g., max_percentage, min_amount"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-value">Value *</Label>
              {ruleFormData.type === 'boolean' ? (
                <Select 
                  value={ruleFormData.value} 
                  onValueChange={(value) => setRuleFormData({...ruleFormData, value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="rule-value"
                  value={ruleFormData.value}
                  onChange={(e) => setRuleFormData({...ruleFormData, value: e.target.value})}
                  placeholder={
                    ruleFormData.type === 'amount' ? "5000" :
                    ruleFormData.type === 'percentage' ? "65" :
                    ruleFormData.type === 'number' ? "2" :
                    "education,recreation"
                  }
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rule-description">Description</Label>
              <Textarea
                id="rule-description"
                value={ruleFormData.description}
                onChange={(e) => setRuleFormData({...ruleFormData, description: e.target.value})}
                placeholder="Brief description of this rule"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateRuleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRule}>Add Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Modal */}
      <Dialog open={isEditRuleModalOpen} onOpenChange={setIsEditRuleModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Rule "{ruleToEdit?.name}"</DialogTitle>
            <DialogDescription>
              Update the rule details below
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-name">Rule Name *</Label>
              <Input
                id="edit-rule-name"
                value={ruleFormData.name}
                onChange={(e) => setRuleFormData({...ruleFormData, name: e.target.value})}
                placeholder="e.g., Maximum Budget Percentage"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-type">Rule Type *</Label>
              <Select 
                value={ruleFormData.type} 
                onValueChange={(value: any) => setRuleFormData({...ruleFormData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amount">Amount ($)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-condition">Condition *</Label>
              <Input
                id="edit-rule-condition"
                value={ruleFormData.condition}
                onChange={(e) => setRuleFormData({...ruleFormData, condition: e.target.value})}
                placeholder="e.g., max_percentage, min_amount"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-value">Value *</Label>
              {ruleFormData.type === 'boolean' ? (
                <Select 
                  value={ruleFormData.value} 
                  onValueChange={(value) => setRuleFormData({...ruleFormData, value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="edit-rule-value"
                  value={ruleFormData.value}
                  onChange={(e) => setRuleFormData({...ruleFormData, value: e.target.value})}
                  placeholder={
                    ruleFormData.type === 'amount' ? "5000" :
                    ruleFormData.type === 'percentage' ? "65" :
                    ruleFormData.type === 'number' ? "2" :
                    "education,recreation"
                  }
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-rule-description">Description</Label>
              <Textarea
                id="edit-rule-description"
                value={ruleFormData.description}
                onChange={(e) => setRuleFormData({...ruleFormData, description: e.target.value})}
                placeholder="Brief description of this rule"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRuleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRule}>Update Rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}