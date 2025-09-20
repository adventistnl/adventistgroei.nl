import { SEND_INVITE_EMAIL_MUTATION } from "@/graphql/mutations/SEND_INVITE_EMAIL_MUTATION";
import { useMutation } from "@apollo/client/react";
import { SendInviteEmail, SendInviteEmailVariables } from "@/types/SendInviteEmail";

export function useSendInviteEmailMutation(options?: useMutation.Options<SendInviteEmail, SendInviteEmailVariables>): useMutation.ResultTuple<SendInviteEmail, SendInviteEmailVariables> {
  return useMutation<SendInviteEmail, SendInviteEmailVariables>(SEND_INVITE_EMAIL_MUTATION, options);
}
