import { useMutation, useQuery } from "@apollo/client/react";
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY";
import { Churches } from "@/types/Churches";
import { CREATE_CHURCH_MUTATION } from "@/graphql/mutations/CHURCH_MUTATIONS";
import { CreateChurch, CreateChurchVariables } from "@/types/CreateChurch";

export function useGetChurchesQuery(options?: useQuery.Options<Churches>): useQuery.Result<Churches> {
  return useQuery<Churches>(GET_CHURCHES_QUERY, options);
}

export function useCreateChurchMutation(options?: useMutation.Options<CreateChurch, CreateChurchVariables>): useMutation.ResultTuple<CreateChurch, CreateChurchVariables> {
  return useMutation<CreateChurch, CreateChurchVariables>(CREATE_CHURCH_MUTATION, options);
}
