import { gql } from "@apollo/client";

export const CREATE_REGION = gql`
  mutation CreateRegion(
    $name: String!
    $institution_id: String!
    $parent_region_id: String
    $description: String
    $email: String
    $phone: String
    $website: String
  ) {
    createRegion(
      data: {
        institution_id: $institution_id
        name: $name
        parent_region_id: $parent_region_id
        description: $description
        contact: {
          email: $email
          phone: $phone
          website: $website
        }
      }
    ) {
      id
    }
  }
`;

// Ajustando a mutation `UPDATE_REGION` para seguir o padrão de `CREATE_REGION`
export const UPDATE_REGION = gql`
  mutation UpdateRegion(
    $id: ID!
    $name: String!
    $institution_id: String
    $parent_region_id: String
    $description: String
    $email: String
    $phone: String
    $website: String
  ) {
    updateRegion(
      id: $id
      data: {
        name: $name
        institution_id: $institution_id
        parent_region_id: $parent_region_id
        description: $description
        contact: {
          email: $email
          phone: $phone
          website: $website
        }
      }
    ) {
      id
    }
  }
`;


export const UPDATE_REGION_CONTACT = gql`
  mutation UpdateRegionContact(
    $id: String!
    $contactId: String!
    $name: String
    $phone: String
    $mobile: String
    $country: String
    $email: String
    $city: String
    $address: String
    $full_address: String
    $postal_code: String
    $website: String
    $notes: String
    $is_primary: Boolean
  ) {
    updateRegion(
      data: {
        contact: {
          name: $name
          phone: $phone
          mobile: $mobile
          country: $country
          email: $email
          city: $city
          address: $address
          full_address: $full_address
          postal_code: $postal_code
          website: $website
          notes: $notes
          is_primary: $is_primary
          id: $contactId
        }
      }
      id: $id
    ) {
      id
    }
  }
`;
