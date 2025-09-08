import { LOGIN_MUTATION } from "@/graphql/mutations/LOGIN_MUTATION";
import { useMutation } from "@apollo/client/react";
import { Login, LoginVariables } from "@/types/Login";

export function useLogin(options?: useMutation.Options<Login, LoginVariables>): useMutation.ResultTuple<Login, LoginVariables> {
  return useMutation<Login, LoginVariables>(LOGIN_MUTATION, options);
}