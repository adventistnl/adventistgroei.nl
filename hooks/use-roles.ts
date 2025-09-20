import { use, useMemo } from "react";
import { useGetRolesQuery } from "@/hooks/graphql/use-get-roles-query";
import { Roles_roles } from "@/types/Roles";
import { ErrorLike } from "@apollo/client";

interface iUserRoles {
  roles: Roles_roles[];
  loading: boolean;
  error: ErrorLike | undefined;
}

export function useRoles():iUserRoles  {
  const { data, loading, error } = useGetRolesQuery();
  const roles = useMemo(() => {
    if (!data || !data.roles) {
      return [];
    }
    // Filter out undefined and cast to Roles_roles[]
    return (data.roles as (Roles_roles | undefined)[]).filter((role): role is Roles_roles => !!role);
  }, [data]);

  return {
    roles,
    loading,
    error,
  };
}
