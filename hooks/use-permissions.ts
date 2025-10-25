import { useMemo } from "react";
import { ErrorLike } from "@apollo/client";
import { Permissions_permissions } from "@/types/Permissions";
import { useGetAllPermissionsQuery } from "./graphql/use-get-permissions-query";

interface iUserpermissions {
  permissions: Permissions_permissions[];
  permissionsLoading: boolean;
  permissionsError: ErrorLike | undefined;
}

export function usePermissions(): iUserpermissions {
  const { data: dataPermissions, loading: permissionsLoading, error: permissionsError } = useGetAllPermissionsQuery();
  console.log(dataPermissions);
  const permissions = useMemo(() => {
    if (!dataPermissions || !dataPermissions.permissions) {
      return [];
    }
    return (dataPermissions.permissions as (Permissions_permissions | undefined)[]).filter((role): role is Permissions_permissions => !!role);
  }, [dataPermissions]);
  
  return {
    permissions,
    permissionsLoading,
    permissionsError,
  };
}
