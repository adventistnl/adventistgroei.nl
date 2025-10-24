import { gql } from "@apollo/client";

export const GET_REGIONS_QUERY = gql`
query Regions {
    regions {
        id
        name
        created_at
        updated_at
        created_by
        updated_by
        is_deleted
        deleted_at
        deleted_by
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
}
`