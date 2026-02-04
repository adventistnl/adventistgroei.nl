import { gql } from "@apollo/client";

/**
 * Query to fetch all subsidy requests
 * Can optionally filter by institution_id
 */
export const GET_ALL_SUBSIDY_REQUESTS = gql`
  query GetAllSubsidyRequests {
    subsidyRequests {
      id
      description
      total_budget
      approved_amount
      rejection_reason
      created_at
      updated_at
      approved_at
      created_by
      updated_by
      approved_by
      institution_id
      department_id
      church_id
      project_id
      is_for_advance
      advance_amount
      subsidy_status {
        id
        name
        description
      }
      institution {
        id
        name
      }
      department {
        id
        name
      }
      church {
        id
        name
      }
      items {
        id
        subsidy_request_id
        project_activity_id
        requested_amount
        approved_amount
        notes
        created_at
        updated_at
        project_activity {
          id
          name
          description
          budget_amount
          status
          priority
          is_subsidized
        }
      }
      receipts: subsidy_receipts {
         id
         is_validated
      }
    }
  }
`;

/**
 * Query to fetch subsidy requests by institution ID
 */
// export const GET_SUBSIDY_REQUESTS_BY_INSTITUTION = gql`
//   query GetSubsidyRequestsByInstitution($institution_id: String!) {
//     subsidyRequests(institution_id: $institution_id) {
//       id
//       description
//       total_budget
//       approved_amount
//       rejection_reason
//       created_at
//       updated_at
//       approved_at
//       created_by
//       updated_by
//       approved_by
//       institution_id
//       department_id
//       church_id
//       project_id
//       subsidy_status {
//         id
//         name
//         description
//       }
//       institution {
//         id
//         name
//       }
//       department {
//         id
//         name
//       }
//       church {
//         id
//         name
//       }
//       items {
//         id
//         subsidy_request_id
//         project_activity_id
//         requested_amount
//         approved_amount
//         notes
//         project_activity {
//           id
//           name
//           description
//           budget_amount
//           status
//         }
//       }
//     }
//   }
// `;
