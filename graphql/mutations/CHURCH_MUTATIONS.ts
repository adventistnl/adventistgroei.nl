import { gql } from "@apollo/client";

export const CREATE_CHURCH_MUTATION = gql`
  mutation CreateChurch(
    $institution_id: String!
    $name: String!
    $email: String!
    $phone: String!
    $contactName: String!
    $city: String!
    $country: String!
    $state: String!
    $type: ChurchType
  ) {
    createChurch(
      data: {
        institution_id: $institution_id
        name: $name
        type: $type
        contact: {
          email: $email
          phone: $phone
          name: $contactName
          city: $city
          country: $country
          state: $state
        }
      }
    ) {
      id
      name
      institution_id
      region_id
      type
      created_at
    }
  }
`;

export const UPDATE_CHURCH_MUTATION = gql`
  mutation UpdateChurch(
    $id: String!
    $name: String
    $email: String
    $phone: String
    $contactName: String
    $city: String
    $country: String
    $state: String
    $type: ChurchType
  ) {
    updateChurch(
      id: $id
      data: {
        name: $name
        type: $type
        contact: {
          email: $email
          phone: $phone
          name: $contactName
          city: $city
          country: $country
          state: $state
        }
      }
    ) {
      id
      name
      institution_id
      region_id
      type
      updated_at
    }
  }
`;

export const DELETE_CHURCH_MUTATION = gql`
  mutation DeleteChurch($id: String!) {
    deleteChurch(id: $id) {
      id
      name
      is_deleted
      deleted_at
    }
  }
`;
