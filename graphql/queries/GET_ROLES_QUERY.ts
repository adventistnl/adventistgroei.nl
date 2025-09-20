import { gql } from "@apollo/client";

export const GET_ROLES_QUERY = gql`
  query Roles {
    roles {
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
