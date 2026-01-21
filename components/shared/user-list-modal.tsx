"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { UserAvatarData } from "./users-avatar-group"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Crown } from "lucide-react"

interface UserListModalProps {
  isOpen: boolean
  onClose: () => void
  users: UserAvatarData[]
  ownerUserId?: string
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

export function UserListModal({ isOpen, onClose, users, ownerUserId }: UserListModalProps) {
  // Reorder users to show owner first
  const orderedUsers = React.useMemo(() => {
    if (!ownerUserId) return users
    const owner = users.find(user => user.id === ownerUserId)
    const others = users.filter(user => user.id !== ownerUserId)
    return owner ? [owner, ...others] : users
  }, [users, ownerUserId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Usuários do Projeto ({users.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {orderedUsers.map((user) => {
            const isOwner = user.id === ownerUserId
            
            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isOwner 
                    ? "ring-2 ring-yellow-400 dark:ring-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" 
                    : ""
                }`}
              >
                <Avatar className={`size-10 ${
                  isOwner 
                    ? "border-4 border-black dark:border-yellow-400 ring-2 ring-yellow-400 dark:ring-yellow-500" 
                    : ""
                }`}>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className={`${
                    isOwner 
                      ? "bg-yellow-600 dark:bg-yellow-700 text-white" 
                      : "bg-gray-600 dark:bg-gray-700 text-white"
                  } font-semibold text-sm`}>
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    {isOwner && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 flex items-center gap-1"
                      >
                        <Crown className="w-3 h-3" />
                        Owner
                      </Badge>
                    )}
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.role && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {user.role}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
