import { useQuery } from "@apollo/client/react";
import { GET_REGIONS_QUERY } from "@/graphql/queries/REGIONS_QUERY";
import { Regions } from "@/types/Regions";

export function useGetRegionsQuery(options?: useQuery.Options<Regions>): useQuery.Result<Regions> {
  return useQuery<Regions>(GET_REGIONS_QUERY, options);
}
