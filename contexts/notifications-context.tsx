"use client"

import React, { createContext, useContext, useCallback, useReducer, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { MY_NOTIFICATIONS_QUERY } from "@/graphql/queries/NOTIFICATIONS_QUERY"
import {
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
  DELETE_NOTIFICATION_MUTATION,
} from "@/graphql/mutations/NOTIFICATIONS_MUTATIONS"
import { useAuth } from "@/contexts/auth-context"

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = 
  | "PROJECT_MESSAGE" 
  | "PROJECT_STATUS_CHANGED" 
  | "SUBSIDY_STATUS_CHANGED" 
  | "DOCUMENT_ADDED" 
  | "PROJECT_MEMBER_ADDED"
  | "PROJECT_MEMBER_REMOVED"
  | "SYSTEM_ALERT"
  | "INFO"

export interface AppNotification {
  id: string
  type: NotificationType | string // Fallback to string for old notifications
  title?: string
  message: string
  metadata?: any
  /** ISO string */
  timestamp: string
  read: boolean
  /** For project-related notifications */
  projectId?: string
  projectTitle?: string
  /** User who triggered the event */
  actorName?: string
}

interface NotificationsState {
  items: AppNotification[]
  /** True after the first backend fetch completes (prevents flash of empty state) */
  hydrated: boolean
}

type NotificationsAction =
  | { type: "HYDRATE"; payload: AppNotification[] }
  | { type: "MARK_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "REMOVE"; id: string }

interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  hydrated: boolean
  /**
   * Called by the WebSocket hook when a real-time event arrives.
   * Triggers a refetch of myNotifications from the DB so the list
   * always uses real UUIDs — preventing duplicates between the
   * WebSocket temp-ID item and the DB-persisted item.
   */
  refetchFromDB: () => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  /** @deprecated kept for backward compat — use refetchFromDB for real-time events */
  addNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case "HYDRATE":
      return {
        items: action.payload.slice(0, 50),
        hydrated: true,
      }
    case "MARK_READ":
      return { ...state, items: state.items.map((n) => n.id === action.id ? { ...n, read: true } : n) }
    case "MARK_ALL_READ":
      return { ...state, items: state.items.map((n) => ({ ...n, read: true })) }
    case "REMOVE":
      return { ...state, items: state.items.filter((n) => n.id !== action.id) }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationsContext = createContext<NotificationsContextValue | null>(null)
export { NotificationsContext }

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false })
  const { user } = useAuth()

  // ── Backend fetch: hydrate on mount + re-hydrate on demand ──────────────────
  const { data: backendData, refetch } = useQuery(MY_NOTIFICATIONS_QUERY, {
    skip: !user,
    fetchPolicy: "network-only",
  })

  useEffect(() => {
    if (!backendData?.myNotifications) return
    const backendItems: AppNotification[] = backendData.myNotifications.map((n: any) => ({
      id: n.id,
      type: (n.type as NotificationType) ?? "info",
      title: n.title ?? "",
      message: n.message ?? "",
      metadata: n.metadata,
      timestamp: n.created_at,
      read: n.read_status,
      projectId: n.project_id ?? undefined,
    }))
    dispatch({ type: "HYDRATE", payload: backendItems })
  }, [backendData])

  // ── Mutations ───────────────────────────────────────────────────────────────
  const [markNotificationReadMutation] = useMutation(MARK_NOTIFICATION_READ_MUTATION)
  const [markAllNotificationsReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ_MUTATION)
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION_MUTATION)

  // ── Actions ─────────────────────────────────────────────────────────────────

  /**
   * Called by the WebSocket hook on each real-time event.
   * Re-fetches myNotifications from DB — the notification is already persisted
   * by the backend before the WebSocket event fires, so we always get the real UUID.
   * This eliminates the temp-ID vs DB-UUID duplicate problem.
   */
  const refetchFromDB = useCallback(() => {
    refetch().catch(() => {/* no-op */})
  }, [refetch])

  /** @deprecated kept for backward compat. Prefer refetchFromDB for WebSocket events. */
  const addNotification = useCallback(refetchFromDB, [refetchFromDB])

  /** Marks a single notification as read locally and syncs to backend. */
  const markRead = useCallback((id: string) => {
    dispatch({ type: "MARK_READ", id })
    markNotificationReadMutation({ variables: { id } }).catch(() => {/* no-op */})
  }, [markNotificationReadMutation])

  /** Marks all notifications as read locally and syncs to backend. */
  const markAllRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_READ" })
    markAllNotificationsReadMutation().catch(() => {/* no-op */})
  }, [markAllNotificationsReadMutation])

  /** Removes a notification locally and deletes it from the backend. */
  const remove = useCallback((id: string) => {
    dispatch({ type: "REMOVE", id })
    deleteNotificationMutation({ variables: { id } }).catch((err) => {
      console.error("Failed to delete notification", err)
    })
  }, [deleteNotificationMutation])

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.items,
        unreadCount: state.items.filter((n) => !n.read).length,
        hydrated: state.hydrated,
        refetchFromDB,
        addNotification,
        markRead,
        markAllRead,
        remove,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider")
  return ctx
}
