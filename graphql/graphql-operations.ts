import { gql } from '@apollo/client';

export const USER_QUERY = gql`
  query User {
    user(id: null) {
      id
      institution_id
      church_id
      name
      email
      language_preference
      contact_id
      created_at
      updated_at
      created_by
      updated_by
      is_deleted
      deleted_at
      deleted_by
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login {
    login(input: null) {
      accessToken
      expiresIn
    }
  }
`;
