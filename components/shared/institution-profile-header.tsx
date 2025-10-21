"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Building,
  Home,
  Globe,
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Layers,
} from "lucide-react"
import { Separator } from "@radix-ui/react-separator"
import { InstitutionById_institution } from "@/types/InstitutionById"
import { AnnualBudgetViewEditModal } from "@/components/modals/annual-budget"
import type { AnnualBudgetData } from "@/components/modals/annual-budget"

export interface InstitutionProfileHeaderProps {
  institution: InstitutionById_institution
  showBackButton?: boolean
  onBack?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onViewContact?: () => void
  onManageChurches?: () => void
  onManageDepartments?: () => void
  onImageUpload?: (file: File) => void
  onImageRemove?: () => void
  className?: string
}

export function InstitutionProfileHeader({
  institution,
  showBackButton = false,
  onBack,
  onEdit,
  onDelete,
  onViewContact,
  onManageChurches,
  onManageDepartments,
  onImageUpload,
  onImageRemove,
  className = ""
}: InstitutionProfileHeaderProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  // Example budget data (in real app, this would come from props or API)
  const exampleBudget: AnnualBudgetData = {
    id: "budget-2024",
    year: 2024,
    planned_budget: 150000,
    total_expenses: 85000,
    balance: 65000,
    notes: "Annual operational budget for institutional activities and programs.",
    status: "approved",
    approved_by: "admin",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-06-20T14:15:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false
  }

  if (!institution) return <div>Institution not found</div>

  const organizationStats = [
    {
      icon: Home,
      label: "Churches", 
      value: institution.churches_count || 0,
      color: "text-blue-600"
    },
    {
      icon: Layers,
      label: "Departments",
      value: institution.departments_count || 0,
      color: "text-emerald-600"
    },
    {
      icon: Users,
      label: "Users",
      value: institution.users_count || 0,
      color: "text-purple-600"
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Back Button */}
      {showBackButton && onBack && (
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      )}

      {/* Institution Header */}
      <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Side - Institution Info */}
            <div className="flex-1 w-full">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative h-50 sm:h-50">
                  <div className="h-full w-full aspect-square border-4 border-background rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Institution type above name */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs border-muted-foreground/30">
                      {institution.denomination}
                    </Badge>
                    <Badge variant="outline" className="text-xs border-muted-foreground/30 font-mono">
                      {institution.language_preference.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{institution.name}</h1>
                    <p className="text-muted-foreground text-sm sm:text-base truncate">
                      {institution.contact?.email || 'No contact email'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Globe className="w-3 h-3 mr-1" />
                        {institution.contact?.country || 'Global'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {new Date(institution.created_at).getFullYear()} • Est.
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Organization Stats - Desktop */}
                  <div className="hidden sm:flex w-full mt-4 border rounded-lg bg-background/50">
                    {organizationStats.map((stat, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 text-sm p-3 flex-1 ${
                          index < organizationStats.length - 1 ? 'border-r border-muted-foreground/20' : ''
                        }`}
                      >
                        <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                          <div className="font-medium">{stat.value.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Organization Stats - Mobile Collapsible */}
                  <div className="sm:hidden">
                    <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Organization Statistics
                          </span>
                          {isDetailsOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-3">
                        {organizationStats.map((stat, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm border rounded-lg p-2 bg-background/50">
                            <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-muted-foreground">{stat.label}</div>
                              <div className="font-medium">{stat.value.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Status & Actions */}
            <div className="flex flex-row items-center gap-4 w-full lg:w-auto">
              {/* Status & Contact */}
              <div className="flex items-center gap-2">
                <Badge 
                  variant={institution.is_deleted ? 'destructive' : 'default'}
                  className={`font-medium ${
                    institution.is_deleted 
                      ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' 
                      : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
                  }`}
                >
                  {institution.is_deleted ? 'Inactive' : 'Active'}
                </Badge>
                {institution.contact?.country && (
                  <Badge variant="outline" className="font-mono border-muted-foreground/30">
                    <Globe className="w-3 h-3 mr-1" />
                    {institution.contact.country}
                  </Badge>
                )}
              </div>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {onViewContact && (
                    <DropdownMenuItem onClick={onViewContact}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Contact Details
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onManageChurches && (
                    <DropdownMenuItem onClick={onManageChurches}>
                      <Home className="w-4 h-4 mr-2" />
                      Manage Churches
                    </DropdownMenuItem>
                  )}
                  {onManageDepartments && (
                    <DropdownMenuItem onClick={onManageDepartments}>
                      <Layers className="w-4 h-4 mr-2" />
                      Manage Departments
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setShowBudgetModal(true)}>
                    <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                    Manage Annual Budgets
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Institution
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={onDelete}
                      // className="text-destructive focus:text-destructive"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Institution
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annual Budget Modal */}
      <AnnualBudgetViewEditModal
        isOpen={showBudgetModal}
        onOpenChange={setShowBudgetModal}
        budget={exampleBudget}
        entityName={institution.name}
        entityType="Institution"
        onSave={(updatedBudget) => {
          // TODO: Implementar atualização via GraphQL/API
          // await updateAnnualBudget({ variables: { id: updatedBudget.id, ...updatedBudget } })
          setShowBudgetModal(false)
        }}
        readonly={false}
      />
    </div>
  )
}
