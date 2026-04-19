"use client"

import * as React from "react"
import { MessageSquare, MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useSubscription, useApolloClient } from "@apollo/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { ON_USER_PROJECT_HISTORY_ADDED } from "@/graphql/subscriptions/USER_NOTIFICATIONS_SUBSCRIPTION"
import { GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { chatTranslations } from "@/lib/translations/chat"
import { ChatProjectList } from "./chat-project-list"
import { ChatProjectRoom, type ChatProject } from "./chat-project-room"

// ─── Main component ───────────────────────────────────────────────────────────

export function ChatSidebar() {
  const { i18n } = useTranslation()
  const tC = chatTranslations[i18n.language?.split("-")[0]] ?? chatTranslations.en

  const { user } = useAuth()
  const apolloClient = useApolloClient()

  const [open, setOpen] = React.useState(false)
  const [activeProject, setActiveProject] = React.useState<ChatProject | null>(null)

  // ── Unread tracking ───────────────────────────────────────────────────────
  // Map of projectId → unread message count (incremented by WS subscription,
  // reset to 0 when the user opens that project's room)
  const [unreadMap, setUnreadMap] = React.useState<Record<string, number>>({})

  // Total unread across all projects
  const totalUnread = Object.values(unreadMap).reduce((s, n) => s + n, 0)

  // ── Global WS subscription — same channel used for notifications ──────────
  // We piggyback on the existing userProjectHistoryAdded subscription to
  // increment per-project unread counts in the chat badge.
  useSubscription(ON_USER_PROJECT_HISTORY_ADDED, {
    variables: { userId: user?.id ?? null },
    skip: !user?.id,
    shouldResubscribe: true,
    onData: ({ data: subData }) => {
      const entry = subData.data?.userProjectHistoryAdded
      if (!entry) return

      // Skip own entries
      if (entry.user?.id === user?.id) return

      const projectId: string | undefined = entry.project_id ?? undefined
      if (!projectId) return

      // If this project's room is currently open and visible, don't increment
      if (open && activeProject?.id === projectId) return

      setUnreadMap((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] ?? 0) + 1,
      }))

      // Preload project into cache for when user opens the room
      // (title resolution will work instantly from cache)
      try {
        apolloClient.query({
          query: GET_PROJECT_BY_ID_QUERY,
          variables: { id: projectId },
          fetchPolicy: "cache-first",
        })
      } catch {
        // Non-critical: cache miss is fine
      }
    },
  })

  // ── Clear unread when opening a room ─────────────────────────────────────
  const handleSelectProject = React.useCallback(
    (project: ChatProject) => {
      setActiveProject(project)
      setUnreadMap((prev) => ({ ...prev, [project.id]: 0 }))
    },
    []
  )

  const handleBack = React.useCallback(() => {
    setActiveProject(null)
  }, [])

  // ── Determine if current user can comment in active project ───────────────
  const canComment = React.useMemo(() => {
    if (!activeProject || !user?.id) return false
    if (activeProject.owner?.id === user.id) return true
    if (activeProject.co_owner?.id === user.id) return true
    if (activeProject.collaborators.some((c) => c.user.id === user.id)) return true
    return false
  }, [activeProject, user?.id])

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) setActiveProject(null)
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9">
          <MessageSquare className="h-4 w-4" />
          {totalUnread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
            >
              {totalUnread > 99 ? "99+" : totalUnread}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[380px] sm:w-[420px] flex flex-col p-0">
        {/* ── Sheet header ──────────────────────────────────────────── */}
        <SheetHeader className="px-5 pt-5 pb-3 shrink-0">
          <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="w-4 h-4" />
            <div className="flex items-center gap-2">
                {!activeProject && totalUnread > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs tabular-nums">
                    {totalUnread}
                </Badge>
                )}
                {activeProject ? activeProject.title : tC.sidebar.title}
            </div>
           
          </SheetTitle>
          {!activeProject && (
            <SheetDescription className="text-xs">{tC.sidebar.subtitle}</SheetDescription>
          )}
        </SheetHeader>

        <Separator className="shrink-0" />

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-h-0 flex flex-col">
          {activeProject ? (
            <ChatProjectRoom
              project={activeProject}
              canComment={canComment}
              onBack={handleBack}
            />
          ) : (
            <ChatProjectList
              unreadMap={unreadMap}
              onSelectProject={handleSelectProject}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
