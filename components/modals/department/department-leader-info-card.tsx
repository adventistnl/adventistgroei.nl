"use client"

import React, { useState } from "react"
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

interface DepartmentUser {
  id: string
  name: string
  email: string
  phone?: string
  language_preference?: string
}

interface Department {
  id: string
  name: string
  leader_id?: string | null
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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Buscar líder pelo leader_id
  const leader = users.find(u => u.id === department.leader_id)

  if (loading) {
    return (
      <Card className="h-full">
        {showHeader && (
          <CardHeader>
            <div className="h-5 bg-muted rounded animate-pulse w-32" />
          </CardHeader>
        )}
        <CardContent className={showHeader ? '' : 'pt-6'}>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!leader) {
    return (
      <Card className="h-full border-dashed">
        {showHeader && (
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-muted-foreground" />
              Department Leader
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={showHeader ? '' : 'pt-6'}>
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <User className="h-10 w-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              No leader assigned
            </p>
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
      <Card className="h-full">
        {showHeader && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crown className="w-4 h-4 text-amber-500" />
                Department Leader
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
                    View Contact
                  </DropdownMenuItem>
                  {leader.email && (
                    <DropdownMenuItem asChild>
                      <a href={`mailto:${leader.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </a>
                    </DropdownMenuItem>
                  )}
                  {leader.phone && (
                    <DropdownMenuItem asChild>
                      <a href={`tel:${leader.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
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
        
        <CardContent className={`space-y-3 ${showHeader ? '' : 'pt-6'}`}>
          {/* Leader Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-amber-500/20">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400 font-medium">
                {getInitials(leader.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-medium text-sm truncate">
                  {leader.name}
                </h4>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                  Leader
                </Badge>
              </div>
              
              {leader.email && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                  <Mail className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{leader.email}</span>
                </div>
              )}
            </div>
          </div>

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
