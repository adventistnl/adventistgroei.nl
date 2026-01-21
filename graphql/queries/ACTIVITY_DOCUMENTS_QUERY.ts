import { gql } from '@apollo/client'

export const GET_ACTIVITY_DOCUMENTS = gql`
  query GetActivityDocuments($activityId: ID!) {
    getActivityDocuments(activityId: $activityId) {
      id
      activity_id
      project_activity_id
      file_url
      drive_file_id
      filename
      type
      is_validated
      uploaded_by
      created_at
      validated_at
      updated_at
      updated_by
      is_deleted
      deleted_at
      deleted_by
    }
  }
`
