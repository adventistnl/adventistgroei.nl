import { CREATE_INSTITUTION_MUTATION, DELETE_INSTITUTION_MUTATION, UPDATE_INSTITUTION_MUTATION } from '@/graphql/mutations/INSTITUTION_MUTATIONS';
import { CreateInstitution, CreateInstitutionVariables } from '@/types/CreateInstitution';
import { DeleteInstitution, DeleteInstitutionVariables } from '@/types/DeleteInstitution';
import { UpdateInstitution, UpdateInstitutionVariables } from '@/types/UpdateInstitution';
import { useMutation } from '@apollo/client/react';

export const useCreateInstitutionMutation = (options?: useMutation.Options<CreateInstitution, CreateInstitutionVariables>): useMutation.ResultTuple<CreateInstitution, CreateInstitutionVariables> => {
  return useMutation<CreateInstitution, CreateInstitutionVariables>(CREATE_INSTITUTION_MUTATION, options);
};

export const useDeleteInstitutionMutation = (options?: useMutation.Options<DeleteInstitution, DeleteInstitutionVariables>): useMutation.ResultTuple<DeleteInstitution, DeleteInstitutionVariables> => {
  return useMutation<DeleteInstitution, DeleteInstitutionVariables>(DELETE_INSTITUTION_MUTATION, options);
}

export const useUpdateInstitutionMutation = (options?: useMutation.Options<UpdateInstitution, UpdateInstitutionVariables>): useMutation.ResultTuple<UpdateInstitution, UpdateInstitutionVariables> => {
  return useMutation<UpdateInstitution, UpdateInstitutionVariables>(UPDATE_INSTITUTION_MUTATION, options);
}