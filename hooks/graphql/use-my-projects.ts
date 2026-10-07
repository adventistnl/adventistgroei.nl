import { useQuery } from "@apollo/client";
import { GET_MY_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY";
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";

export interface MyProjectItem {
  id: string;
  title: string;
  status: string;
  is_private: boolean;
  start_at: string;
  end_at: string;
}

export function useMyProjects() {
  const { data, loading, error, refetch } = useProtectedQuery(
    GET_MY_PROJECTS_QUERY,
    [PermissionResolverName.MyProjects],
  );

  return {
    projects: (data?.myProjects || []) as MyProjectItem[],
    loading,
    error,
    refetch,
  };
}
