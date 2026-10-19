import { useQuery } from "@apollo/client/react";
import { InstitutionsLight } from "@/types/InstitutionsLight";
import { GET_INSTITUTIONS_LIGHT_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY";
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query";
import { PermissionResolverName } from "@/types/graphql-global-types";

export function useGetInstitutionsQuery(
  options?: useQuery.Options<InstitutionsLight>,
): useQuery.Result<InstitutionsLight> {
  return useProtectedQuery<InstitutionsLight>(
    GET_INSTITUTIONS_LIGHT_QUERY,
    [PermissionResolverName.Institutions],
    options,
  );
}
