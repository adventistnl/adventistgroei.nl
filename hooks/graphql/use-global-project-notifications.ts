"use client"

import { useContext } from "react"
import { useSubscription, useApolloClient } from "@apollo/client"
import { ON_USER_PROJECT_HISTORY_ADDED } from "@/graphql/subscriptions/USER_NOTIFICATIONS_SUBSCRIPTION"
import { NotificationsContext } from "@/contexts/notifications-context"
import { useAuth } from "@/contexts/auth-context"
import { ProjectHistoryType } from "@/types/project-history"
import { GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"

/**
 * Global hook — active for the entire session once the user is logged in.
 *
 * Subscribes to `userProjectHistoryAdded(userId)` which covers ALL projects
 * where the user is owner, co_owner or collaborator.
 *
 * The backend returns `project_id` (flat field). The hook resolves the project
 * title by reading from the Apollo in-memory cache — if the project was already
 * loaded anywhere in the app (list, detail view, etc.) the title is available
 * instantly without an extra network request.
 *
 * ─── Backend contract ───────────────────────────────────────────────────────
 * Subscription payload from the backend:
 * {
 *   id, type, comment, field_name, old_value, new_value,
 *   metadata, created_at,
 *   project_id,          // ← flat field, not a nested object
 *   user: { id, name }
 * }
 *
 * Backend publishes `user_notifications:${userId}` for every collaborator
 * (owner + co_owner + voluntários) on each `createProjectHistory` call.
 * ────────────────────────────────────────────────────────────────────────────
 */
export function useGlobalProjectNotifications() {
  const { user } = useAuth()
  const notificationsCtx = useContext(NotificationsContext)
  const apolloClient = useApolloClient()

  const userId = user?.id ?? null

  useSubscription(ON_USER_PROJECT_HISTORY_ADDED, {
    variables: { userId },
    skip: !userId || !notificationsCtx,
    shouldResubscribe: true,
    onData: ({ data: subData }) => {
      const entry = subData.data?.userProjectHistoryAdded
      if (!entry || !notificationsCtx) return

      // Skip entries authored by the logged-in user
      if (entry.user?.id === userId) return

      const projectId: string | undefined = entry.project_id ?? undefined

      // Try to resolve the project title from Apollo cache (avoids extra request)
      let projectTitle = "projeto"
      if (projectId) {
        try {
          const cached = apolloClient.readQuery<{ project: { title: string } }>({
            query: GET_PROJECT_BY_ID_QUERY,
            variables: { id: projectId },
          })
          if (cached?.project?.title) projectTitle = cached.project.title
        } catch {
          // cache miss — keep generic fallback
        }
      }

      const isComment = entry.type === ProjectHistoryType.COMMENT

      notificationsCtx.addNotification({
        type: isComment ? "project_message" : "status_change",
        title: isComment
          ? `Nova mensagem em ${projectTitle}`
          : `Atualização em ${projectTitle}`,
        message: isComment
          ? `${entry.user?.name ?? "Alguém"}: ${entry.comment ?? ""}`
          : `${entry.user?.name ?? "Alguém"} alterou o status`,
        projectId,
        projectTitle,
        actorName: entry.user?.name,
      })
    },
  })
}
