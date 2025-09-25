import { useQuery } from "@apollo/client/react";
import { GET_USER_QUERY } from "@/graphql/queries/GET_USER_QUERY";
import { User, UserVariables } from "@/types/User";

export function useGetUserQuery(variables: UserVariables, options?: useQuery.Options<User, UserVariables>): useQuery.Result<User, UserVariables> {
  return useQuery<User, UserVariables>(GET_USER_QUERY, {
    variables,
    skip: !variables.id,
    ...options,
  });
}
