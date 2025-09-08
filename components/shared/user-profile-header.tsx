"use client"

import React, { useState } from "react"
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
  Crown,
  MoreHorizontal,
  Send,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { User, Institution, Church, Region, Department } from "@/data/usersData"

export interface UserProfileHeaderProps {
  user: User
  userInstitution?: Institution
  userChurch?: Church
  userRegion?: Region
  userDepartment?: Department
  showBackButton?: boolean
  onBack?: () => void
  onSendMessage?: () => void
  onViewContact?: () => void
  onEditUser?: () => void
  onDeleteUser?: () => void
  className?: string
}

export function UserProfileHeader({
  user,
  userInstitution,
  userChurch,
  userRegion,
  userDepartment,
  showBackButton = false,
  onBack,
  onSendMessage,
  onViewContact,
  onEditUser,
  onDeleteUser,
  className = ""
}: UserProfileHeaderProps) {
  const { t } = useTranslation()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const organizationTags = [
    {
      icon: Building,
      label: "Institution",
      value: userInstitution?.name,
      color: "text-blue-600"
    },
    {
      icon: Home,
      label: "Church", 
      value: userChurch?.name,
      color: "text-blue-600"
    },
    {
      icon: MapPin,
      label: "Region",
      value: userRegion?.name || 'None',
      color: "text-green-600"
    },
    {
      icon: Shield,
      label: "Department",
      value: userDepartment?.name || 'None',
      color: "text-emerald-600"
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
            {t('users.actions.back_to_users')}
          </Button>
        </div>
      )}

      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-muted/30 to-muted/10 border-muted">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Left Side - User Info */}
            <div className="flex-1 w-full">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="h-40 sm:h-44">
                  <Avatar className="h-full w-full aspect-square border-4 border-background shadow-lg rounded-lg">
                    <AvatarImage src="/placeholder-user.jpg" className="object-cover" />
                    <AvatarFallback className="text-xl sm:text-2xl font-bold bg-primary/10 text-primary rounded-lg">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Roles above name */}
                  <div className="flex flex-wrap gap-1">
                    {user.user_roles.map((role) => (
                      <Badge key={role.id} variant="outline" className="text-xs border-muted-foreground/30">
                        {role.key_code === 'ADMIN' && <Crown className="w-3 h-3 mr-1 text-amber-600" />}
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">{user.name}</h1>
                    <p className="text-muted-foreground font-mono text-sm sm:text-base truncate">{user.email}</p>
                  </div>
                  
                  {/* Organization Tags - Desktop */}
                  <div className="hidden sm:flex w-full mt-4 border rounded-lg bg-background/50">
                    {organizationTags.map((tag, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-2 text-sm p-3 flex-1 ${
                          index < organizationTags.length - 1 ? 'border-r border-muted-foreground/20' : ''
                        }`}
                      >
                        <tag.icon className={`w-4 h-4 ${tag.color} flex-shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground">{tag.label}</div>
                          <div className="font-medium truncate">{tag.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Organization Tags - Mobile Collapsible */}
                  <div className="sm:hidden">
                    <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <span className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Organization Details
                          </span>
                          {isDetailsOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2 mt-3">
                        {organizationTags.map((tag, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm border rounded-lg p-2 bg-background/50">
                            <tag.icon className={`w-4 h-4 ${tag.color} flex-shrink-0`} />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs text-muted-foreground">{tag.label}</div>
                              <div className="font-medium truncate">{tag.value}</div>
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


              {/* Status & Language */}
              <div className="flex items-center gap-2">
                <Badge 
                  variant={user.is_deleted ? 'destructive' : 'default'}
                  className={`font-medium ${
                    user.is_deleted 
                      ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' 
                      : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
                  }`}
                >
                  {user.is_deleted ? 'Inactive' : 'Active'}
                </Badge>
                <Badge variant="outline" className="font-mono border-muted-foreground/30">
                  {user.language_preference.toUpperCase()}
                </Badge>
              </div>

               {/* Action Menu */}
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {onSendMessage && (
                    <DropdownMenuItem onClick={onSendMessage}>
                      <Send className="w-4 h-4 mr-2" />
                      {t('users.actions.send_message')}
                    </DropdownMenuItem>
                  )}
                  {onViewContact && (
                    <DropdownMenuItem onClick={onViewContact}>
                      <Eye className="w-4 h-4 mr-2" />
                      {t('users.actions.view_contact')}
                    </DropdownMenuItem>
                  )}
                  {(onEditUser || onDeleteUser) && <DropdownMenuSeparator />}
                  {onEditUser && (
                    <DropdownMenuItem onClick={onEditUser}>
                      <Edit className="w-4 h-4 mr-2" />
                      {t('users.actions.edit_user')}
                    </DropdownMenuItem>
                  )}
                  {onDeleteUser && (
                    <DropdownMenuItem 
                      onClick={onDeleteUser}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('users.actions.delete_user')}
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
