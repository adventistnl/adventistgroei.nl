import { gql } from '@apollo/client'

export const UPDATE_OWN_USER = gql`
  mutation UpdateOwnUser($data: UserUpdateDto!) {
    updateOwnUser(data: $data) {
      id
      name
      email
      recieve_emails
      contact {
        phone
        address
      }
      language_preference
      institution_id
      church_id
      institution {
        id
        name
      }
      church {
        id
        name
      }
      created_at
      updated_at
    }
  }
`
