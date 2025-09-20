import { LOGIN_MUTATION } from "@/graphql/mutations/LOGIN_MUTATION";
import { Mutation, MutationLoginArgs } from "@/types/graphql-global-types";
import { useMutation } from "@apollo/client/react";

type LoginMutationResult = Pick<Mutation, 'login'>;

export function useLoginMutation(options?: useMutation.Options<LoginMutationResult, MutationLoginArgs['input']>): useMutation.ResultTuple<LoginMutationResult, MutationLoginArgs['input']> {
  return useMutation<LoginMutationResult, MutationLoginArgs['input']>(LOGIN_MUTATION, options);
}