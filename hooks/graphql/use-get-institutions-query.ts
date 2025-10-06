import { useQuery } from "@apollo/client/react";
import { Institutions } from "@/types/Institutions";
import { GET_INSTITUTIONS_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY";

export function useGetInstitutionsQuery(options?: useQuery.Options<Institutions>): useQuery.Result<Institutions> {
  const result = useQuery<Institutions>(GET_INSTITUTIONS_QUERY, options);
  
  // Debug logs
  console.log('useGetInstitutionsQuery Debug:', {
    data: result.data,
    loading: result.loading,
    error: result.error?.message,
    networkStatus: result.networkStatus
  });
  
  return result;
}
