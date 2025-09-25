import { gql } from "@apollo/client";

export const CREATE_INSTITUTION_MUTATION = gql`
  mutation CreateInstitution(
    $name: String!
    $denomination: String!
    $description: String
    $contactEmail: String
    $contactPhone: String
    $contactFullAddress: String
    $contactCountry: String
    $languagePreference: String!
  ) {
    createInstitution(
      data: {
        name: $name
        denomination: $denomination
        description: $description
        contact: { email: $contactEmail, phone: $contactPhone, full_address: $contactFullAddress, country: $contactCountry }
        language_preference: $languagePreference
      }
    ) {
      id
    }
  }
`;

export const DELETE_INSTITUTION_MUTATION = gql`
  mutation DeleteInstitution ($id: String!) {
      deleteInstitution(id: $id) {
          id
      }
  }
`;