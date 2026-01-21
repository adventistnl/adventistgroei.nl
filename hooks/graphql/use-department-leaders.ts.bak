import { useQuery } from '@apollo/client'
import { GET_DEPARTMENTS_WITH_LEADERS } from '@/graphql/queries/get-departments-with-leaders'
import { useMemo } from 'react'

export interface DepartmentLeader {
  userId: string
  userName: string
  userEmail: string
  userPhone?: string | null
  userMobile?: string | null
  departmentCount: number
  departments: Array<{
    id: string
    name: string
    description: string
    churchName?: string | null
    membersCount: number
    isChurchDepartment: boolean
  }>
  roles: Array<{
    id: string
    name: string
    keyCode: string
  }>
  isAdmin: boolean
}

export interface UseDepartmentLeadersResult {
  leaders: DepartmentLeader[]
  totalLeaders: number
  totalDepartments: number
  loading: boolean
  error: any
  refetch: () => void
}

export type DepartmentType = 'church' | 'institution' | 'all'

/**
 * Hook customizado para buscar e processar dados de líderes de departamentos
 * Agrupa departamentos por líder e fornece estatísticas úteis
 * 
 * @param institutionId - ID da instituição
 * @param departmentType - Tipo de departamento: 'church' (com church_id), 'institution' (sem church_id), 'all' (todos)
 */
export function useDepartmentLeaders(
  institutionId: string | undefined,
  departmentType: DepartmentType = 'all'
): UseDepartmentLeadersResult {
  const { data, loading, error, refetch } = useQuery(GET_DEPARTMENTS_WITH_LEADERS, {
    variables: { institution_id: institutionId },
    skip: !institutionId,
  })

  const leaders = useMemo(() => {
    if (!data?.departments) return []

    // Filtrar departamentos por tipo baseado em church_id
    const filteredDepartments = data.departments.filter((dept: any) => {
      if (departmentType === 'all') return true
      if (departmentType === 'church') return !!dept.church_id // Church departments TÊM church_id
      if (departmentType === 'institution') return !dept.church_id // Institutional departments NÃO TÊM church_id
      return true
    })

    console.log(`🔍 [Department Leaders Hook] Filtering by type: ${departmentType}`)
    console.log(`📊 [Department Leaders Hook] Total departments: ${data.departments.length}, Filtered: ${filteredDepartments.length}`)

    // Agrupar departamentos por leader_id
    const leaderMap = new Map<string, DepartmentLeader>()

    filteredDepartments.forEach((dept: any) => {
      if (!dept.leader) return // Pular se não tiver líder

      const leaderId = dept.leader.id

      if (!leaderMap.has(leaderId)) {
        // Criar nova entrada para o líder
        const roles = dept.leader.user_roles?.map((ur: any) => ({
          id: ur.role.id,
          name: ur.role.name,
          keyCode: ur.role.key_code,
        })) || []

        const isAdmin = roles.some((r: any) => r.keyCode === 'ADMIN')

        leaderMap.set(leaderId, {
          userId: dept.leader.id,
          userName: dept.leader.name,
          userEmail: dept.leader.email,
          userPhone: dept.leader.contact?.phone,
          userMobile: dept.leader.contact?.mobile,
          departmentCount: 0,
          departments: [],
          roles,
          isAdmin,
        })
      }

      // Adicionar departamento à lista do líder
      const leader = leaderMap.get(leaderId)!
      leader.departmentCount += 1
      leader.departments.push({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        churchName: dept.church?.name,
        membersCount: dept.users?.length || 0,
        isChurchDepartment: !!dept.church_id,
      })
    })

    // Converter Map para array e ordenar por quantidade de departamentos
    return Array.from(leaderMap.values()).sort(
      (a, b) => b.departmentCount - a.departmentCount
    )
  }, [data, departmentType])

  const totalLeaders = leaders.length
  const totalDepartments = useMemo(() => {
    return leaders.reduce((sum, leader) => sum + leader.departmentCount, 0)
  }, [leaders])

  return {
    leaders,
    totalLeaders,
    totalDepartments,
    loading,
    error,
    refetch,
  }
}
