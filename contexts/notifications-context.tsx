"use client"

import React, { createContext, useContext, useCallback, useReducer } from "react"

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
}

type NotificationsAction =
  | { type: "ADD"; payload: AppNotification }
  | { type: "MARK_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "REMOVE"; id: string }

interface NotificationsContextValue {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: NotificationsState, action: NotificationsAction): NotificationsState {
  switch (action.type) {
    case "ADD":
      // Prevent duplicates by notif id
      if (state.items.some((n) => n.id === action.payload.id)) return state
      // Keep max 50 notifications
      return { items: [action.payload, ...state.items].slice(0, 50) }
    case "MARK_READ":
      return { items: state.items.map((n) => n.id === action.id ? { ...n, read: true } : n) }
    case "MARK_ALL_READ":
      return { items: state.items.map((n) => ({ ...n, read: true })) }
    case "REMOVE":
      return { items: state.items.filter((n) => n.id !== action.id) }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationsContext = createContext<NotificationsContextValue | null>(null)
export { NotificationsContext }

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] })

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

  const markRead = useCallback((id: string) => dispatch({ type: "MARK_READ", id }), [])
  const markAllRead = useCallback(() => dispatch({ type: "MARK_ALL_READ" }), [])
  const remove = useCallback((id: string) => dispatch({ type: "REMOVE", id }), [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications: state.items,
        unreadCount: state.items.filter((n) => !n.read).length,
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
