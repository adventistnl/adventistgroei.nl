"use client"

import { useQuery, useMutation, useSubscription } from "@apollo/client"
import { useCallback, useEffect } from "react"
import { GET_PROJECT_HISTORY } from "@/graphql/queries/PROJECT_HISTORY_QUERY"
import {
  CREATE_PROJECT_HISTORY,
  DELETE_PROJECT_HISTORY,
} from "@/graphql/mutations/PROJECT_HISTORY_MUTATIONS"
import { ON_PROJECT_HISTORY_ADDED } from "@/graphql/subscriptions/PROJECT_HISTORY_SUBSCRIPTION"
import {
  ProjectHistoryType,
  ProjectHistoryCreateInput,
  ProjectHistoryEntry,
} from "@/types/project-history"

// ─── Debug flag — set to false to silence in production ─────────────────────
// const DEBUG = true
// const log = (...args: unknown[]) => DEBUG && console.log("[ProjectHistory]", ...args)
// const warn = (...args: unknown[]) => DEBUG && console.warn("[ProjectHistory]", ...args)

// ─── Public API ───────────────────────────────────────────────────────────────

export interface UseProjectHistoryOptions {
  /** Project ID to fetch history for. Pass undefined/null to skip fetching. */
  projectId: string | undefined | null
  /** Skip the initial network fetch (useful when you only need `logHistory`). */
  skipFetch?: boolean
  /** Used to label notifications pushed to NotificationsContext. */
  projectTitle?: string
}

export interface UseProjectHistoryReturn {
  entries: ProjectHistoryEntry[]
  loading: boolean
  refetch: () => void
  /** Post a manual or automatic history entry. Refetches the list on success. */
  logHistory: (input: Omit<ProjectHistoryCreateInput, "project_id">) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  creating: boolean
  deleting: boolean
}

export function useProjectHistory({
  projectId,
  skipFetch = false,
  projectTitle,
}: UseProjectHistoryOptions): UseProjectHistoryReturn {
  const skip = skipFetch || !projectId
  // Use context directly so it gracefully no-ops when provider is absent
  // (notifications are now handled globally by GlobalNotificationsWatcher)

  const { data, loading, refetch } = useQuery(GET_PROJECT_HISTORY, {
    variables: { projectId },
    skip,
    fetchPolicy: "cache-and-network",
  })

  const [createMutation, { loading: creating }] = useMutation(CREATE_PROJECT_HISTORY, {
    onError: () => {
      // History logging failures are intentionally silent to avoid noise
    },
  })

  const [deleteMutation, { loading: deleting }] = useMutation(DELETE_PROJECT_HISTORY, {
    onError: () => {},
  })

  // Real-time subscription — updates Apollo cache without refetch
  useSubscription(ON_PROJECT_HISTORY_ADDED, {
    variables: { projectId },
    skip,
    shouldResubscribe: true,
    onData: ({ client, data: subData }) => {
      const newEntry = subData.data?.projectHistoryAdded
      if (!newEntry) {
        warn("subscription: no entry in payload", subData)
        return
      }
      const cached = client.readQuery<{ projectHistories: ProjectHistoryEntry[] }>({
        query: GET_PROJECT_HISTORY,
        variables: { projectId },
      })
      const existingList = cached?.projectHistories ?? []
      const withoutDuplicate = existingList.filter((e) => e.id !== newEntry.id)

      if (withoutDuplicate.length < existingList.length) {
        warn("subscription: dedup — replaced existing entry", newEntry.id)
      } else {
        log("subscription: new entry received", newEntry.id, newEntry.type)
      }

      client.writeQuery({
        query: GET_PROJECT_HISTORY,
        variables: { projectId },
        data: { projectHistories: [newEntry, ...withoutDuplicate] },
      })

      // NOTE: Notifications for other users are handled globally by
      // GlobalNotificationsWatcher (useGlobalProjectNotifications).
      // No notification push here to avoid duplicates.
    },
  })

  const logHistory = useCallback(
    async (input: Omit<ProjectHistoryCreateInput, "project_id">) => {
      if (!projectId) return
      await createMutation({
        variables: {
          data: {
            project_id: projectId,
            ...input,
          },
        },
        // Write the new entry directly to the cache so the author sees it
        // immediately, without waiting for the WebSocket subscription.
        // The subscription's dedup guard will skip it if it arrives later via WS.
        update(cache, { data: mutationData }) {
          const newEntry = mutationData?.createProjectHistory as ProjectHistoryEntry | undefined
          if (!newEntry) return
          const cached = cache.readQuery<{ projectHistories: ProjectHistoryEntry[] }>({
            query: GET_PROJECT_HISTORY,
            variables: { projectId },
          })
          const withoutDuplicate = (cached?.projectHistories ?? []).filter(
            (e) => e.id !== newEntry.id
          )
          cache.writeQuery({
            query: GET_PROJECT_HISTORY,
            variables: { projectId },
            data: { projectHistories: [newEntry, ...withoutDuplicate] },
          })
        },
      })
    },
    [projectId, createMutation]
  )

  const deleteEntry = useCallback(
    async (id: string) => {
      await deleteMutation({
        variables: { id },
        // Update the cache directly instead of refetching over the network.
        update(cache) {
          const cached = cache.readQuery<{ projectHistories: ProjectHistoryEntry[] }>({
            query: GET_PROJECT_HISTORY,
            variables: { projectId },
          })
          if (!cached) return
          cache.writeQuery({
            query: GET_PROJECT_HISTORY,
            variables: { projectId },
            data: {
              projectHistories: cached.projectHistories.filter((e) => e.id !== id),
            },
          })
        },
      })
    },
    [projectId, deleteMutation]
  )

  return {
    entries: (data?.projectHistories ?? []) as ProjectHistoryEntry[],
    loading,
    refetch,
    logHistory,
    deleteEntry,
    creating,
    deleting,
  }
}

