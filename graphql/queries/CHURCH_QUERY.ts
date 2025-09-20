import { gql } from "@apollo/client";

export const GET_CHURCHES_QUERY = gql`
  query Churches {
      churches {
          id
          institution_id
          name
          region_id
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