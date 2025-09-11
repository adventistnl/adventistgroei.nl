"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Globe,
  Lock,
  Calendar,
  DollarSign,
  Users,
  MoreHorizontal,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Share,
  Clock,
  Building,
  FileText,
  Target
} from "lucide-react"
import { Separator } from "@radix-ui/react-separator"
import { Project } from "@/types/Project"

export interface ProjectProfileHeaderProps {
  project: Project
  showBackButton?: boolean
  onBack?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onViewDetails?: () => void
  onShare?: () => void
  onManageVolunteers?: () => void
  className?: string
}

export function ProjectProfileHeader({
  project,
  showBackButton = false,
  onBack,
  onEdit,
  onDelete,
  onViewDetails,
  onShare,
  onManageVolunteers,
  className = ""
}: ProjectProfileHeaderProps) {
  const { t } = useTranslation()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const projectStats = [
    {
      icon: DollarSign,
      label: "Budget",
      value: `$${project.budget.toLocaleString()}`,
      color: "text-green-600"
    },
    {
      icon: Calendar,
      label: "Duration",
      value: `${Math.ceil((new Date(project.end_at).getTime() - new Date(project.start_at).getTime()) / (1000 * 60 * 60 * 24))} days`,
      color: "text-blue-600"
    },
    {
      icon: Users,
      label: "Volunteers",
      value: project.request_volunteers ? "Open" : "Closed",
      color: project.request_volunteers ? "text-purple-600" : "text-gray-600"
    },
    {
      icon: Globe,
      label: "Language",
      value: project.language_preference.toUpperCase(),
      color: "text-emerald-600"
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = () => {
    const now = new Date()
    const start = new Date(project.start_at)
    const end = new Date(project.end_at)
    
    if (now < start) return "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
    if (now > end) return "text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
    return "text-green-600 bg-green-100 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
  }

  const getStatusText = () => {
    const now = new Date()
    const start = new Date(project.start_at)
    const end = new Date(project.end_at)
    
    if (now < start) return "Upcoming"
    if (now > end) return "Completed"
    return "Active"
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
            Back to Projects
          </Button>
        </div>
      )}

      {/* Project Header */}
      <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Side - Project Info */}
            <div className="flex-1 w-full">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="relative h-32 sm:h-36">
                  <div className={`h-full w-32 sm:w-36 aspect-square border-4 border-background shadow-lg rounded-lg flex items-center justify-center ${
                    project.is_private 
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900' 
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'
                  }`}>
                    {project.is_private ? (
                      <Lock className="w-8 h-8 sm:w-12 sm:h-12 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Project type and privacy above title */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs border-muted-foreground/30">
                      <Building className="w-3 h-3 mr-1" />
                      Project
                    </Badge>
                    <Badge variant="outline" className="text-xs border-muted-foreground/30 font-mono">
                      {project.language_preference.toUpperCase()}
                    </Badge>
                    {project.is_private && (
                      <Badge variant="outline" className="text-xs border-amber-200 text-amber-600">
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{project.title}</h1>
                    <p className="text-muted-foreground text-sm sm:text-base line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(project.start_at)} - {formatDate(project.end_at)}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor()}`}>
                        {getStatusText()}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Project Stats - Desktop */}
                  <div className="hidden sm:flex w-full mt-4 border rounded-lg bg-background/50">
                    {projectStats.map((stat, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 text-sm p-3 flex-1 ${
                          index < projectStats.length - 1 ? 'border-r border-muted-foreground/20' : ''
                        }`}
                      >
                        <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                          <div className="font-medium">{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Project Stats - Mobile Collapsible */}
                  <div className="sm:hidden">
                    <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Project Details
                          </span>
                          {isDetailsOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-3">
                        {projectStats.map((stat, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm border rounded-lg p-2 bg-background/50">
                            <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-muted-foreground">{stat.label}</div>
                              <div className="font-medium">{stat.value}</div>
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
              {/* Status & Privacy */}
              <div className="flex items-center gap-2">
                <Badge className={`font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </Badge>
                {project.request_volunteers && (
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    <Users className="w-3 h-3 mr-1" />
                    Volunteers Welcome
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
                  {onViewDetails && (
                    <DropdownMenuItem onClick={onViewDetails}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onShare && (
                    <DropdownMenuItem onClick={onShare}>
                      <Share className="w-4 h-4 mr-2" />
                      Share Project
                    </DropdownMenuItem>
                  )}
                  {onManageVolunteers && project.request_volunteers && (
                    <DropdownMenuItem onClick={onManageVolunteers}>
                      <Users className="w-4 h-4 mr-2" />
                      Manage Volunteers
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={onDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Project
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
