import { GET_ALL_PERMISSIONS_QUERY } from "@/graphql/queries/PERMISSIONS_QUERY";
import { Permissions } from "@/types/Permissions";
import { useQuery } from "@apollo/client/react";

export function useGetAllPermissionsQuery(options?: useQuery.Options<Permissions>): useQuery.Result<Permissions> {
  return useQuery<Permissions>(GET_ALL_PERMISSIONS_QUERY, { ...options, fetchPolicy: "cache-first" });
}
