"use client"

import React, { useState } from "react"
import { UserPlus, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export interface UserSelectorProps {
  /** Lista de usuários disponíveis */
  availableUsers: User[]

  /** Usuário atualmente selecionado */
  selectedUser: User | null

  /** Callback quando um usuário é selecionado */
  onUserSelect: (user: User) => void

  /** Label do botão */
  buttonLabel?: string

  /** Título do dialog */
  dialogTitle?: string

  /** Placeholder da busca */
  searchPlaceholder?: string

  /** Desabilitar */
  disabled?: boolean
}

export function UserSelector({
  availableUsers,
  selectedUser,
  onUserSelect,
  buttonLabel = "Selecionar Usuário",
  dialogTitle = "Selecionar Responsável",
  searchPlaceholder = "Buscar usuário...",
  disabled = false,
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

  const handleUserSelect = (user: User) => {
    onUserSelect(user)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <div className="max-h-[400px] overflow-y-auto space-y-1">
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
                const isSelected = selectedUser?.id === user.id

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleUserSelect(user)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      isSelected && "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
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

                    {isSelected && (
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* Current Selection Info */}
          {selectedUser && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Selecionado:
              </p>
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedUser.name}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
