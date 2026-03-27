"use client"

import * as React from "react"
import { Bell, Check } from "lucide-react"
import { useTranslation } from "react-i18next"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/contexts/notifications-context"
import { NotifCard } from "@/components/notifications/notif-card"
import { QuickViewProjectModal } from "@/components/modals/project/quick-view-project-modal"
import { type ProjectTableData } from "@/components/projects/projects-table"

// ─── i18n ─────────────────────────────────────────────────────────────────────

const T = {
  en: {
    title: "Notifications",
    subtitle: "Real-time updates from your projects",
    markAllRead: "Mark all as read",
    viewHistory: "View history",
    emptyTitle: "No notifications",
    emptyMessage: "New activity from your projects will appear here.",
  },
  pt: {
    title: "Notificações",
    subtitle: "Atualizações em tempo real dos seus projetos",
    markAllRead: "Marcar todas como lidas",
    viewHistory: "Ver histórico",
    emptyTitle: "Sem notificações",
    emptyMessage: "Novas atividades dos seus projetos aparecerão aqui.",
  },
  nl: {
    title: "Meldingen",
    subtitle: "Realtime updates van uw projecten",
    markAllRead: "Alles als gelezen markeren",
    viewHistory: "Geschiedenis bekijken",
    emptyTitle: "Geen meldingen",
    emptyMessage: "Nieuwe activiteit van uw projecten verschijnt hier.",
  },
} as const

type Lang = keyof typeof T

// ─── Minimal project stub for the QuickView modal ────────────────────────────

function buildProjectStub(projectId: string, projectTitle?: string): ProjectTableData {
  return {
    id: projectId,
    title: projectTitle ?? "",
    status: "",
    description: "",
    budget: 0,
    department_id: "",
    institutionId: "",
    is_private: false,
    required_volunteers: false,
    start_at: "",
    end_at: "",
    language_preference: "en",
  } as ProjectTableData
}

// ─── Main component ────────────────────────────────────────────────────────────

export function NotificationsSidebar() {
  const { i18n } = useTranslation()
  const lang = (i18n.language?.split("-")[0] ?? "en") as Lang
  const t = T[lang] ?? T.en

  const { notifications, unreadCount, markRead, markAllRead, remove } = useNotifications()
  const [open, setOpen] = React.useState(false)

  // State for opening QuickViewProjectModal at the history tab
  const [historyModal, setHistoryModal] = React.useState<{
    projectId: string
    projectTitle?: string
  } | null>(null)

  function handleOpenHistory(projectId: string, projectTitle: string | undefined) {
    setHistoryModal({ projectId, projectTitle })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[360px] sm:w-[400px] flex flex-col p-0">
          <SheetHeader className="px-5 pt-5 pb-3 shrink-0">
            <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="w-4 h-4" />
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs tabular-nums">
                    {unreadCount}
                  </Badge>
                )}
                {t.title}
              </div>
             
            
            </SheetTitle>
            <SheetDescription className="text-xs">{t.subtitle}</SheetDescription>
          </SheetHeader>

          {unreadCount > 0 && (
            <div className="px-4 pb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllRead}
                className="w-full justify-start text-xs text-muted-foreground h-7 gap-1.5"
              >
                <Check className="w-3 h-3" />
                {t.markAllRead}
              </Button>
            </div>
          )}

          <Separator className="shrink-0" />

          <ScrollArea className="flex-1 px-3 py-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[320px] text-center px-4">
                <Bell className="w-10 h-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm font-medium text-foreground">{t.emptyTitle}</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                  {t.emptyMessage}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <NotifCard
                    key={n.id}
                    notification={n}
                    lang={lang}
                    labelViewHistory={t.viewHistory}
                    onMarkRead={markRead}
                    onRemove={remove}
                    onOpenHistory={handleOpenHistory}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* QuickView modal — opens on history tab when triggered from a notification card */}
      {historyModal && (
        <QuickViewProjectModal
          isOpen={!!historyModal}
          onClose={() => setHistoryModal(null)}
          project={buildProjectStub(historyModal.projectId, historyModal.projectTitle)}
          initialTab="history"
        />
      )}
    </>
  )
}
