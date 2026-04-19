import { gql } from "@apollo/client"

/**
 * Global user-level subscription.
 *
 * Fires whenever ANY project the authenticated user is involved in
 * (owner, co_owner or collaborator) receives a new project history entry.
 *
 * Backend returns `project_id` as a flat field — the frontend resolves
 * the project title from the Apollo cache when available.
 *
 * Backend publishes to `user_notifications:${userId}` on every
 * `createProjectHistory` for each collaborator (owner + co_owner + voluntários).
 */
export const ON_USER_PROJECT_HISTORY_ADDED = gql`
  subscription OnUserProjectHistoryAdded($userId: ID!) {
    userProjectHistoryAdded(userId: $userId) {
      id
      type
      comment
      field_name
      old_value
      new_value
      metadata
      created_at
      project_id
      user {
        id
        name
      }
    }
  }
`
