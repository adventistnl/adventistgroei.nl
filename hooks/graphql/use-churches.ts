import { useMutation, useQuery } from "@apollo/client/react";
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY";
import { Churches } from "@/types/Churches";
import { CREATE_CHURCH_MUTATION, UPDATE_CHURCH_MUTATION, DELETE_CHURCH_MUTATION } from "@/graphql/mutations/CHURCH_MUTATIONS";
import { CreateChurch, CreateChurchVariables } from "@/types/CreateChurch";
import { UpdateChurch, UpdateChurchVariables } from "@/types/UpdateChurch";

export function useGetChurchesQuery(options?: useQuery.Options<Churches>): useQuery.Result<Churches> {
  return useQuery<Churches>(GET_CHURCHES_QUERY, options);
}

export function useCreateChurchMutation(options?: useMutation.Options<CreateChurch, CreateChurchVariables>): useMutation.ResultTuple<CreateChurch, CreateChurchVariables> {
  return useMutation<CreateChurch, CreateChurchVariables>(CREATE_CHURCH_MUTATION, options);
}

export function useUpdateChurchMutation(options?: useMutation.Options<UpdateChurch, UpdateChurchVariables>): useMutation.ResultTuple<UpdateChurch, UpdateChurchVariables> {
  return useMutation<UpdateChurch, UpdateChurchVariables>(UPDATE_CHURCH_MUTATION, options);
}

export function useDeleteChurchMutation(options?: useMutation.Options<any, { id: string }>): useMutation.ResultTuple<any, { id: string }> {
  return useMutation<any, { id: string }>(DELETE_CHURCH_MUTATION, options);
}
