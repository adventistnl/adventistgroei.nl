import { gql } from "@apollo/client";

export const INVITE_USER_MUTATION = gql`
  mutation InviteUser(
    $role_ids: [String!]!,
    $email: String!,
    $institution_id: String!,
    $inviter_id: String!,
    $language_preference: String!
    $church_id: String,
    $church_department_id: String,
    $institution_department_id: String
  ) {
    inviteUser(
      data: {
        role_ids: $role_ids,
        email: $email,
        institution_id: $institution_id,
        inviter_id: $inviter_id,
        language_preference: $language_preference,
        church_id: $church_id,
        church_department_id: $church_department_id,
        institution_department_id: $institution_department_id
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
          institution_department_id
          church_id
          church_department_id
          inviter_id
          language_preference
          exp
      }
  }
`;