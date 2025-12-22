import { gql } from '@apollo/client'

export const UPLOAD_ACTIVITY_DOCUMENT = gql`
  mutation UploadActivityDocument($input: UploadActivityDocumentDto!, $file: Upload!) {
    uploadActivityDocument(input: $input, file: $file) {
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

export const DELETE_ACTIVITY_DOCUMENT = gql`
  mutation DeleteActivityDocument($id: ID!) {
    deleteActivityDocument(id: $id) {
      id
      is_deleted
      deleted_at
      deleted_by
    }
  }
`

export const VALIDATE_ACTIVITY_DOCUMENT = gql`
  mutation ValidateActivityDocument($id: ID!) {
    validateActivityDocument(id: $id) {
      id
      is_validated
      validated_at
      updated_at
      updated_by
    }
  }
`

// DEPRECATED: Download agora usa REST endpoint (/activity-documents/:id/download)
// export const DOWNLOAD_ACTIVITY_DOCUMENT = gql`
//   query DownloadActivityDocument($id: ID!) {
//     downloadActivityDocument(id: $id)
//   }
// `
