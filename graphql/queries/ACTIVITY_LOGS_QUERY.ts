import { gql } from "@apollo/client";

export const GET_PROJECT_ACTIVITY_LOGS_QUERY = gql`
  query GetProjectActivityLogs($activityId: ID!) {
    projectActivityLogs(activityId: $activityId) {
      id
      activity_id
      user_id
      action
      field_name
      old_value
      new_value
      metadata
      created_at
      user {
        id
        name
        email
      }
    }
  }
`;
