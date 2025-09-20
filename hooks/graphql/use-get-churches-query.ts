import { useQuery } from "@apollo/client/react";
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY";
import { Churches } from "@/types/Churches";

export function useGetChurchesQuery(options?: useQuery.Options<Churches>): useQuery.Result<Churches> {
  return useQuery<Churches>(GET_CHURCHES_QUERY, options);
}
