import { gql } from "@apollo/client"

export const GET_PROJECT_HISTORY = gql`
  query GetProjectHistory($projectId: ID!) {
    projectHistories(projectId: $projectId) {
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
      adjustment {
        id
        status
        tasks {
          id
          title
          completed
          position
        }
      }
    }
  }
`
