import { CREATE_USER } from '@/graphql/mutations/CREATE_USER';
import { CreateUser, CreateUserVariables } from '@/types/CreateUser';
import { useMutation } from '@apollo/client/react';

export const useCreateUserMutation = () => {
  return useMutation<CreateUser, CreateUserVariables>(CREATE_USER);
};

