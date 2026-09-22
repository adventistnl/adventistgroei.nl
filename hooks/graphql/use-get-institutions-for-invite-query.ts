import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";
import { GET_INSTITUTIONS_FOR_INVITE_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY";

export interface DepartmentForInvite {
  id: string;
  name: string;
}

export interface ChurchForInvite {
  id: string;
  name: string;
  departments: DepartmentForInvite[];
}

export interface InstitutionForInvite {
  id: string;
  name: string;
  departments: DepartmentForInvite[];
  churches: ChurchForInvite[];
}

export interface InstitutionsForInviteResult {
  institutions: InstitutionForInvite[];
}

export function useGetInstitutionsForInviteQuery() {
  return useProtectedQuery<InstitutionsForInviteResult>(
    GET_INSTITUTIONS_FOR_INVITE_QUERY, 
    [PermissionResolverName.Institutions],
    {
      fetchPolicy: "cache-and-network",
    }
  );
}
