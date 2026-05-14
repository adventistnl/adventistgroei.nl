import { gql } from "@apollo/client";

export const GET_INSTITUTION_POSITIONS_QUERY = gql`
  query GetInstitutionPositions($institution_id: String!) {
    institutionPositions(institution_id: $institution_id) {
      id
      position_type
      institution_id
      user_id
      is_deleted
      created_at
      updated_at
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_INSTITUTION_POSITION_QUERY = gql`
  query GetInstitutionPosition($id: String!) {
    institutionPosition(id: $id) {
      id
      position_type
      institution_id
      user_id
      created_at
      updated_at
      user {
        id
        name
        email
      }
    }
  }
`;
