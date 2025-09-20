import { gql } from '@apollo/client';

export const GET_USER_QUERY = gql`
  query User($id: String!) {
    user(id: $id) {
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

export const GET_ALL_USERS_QUERY = gql`
  query Users {
    users {
        id
        institution_id
        password
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


