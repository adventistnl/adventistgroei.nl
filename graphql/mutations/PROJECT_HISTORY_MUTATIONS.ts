import { gql } from "@apollo/client"

export const CREATE_PROJECT_HISTORY = gql`
  mutation CreateProjectHistory($data: ProjectHistoryCreateDto!) {
    createProjectHistory(data: $data) {
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
`

export const DELETE_PROJECT_HISTORY = gql`
  mutation DeleteProjectHistory($id: ID!) {
    deleteProjectHistory(id: $id) {
      id
    }
  }
`
