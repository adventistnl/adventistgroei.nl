"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Users, 
  Crown, 
  Shield, 
  Building2, 
  Building, 
  Mail, 
  Phone,
  Layers
} from 'lucide-react'
import { useDepartmentLeaders, type DepartmentLeader, type DepartmentType } from '@/hooks/graphql/use-department-leaders'
import { useTranslation } from 'react-i18next'
import { departmentTranslations } from '@/lib/translations/departments'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface DepartmentLeadersCardProps {
  institutionId: string | undefined
  loading?: boolean
  /**
   * Tipo de departamento a filtrar:
   * - 'church': Apenas líderes de departamentos de igrejas (com church_id)
   * - 'institution': Apenas líderes de departamentos institucionais (sem church_id)
   * - 'all': Todos os líderes (padrão)
   */
  departmentType?: DepartmentType
}

/**
 * Componente minimalista para exibir líderes de departamentos
 * Mostra informações agregadas sobre quantos departamentos cada líder gerencia
 */
export function DepartmentLeadersCard({ 
  institutionId, 
  loading: externalLoading,
  departmentType = 'all'
}: DepartmentLeadersCardProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  const { leaders, totalLeaders, totalDepartments, loading, error } = useDepartmentLeaders(institutionId, departmentType)

  const isLoading = loading || externalLoading

  if (isLoading) {
    return <DepartmentLeadersCardSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-md">
            {/* <Crown className="h-5 w-5 text-muted-foreground" /> */}
            {t.leaders?.title || "Department Leaders"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            {t.leaders?.error || "Error loading leaders"}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (leaders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            {/* <Crown className="h-5 w-5 text-muted-foreground" /> */}
            {t.leaders?.title || "Department Leaders"}
          </CardTitle>
          <CardDescription>
            {t.leaders?.description || "Overview of department leaders and their responsibilities"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            {t.leaders?.empty || "No leaders found"}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-md">
              {/* <Crown className="h-5 w-5 text-muted-foreground" /> */}
              {t.leaders?.title || "Department Leaders"}
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              {t.leaders?.description || "Overview of department leaders and their responsibilities"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background">
              <Users className="h-3 w-3 mr-1" />
              {totalLeaders}
            </Badge>
            <Badge variant="outline" className="bg-background">
              <Layers className="h-3 w-3 mr-1" />
              {totalDepartments}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            {leaders.map((leader, index) => (
              <AccordionItem key={leader.userId} value={leader.userId} className="border-b last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 w-full">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-muted text-foreground font-medium">
                        {leader.userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {leader.userName}
                        </span>
                        {leader.isAdmin && (
                          <Crown className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {leader.userEmail}
                        </span>
                        {leader.userPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {leader.userPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    <Badge variant="secondary" className="font-medium">
                      {leader.departmentCount}
                    </Badge>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4 pt-2">
                    {/* Roles */}
                    {leader.roles.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          {t.labels?.roles || "Roles"}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {leader.roles.map(role => (
                            <Badge 
                              key={role.id} 
                              variant="outline"
                              className="text-xs"
                            >
                              {role.keyCode === 'ADMIN' && <Crown className="h-3 w-3 mr-1" />}
                              {role.keyCode !== 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                              {role.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Departments */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        {t.leaders?.managed_departments || "Managed Departments"}
                      </div>
                      <div className="space-y-2">
                        {leader.departments.map(dept => (
                          <div 
                            key={dept.id} 
                            className="flex items-start gap-3 py-2"
                          >
                            <div className="w-auto h-full rounded m-auto flex items-center justify-center flex-shrink-0 bg-muted p-4">
                              {dept.isChurchDepartment ? (
                                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className='flex w-full justify-between'>
                                    <div className="font-medium text-sm text-foreground">
                                        {dept.name}
                                    </div>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {dept.membersCount}
                                    </span>
                                </div>
                             
                              <div className="text-xs text-muted-foreground line-clamp-2">
                                {dept.description}
                              </div>
                              <div className="flex items-center gap-2 pt-0.5">
                                {dept.churchName && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Building2 className="h-3 w-3" />
                                    {dept.churchName}
                                  </span>
                                )}

                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton loader para o componente de líderes
 */
function DepartmentLeadersCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
