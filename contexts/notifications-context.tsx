"use client"

import React, { createContext, useContext, useCallback, useReducer, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { MY_NOTIFICATIONS_QUERY } from "@/graphql/queries/NOTIFICATIONS_QUERY"
import {
  MARK_NOTIFICATION_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_READ_MUTATION,
} from "@/graphql/mutations/NOTIFICATIONS_MUTATIONS"
import { useAuth } from "@/contexts/auth-context"

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType = "project_message" | "status_change" | "info"

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
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
  | { type: "ADD"; payload: AppNotification }
  | { type: "MARK_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "REMOVE"; id: string }

interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  hydrated: boolean
  addNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case "HYDRATE":
      // Merge backend items with any real-time items already received, deduplicating by id
      const existingIds = new Set(action.payload.map((n) => n.id))
      const realTimeOnly = state.items.filter((n) => !existingIds.has(n.id))
      return {
        items: [...action.payload, ...realTimeOnly].slice(0, 50),
        hydrated: true,
      }
    case "ADD":
      // Prevent duplicates by notification id
      if (state.items.some((n) => n.id === action.payload.id)) return state
      return { ...state, items: [action.payload, ...state.items].slice(0, 50) }
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

  // ── Backend fetch: hydrate on mount ────────────────────────────────────────
  const { data: backendData } = useQuery(MY_NOTIFICATIONS_QUERY, {
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
      timestamp: n.created_at,
      read: n.read_status,
      projectId: n.project_id ?? undefined,
    }))
    dispatch({ type: "HYDRATE", payload: backendItems })
  }, [backendData])

  // ── Mutations ───────────────────────────────────────────────────────────────
  const [markNotificationReadMutation] = useMutation(MARK_NOTIFICATION_READ_MUTATION)
  const [markAllNotificationsReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ_MUTATION)

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Adds a real-time WebSocket notification (won't duplicate if id already exists). */
  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "timestamp" | "read">) => {
      dispatch({
        type: "ADD",
        payload: {
          ...n,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          read: false,
        },
      })
    },
    []
  )

  /** Marks a single notification as read locally and syncs to backend. */
  const markRead = useCallback((id: string) => {
    dispatch({ type: "MARK_READ", id })
    markNotificationReadMutation({ variables: { id } }).catch(() => {
      // If the notification was created via WebSocket (temp id) the backend mutation
      // will fail gracefully — local state is still updated.
    })
  }, [markNotificationReadMutation])

  /** Marks all notifications as read locally and syncs to backend. */
  const markAllRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_READ" })
    markAllNotificationsReadMutation().catch(() => {/* no-op */})
  }, [markAllNotificationsReadMutation])

  const remove = useCallback((id: string) => dispatch({ type: "REMOVE", id }), [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.items,
        unreadCount: state.items.filter((n) => !n.read).length,
        hydrated: state.hydrated,
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

