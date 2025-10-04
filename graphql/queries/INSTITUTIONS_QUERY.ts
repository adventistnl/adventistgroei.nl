import { gql } from "@apollo/client";
import { INSTITUTION_FRAGMENT } from "../fragments/INSTITUTIONS_FRAGMENTS";

// export const GET_INSTITUTIONS_QUERY = gql`
// query Institutions {
//     institutions {
//         id
//         name
//         denomination
//         language_preference
//         contact_id
//         created_at
//         updated_at
//         created_by
//         updated_by
//         is_deleted
//         deleted_at
//         deleted_by
//         regions_count
//         churches_count
//         departments_count
//         users_count
//         contact {
//             id
//             phone
//             email
//             country
//             full_address
//             is_primary
//         }
//     }
//   }
// `;


// export const GET_INSTITUTION_BY_ID_FULL_DATA_QUERY = gql`
//   query InstitutionById($id: String!) {
//     institution(id: $id) {
//         id
//         name
//         denomination
//         language_preference
//         contact_id
//         created_at
//         updated_at
//         created_by
//         updated_by
//         is_deleted
//         deleted_at
//         deleted_by
//         regions_count
//         churches_count
//         departments_count
//         users_count
//         contact {
//             id
//             name
//             phone
//             mobile
//             email
//             country
//             city
//             address
//             full_address
//             postal_code
//             website
//             notes
//             is_primary
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//         subsidy_requests {
//             id
//             description
//             total_budget
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//             institution_id
//             requester_id
//             department_id
//             church_id
//             subsidy_statuses_id
//             project_id
//         }
//         direct_messages {
//             id
//             institution_id
//             sender_id
//             title
//             content
//             status
//             sent_at
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//         projects {
//             id
//             department_id
//             title
//             description
//             budget
//             language_preference
//             type
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//             event_id
//             institution_id
//         }
//         settings {
//             id
//             institution_id
//             key
//             value
//             description
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//         notifications {
//             id
//             institution_id
//             user_id
//             type
//             message
//             read_status
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//         communications {
//             id
//             institution_id
//             title
//             content
//             type
//             priority
//             status
//             language_preference
//             schedule_at
//             published_at
//             author_id
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//         departments {
//             id
//             institution_id
//             church_id
//             name
//             description
//             contact_id
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//         users {
//             id
//             name
//             email
//             password
//             language_preference
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//             contact_id
//             institution_id
//             church {
//               id
//               name
//             }
//             institution {
//               id
//               name
//             }
//             user_roles {
//               id
//               role {
//                 id
//                 name
//                 key_code
//                 description
//               }
//             }
//         }
//         regions {
//             id
//             institution_id
//             name
//             parent_region_id
//             contact_id
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//         churches {
//             id
//             institution_id
//             name
//             region_id
//             contact_id
//             created_at
//             updated_at
//             created_by
//             updated_by
//             is_deleted
//             deleted_at
//             deleted_by
//         }
//     }
//   }
// `

export const GET_INSTITUTIONS_QUERY = gql`
  query Institutions {
    institutions {
      ...InstitutionFragment
    }
  }
  ${INSTITUTION_FRAGMENT}
`;

export const GET_INSTITUTION_BY_ID_FULL_DATA_QUERY = gql`
  query InstitutionById($id: String!) {
    institution(id: $id) {
      ...InstitutionFragment
    }
  }
  ${INSTITUTION_FRAGMENT}
`;