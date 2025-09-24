import { gql } from "@apollo/client";

export const GET_ALL_ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
      description
      key_code
      users {
        user_id
        is_deleted
      }
      color
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

export const GET_ROLE_BY_ID_QUERY = gql`
  query Role($id: String!) {
      role(id: $id) {
          id
          name
          description
          key_code
          color
          users {
              user_id
              is_deleted
          }
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