"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Users, Check, ChevronsUpDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { churchTranslations } from "@/lib/translations/churches"

interface User {
  id: string
  name: string
  email: string
  is_deleted?: boolean
}

interface LeaderSelectorProps {
  value: string
  onValueChange: (value: string) => void
  users: User[]
  isLoading?: boolean
  error?: string
  required?: boolean
}

export function LeaderSelector({
  value,
  onValueChange,
  users,
  isLoading = false,
  error,
  required = false
}: LeaderSelectorProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  // Filter active users
  const activeUsers = useMemo(() => 
    users.filter(user => !user.is_deleted),
    [users]
  )

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!search) return activeUsers
    return activeUsers.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [activeUsers, search])

  // Get selected user
  const selectedUser = useMemo(() => {
    return activeUsers.find(u => u.id === value)
  }, [value, activeUsers])

  const displayText = selectedUser 
    ? selectedUser.name 
    : tChurch.placeholders.leader

  return (
    <div className="space-y-2">
      <Label htmlFor="leader" className="flex items-center gap-2 text-sm">
        <Users className="w-4 h-4 text-muted-foreground" />
        {tChurch.fields.leader} {required && '*'}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-10 justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
            disabled={isLoading}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {selectedUser && (
                <Avatar className="w-5 h-5">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-[10px]">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="truncate">{displayText}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={tChurch.placeholders.leader}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup heading={tChurch.fields.leader}>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onSelect={() => {
                      onValueChange(user.id)
                      setOpen(false)
                      setSearch("")
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === user.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
