import { gql } from "@apollo/client";

export const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($id: String!, $permissionIds: [String!]!) {
      updateRole(input: { permissionIds: $permissionIds, id: $id }) {
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