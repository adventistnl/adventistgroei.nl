import { useQuery } from "@apollo/client/react";
import { GET_INSTITUTION_BY_ID_FULL_DATA_QUERY, GET_INSTITUTION_BY_ID_LIGHT_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY";
import { InstitutionById } from "@/types/InstitutionById";
import { InstitutionByIdLight } from "@/types/InstitutionByIdLight";

interface Variables {
  id?: string;
}

// Hook para versão light (recomendado para performance)
export function useGetInstitutionByIdLightQuery(
  variables: Variables,
  options?: useQuery.Options<InstitutionByIdLight, Variables>
): useQuery.Result<InstitutionByIdLight, Variables> {
  return useQuery<InstitutionByIdLight, Variables>(GET_INSTITUTION_BY_ID_LIGHT_QUERY, {
    variables,
    skip: !variables.id,
    fetchPolicy: 'cache-first', // Usa cache para melhor performance
    ...options,
  });
}

// Hook para versão completa (usar apenas quando necessário)
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
