import { gql } from "@apollo/client";

export const UPDATE_ROLE_MUTATION = gql`
    mutation UpdateRole(
        $id: String!
        $name: String
        $description: String
        $key_code: String
        $permissionIds: [String!]
    ) {
        updateRole(
            input: {
                id: $id
                name: $name
                description: $description
                key_code: $key_code
                permissionIds: $permissionIds
            }
        ) {
            id
            name
            description
            key_code
            permissions {
                group
                data {
                    id
                    name
                    description
                    key_code
                    group
                }
            }
        }
    }
`;

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($name: String!, $description: String!, $key_code: String!) {
      createRole(
          input: {
              name: $name
              description: $description
              key_code: $key_code
          }
      ) {
          id
      }
  }
`;

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($id: String!) {
      deleteRole(id: $id) {
          id
      }
  }
`