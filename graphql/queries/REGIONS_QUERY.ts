import { gql } from "@apollo/client";

export const GET_REGIONS_QUERY = gql`
query Regions {
    regions {
        id
        institution_id
        name
        parent_region_id
        contact_id
        created_at
        updated_at
        created_by
        updated_by
        is_deleted
        deleted_at
        deleted_by
        institution {
            id
            name
            denomination
            language_preference
            contact_id
            created_at
            updated_at
            created_by
            updated_by
            is_deleted
            deleted_at
            deleted_by
        }
        contact {
            id
            name
            phone
            mobile
            email
            country
            city
            address
            full_address
            postal_code
            website
            notes
            is_primary
            created_at
            updated_at
            created_by
            updated_by
            is_deleted
            deleted_at
            deleted_by
        }
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
        children {
            id
            institution_id
            name
            parent_region_id
            contact_id
            created_at
            updated_at
            created_by
            updated_by
            is_deleted
            deleted_at
            deleted_by
        }
        parent_region {
            id
            institution_id
            name
            parent_region_id
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