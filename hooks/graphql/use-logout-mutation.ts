import { useMutation } from '@apollo/client';
import { LOGOUT_MUTATION } from '@/graphql/mutations/LOGOUT_MUTATION';

export function useLogoutMutation() {
  return useMutation(LOGOUT_MUTATION);
}
