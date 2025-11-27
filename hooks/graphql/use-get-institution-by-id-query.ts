import { useQuery } from "@apollo/client/react";
import { GET_INSTITUTION_BY_ID_FULL_DATA_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY";
import { InstitutionById } from "@/types/InstitutionById";

interface Variables {
  id?: string;
}

export function useGetInstitutionByIdQuery(
  variables: Variables,
  options?: useQuery.Options<InstitutionById, Variables>
): useQuery.Result<InstitutionById, Variables> {
  return useQuery<InstitutionById, Variables>(GET_INSTITUTION_BY_ID_FULL_DATA_QUERY, {
    variables,
    skip: !variables.id,
    fetchPolicy: 'network-only', // Sempre faz requisição de rede, ignora cache
    ...options,
  });
}
