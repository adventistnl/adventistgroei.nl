import { gql } from "@apollo/client"
import { PROJECT_ADJUSTMENT_FIELDS } from "@/graphql/fragments/PROJECT_ADJUSTMENT_FRAGMENTS"

export const GET_PROJECT_ADJUSTMENTS = gql`
  ${PROJECT_ADJUSTMENT_FIELDS}
  query GetProjectAdjustments($projectId: ID!) {
    projectAdjustments(projectId: $projectId) {
      ...ProjectAdjustmentFields
    }
  }
`

export const GET_PROJECT_ADJUSTMENT = gql`
  ${PROJECT_ADJUSTMENT_FIELDS}
  query GetProjectAdjustment($id: ID!) {
    projectAdjustment(id: $id) {
      ...ProjectAdjustmentFields
    }
  }
`
