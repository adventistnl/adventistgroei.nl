"use client"

import React, { useMemo, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { Crown, ChevronDown, ChevronUp, AlertCircle, Building2 } from "lucide-react"
import { institutionTranslations } from "@/lib/translations/institutions"
import { Button } from "@/components/ui/button"
import { ContactViewEditModal } from "@/components/modals/contact/contact-view-edit-modal"
import { useUpdateUserMutation } from "@/hooks/graphql/use-user-mutation"

interface UserRole {
  id: string
  role: {
    id: string
    name: string
    key_code: string
    description?: string
  }
}

interface InstitutionUser {
  id: string
  name: string
  email: string
  language_preference?: string
  user_roles?: UserRole[] | null
  is_deleted?: boolean
}

interface InstitutionLeadersCardProps {
  users: InstitutionUser[]
  institutionName: string
  loading?: boolean
  selectedYear?: number
}

/**
 * COMPONENTE DE CARD DE LÍDERES DA INSTITUIÇÃO
 * Exibe os líderes da instituição baseado em seus roles
 * 
 * Lógica:
 * - Identifica líderes através dos roles específicos de liderança institucional
 * - Roles de liderança: president, director, administrator, manager, coordinator, etc.
 * - Mostra detalhes de contato ao expandir o card
 * - Ordena alfabeticamente por nome do líder
 */
export function InstitutionLeadersCard({ 
  users = [], 
  institutionName,
  loading = false,
  selectedYear
}: InstitutionLeadersCardProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = institutionTranslations[currentLanguage as keyof typeof institutionTranslations] || institutionTranslations.en

  // Filter users by selected year if provided
  const filteredUsersByYear = useMemo(() => {
    if (!selectedYear) return users
    
    return users.filter(user => {
      if (!user?.id) return false
      // Assuming users have a created_at field; adjust if needed
      const userCreatedAt = (user as any).created_at
      if (!userCreatedAt) return true // Include if no date available
      const userYear = new Date(userCreatedAt).getFullYear()
      return userYear <= selectedYear
    })
  }, [users, selectedYear])


  /**
   * Identificar líderes institucionais baseado em roles específicos
   * Roles de liderança institucional: president, director, administrator, manager, coordinator
   * OTIMIZADO: Usa Set para busca O(1) de roles de liderança
   */
  const leaders = useMemo(() => {

    
    // 1. Definir roles que indicam liderança institucional
    const leadershipRoles = new Set([
      'president',
      'vice_president', 
      'director',
      'vice_director',
      'administrator',
      'manager',
      'coordinator',
      'executive_secretary',
      'treasurer',
      'superintendent',
      'institutional_leader',
      'institutional_admin',
      'institutional_manager'
    ])
    
    // 2. Filtrar usuários ativos (já filtrados por ano)
    const activeUsers = filteredUsersByYear.filter(user => !user.is_deleted)
    
    // 3. Identificar líderes: usuários com pelo menos um role de liderança
    const institutionLeaders = activeUsers
      .map(user => {
        // Buscar roles de liderança do usuário
        const userLeadershipRoles = (user.user_roles || []).filter(ur => 
          leadershipRoles.has(ur.role.key_code.toLowerCase())
        )
        
        if (userLeadershipRoles.length > 0) {
          
          return {
            user,
            leadershipRoles: userLeadershipRoles
          }
        }
        
        return null
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.user.name.localeCompare(b.user.name))
    

    return institutionLeaders
  }, [filteredUsersByYear, selectedYear])

  // Gerar iniciais para o avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Estado para controlar quais líderes estão expandidos
  const [expandedLeaders, setExpandedLeaders] = useState<Set<string>>(new Set())
  
  // Estado para controlar o modal de contato
  const [selectedUserForContact, setSelectedUserForContact] = useState<InstitutionUser | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  
  const [updateUserMutation] = useUpdateUserMutation()

  const toggleLeader = (userId: string) => {
    setExpandedLeaders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }
  
  const handleViewContact = (user: InstitutionUser) => {
    setSelectedUserForContact(user)
    setIsContactModalOpen(true)
  }

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-1">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-5 bg-muted rounded w-8 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded border animate-pulse">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="h-full flex flex-col bg-card/50">
        <CardHeader className="pb-3 space-y-1 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4 text-muted-foreground" />
                {t.leadershipCard?.title || "Institution Leaders"}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {t.leadershipCard?.description || "Leaders managing this institution"}
              </CardDescription>
            </div>
            <StatusBadge
              label={leaders.length.toString()}
              variant="neutral"
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-1 pr-2">
          {leaders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground">
                {t.leadershipCard?.no_leaders || "No institutional leaders found"}
              </p>
            </div>
          ) : (
            leaders.map(({ user, leadershipRoles }) => {
              const isExpanded = expandedLeaders.has(user.id)

              return (
                <div key={user.id} className="border border-border/50 rounded-lg overflow-hidden bg-card hover:border-border transition-colors">
                  {/* Header colapsável */}
                  <div className="flex items-center gap-2 p-3">
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start h-auto p-0 hover:bg-transparent"
                      onClick={() => toggleLeader(user.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs border font-medium bg-primary/10 text-primary dark:bg-primary/20">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Conteúdo expandido - Roles e Botão de Contato */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 bg-muted/5 border-t">
                      <div className="pt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Building2 className="w-3 h-3" />
                          {t.leadershipCard?.leadership_roles || "Leadership Roles"} ({leadershipRoles.length})
                        </p>
                        {leadershipRoles.length > 0 ? (
                          <div className="space-y-1.5">
                            {leadershipRoles.map(roleData => (
                              <div 
                                key={roleData.id}
                                className="flex items-center justify-between px-2 py-1.5 rounded bg-background text-xs border border-border/50"
                              >
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <Crown className="w-3 h-3 text-primary/70 flex-shrink-0" />
                                  <span className="font-medium truncate">{roleData.role.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic px-2">
                            {t.leadershipCard?.no_roles || "No leadership roles assigned"}
                          </p>
                        )}
                      </div>

                      {/* Botão Ver Contato */}
                      <div className="pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => handleViewContact(user)}
                        >
                          {t.leadershipCard?.view_contact || "View Contact"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
      
      {/* Contact Modal */}
      {selectedUserForContact && (
        <ContactViewEditModal
          isOpen={isContactModalOpen}
          onOpenChange={setIsContactModalOpen}
          contact={{
            id: selectedUserForContact.id,
            name: selectedUserForContact.name,
            email: selectedUserForContact.email,
            phone: null,
            mobile: null,
            address: null,
            city: null,
            country: null,
            postal_code: null,
            full_address: null,
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
          entityName={selectedUserForContact.name}
          entityType="User"
          readonly={true}
          updateMutation={updateUserMutation}
          entityId={selectedUserForContact.id}
        />
      )}
    </>
  )
}
