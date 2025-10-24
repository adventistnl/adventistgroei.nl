import { gql } from "@apollo/client";

export const INVITE_USER_MUTATION = gql`
  mutation InviteUser(
    $role_ids: [String!]!,
    $email: String!,
    $institution_id: String!,
    $inviter_id: String!,
    $language_preference: String!
  ) {
    inviteUser(
      data: {
        role_ids: $role_ids,
        email: $email,
        institution_id: $institution_id,
        inviter_id: $inviter_id,
        language_preference: $language_preference
      }
    ) {
      token
    }
  }
`;

export const VALIDATE_INVITE_TOKEN_MUTATION = gql`
  mutation ValidateInviteToken($token: String!) {
      validateInviteToken(
          token: $token
      ) {
          role_ids
          email
          institution_id
          inviter_id
          language_preference
          exp
      }
  }
`;