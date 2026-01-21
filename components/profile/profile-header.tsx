"use client"

import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck } from "lucide-react"

interface ProfileHeaderProps {
  name: string
  email: string
  avatar?: string
  isComplete?: boolean
}

export function ProfileHeader({ name, email, avatar, isComplete = false }: ProfileHeaderProps) {
  // Debug: Log when props change
  useEffect(() => {
    console.log("👤 ProfileHeader received props:", { name, email, avatar, isComplete })
  }, [name, email, avatar, isComplete])

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-foreground">{name}</h1>
          {isComplete && (
            <BadgeCheck className="w-6 h-6 text-blue-500 fill-blue-500/20" />
          )}
        </div>
        <p className="text-muted-foreground">{email}</p>
      </div>
    </div>
  )
}
