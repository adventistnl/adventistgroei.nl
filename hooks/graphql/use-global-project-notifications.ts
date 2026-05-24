"use client"

import { useContext } from "react"
import { useSubscription, useApolloClient } from "@apollo/client"
import { useTranslation } from "react-i18next"
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
 * For subsidy-related entries, `metadata` will contain:
 *   { subsidyDescription: string, newStatus: string }
 *
 * Backend publishes `userProjectHistoryAdded` event for every collaborator
 * (owner + co_owner + voluntários) on each `ProjectHistoryService.logEvent()` call.
 * ────────────────────────────────────────────────────────────────────────────
 */
export function useGlobalProjectNotifications() {
  const { user } = useAuth()
  const notificationsCtx = useContext(NotificationsContext)
  const apolloClient = useApolloClient()
  const { t } = useTranslation()

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
      const fallbackProject = t("notifications.fallback_project", "project")
      let projectTitle = fallbackProject
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

      const actorName = entry.user?.name ?? t("notifications.fallback_actor", "Someone")
      const isComment = entry.type === ProjectHistoryType.COMMENT
      // Subsidy-related history entries carry subsidyDescription in metadata
      const subsidyDescription: string | undefined = (entry.metadata as any)?.subsidyDescription
      const newStatus: string | undefined = (entry.metadata as any)?.newStatus

      if (isComment) {
        notificationsCtx.addNotification({
          type: "project_message",
          title: t("notifications.new_message_title", "New message in {{projectTitle}}", { projectTitle }),
          message: t("notifications.new_message_body", "{{actor}}: {{message}}", {
            actor: actorName,
            message: entry.comment ?? "",
          }),
          projectId,
          projectTitle,
          actorName,
        })
      } else if (subsidyDescription) {
        // Subsidy status change notification
        notificationsCtx.addNotification({
          type: "status_change",
          title: t("notifications.subsidy_change_title", "Subsidy update in {{projectTitle}}", { projectTitle }),
          message: t("notifications.subsidy_change_message", "Subsidy \"{{subsidy}}\" changed to \"{{status}}\"", {
            subsidy: subsidyDescription,
            status: newStatus ?? entry.new_value ?? "",
          }),
          projectId,
          projectTitle,
          actorName,
        })
      } else {
        // Project status change or generic update
        notificationsCtx.addNotification({
          type: "status_change",
          title: t("notifications.status_change_title", "Update in {{projectTitle}}", { projectTitle }),
          message: t("notifications.status_change_message", "{{actor}} changed the project status to \"{{status}}\"", {
            actor: actorName,
            status: newStatus ?? entry.new_value ?? "",
          }),
          projectId,
          projectTitle,
          actorName,
        })
      }
    },
  })
}
