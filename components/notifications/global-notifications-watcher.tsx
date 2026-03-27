"use client"

import { useGlobalProjectNotifications } from "@/hooks/graphql/use-global-project-notifications"

/**
 * Mounts the global WS subscription for the authenticated user.
 *
 * Renders nothing — exists solely to keep `useGlobalProjectNotifications`
 * alive for the entire session, regardless of which page or modal is open.
 *
 * Must be placed inside: GraphQLProvider > AuthProvider > NotificationsProvider
 */
export function GlobalNotificationsWatcher() {
  useGlobalProjectNotifications()
  return null
}
