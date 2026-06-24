"use client"

import { useContext } from "react"
import { useSubscription } from "@apollo/client"
import { ON_USER_PROJECT_HISTORY_ADDED } from "@/graphql/subscriptions/USER_NOTIFICATIONS_SUBSCRIPTION"
import { NotificationsContext } from "@/contexts/notifications-context"
import { useAuth } from "@/contexts/auth-context"

/**
 * Global hook — active for the entire session once the user is logged in.
 *
 * Subscribes to `userProjectHistoryAdded(userId)` which covers ALL projects
 * where the user is owner, co_owner or collaborator.
 *
 * On each event, instead of creating a local notification with a temporary ID
 * (which caused duplicates alongside the DB-persisted item), we simply trigger
 * a refetch of `myNotifications` from the backend. The notification was already
 * persisted by the backend before the WebSocket event fired, so the refetch
 * returns the real UUID — no duplicates possible.
 */
export function useGlobalProjectNotifications() {
  const { user } = useAuth()
  const notificationsCtx = useContext(NotificationsContext)

  const userId = user?.id ?? null

  useSubscription(ON_USER_PROJECT_HISTORY_ADDED, {
    variables: { userId },
    skip: !userId || !notificationsCtx,
    shouldResubscribe: true,
    onData: ({ data: subData }) => {
      const entry = subData.data?.userProjectHistoryAdded
      if (!entry || !notificationsCtx) return

      // Skip entries authored by the logged-in user (they don't get notified of their own actions)
      if (entry.user?.id === userId) return

      // Re-fetch from DB — notification already persisted by the backend.
      // Using the DB as single source of truth avoids temp-ID vs UUID duplicates.
      notificationsCtx.refetchFromDB()
    },
  })
}
