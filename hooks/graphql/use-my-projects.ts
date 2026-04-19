import { useQuery } from "@apollo/client"
import { GET_MY_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"

export interface MyProjectItem {
  id: string
  title: string
  status: string
  is_private: boolean
  start_at: string
  end_at: string
}

export function useMyProjects() {
  const { data, loading, error, refetch } = useQuery(GET_MY_PROJECTS_QUERY)

  return {
    projects: (data?.myProjects || []) as MyProjectItem[],
    loading,
    error,
    refetch,
  }
}
