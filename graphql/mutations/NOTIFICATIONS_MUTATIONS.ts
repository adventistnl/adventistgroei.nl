import { gql } from "@apollo/client"

/**
 * Marks a single notification as read for the authenticated user.
 * Called when the user clicks on a specific notification or its read button.
 */
export const MARK_NOTIFICATION_READ_MUTATION = gql`
  mutation MarkNotificationRead($id: String!) {
    markNotificationRead(id: $id) {
      id
      read_status
    }
  }
`

/**
 * Marks ALL notifications of the authenticated user as read.
 * Called when the user clicks "Mark all as read" in the sidebar.
 */
export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      count
    }
  }
`

/**
 * Deletes a single notification for the authenticated user.
 * Called when the user clicks the delete/remove button on a notification.
 */
export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotification($id: String!) {
    deleteNotification(id: $id) {
      id
    }
  }
`
