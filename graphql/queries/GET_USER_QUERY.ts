import { gql } from '@apollo/client';
import { USER_MODEL_FRAGMENT } from '../fragments/INSTITUTIONS_FRAGMENTS';

export const GET_USER_QUERY = gql`
  query User($id: String!) {
    user(id: $id) {
      ...UserModelFragment
      contact {
        id
        name
        phone
        mobile
        email
        country
        city
        state
        address
        full_address
        postal_code
        website
        notes
        is_primary
        created_at
        updated_at
      }
    }
  }
  ${USER_MODEL_FRAGMENT}
`;

export const GET_ALL_USERS_QUERY = gql`
  query Users($institution_id: String) {
    users(institution_id: $institution_id) {
      ...UserModelFragment
    }
  }
  ${USER_MODEL_FRAGMENT}
`;


