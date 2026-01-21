"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Bell, X, Check, Clock, AlertCircle, CheckCircle, Info, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import toast from "react-hot-toast"

// Translations object
const notificationsTranslations = {
  en: {
    title: "Notifications",
    subtitle: "Stay updated with your church management system",
    markAllRead: "Mark all read",
    markedAsRead: "Notification marked as read",
    allMarkedAsRead: "All notifications marked as read",
    more: "More...",
    emptyTitle: "No notifications",
    emptyMessage: "You're all caught up! Check back later for updates.",
    types: {
      info: "info",
      success: "success",
      warning: "warning",
      error: "error"
    }
  },
  pt: {
    title: "Notificações",
    subtitle: "Fique atualizado com o sistema de gestão da igreja",
    markAllRead: "Marcar todas como lidas",
    markedAsRead: "Notificação marcada como lida",
    allMarkedAsRead: "Todas as notificações marcadas como lidas",
    more: "Mais...",
    emptyTitle: "Sem notificações",
    emptyMessage: "Você está em dia! Volte mais tarde para atualizações.",
    types: {
      info: "info",
      success: "sucesso",
      warning: "aviso",
      error: "erro"
    }
  },
  nl: {
    title: "Meldingen",
    subtitle: "Blijf op de hoogte van uw kerkbeheersysteem",
    markAllRead: "Alles als gelezen markeren",
    markedAsRead: "Melding gemarkeerd als gelezen",
    allMarkedAsRead: "Alle meldingen gemarkeerd als gelezen",
    more: "Meer...",
    emptyTitle: "Geen meldingen",
    emptyMessage: "Je bent helemaal bij! Kom later terug voor updates.",
    types: {
      info: "info",
      success: "succes",
      warning: "waarschuwing",
      error: "fout"
    }
  },
  es: {
    title: "Notificaciones",
    subtitle: "Mantente actualizado con el sistema de gestión de la iglesia",
    markAllRead: "Marcar todas como leídas",
    markedAsRead: "Notificación marcada como leída",
    allMarkedAsRead: "Todas las notificaciones marcadas como leídas",
    more: "Más...",
    emptyTitle: "Sin notificaciones",
    emptyMessage: "¡Estás al día! Vuelve más tarde para actualizaciones.",
    types: {
      info: "info",
      success: "éxito",
      warning: "advertencia",
      error: "error"
    }
  }
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  status: "unread" | "read"
  timestamp: string
  actionLabel?: string
  actionHref?: string
}

interface NotificationsSidebarProps {
  notifications?: Notification[] // Optional prop to receive real notifications
  onNotificationRead?: (id: string) => void // Callback when notification is marked as read
  onAllRead?: () => void // Callback when all notifications are marked as read
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Member Registration",
    message: "Maria Silva registered from São Paulo Capital region",
    type: "success",
    status: "unread",
    timestamp: "2024-08-27T10:30:00Z",
    actionLabel: "View Member",
    actionHref: "/members"
  },
  {
    id: "2",
    title: "Subsidy Request Approved",
    message: "Youth Department subsidy of R$ 15,000 has been approved",
    type: "success",
    status: "unread",
    timestamp: "2024-08-27T09:15:00Z",
    actionLabel: "View Details",
    actionHref: "/subsidies"
  },
  {
    id: "3",
    title: "Event Reminder",
    message: "Evangelism campaign starts tomorrow in Rio de Janeiro",
    type: "info",
    status: "unread",
    timestamp: "2024-08-27T08:45:00Z",
    actionLabel: "View Event",
    actionHref: "/events"
  },
  {
    id: "4",
    title: "Budget Alert",
    message: "Communication Department has reached 85% of monthly budget",
    type: "warning",
    status: "read",
    timestamp: "2024-08-26T16:20:00Z",
    actionLabel: "Review Budget",
    actionHref: "/reports"
  },
  {
    id: "5",
    title: "System Maintenance",
    message: "Scheduled maintenance tonight from 2:00 AM to 4:00 AM",
    type: "info",
    status: "read",
    timestamp: "2024-08-26T14:00:00Z"
  },
  {
    id: "6",
    title: "New Church Registered",
    message: "Igreja Central de Brasília successfully added to the system",
    type: "success",
    status: "read",
    timestamp: "2024-08-25T11:30:00Z",
    actionLabel: "View Church",
    actionHref: "/churches"
  }
]

export function NotificationsSidebar({ 
  notifications: externalNotifications,
  onNotificationRead,
  onAllRead 
}: NotificationsSidebarProps = {}) {
  const { i18n } = useTranslation()
  const t = notificationsTranslations[i18n.language as keyof typeof notificationsTranslations] || notificationsTranslations.en
  
  // Use external notifications if provided, otherwise use mock data
  const [notifications, setNotifications] = useState<Notification[]>(externalNotifications || mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Update notifications when external prop changes
  useEffect(() => {
    if (externalNotifications) {
      setNotifications(externalNotifications)
    }
  }, [externalNotifications])

  const unreadCount = notifications.filter(n => n.status === "unread").length

  const [expandedNotification, setExpandedNotification] = useState<string | null>(null)

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: "read" as const }
          : notification
      )
    )
    
    // Call external callback if provided
    if (onNotificationRead) {
      onNotificationRead(id)
    }
    
    toast.success(`✅ ${t.markedAsRead}`, {
      duration: 2000
    })
  }

  const toggleExpanded = (id: string) => {
    setExpandedNotification(expandedNotification === id ? null : id)
    // Mark as read when expanded
    if (expandedNotification !== id) {
      markAsRead(id)
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: "read" as const }))
    )
    
    // Call external callback if provided
    if (onAllRead) {
      onAllRead()
    }
    
    toast.success(`✅ ${t.allMarkedAsRead}`, {
      duration: 3000
    })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />
    }
  }


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] p-6">
        <SheetHeader className="space-y-3">
          <div className="space-y-2">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5" />
              {t.title}
            </SheetTitle>
            <SheetDescription className="text-sm">
              {t.subtitle}
            </SheetDescription>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Check className="w-4 h-4 mr-2" />
              {t.markAllRead}
            </Button>
          )}
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg transition-all hover:bg-muted/30 cursor-pointer ${
                  notification.status === "unread" 
                    ? "border-l-4 border-l-foreground/20 bg-muted/10" 
                    : "border-l-4 border-l-transparent"
                }`}
                onClick={() => toggleExpanded(notification.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium truncate text-foreground">{notification.title}</h4>
                        {notification.status === "unread" && (
                          <div className="w-2 h-2 bg-foreground/60 rounded-full shrink-0" />
                        )}
                      </div>
                      
                      {expandedNotification === notification.id ? (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(notification.timestamp).toLocaleString()}
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-border/60 bg-muted/50"
                            >
                              {t.types[notification.type]}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground line-clamp-1 flex-1">
                            {notification.message}
                          </p>
                          <button className="text-xs text-foreground/60 hover:text-foreground hover:underline ml-2 shrink-0">
                            {t.more}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center py-12 px-4">
                  <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-foreground">{t.emptyTitle}</h3>
                  <p className="text-sm text-muted-foreground max-w-[280px]">
                    {t.emptyMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
