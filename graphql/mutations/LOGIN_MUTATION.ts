import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      accessToken
      expiresIn
      user {
        id
        name
        email
        language_preference
        user_roles {
            id
            name
            description
            key_code
            permissions {
                group
                data {
                    name
                    resolver_name
                }
            }
        }
      }
    }
  }
`;