import { gql } from '@apollo/client';

/**
 * Query to get subsidy status history
 */
export const GET_SUBSIDY_STATUS_HISTORY = gql`
  query GetSubsidyStatusHistory($subsidyRequestId: String!) {
    getSubsidyStatusHistory(subsidyRequestId: $subsidyRequestId) {
      id
      status_id
      previous_status_id
      type
      reason
      changed_by
      changed_at
      status {
        id
        name
        description
      }
      previous_status {
        id
        name
        description
      }
      user {
        id
        name
      }
    }
  }
`;
