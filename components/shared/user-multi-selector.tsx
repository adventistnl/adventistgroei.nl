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
  buttonLabel?: string

  /** Título do dialog */
  dialogTitle?: string

  /** Placeholder da busca */
  searchPlaceholder?: string

  /** Desabilitar */
  disabled?: boolean

  /** Número máximo de usuários selecionáveis (opcional) */
  maxSelections?: number
}

export function UserMultiSelector({
  availableUsers,
  selectedUsers,
  onUsersChange,
  buttonLabel = "Adicionar Responsáveis",
  dialogTitle = "Selecionar Responsáveis",
  searchPlaceholder = "Buscar usuário...",
  disabled = false,
  maxSelections,
}: UserMultiSelectorProps) {
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
          <UserPlus className="w-4 h-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Users Chips */}
          {tempSelectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {tempSelectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-[8px] bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    {user.name.split(" ")[0]}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user.id)}
                    className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Users List */}
          <div className="max-h-[300px] overflow-y-auto space-y-1">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "Nenhum usuário encontrado"
                    : "Nenhum usuário disponível"}
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
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      isSelected && "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800",
                      !canSelect && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.name}
                      </p>
                      {(user.email || user.role) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.role || user.email}
                        </p>
                      )}
                    </div>

                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                      isSelected 
                        ? "bg-blue-600 border-blue-600" 
                        : "border-gray-300 dark:border-gray-600"
                    )}>
                      {isSelected && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Selection count */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {tempSelectedUsers.length} usuário(s) selecionado(s)
            {maxSelections && ` (máximo: ${maxSelections})`}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
