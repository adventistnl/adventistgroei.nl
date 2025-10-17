import { INVITE_USER_MUTATION, VALIDATE_INVITE_TOKEN_MUTATION } from "@/graphql/mutations/INVITE_USER_MUTATION";
import { useMutation } from "@apollo/client/react";
import { InviteUser, InviteUserVariables } from "@/types/InviteUser";
import { ValidateInviteToken, ValidateInviteTokenVariables } from "@/types/ValidateInviteToken";

export function useInviteUserMutation(options?: useMutation.Options<InviteUser, InviteUserVariables>): useMutation.ResultTuple<InviteUser, InviteUserVariables> {
  return useMutation<InviteUser, InviteUserVariables>(INVITE_USER_MUTATION, options);
}

export function useValidateInviteTokenMutation(options?: useMutation.Options<ValidateInviteToken, ValidateInviteTokenVariables>): useMutation.ResultTuple<ValidateInviteToken, ValidateInviteTokenVariables> {
  return useMutation<ValidateInviteToken, ValidateInviteTokenVariables>(VALIDATE_INVITE_TOKEN_MUTATION, options);
}
