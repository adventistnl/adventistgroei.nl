import { ADD_ROLE_TO_USER, CREATE_USER, DELETE_USER, REMOVE_ROLE_FROM_USER, UPDATE_USER } from '@/graphql/mutations/USER_MUTATIONS';
import { AddRoleToUser, AddRoleToUserVariables } from '@/types/AddRoleToUser';
import { CreateUser, CreateUserVariables } from '@/types/CreateUser';
import { DeleteUser, DeleteUserVariables } from '@/types/DeleteUser';
import { RemoveRoleFromUser, RemoveRoleFromUserVariables } from '@/types/RemoveRoleFromUser';
import { UpdateUser, UpdateUserVariables } from '@/types/UpdateUser';
import { useMutation } from '@apollo/client/react';

export const useCreateUserMutation = () => {
  return useMutation<CreateUser, CreateUserVariables>(CREATE_USER, {
    refetchQueries: ['InstitutionById']
  });
};

export const useDeleteUserMutation = () => {
  return useMutation<DeleteUser, DeleteUserVariables>(DELETE_USER, {
    refetchQueries: ['InstitutionById']
  });
}

export const useUpdateUserMutation = () => {
  return useMutation<UpdateUser, UpdateUserVariables>(UPDATE_USER, {
    refetchQueries: ['InstitutionById']
  });
};

export const useAddRoleToUserMutation = () => {
  // Placeholder for future implementation
  return useMutation<AddRoleToUser, AddRoleToUserVariables>(ADD_ROLE_TO_USER, {
    refetchQueries: ['InstitutionById']
  })
}

export const useRemoveRoleFromUserMutation = () => {
  // Placeholder for future implementation
  return useMutation<RemoveRoleFromUser, RemoveRoleFromUserVariables>(REMOVE_ROLE_FROM_USER, {
    refetchQueries: ['InstitutionById']
  })
}