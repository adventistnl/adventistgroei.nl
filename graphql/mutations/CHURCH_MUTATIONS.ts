import { gql } from "@apollo/client";

export const CREATE_CHURCH_MUTATION = gql`
  mutation CreateChurch(
    $institution_id: String!
    $name: String!
    $region_id: String!
    $email: String!
    $phone: String!
    $contactName: String!
    $city: String!
    $type: ChurchType
  ) {
    createChurch(
      data: {
        institution_id: $institution_id
        name: $name
        region_id: $region_id
        type: $type
        contact: {
          email: $email
          phone: $phone
          name: $contactName
          city: $city
        }
      }
    ) {
      id
    }
  }
`;