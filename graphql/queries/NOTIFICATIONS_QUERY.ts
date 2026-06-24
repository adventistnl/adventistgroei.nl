import { gql } from "@apollo/client"

/**
 * Fetches the 50 most recent notifications for the authenticated user.
 * Called on AppLayout mount to hydrate the notification sidebar with
 * any missed events (browser closed, offline, or other device).
 */
export const MY_NOTIFICATIONS_QUERY = gql`
  query MyNotifications {
    myNotifications {
      id
      type
      title
      message
      metadata
      read_status
      project_id
      created_at
    }
  }
`
