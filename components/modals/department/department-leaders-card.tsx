"use client"

import React, { useMemo, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { Crown, ChevronDown, ChevronUp, AlertCircle, Layers, MoreVertical, Mail, Phone, User, MoreHorizontal } from "lucide-react"
import { departmentTranslations } from "@/lib/translations/departments"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

interface Department {
  id: string
  name: string
  church_id: string | null
  church_name?: string
  leader_id?: string | null
}

interface DepartmentUser {
  id: string
  name: string
  email: string
  language_preference?: string
  user_roles?: UserRole[]
  is_deleted?: boolean
}

interface DepartmentLeadersCardProps {
  users?: DepartmentUser[]
  departments?: Department[]
  departmentName: string
  departmentType?: 'church' | 'institution' | 'all'
  loading?: boolean
}

/**
 * COMPONENTE DE CARD DE LÍDERES DE DEPARTAMENTO
 * Exibe os líderes de departamentos usando apenas o campo leader_id
 * 
 * Lógica:
 * - Identifica líderes através do campo leader_id em cada departamento
 * - Cruza os dados com a lista de usuários para obter detalhes (name, email)
 * - Mostra quais departamentos cada líder gerencia
 * - Ordena alfabeticamente por nome do líder
 */
export function DepartmentLeadersCard({ 
  users = [], 
  departments = [],
  departmentName,
  departmentType = 'all',
  loading = false 
}: DepartmentLeadersCardProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  // 🔍 DEBUG: Validar dados de entrada
  useEffect(() => {
    console.group('🔍 [DepartmentLeadersCard] DEBUG - Input Data Validation')
    
    // 1. Dados brutos recebidos
    console.log('📥 [Input] Total Users Received:', users.length)
    console.log('📥 [Input] Total Departments Received:', departments.length)
    console.log('📥 [Input] Department Type Filter:', departmentType)
    
    // 2. Usuários ativos
    const activeUsers = users.filter(u => !u.is_deleted)
    console.log('✅ [Users] Active Users:', activeUsers.length, '/', users.length)
    
    if (users.length > 0) {
      console.table(users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        is_deleted: u.is_deleted || false,
        roles_count: u.user_roles?.length || 0
      })))
    }
    
    // 3. Departamentos com leader_id
    const deptsWithLeader = departments.filter(d => d.leader_id)
    const deptsWithoutLeader = departments.filter(d => !d.leader_id)
    
    console.log('👑 [Departments] With leader_id:', deptsWithLeader.length, '/', departments.length)
    console.log('⚠️ [Departments] Without leader_id:', deptsWithoutLeader.length)
    
    if (deptsWithLeader.length > 0) {
      console.log('👑 [Departments] Details with leader_id:')
      console.table(deptsWithLeader.map(d => ({
        dept_id: d.id,
        dept_name: d.name,
        church_id: d.church_id || 'institutional',
        church_name: d.church_name || 'N/A',
        leader_id: d.leader_id
      })))
    }
    
    if (deptsWithoutLeader.length > 0) {
      console.warn('⚠️ [Departments] Without leader_id:', 
        deptsWithoutLeader.map(d => ({
          dept_id: d.id,
          dept_name: d.name,
          church_name: d.church_name || 'institutional'
        }))
      )
    }
    
    // 4. Validação de cruzamento: leader_id existe na lista de usuários?
    const leaderIds = new Set(deptsWithLeader.map(d => d.leader_id).filter(Boolean))
    const userIds = new Set(activeUsers.map(u => u.id))
    
    console.log('🔗 [Validation] Unique leader_ids found:', leaderIds.size)
    console.log('🔗 [Validation] Active user_ids available:', userIds.size)
    
    const missingLeaders: string[] = []
    const validLeaders: Array<{leader_id: string, user_name: string, dept_count: number}> = []
    
    leaderIds.forEach(leaderId => {
      const user = activeUsers.find(u => u.id === leaderId)
      const deptCount = deptsWithLeader.filter(d => d.leader_id === leaderId).length
      
      if (!user) {
        missingLeaders.push(leaderId as string)
      } else {
        validLeaders.push({
          leader_id: leaderId as string,
          user_name: user.name,
          dept_count: deptCount
        })
      }
    })
    
    if (validLeaders.length > 0) {
      console.log('✅ [Validation] Valid Leaders (leader_id found in users):')
      console.table(validLeaders)
    }
    
    if (missingLeaders.length > 0) {
      console.error('❌ [Validation] Missing Leaders (leader_id NOT found in users):', missingLeaders)
      console.error('❌ These departments have leader_ids that don\'t match any user:', 
        deptsWithLeader
          .filter(d => missingLeaders.includes(d.leader_id as string))
          .map(d => ({
            dept_name: d.name,
            leader_id: d.leader_id,
            church_name: d.church_name || 'institutional'
          }))
      )
    }
    
    // 5. Resumo final
    console.log('📊 [Summary] Expected leaders to display:', validLeaders.length)
    console.log('📊 [Summary] Total departments they manage:', 
      validLeaders.reduce((sum, l) => sum + l.dept_count, 0)
    )
    
    console.groupEnd()
  }, [users, departments, departmentType])

  // Filtrar departamentos por tipo
  const filteredDepartments = useMemo(() => {
    if (departmentType === 'all') return departments
    if (departmentType === 'church') {
      return departments.filter(d => d.church_id !== null && d.church_id !== undefined)
    }
    // institution
    return departments.filter(d => d.church_id === null || d.church_id === undefined)
  }, [departments, departmentType])

  // 🔍 DEBUG: Validar filtro de departamentos por tipo
  useEffect(() => {
    console.group('🔍 [DepartmentLeadersCard] DEBUG - Department Type Filtering')
    console.log('🏷️ [Filter] Department Type:', departmentType)
    console.log('📊 [Filter] Before filtering:', departments.length, 'departments')
    console.log('📊 [Filter] After filtering:', filteredDepartments.length, 'departments')
    
    if (departmentType !== 'all') {
      const filtered = departments.length - filteredDepartments.length
      console.log(`🗂️ [Filter] Filtered out: ${filtered} departments`)
      
      if (departmentType === 'church') {
        const institutional = departments.filter(d => !d.church_id)
        console.log(`🏛️ [Filter] Institutional departments excluded: ${institutional.length}`)
      } else {
        const church = departments.filter(d => d.church_id)
        console.log(`⛪ [Filter] Church departments excluded: ${church.length}`)
      }
    }
    
    const filteredWithLeader = filteredDepartments.filter(d => d.leader_id)
    console.log('👑 [Filter] Departments with leader_id after filtering:', filteredWithLeader.length)
    
    if (filteredWithLeader.length > 0) {
      console.table(filteredWithLeader.map(d => ({
        dept_name: d.name,
        leader_id: d.leader_id,
        type: d.church_id ? 'church' : 'institutional',
        church_name: d.church_name || 'N/A'
      })))
    }
    
    console.groupEnd()
  }, [departments, filteredDepartments, departmentType])

  /**
   * Identificar líderes baseado APENAS no campo leader_id dos departamentos
   * Cruza com a lista de usuários para obter detalhes completos
   * OTIMIZADO: Usa Map para busca O(1) ao invés de find() O(n)
   */
  const leaders = useMemo(() => {
    console.group('🔍 [DepartmentLeadersCard] DEBUG - Leaders Identification Process')
    
    // 1. Criar mapa de usuários ativos para busca O(1)
    const activeUsers = users.filter(user => !user.is_deleted)
    const userMap = new Map<string, DepartmentUser>()
    activeUsers.forEach(user => {
      userMap.set(user.id, user)
    })
    
    console.log('📊 [Performance] Created user Map with', userMap.size, 'active users for O(1) lookup')
    
    // 2. Criar mapa de leader_id -> departamentos
    const leaderDepartmentsMap = new Map<string, Department[]>()
    
    filteredDepartments.forEach(dept => {
      if (dept.leader_id) {
        const existing = leaderDepartmentsMap.get(dept.leader_id) || []
        leaderDepartmentsMap.set(dept.leader_id, [...existing, dept])
      }
    })
    
    console.log('📊 [Mapping] Found', leaderDepartmentsMap.size, 'unique leader_ids in departments')
    
    // 3. Mapear líderes com seus departamentos usando busca otimizada
    const leadersWithDepartments = Array.from(leaderDepartmentsMap.entries())
      .map(([leaderId, ledDepartments]) => {
        // Busca O(1) no Map ao invés de find() O(n)
        const user = userMap.get(leaderId)
        
        if (!user) {
          console.error(`❌ [Missing Leader] leader_id "${leaderId}" not found in institution users`)
          console.error('   Affected departments:', ledDepartments.map(d => d.name).join(', '))
          return null
        }
        
        console.log(`✅ [Found] Leader "${user.name}" manages ${ledDepartments.length} department(s)`)

        return {
          user,
          ledDepartments,
          leadershipRoles: user.user_roles || []
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.user.name.localeCompare(b.user.name))
    
    console.log('📊 [Result] Total leaders to display:', leadersWithDepartments.length)
    console.table(leadersWithDepartments.map(l => ({
      user_id: l.user.id,
      user_name: l.user.name,
      user_email: l.user.email,
      departments_count: l.ledDepartments.length,
      departments: l.ledDepartments.map(d => d.name).join(', ')
    })))
    
    console.groupEnd()

    return leadersWithDepartments
  }, [users, filteredDepartments])

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
  const [selectedUserForContact, setSelectedUserForContact] = useState<DepartmentUser | null>(null)
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
  
  const handleViewContact = (user: DepartmentUser) => {
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
                {t.detail?.leaders_card?.title || "Leaders"}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {t.detail?.leaders_card?.description || "Department leaders and their assigned departments"}
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
                {t.detail?.leaders_card?.no_leaders || "No leaders assigned"}
              </p>
            </div>
          ) : (
            leaders.map(({ user, ledDepartments, leadershipRoles }) => {
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
                          <AvatarFallback className="text-xs border font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                          {/* <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                            <StatusBadge
                              label={`${ledDepartments.length} ${ledDepartments.length === 1 ? (t.detail?.leaders_card?.department || 'department') : (t.detail?.leaders_card?.departments || 'departments')}`}
                              variant="neutral"
                              size="sm"
                            />
                          </div> */}
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

                  {/* Conteúdo expandido - Departamentos */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 bg-muted/5 border-t">
                      <div className="pt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                          <Layers className="w-3 h-3" />
                          {t.detail?.leaders_card?.managed_departments || "Managed Departments"} ({ledDepartments.length})
                        </p>
                        {ledDepartments.length > 0 ? (
                          <div className="space-y-1.5">
                            {ledDepartments.map(dept => (
                              <div 
                                key={dept.id}
                                className="flex items-center justify-between px-2 py-1.5 rounded bg-background text-xs border border-border/50"
                              >
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                  <Layers className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                  <span className="font-medium truncate">{dept.name}</span>
                                </div>
                                {dept.church_name && (
                                  <StatusBadge
                                    label={dept.church_name}
                                    variant="neutral"
                                    size="sm"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic px-2">
                            {t.detail?.leaders_card?.no_departments || "No departments assigned"}
                          </p>
                        )}
                      </div>

                      {/* Botão Ver Mais */}
                      <div className="pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => handleViewContact(user)}
                            >
                              {t.detail?.leaders_card?.view_contact || "View Contact"}
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
