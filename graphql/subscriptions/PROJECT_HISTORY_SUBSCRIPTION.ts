import { gql } from "@apollo/client";

export const ON_PROJECT_HISTORY_ADDED = gql`
  subscription OnProjectHistoryAdded($projectId: ID!) {
    projectHistoryAdded(projectId: $projectId) {
      id
      type
      comment
      field_name
      old_value
      new_value
      metadata
      created_at
      user {
        id
        name
      }
    }
  }
`;
