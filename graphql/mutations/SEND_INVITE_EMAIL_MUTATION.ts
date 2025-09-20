import { gql } from "@apollo/client";

export const SEND_INVITE_EMAIL_MUTATION = gql`
  mutation SendInviteEmail(
    $inviter_id: String!,
    $to: String!,
    $message: String,
    $url: String!
  ) {
    sendInviteEmail(
      data: {
        inviter_id: $inviter_id,
        to: $to,
        message: $message,
        url: $url
      }
    )
  }
`;
