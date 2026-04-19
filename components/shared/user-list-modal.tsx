"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { UserAvatarData } from "./users-avatar-group"
import { Badge } from "@/components/ui/badge"
import { Crown, UserCheck, Users } from "lucide-react"
import { projectTranslations } from "@/lib/translations/projects"

interface UserListModalProps {
  isOpen: boolean
  onClose: () => void
  users: UserAvatarData[]
  ownerUserId?: string
  coOwnerUserId?: string
}

const getInitials = (user: UserAvatarData) => {
  if (user.initials) return user.initials
  return user.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function UserListModal({ isOpen, onClose, users, ownerUserId, coOwnerUserId }: UserListModalProps) {
  const { i18n } = useTranslation()
  const t = (projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en).userListModal

  // Reorder: owner first, co-owner second, then others
  const orderedUsers = React.useMemo(() => {
    const owner = users.find(u => u.id === ownerUserId)
    const coOwner = users.find(u => u.id === coOwnerUserId && u.id !== ownerUserId)
    const others = users.filter(u => u.id !== ownerUserId && u.id !== coOwnerUserId)
    return [
      ...(owner ? [owner] : []),
      ...(coOwner ? [coOwner] : []),
      ...others,
    ]
  }, [users, ownerUserId, coOwnerUserId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-muted-foreground" />
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 max-h-[360px] overflow-y-auto -mx-1 px-1">
          {orderedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">{t.noUsers}</p>
          ) : (
            orderedUsers.map((user) => {
              const isOwner = user.id === ownerUserId
              const isCoOwner = !isOwner && user.id === coOwnerUserId

              return (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Avatar with role indicator dot */}
                  <div className="relative shrink-0">
                    <Avatar className="size-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className={`text-xs font-medium text-white ${
                        isOwner
                          ? "bg-amber-500"
                          : isCoOwner
                          ? "bg-blue-500"
                          : "bg-muted-foreground/60"
                      }`}>
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    {(isOwner || isCoOwner) && (
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background flex items-center justify-center ${
                        isOwner ? "bg-amber-500" : "bg-blue-500"
                      }`}>
                        {isOwner
                          ? <Crown className="w-2 h-2 text-white" />
                          : <UserCheck className="w-2 h-2 text-white" />
                        }
                      </span>
                    )}
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight truncate">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                  </div>

                  {/* Compact role badge */}
                  {isOwner && (
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] px-1.5 py-0 h-5 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                    >
                      {t.ownerBadge}
                    </Badge>
                  )}
                  {isCoOwner && (
                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] px-1.5 py-0 h-5 border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-400"
                    >
                      {t.coOwnerBadge}
                    </Badge>
                  )}
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}