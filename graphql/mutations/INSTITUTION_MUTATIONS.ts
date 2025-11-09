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

export const UPDATE_INSTITUTION_MUTATION = gql`
  mutation UpdateInstitution(
    $id: String!
    $name: String
    $denomination: String
    $language_preference: String
    $description: String
    $email: String
    $phone: String
    $website: String
    $country: String
    $state: String
    $city: String
    $contactId: String!
  ) {
    updateInstitution(
      data: {
        name: $name
        denomination: $denomination
        language_preference: $language_preference
        description: $description
        contact: {
          email: $email
          phone: $phone
          website: $website
          country: $country
          state: $state
          city: $city
          id: $contactId
        }
      }
      id: $id
    ) {
      id
    }
  }
`;

export const UPDATE_INSTITUTION_CONTACT_MUTATION = gql`
  mutation UpdateInstitutionContact(
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
    updateInstitution(
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