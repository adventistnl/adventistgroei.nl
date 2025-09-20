import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser(
    $name: String!
    $email: String!
    $password: String!
    $language_preference: String!
    $institution_id: String!
    $department_id: String!
    $church_id: String!
  ) {
    createUser(
      data: {
        name: $name
        email: $email
        password: $password
        language_preference: $language_preference
        institution_id: $institution_id
        department_id: $department_id
        church_id: $church_id
      }
    ) {
      id
      institution_id
      password
      church_id
      name
      email
      language_preference
    }
  }
`;

