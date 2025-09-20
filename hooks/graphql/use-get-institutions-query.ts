import { useQuery } from "@apollo/client/react";
import { Institutions } from "@/types/Institutions";
import { GET_INSTITUTIONS_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY";

export function useGetInstitutionsQuery(options?: useQuery.Options<Institutions>): useQuery.Result<Institutions> {
  return useQuery<Institutions>(GET_INSTITUTIONS_QUERY, options);
}
