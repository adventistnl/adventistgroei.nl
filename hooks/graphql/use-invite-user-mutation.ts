import { INVITE_USER_MUTATION } from "@/graphql/mutations/INVITE_USER_MUTATION";
import { useMutation } from "@apollo/client/react";
import { InviteUser, InviteUserVariables } from "@/types/InviteUser";

export function useInviteUserMutation(options?: useMutation.Options<InviteUser, InviteUserVariables>): useMutation.ResultTuple<InviteUser, InviteUserVariables> {
  return useMutation<InviteUser, InviteUserVariables>(INVITE_USER_MUTATION, options);
}
