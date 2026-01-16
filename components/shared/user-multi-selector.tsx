"use client"

import React, { useState } from "react"
import { UserPlus, Search, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: string
}

export interface UserMultiSelectorProps {
  /** Lista de usuários disponíveis */
  availableUsers: User[]

  /** Usuários atualmente selecionados */
  selectedUsers: User[]

  /** Callback quando os usuários selecionados mudam */
  onUsersChange: (users: User[]) => void

  /** Label do botão */
  buttonLabel?: React.ReactNode

  /** Título do dialog */
  dialogTitle?: string

  /** Placeholder da busca */
  searchPlaceholder?: string

  /** Desabilitar */
  disabled?: boolean

  /** Número máximo de usuários selecionáveis (opcional) */
  maxSelections?: number

  /** Nome ou descrição da atividade */
  activityName?: string

  /** Tipo de atividade */
  activityType?: string
}

export function UserMultiSelector({
  availableUsers,
  selectedUsers,
  onUsersChange,
  buttonLabel,
  dialogTitle,
  searchPlaceholder,
  disabled = false,
  maxSelections,
  activityName,
  activityType,
}: UserMultiSelectorProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [tempSelectedUsers, setTempSelectedUsers] = useState<User[]>(selectedUsers)

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const filteredUsers = availableUsers.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.name.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    )
  })

  const handleUserToggle = (user: User) => {
    const isSelected = tempSelectedUsers.some(u => u.id === user.id)
    
    if (isSelected) {
      setTempSelectedUsers(tempSelectedUsers.filter(u => u.id !== user.id))
    } else {
      if (maxSelections && tempSelectedUsers.length >= maxSelections) {
        return // Não permite adicionar mais
      }
      setTempSelectedUsers([...tempSelectedUsers, user])
    }
  }

  const handleRemoveUser = (userId: string) => {
    setTempSelectedUsers(tempSelectedUsers.filter(u => u.id !== userId))
  }

  const handleConfirm = () => {
    onUsersChange(tempSelectedUsers)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleCancel = () => {
    setTempSelectedUsers(selectedUsers)
    setIsOpen(false)
    setSearchQuery("")
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempSelectedUsers(selectedUsers)
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn(
            "gap-2",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {typeof buttonLabel === 'string' ? (
            <>
              <UserPlus className="w-4 h-4" />
              {buttonLabel || t('activities.user_selector.add_assignees')}
            </>
          ) : (
            buttonLabel || (
              <>
                <UserPlus className="w-4 h-4" />
                {t('activities.user_selector.add_assignees')}
              </>
            )
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            {dialogTitle || t('activities.user_selector.select_assignees')}
          </DialogTitle>
          {(activityName || activityType) && (
            <div className="mt-2 pt-2 border-t">
              {activityType && (
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {activityType}
                </p>
              )}
              {activityName && (
                <p className="text-sm font-medium mt-1">
                  {activityName}
                </p>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Users Section */}
          {tempSelectedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t('activities.user_selector.selected')} ({tempSelectedUsers.length})
                </p>
              </div>
              <div className="space-y-1.5 p-3 border rounded-lg bg-muted/30">
                {tempSelectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-2 bg-background rounded border hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs bg-muted text-foreground font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name}
                      </p>
                      {(user.email || user.role) && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.role || user.email}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('activities.user_selector.search_label')}
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder || t('activities.user_selector.search_user')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t('activities.user_selector.available_users')}
            </p>
            <div className="max-h-[280px] overflow-y-auto space-y-1 p-2 border rounded-lg">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? t('activities.user_selector.no_user_found')
                      : t('activities.user_selector.no_user_available')}
                  </p>
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = tempSelectedUsers.some(u => u.id === user.id)
                  const canSelect = !maxSelections || tempSelectedUsers.length < maxSelections || isSelected

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleUserToggle(user)}
                      disabled={!canSelect}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-md transition-all",
                        "hover:bg-muted",
                        isSelected && "bg-muted border border-border",
                        !canSelect && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <Avatar className="h-9 w-9 border">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs bg-muted text-foreground font-medium">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.name}
                        </p>
                        {(user.email || user.role) && (
                          <p className="text-xs text-muted-foreground truncate">
                            {user.role || user.email}
                          </p>
                        )}
                      </div>

                      <div className={cn(
                        "w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-colors",
                        isSelected 
                          ? "bg-foreground border-foreground" 
                          : "border-muted-foreground/30"
                      )}>
                        {isSelected && (
                          <Check className="w-3 h-3 text-background" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Selection count and validation */}
          <div className="pt-1 border-t space-y-2">
            {maxSelections && (
              <div className="text-xs text-muted-foreground text-center">
                {t('activities.user_selector.selection_count', { 
                  selected: tempSelectedUsers.length, 
                  max: maxSelections 
                })}
              </div>
            )}
            {tempSelectedUsers.length === 0 && (
              <div className="text-xs text-dark-600 text-center bg-dark-50 border border-dark-200 rounded-md p-2">
                {t('activities.user_selector.minimum_required')}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="flex-1 sm:flex-none"
          >
            {t('activities.user_selector.cancel')}
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={tempSelectedUsers.length === 0}
            className={cn(
              "flex-1 sm:flex-none bg-foreground text-background hover:bg-foreground/90",
              tempSelectedUsers.length === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            {t('activities.user_selector.confirm', { count: tempSelectedUsers.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
