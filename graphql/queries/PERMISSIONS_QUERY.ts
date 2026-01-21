import { gql } from "@apollo/client";

export const GET_ALL_PERMISSIONS_QUERY = gql`
  query Permissions {
      permissions {
          group
          data {
              id
              name
              description
              key_code
              group
              is_essential
          }
      }
  }
`;