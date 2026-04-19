import { gql } from "@apollo/client";

export const CREATE_INSTITUTION_POSITION_MUTATION = gql`
  mutation CreateInstitutionPosition($data: InstitutionPositionCreateDto!) {
    createInstitutionPosition(data: $data) {
      id
      position_type
      institution_id
      user_id
      created_at
      user {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_INSTITUTION_POSITION_MUTATION = gql`
  mutation UpdateInstitutionPosition($id: String!, $data: InstitutionPositionUpdateDto!) {
    updateInstitutionPosition(id: $id, data: $data) {
      id
      position_type
      institution_id
      user_id
      updated_at
      user {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_INSTITUTION_POSITION_MUTATION = gql`
  mutation DeleteInstitutionPosition($id: String!) {
    deleteInstitutionPosition(id: $id) {
      id
      position_type
      is_deleted
    }
  }
`;
