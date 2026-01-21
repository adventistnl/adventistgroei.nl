import { useQuery } from "@apollo/client/react";
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY";
import { Users } from "@/types/Users";

export function useGetAllUsersQuery(options?: useQuery.Options<Users>): useQuery.Result<Users> {
  return useQuery<Users>(GET_ALL_USERS_QUERY, options);
}
