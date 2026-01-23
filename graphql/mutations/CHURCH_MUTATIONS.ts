import { gql } from "@apollo/client";

export const CREATE_CHURCH_MUTATION = gql`
  mutation CreateChurch(
    $institution_id: String!
    $name: String!
    $leader_id: String!
    $email: String!
    $phone: String!
    $contactName: String!
    $city: String!
    $country: String!
    $state: String!
    $type: ChurchType
    $zip_code: String
    $house_number: Int
  ) {
    createChurch(
      data: {
        institution_id: $institution_id
        name: $name
        leader_id: $leader_id
        type: $type
        zip_code: $zip_code
        house_number: $house_number
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
      zip_code
      house_number
      created_at
      leader {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_CHURCH_MUTATION = gql`
  mutation UpdateChurch(
    $id: String!
    $name: String
    $leader_id: String
    $email: String
    $phone: String
    $contactName: String
    $city: String
    $country: String
    $state: String
    $type: ChurchType
    $zip_code: String
    $house_number: Int
  ) {
    updateChurch(
      id: $id
      data: {
        name: $name
        leader_id: $leader_id
        type: $type
        zip_code: $zip_code
        house_number: $house_number
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
      zip_code
      house_number
      updated_at
      leader {
        id
        name
        email
      }
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
