import { gql } from "@apollo/client"

export const ADJUSTMENT_TASK_FIELDS = gql`
  fragment AdjustmentTaskFields on AdjustmentTask {
    id
    title
    completed
    position
    created_at
    updated_at
  }
`

export const PROJECT_ADJUSTMENT_FIELDS = gql`
  ${ADJUSTMENT_TASK_FIELDS}
  fragment ProjectAdjustmentFields on ProjectAdjustment {
    id
    status
    created_at
    updated_at
    project_history {
      id
      project_id
      comment
      created_at
      user {
        id
        name
      }
    }
    tasks {
      ...AdjustmentTaskFields
    }
  }
`
