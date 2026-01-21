"use client"

import React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UserAvatarData {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: string
  initials?: string
  isOwner?: boolean
}

interface UsersAvatarGroupProps {
  users: UserAvatarData[]
  maxDisplay?: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  labelText?: string
  className?: string
  showEmptyState?: boolean
  onAddUser?: () => void
  showAddButton?: boolean
  onShowAllUsers?: () => void
  ownerUserId?: string // ID of the project owner for special styling
}

const sizeConfig = {
  sm: {
    avatar: "size-6",
    iconSize: "size-3",
    fontSize: "text-[9px]",
  },
  md: {
    avatar: "size-8",
    iconSize: "size-4",
    fontSize: "text-[10px]",
  },
  lg: {
    avatar: "size-10",
    iconSize: "size-5",
    fontSize: "text-xs",
  },
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

/**
 * UsersAvatarGroup - Componente reutilizável seguindo padrão shadcn/ui
 * 
 * Padrão baseado em: https://ui.shadcn.com/docs/components/avatar
 * 
 * @example
 * ```tsx
 * <UsersAvatarGroup 
 *   users={projectUsers} 
 *   maxDisplay={5} 
 *   size="md"
 *   showAddButton={true}
 *   onAddUser={() => setModalOpen(true)}
 * />
 * ```
 */
export function UsersAvatarGroup({
  users,
  maxDisplay = 3,
  size = "md",
  showLabel = false,
  labelText = "Usuários Registrados",
  className,
  showEmptyState = true,
  onAddUser,
  showAddButton = true,
  onShowAllUsers,
  ownerUserId,
}: UsersAvatarGroupProps) {
  const config = sizeConfig[size]
  const displayedUsers = users.slice(0, maxDisplay)
  const remainingCount = Math.max(0, users.length - maxDisplay)

  // Empty state - only show add button
  if (users.length === 0 && showAddButton && onAddUser) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {labelText} (0)
          </span>
        )}
        
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar 
                onClick={onAddUser}
                className={cn(
                  config.avatar,
                  "border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10",
                  "transition-colors cursor-pointer"
                )}
              >
                <AvatarFallback className="text-primary bg-transparent">
                  <Plus className={config.iconSize} />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs" sideOffset={5}>
              <p className="font-medium">Adicionar usuário ao projeto</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  // No users and no empty state
  if (users.length === 0) {
    return null
  }

  // Main render - Shadcn pattern: stack + add button
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {labelText} ({users.length})
        </span>
      )}
      
      {/* Shadcn Pattern: flex gap-2 wrapper */}
      <div className="flex items-center gap-2">
        {/* Avatar stack */}
        <div className="flex -space-x-2">
          {displayedUsers.map((user) => {
            const isOwner = user.id === ownerUserId
            
            return (
              <TooltipProvider key={user.id} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar 
                      className={cn(
                        config.avatar,
                        "border-2 cursor-pointer hover:scale-110 transition-transform hover:z-50",
                        isOwner 
                          ? "border-black dark:border-white border-4 ring-2 ring-yellow-400 dark:ring-yellow-300" 
                          : "border-background"
                      )}
                    >
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className={cn(
                        config.fontSize,
                        isOwner 
                          ? "bg-yellow-600 dark:bg-yellow-500 text-white font-bold" 
                          : "bg-gray-600 dark:bg-gray-700 text-white font-semibold"
                      )}>
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs max-w-[200px]" sideOffset={5}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        {isOwner && (
                          <span className="bg-yellow-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
                            Owner
                          </span>
                        )}
                      </div>
                      {user.email && (
                        <p className="text-gray-400 text-[10px]">{user.email}</p>
                      )}
                      {user.role && (
                        <p className="text-gray-400 text-[10px] capitalize">
                          {isOwner ? 'Project Owner' : user.role}
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}

          {/* Overflow indicator */}
          {remainingCount > 0 && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar 
                    onClick={onShowAllUsers}
                    className={cn(
                      config.avatar,
                      "border-2 border-background cursor-pointer hover:scale-110 transition-transform hover:z-50",
                      onShowAllUsers && "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <AvatarFallback className={cn(config.fontSize, "font-medium")}>
                      +{remainingCount}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs" sideOffset={5}>
                  <p className="font-medium">
                    {remainingCount} usuário{remainingCount > 1 ? 's' : ''} adiciona{remainingCount > 1 ? 'is' : 'l'}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-1">
                    Clique para ver todos
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Add button - Outside the stack (shadcn pattern) */}
        {showAddButton && onAddUser && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar 
                  onClick={onAddUser}
                  className={cn(
                    config.avatar,
                    "border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10",
                    "transition-colors cursor-pointer"
                  )}
                >
                  <AvatarFallback className="text-primary bg-transparent">
                    <Plus className={config.iconSize} />
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs font-medium" sideOffset={5}>
                <p>Adicionar usuário ao projeto</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
