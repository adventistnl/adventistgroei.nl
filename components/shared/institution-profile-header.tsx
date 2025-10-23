"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Building,
  MapPin,
  Home,
  Globe,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Mail,
  Calendar,
  DollarSign,
  Layers
} from "lucide-react"
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
  onManageRegions?: () => void
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
  onManageRegions,
  onManageChurches,
  onManageDepartments,
  onImageUpload,
  onImageRemove,
  className = ""
}: InstitutionProfileHeaderProps) {
  const { t } = useTranslation()
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  // Example budget data (in real app, this would come from props or API)
  const exampleBudget: AnnualBudgetData = {
    id: "budget-2024",
    year: 2024,
    planned_budget: 150000,
    total_expenses: 85000,
    balance: 65000,
    notes: "Annual operational budget for institutional activities and programs.",
    approved_by: "admin",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-06-20T14:15:00Z",
    created_by: "admin",
    updated_by: "admin",
    is_deleted: false
  }

  if (!institution) return <div>Institution not found</div>

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
      <Card className="border-muted bg-muted/30">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            {/* Left Side - Institution Info */}
            <div className="flex items-start gap-4 flex-1">
              {/* Icon */}
              <div className="w-14 h-14 bg-background rounded-lg border flex items-center justify-center flex-shrink-0">
                <Building className="w-7 h-7 text-muted-foreground" />
              </div>
              
              {/* Information */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{institution.name}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {institution.denomination}
                  </p>
                </div>
                
                {/* Contact Info */}
                {institution.contact?.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{institution.contact.email}</span>
                  </div>
                )}
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {institution.contact?.country && (
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {institution.contact.country}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(institution.created_at).getFullYear()}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-mono">
                    {institution.language_preference.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Side - Status & Actions */}
            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <Badge 
                variant={institution.is_deleted ? 'destructive' : 'default'}
                className={`${
                  institution.is_deleted 
                    ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' 
                    : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
                }`}
              >
                {institution.is_deleted ? 'Inactive' : 'Active'}
              </Badge>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
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
                  {onManageRegions && (
                    <DropdownMenuItem onClick={onManageRegions}>
                      <MapPin className="w-4 h-4 mr-2" />
                      Manage Regions
                    </DropdownMenuItem>
                  )}
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
                    <DollarSign className="w-4 h-4 mr-2" />
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
