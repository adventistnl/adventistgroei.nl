
import { useMemo } from "react";
import { useGetAllRolesQuery, useGetRoleByIdQuery } from "@/hooks/graphql/use-get-roles-query";
import { Roles_roles } from "@/types/Roles";
import { ErrorLike } from "@apollo/client";
import { Role_role } from "@/types/Role";
import { useMutation } from "@apollo/client/react";
import { UPDATE_ROLE_MUTATION } from "@/graphql/mutations/ROLE_MUTATIONS";
import { UpdateRole, UpdateRoleVariables } from "@/types/UpdateRole";

interface iUserRoles {
  roles: Roles_roles[];
  currentRole?: Role_role | null;
  rolesLoading: boolean;
  rolesError: ErrorLike | undefined;
  currentRoleLoading: boolean;
  currentRoleError: ErrorLike | undefined;
  updateRole: (variables: UpdateRoleVariables) => Promise<void>;
  updateRoleData?: UpdateRole | null;
  updateRoleError?: ErrorLike;
  updateRoleLoading: boolean;
  refetchAllRoles: () => void;
}

export function useRoles({ id }: { id?: string }): iUserRoles {
  const { data: dataRoles, loading: rolesLoading, error: rolesError, refetch: refetchAllRoles } = useGetAllRolesQuery();
  const { data: dataRole, loading: currentRoleLoading, error: currentRoleError } = useGetRoleByIdQuery({ id: id || "" });

  const [useUpdateRoleMutate, { data: updateRoleData, error: updateRoleError, loading: updateRoleLoading }] = useMutation<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE_MUTATION);

  const roles = useMemo(() => {
    if (!dataRoles || !dataRoles.roles) {
      return [];
    }
    // Filter out undefined and cast to Roles_roles[]
    return (dataRoles.roles as (Roles_roles | undefined)[]).filter((role): role is Roles_roles => !!role);
  }, [dataRoles]);

  return {
    roles,
    rolesLoading,
    rolesError,
    currentRole: dataRole ? dataRole.role : undefined,
    currentRoleError,
    currentRoleLoading,
    updateRole: async (variables: UpdateRoleVariables) => {
      await useUpdateRoleMutate({ variables });
    },
    updateRoleData,
    updateRoleError,
    updateRoleLoading,
    refetchAllRoles,
  };
}
