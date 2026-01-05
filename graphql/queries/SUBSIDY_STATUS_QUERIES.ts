import { gql } from "@apollo/client";

/**
 * Query to fetch all subsidy statuses
 */
export const GET_ALL_SUBSIDY_STATUSES = gql`
  query GetAllSubsidyStatuses {
    subsidyStatuses {
      id
      name
      description
    }
  }
`;