// ─── Convenience: log a comment ──────────────────────────────────────────────
export function buildCommentPayload(comment: string): Omit<ProjectHistoryCreateInput, "project_id"> {
  return { type: ProjectHistoryType.COMMENT, comment }
}

// ─── Convenience: log a status change ───────────────────────────────────────
export function buildStatusChangedPayload(
  oldStatus: string,
  newStatus: string
): Omit<ProjectHistoryCreateInput, "project_id"> {
  return {
    type: ProjectHistoryType.STATUS_CHANGED,
    field_name: "status",
    old_value: oldStatus,
    new_value: newStatus,
  }
}

// ─── Convenience: log any field update ──────────────────────────────────────
export function buildFieldUpdatedPayload(
  fieldName: string,
  oldValue: string,
  newValue: string,
  type: ProjectHistoryType = ProjectHistoryType.UPDATED
): Omit<ProjectHistoryCreateInput, "project_id"> {
  return { type, field_name: fieldName, old_value: oldValue, new_value: newValue }
}

// ─── Convenience: log an adjustment request (ADJUSTMENTS_NEEDED flow) ────────
/**
 * Creates an ADJUSTMENT_NEEDED history entry with the reviewer's justification.
 * The resulting entry is the "open" adjustment record that will be shown as a
 * banner notification until resolved.
 *
 * @param justification - free-text written by the reviewer explaining what needs to change
 */
export function buildAdjustmentNeededPayload(
  justification: string
): Omit<ProjectHistoryCreateInput, "project_id"> {
  return {
    type: ProjectHistoryType.ADJUSTMENT_NEEDED,
    comment: justification,
  }
}

// ─── Convenience: mark an adjustment as resolved ─────────────────────────────
/**
 * Creates an ADJUSTMENT_RESOLVED history entry that closes a specific
 * ADJUSTMENT_NEEDED entry (identified by `adjustmentEntryId`).
 *
 * Once this is present in project history, the corresponding banner is hidden.
 *
 * @param adjustmentEntryId - id of the ADJUSTMENT_NEEDED entry being resolved
 * @param note              - optional message from the project owner
 */
export function buildAdjustmentResolvedPayload(
  adjustmentEntryId: string,
  note?: string
): Omit<ProjectHistoryCreateInput, "project_id"> {
  return {
    type: ProjectHistoryType.ADJUSTMENT_RESOLVED,
    comment: note,
    metadata: { resolves_adjustment_id: adjustmentEntryId },
  }
}
