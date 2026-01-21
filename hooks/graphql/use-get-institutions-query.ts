import { useQuery } from "@apollo/client/react";
import { InstitutionsLight } from "@/types/InstitutionsLight";
import { GET_INSTITUTIONS_LIGHT_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY";

export function useGetInstitutionsQuery(options?: useQuery.Options<InstitutionsLight>): useQuery.Result<InstitutionsLight> {
  return useQuery<InstitutionsLight>(GET_INSTITUTIONS_LIGHT_QUERY, options);
}
