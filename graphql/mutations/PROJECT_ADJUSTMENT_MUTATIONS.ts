import { gql } from "@apollo/client"
import {
  PROJECT_ADJUSTMENT_FIELDS,
  ADJUSTMENT_TASK_FIELDS,
} from "@/graphql/fragments/PROJECT_ADJUSTMENT_FRAGMENTS"

// ─── Create a new adjustment (text + optional tasks) ─────────────────────────

export const CREATE_ADJUSTMENT = gql`
  ${PROJECT_ADJUSTMENT_FIELDS}
  mutation CreateAdjustment($data: CreateAdjustmentDto!) {
    createAdjustment(data: $data) {
      ...ProjectAdjustmentFields
    }
  }
`

// ─── Update adjustment lifecycle status ──────────────────────────────────────

export const UPDATE_ADJUSTMENT_STATUS = gql`
  ${ADJUSTMENT_TASK_FIELDS}
  mutation UpdateAdjustmentStatus($data: UpdateAdjustmentStatusDto!) {
    updateAdjustmentStatus(data: $data) {
      id
      status
      updated_at
      tasks {
        ...AdjustmentTaskFields
      }
    }
  }
`

// ─── Task CRUD ────────────────────────────────────────────────────────────────

export const ADD_ADJUSTMENT_TASK = gql`
  ${ADJUSTMENT_TASK_FIELDS}
  mutation AddAdjustmentTask($data: AddAdjustmentTaskDto!) {
    addAdjustmentTask(data: $data) {
      ...AdjustmentTaskFields
    }
  }
`

export const TOGGLE_ADJUSTMENT_TASK = gql`
  mutation ToggleAdjustmentTask($data: ToggleAdjustmentTaskDto!) {
    toggleAdjustmentTask(data: $data) {
      id
      title
      completed
      updated_at
    }
  }
`

export const REMOVE_ADJUSTMENT_TASK = gql`
  mutation RemoveAdjustmentTask($taskId: ID!) {
    removeAdjustmentTask(taskId: $taskId) {
      id
      title
    }
  }
`
