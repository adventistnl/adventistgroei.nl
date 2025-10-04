import { gql } from '@apollo/client';

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment(
    $name: String!,
    $description: String!,
    $institution: String!,
    $church: String!,
    $contactName: String,
    $email: String,
    $phone: String,
    $city: String
  ) {
    createDepartment(
      data: {
        name: $name,
        description: $description,
        institution: $institution,
        church: $church,
        contact: {
          name: $contactName,
          email: $email,
          phone: $phone,
          city: $city
        }
      }
    ) {
      id
    }
  }
`;