"use client"

import React, { useState } from "react"
import { UserPlus, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { AvatarGroup, AvatarGroupTooltip } from "@/components/ui/avatar-group"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  initials?: string
  role?: string
}

export interface UserAssignmentProps {
  /** Lista de usuários já atribuídos */
  assignedUsers: User[]
  
  /** Lista de todos os usuários disponíveis para atribuição */
  availableUsers: User[]
  
  /** Callback quando um usuário é adicionado ou removido */
  onAssignmentChange: (users: User[]) => void
  
  /** Título personalizado (default: "Responsáveis") */
  label?: string
  
  /** Texto do tooltip do botão de adicionar */
  addButtonTooltip?: string
  
  /** Tamanho dos avatares */
  avatarSize?: "sm" | "md" | "lg"
  
  /** Número máximo de avatares exibidos antes de mostrar +N */
  maxAvatarsDisplay?: number
  
  /** Mostrar badge com contagem total */
  showCount?: boolean
  
  /** Permitir busca por nome */
  enableSearch?: boolean
  
  /** Mensagens de toast personalizadas */
  toastMessages?: {
    assigned?: (userName: string) => string
    removed?: (userName: string) => string
  }
  
  /** Classes CSS customizadas */
  className?: string
  
  /** Modo compacto (esconde label) */
  compact?: boolean
  
  /** Desabilitar interação */
  disabled?: boolean
  
  /** Callback ao abrir/fechar o dropdown */
  onOpenChange?: (isOpen: boolean) => void
}

/**
 * UserAssignment - Componente reutilizável para atribuição de múltiplos usuários
 * 
 * @example
 * ```tsx
 * const [assignedUsers, setAssignedUsers] = useState<User[]>([])
 * 
 * <UserAssignment
 *   assignedUsers={assignedUsers}
 *   availableUsers={allUsers}
 *   onAssignmentChange={setAssignedUsers}
 *   label="Equipe do Projeto"
 *   enableSearch
 *   showCount
 * />
 * ```
 */
export function UserAssignment({
  assignedUsers,
  availableUsers,
  onAssignmentChange,
  label = "Responsáveis",
  addButtonTooltip = "Atribuir usuários",
  avatarSize = "md",
  maxAvatarsDisplay,
  showCount = false,
  enableSearch = false,
  toastMessages,
  className,
  compact = false,
  disabled = false,
  onOpenChange,
}: UserAssignmentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const avatarSizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
  }

  const getInitials = (user: User): string => {
    if (user.initials) return user.initials
    
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleToggleUser = (e: React.MouseEvent, user: User) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    const isAssigned = assignedUsers.some((u) => u.id === user.id)

    let newAssignedUsers: User[]

    if (isAssigned) {
      newAssignedUsers = assignedUsers.filter((u) => u.id !== user.id)

      const message = toastMessages?.removed
        ? toastMessages.removed(user.name)
        : `${user.name} removido`

      toast.success(message)
    } else {
      newAssignedUsers = [...assignedUsers, user]

      const message = toastMessages?.assigned
        ? toastMessages.assigned(user.name)
        : `${user.name} atribuído`

      toast.success(message)
    }

    onAssignmentChange(newAssignedUsers)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
    
    if (!open) {
      setSearchQuery("")
    }
  }

  const filteredUsers = enableSearch && searchQuery
    ? availableUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableUsers

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aAssigned = assignedUsers.some((u) => u.id === a.id)
    const bAssigned = assignedUsers.some((u) => u.id === b.id)
    
    if (aAssigned && !bAssigned) return -1
    if (!aAssigned && bAssigned) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!compact && (
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}:
        </Label>
      )}
      
      <div className="flex items-center gap-2">
        {assignedUsers.length > 0 ? (
          <AvatarGroup max={maxAvatarsDisplay}>
            {assignedUsers.map((user) => (
              <TooltipProvider key={user.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className={cn(avatarSizeClasses[avatarSize], "border-2 border-background cursor-pointer")}>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      {user.email && (
                        <p className="text-gray-400 text-[10px]">{user.email}</p>
                      )}
                      {user.role && (
                        <p className="text-gray-400 text-[10px]">{user.role}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </AvatarGroup>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Nenhum usuário atribuído
          </span>
        )}
        
        {showCount && assignedUsers.length > 0 && (
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            ({assignedUsers.length})
          </span>
        )}

        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              className={cn(
                "h-6 w-6 p-0 rounded-md transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <UserPlus className="w-3.5 h-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={5}
            className="w-64 p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div
              className="p-2 space-y-2"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-2 py-1">
                <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {addButtonTooltip}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleOpenChange(false)
                  }}
                  className="h-4 w-4 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {enableSearch && (
                <div className="px-2">
                  <Input
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-7 text-xs border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}

              <div
                className="max-h-60 overflow-y-auto space-y-0.5 px-1"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {sortedUsers.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
                    {searchQuery ? "Nenhum usuário encontrado" : "Nenhum usuário disponível"}
                  </p>
                ) : (
                  sortedUsers.map((user) => {
                    const isAssigned = assignedUsers.some((u) => u.id === user.id)

                    return (
                      <button
                        type="button"
                        key={user.id}
                        onClick={(e) => handleToggleUser(e, user)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors text-left",
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          isAssigned && "bg-gray-50 dark:bg-gray-800/50"
                        )}
                      >
                        <Avatar className="size-6 border border-gray-200 dark:border-gray-700">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="text-[9px] bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            {getInitials(user)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                            {user.name}
                          </p>
                          {(user.email || user.role) && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {user.role || user.email}
                            </p>
                          )}
                        </div>

                        {isAssigned && (
                          <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {assignedUsers.length > 0 && (
                <div className="px-2 py-1 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {assignedUsers.length} {assignedUsers.length === 1 ? "usuário atribuído" : "usuários atribuídos"}
                  </p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
