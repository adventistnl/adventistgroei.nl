import { gql } from "@apollo/client";

export const CREATE_REGION = gql`
  mutation CreateRegion (
    $name: String!,
    $institution_id: String!,
    $parent_region_id: String,
    $email: String,
    $phone: String,
    $mobile: String,
    $country: String,
    $city: String,
    $full_address: String,
    $postal_code: String,
    $website: String
  ) {
    createRegion(
      data: {
        institution_id: $institution_id
        name: $name
        parent_region_id: $parent_region_id
              contact: {
                  name: $name
                  email: $email
                  phone: $phone
                  mobile: $mobile
                  country: $country
                  city: $city
                  full_address: $full_address
                  postal_code: $postal_code
                  website: $website
              }
          }
      ) {
          id
          institution_id
          name
          parent_region_id
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
`