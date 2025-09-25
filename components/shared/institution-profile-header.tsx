"use client"

import React, { use, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Building,
  MapPin,
  Home,
  Shield,
  Globe,
  Users,
  MoreHorizontal,
  Send,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Layers,
  Camera,
  Upload,
  X
} from "lucide-react"
import { Separator } from "@radix-ui/react-separator"
import { useInstitutions } from "@/hooks/use-institutions"

export interface InstitutionProfileHeaderProps {
  institutionId: string 
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
  institutionId,
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
  const { currentInstitutionData: institution } = useInstitutions(institutionId)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  if (!institution) return <div>Institution not found</div>

  const organizationStats = [
    {
      icon: MapPin,
      label: "Regions",
      value: institution.regions_count || 0,
      color: "text-green-600"
    },
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImageUpload) {
      setIsUploading(true)
      onImageUpload(file)
      // Reset the input
      event.target.value = ''
      // Simulate upload completion (in real app, this would be handled by the parent)
      setTimeout(() => setIsUploading(false), 1000)
    }
  }

  const handleImageRemove = () => {
    if (onImageRemove) {
      onImageRemove()
    }
  }

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
                <div className="relative h-44 sm:h-50">
                  <Avatar className="h-full w-full aspect-square border-4 border-background shadow-lg rounded-lg">
                    <AvatarImage 
                      src={"/placeholder-logo.svg"} 
                      className="object-cover" 
                    />
                    <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary rounded-lg">
                      {/* {institution.image_url ? ( */}
                        <Building className="w-8 h-8 sm:w-12 sm:h-12" />
                      {/* ) : ( */}
                        {/* institution.name.split(' ').map(n => n[0]).join('').toUpperCase() */}
                      {/* )} */}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Image Upload Button - Bottom Right Corner */}
                  {/* <div className="absolute -bottom-2 -right-2">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                      />
                      <Button
                        size="sm"
                        className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shadow-lg border-2 border-background"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : institution.image_url ? (
                          <Camera className="w-4 h-4 text-white" />
                        ) : (
                          <Upload className="w-4 h-4 text-white" />
                        )}
                      </Button>
                    </div>
                  </div> */}
                  
                  {/* Remove Image Button - Top Right Corner (only show if image exists) */}
                  {/* {institution.image_url && onImageRemove && (
                    <div className="absolute -top-2 -right-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 rounded-full shadow-lg border-2 border-background"
                        onClick={handleImageRemove}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )} */}
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
    </div>
  )
}
