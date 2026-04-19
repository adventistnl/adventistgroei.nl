"use client"

import React, { useMemo } from "react"
import { useQuery } from "@apollo/client"
import { useTranslation } from "react-i18next"
import { Loader2, MessageCircle, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { PROJECT_STATUS_CONFIG } from "@/components/projects/project-header"
import { chatTranslations } from "@/lib/translations/chat"
import type { ChatProject } from "./chat-project-room"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ChatProjectListProps {
  /** Map of projectId → unread message count (updated in real-time by parent) */
  unreadMap: Record<string, number>
  onSelectProject: (project: ChatProject) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChatProjectList({ unreadMap, onSelectProject }: ChatProjectListProps) {
  const { i18n } = useTranslation()
  const { user } = useAuth()

  const tC = chatTranslations[i18n.language?.split("-")[0]] ?? chatTranslations.en

  const [search, setSearch] = React.useState("")

  const { data, loading } = useQuery(GET_PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network",
  })

  // Filter only projects where the current user is involved
  const myProjects = useMemo(() => {
    if (!data?.projects || !user?.id) return []

    return (data.projects as any[]).filter((p) => {
      if (p.owner_id === user.id) return true
      if (p.co_owner?.id === user.id) return true
      if (p.collaborators?.some((c: any) => c.user?.id === user.id)) return true
      return false
    })
  }, [data?.projects, user?.id])

  // Apply search filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return myProjects
    return myProjects.filter((p) => p.title?.toLowerCase().includes(q))
  }, [myProjects, search])

  // Sort by unread count desc, then alphabetical
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const ua = unreadMap[a.id] ?? 0
      const ub = unreadMap[b.id] ?? 0
      if (ub !== ua) return ub - ua
      return (a.title ?? "").localeCompare(b.title ?? "")
    })
  }, [filtered, unreadMap])

  const totalUnread = Object.values(unreadMap).reduce((s, n) => s + n, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tC.list.searchPlaceholder}
            className="pl-7 h-8 text-xs border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Meta */}
      {!loading && myProjects.length > 0 && (
        <div className="px-3 pb-1">
          <p className="text-[10px] text-muted-foreground">
            {tC.list.projectsAvailable(myProjects.length)}
            {totalUnread > 0 && (
              <span className="ml-1 text-primary font-medium">{tC.list.newMessages(totalUnread)}</span>
            )}
          </p>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <MessageCircle className="w-8 h-8 opacity-20" />
            <p className="text-xs text-center px-4">
              {search ? tC.list.noResults : tC.list.noProjects}
            </p>
          </div>
        ) : (
          <div className="pb-2">
            {sorted.map((project) => {
              const unread = unreadMap[project.id] ?? 0
              const cfg = PROJECT_STATUS_CONFIG[project.status]
              const isOwner = project.owner_id === user?.id
              const isCoOwner = project.co_owner?.id === user?.id
              const role = isOwner
                ? tC.list.roles.owner
                : isCoOwner
                ? tC.list.roles.coOwner
                : tC.list.roles.collaborator

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onSelectProject(project as ChatProject)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60",
                    unread > 0 && "bg-primary/5 hover:bg-primary/10"
                  )}
                >
                  {/* Status dot */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-8 h-8 rounded-full border bg-muted flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    {cfg && (
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                          cfg.dotColor
                        )}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={cn(
                          "text-xs truncate leading-tight",
                          unread > 0 ? "font-semibold text-foreground" : "font-medium text-foreground"
                        )}
                      >
                        {project.title}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {role}
                    </p>
                  </div>

                  {/* Unread badge or chevron */}
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {unread > 0 ? (
                      <Badge
                        variant="default"
                        className="h-4 min-w-4 flex items-center justify-center p-0 text-[9px] bg-primary"
                      >
                        {unread > 99 ? "99+" : unread}
                      </Badge>
                    ) : (
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
