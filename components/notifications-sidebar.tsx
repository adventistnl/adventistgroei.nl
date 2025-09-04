"use client"

import * as React from "react"
import { useState } from "react"
import { Bell, X, Check, Clock, AlertCircle, CheckCircle, Info, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
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

export function NotificationsSidebar() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const unreadCount = notifications.filter(n => n.status === "unread").length

  const handleNavigation = (href: string, name: string) => {
    setIsOpen(false)
    toast.success(`🚀 Navigating to ${name}`, { duration: 2000 })
    router.push(href)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: "read" as const }
          : notification
      )
    )
    
    toast.success("✅ Notification marked as read", {
      duration: 2000
    })
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: "read" as const }))
    )
    
    toast.success("✅ All notifications marked as read", {
      duration: 3000
    })
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getNotificationBadgeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
      case "error":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
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
      
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </SheetTitle>
              <SheetDescription>
                Stay updated with your church management system
              </SheetDescription>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all hover:shadow-md ${
                  notification.status === "unread" 
                    ? "border-l-4 border-l-primary bg-accent/50" 
                    : "border-l-4 border-l-transparent"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <CardTitle className="text-sm font-medium">
                        {notification.title}
                      </CardTitle>
                      {notification.status === "unread" && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getNotificationBadgeColor(notification.type)}`}
                      >
                        {notification.type}
                      </Badge>
                      {notification.status === "unread" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3">
                    {notification.message}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                    
                    {notification.actionLabel && notification.actionHref && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNavigation(notification.actionHref!, notification.actionLabel!)}
                        className="h-7 text-xs"
                      >
                        {notification.actionLabel}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
