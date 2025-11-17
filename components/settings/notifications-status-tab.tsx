"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Bell, CheckCircle } from "lucide-react"

type UserStatus = "online" | "offline" | "away"

interface NotificationsStatusTabProps {
  notificationsEnabled: boolean
  setNotificationsEnabled: (value: boolean) => void
  userStatus: UserStatus
  setUserStatus: (value: UserStatus) => void
}

export function NotificationsStatusTab({
  notificationsEnabled,
  setNotificationsEnabled,
  userStatus,
  setUserStatus,
}: NotificationsStatusTabProps) {
  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-gray-400"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications & Status
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Control notifications and your availability status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-foreground">Enable Notifications</Label>
            <div className="text-sm text-muted-foreground">Receive system and activity notifications</div>
          </div>
          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
        </div>

        <Separator className="bg-border" />

        {/* User Status */}
        <div className="space-y-3">
          <Label className="text-foreground">Status</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setUserStatus("online")}
              className={`p-4 border rounded-lg transition-all ${
                userStatus === "online"
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor("online")}`}></div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Online</div>
                  <div className="text-xs text-muted-foreground">Available for messages</div>
                </div>
                {userStatus === "online" && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
              </div>
            </button>

            <button
              onClick={() => setUserStatus("away")}
              className={`p-4 border rounded-lg transition-all ${
                userStatus === "away"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor("away")}`}></div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Away</div>
                  <div className="text-xs text-muted-foreground">Currently inactive</div>
                </div>
                {userStatus === "away" && <CheckCircle className="w-5 h-5 text-yellow-600 ml-auto" />}
              </div>
            </button>

            <button
              onClick={() => setUserStatus("offline")}
              className={`p-4 border rounded-lg transition-all ${
                userStatus === "offline"
                  ? "border-gray-500 bg-gray-50 dark:bg-gray-950"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor("offline")}`}></div>
                <div className="text-left">
                  <div className="font-medium text-foreground">Offline</div>
                  <div className="text-xs text-muted-foreground">Not available</div>
                </div>
                {userStatus === "offline" && <CheckCircle className="w-5 h-5 text-gray-600 ml-auto" />}
              </div>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
