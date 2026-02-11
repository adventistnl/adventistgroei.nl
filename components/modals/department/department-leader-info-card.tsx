"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  User,
  Mail,
  Phone,
  Building,
  Crown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ContactViewEditModal } from "@/components/modals/contact/contact-view-edit-modal"
import { departmentTranslations } from "@/lib/translations/departments"

interface DepartmentUser {
  id: string
  name: string
  email: string
  phone?: string
  language_preference?: string
  is_deleted?: boolean
}

interface Department {
  id: string
  name: string
  leader_id?: string | null
  is_deleted?: boolean
}

interface DepartmentLeaderInfoCardProps {
  department: Department
  users: DepartmentUser[]
  loading?: boolean
  showHeader?: boolean
}

/**
 * COMPONENTE DE INFORMAÇÃO DO LÍDER DO DEPARTAMENTO
 * Exibe o líder do departamento com informações de contato
 */
export function DepartmentLeaderInfoCard({ 
  department,
  users,
  loading = false,
  showHeader = true
}: DepartmentLeaderInfoCardProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Debug: Log received props
  React.useEffect(() => {
    console.group('🎯 [DepartmentLeaderInfoCard] Props Received')
    console.log('📍 Component mounted/updated')
    console.log('')
    
    console.group('🏢 department prop')
    console.log('Raw:', department)
    console.table({
      id: department.id,
      name: department.name,
      leader_id: department.leader_id || '❌ NULL',
      is_deleted: department.is_deleted || false
    })
    console.groupEnd()
    
    console.group('👥 users prop')
    console.log('Array length:', users.length)
    console.log('Raw array:', users)
    console.table(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      is_deleted: u.is_deleted || false,
      language_preference: u.language_preference || 'N/A'
    })))
    console.groupEnd()
    
    console.group('🔍 Leader Lookup Logic')
    console.log('Executing: const leader = users.find(u => u.id === department.leader_id)')
    console.log('Searching for leader_id:', department.leader_id || 'NULL')
    
    const foundLeader = users.find(u => u.id === department.leader_id)
    console.log('Result:', foundLeader || '❌ undefined')
    
    if (foundLeader) {
      console.log('')
      console.log('✅ LEADER FOUND:')
      console.log({
        id: foundLeader.id,
        name: foundLeader.name,
        email: foundLeader.email,
        is_deleted: foundLeader.is_deleted || false
      })
      console.log('Will render: Leader card with user info')
    } else {
      if (department.leader_id) {
        console.error('💥 MISMATCH: leader_id exists but user NOT found')
        console.log('leader_id value:', department.leader_id)
        console.log('Available user IDs:', users.map(u => u.id))
        console.log('Will render: "No Leader Assigned" empty state')
      } else {
        console.warn('ℹ️ No leader_id set')
        console.log('Will render: "No Leader Assigned" empty state')
      }
    }
    console.groupEnd()
    
    console.group('📊 Component State')
    console.log('loading:', loading)
    console.log('showHeader:', showHeader)
    console.groupEnd()
    
    console.groupEnd()
  }, [department, users, loading, showHeader])

  // Buscar líder pelo leader_id
  const leader = users.find(u => u.id === department.leader_id)

  // Check if leader is inactive (leader's user is deleted OR department is deleted)
  const isLeaderInactive = leader?.is_deleted || department.is_deleted

  if (loading) {
    return (
      <Card className="h-full min-h-[180px]">
        {showHeader && (
          <CardHeader className="pb-3">
            <div className="h-5 bg-muted rounded animate-pulse w-36" />
            <div className="h-3 bg-muted rounded animate-pulse w-28 mt-1" />
          </CardHeader>
        )}
        <CardContent className={showHeader ? 'space-y-3' : 'pt-6 space-y-3'}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted rounded animate-pulse w-32" />
                <div className="h-5 bg-muted rounded-full animate-pulse w-16" />
              </div>
              <div className="h-3 bg-muted rounded animate-pulse w-40" />
            </div>
          </div>
          {/* Additional info skeleton */}
          <div className="space-y-2 pt-2 border-t">
            <div className="h-3 bg-muted rounded animate-pulse w-24" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!leader) {
    return (
      <Card className="h-full min-h-[180px] border-dashed">
        {showHeader && (
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-muted-foreground" />
              {t.leader_info?.title || "Department Leader"}
            </CardTitle>
            <CardDescription className="text-xs">
              {department.name}
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={showHeader ? 'flex-1 flex flex-col' : 'pt-6 flex-1 flex flex-col'}>
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center space-y-4">
            {/* Empty state illustration */}
            <div className="relative h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-muted/40" />
              <User className="h-10 w-10 text-muted-foreground/50" />
            </div>
            
            {/* Message */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {t.leader_info?.no_leader?.title || "No Leader Assigned"}
              </p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                {t.leader_info?.no_leader?.description || "This department doesn't have a leader yet"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <Card className="h-full ">
        {showHeader && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="w-4 h-4 text-amber-500" />
                {t.leader_info?.title || "Department Leader"}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsContactModalOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    {t.leader_info?.actions?.view_contact || "View Contact"}
                  </DropdownMenuItem>
                  {leader.email && (
                    <DropdownMenuItem asChild>
                      <a href={`mailto:${leader.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        {t.leader_info?.actions?.send_email || "Send Email"}
                      </a>
                    </DropdownMenuItem>
                  )}
                  {leader.phone && (
                    <DropdownMenuItem asChild>
                      <a href={`tel:${leader.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {t.leader_info?.actions?.call || "Call"}
                      </a>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="text-xs">
              {department.name}
            </CardDescription>
          </CardHeader>
        )}


        {!showHeader && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="w-4 h-4 text-amber-500" />
                {t.leader_info?.title || "Department Leader"}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsContactModalOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    {t.leader_info?.actions?.view_contact || "View Contact"}
                  </DropdownMenuItem>
                  {leader.phone && (
                    <DropdownMenuItem asChild>
                      <a href={`tel:${leader.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {t.leader_info?.actions?.call || "Call"}
                      </a>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        )}
        
        <CardContent className={`space-y-3`}>
          {/* Leader Info */}
          <div className="flex items-center gap-3">
            <Avatar className={`h-12 w-12 border-2 ${isLeaderInactive ? 'border-muted opacity-60' : 'border-foreground/20'}`}>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className={`font-medium ${isLeaderInactive ? 'bg-muted text-muted-foreground' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
                {getInitials(leader.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h4 className={`font-medium text-sm truncate ${isLeaderInactive ? 'text-muted-foreground' : ''}`}>
                  {leader.name}
                </h4>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                  {t.leader_info?.badges?.leader || "Leader"}
                </Badge>
                {isLeaderInactive && (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium border-muted-foreground/30 text-muted-foreground">
                    {t.leader_info?.badges?.inactive || "Inactive"}
                  </Badge>
                )}
              </div>
              
              {leader.email && (
                <div className={`flex items-center gap-1.5 text-xs truncate ${isLeaderInactive ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{leader.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional info when inactive */}
          {isLeaderInactive && (
            <div className="pt-2 border-t border-muted">
              <p className="text-xs text-muted-foreground italic">
                {department.is_deleted 
                  ? (t.leader_info?.status?.department_inactive || "Department is currently inactive")
                  : (t.leader_info?.status?.leader_inactive || "Leader account is currently inactive")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Modal */}
      {leader && (
        <ContactViewEditModal
          isOpen={isContactModalOpen}
          onOpenChange={setIsContactModalOpen}
          contact={{
            id: leader.id,
            name: leader.name,
            email: leader.email,
            phone: leader.phone || null,
            mobile: null,
            country: null,
            city: null,
            address: null,
            full_address: null,
            postal_code: null,
            website: null,
            notes: null,
            is_primary: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 'system',
            updated_by: 'system',
            is_deleted: false,
            _count: {
              Church: 0,
              Department: 0,
              Event: 0,
              User: 0
            }
          }}
          entityName={leader.name}
          entityType="User"
          readonly={true}
          updateMutation={() => {}}
          entityId={leader.id}
        />
      )}
    </>
  )
}
