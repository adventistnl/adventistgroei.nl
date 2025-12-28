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
import { cn } from "@/lib/utils"

export interface UserAvatarProps {
  /** User data */
  user: {
    id: string
    name: string
    email?: string
    avatar?: string
    role?: string
    initials?: string
  }
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Show tooltip on hover */
  showTooltip?: boolean
  /** Additional CSS classes */
  className?: string
  /** Click handler */
  onClick?: () => void
}

const sizeClasses = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
}

const fontSizeClasses = {
  sm: "text-[9px]",
  md: "text-[10px]",
  lg: "text-xs",
}

/**
 * UserAvatar - Reusable component for displaying a single user avatar
 * 
 * Features:
 * - Responsive sizes (sm, md, lg)
 * - Optional tooltip with user details
 * - Fallback with user initials
 * - Click handler support
 * - Consistent styling
 * 
 * @example
 * ```tsx
 * <UserAvatar 
 *   user={user}
 *   size="md"
 *   showTooltip={true}
 * />
 * ```
 */
export function UserAvatar({
  user,
  size = "md",
  showTooltip = true,
  className,
  onClick,
}: UserAvatarProps) {
  const getInitials = (name: string, providedInitials?: string): string => {
    if (providedInitials) return providedInitials
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const avatar = (
    <Avatar 
      className={cn(
        sizeClasses[size],
        onClick && "cursor-pointer",
        "transition-transform hover:scale-110 hover:z-50 relative",
        className
      )}
      onClick={onClick}
    >
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback 
        className={cn(
          fontSizeClasses[size],
          "bg-gray-600 dark:bg-gray-700 text-white font-semibold"
        )}
      >
        {getInitials(user.name, user.initials)}
      </AvatarFallback>
    </Avatar>
  )

  if (!showTooltip) {
    return avatar
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {avatar}
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="text-xs max-w-[200px]"
          sideOffset={5}
        >
          <div className="space-y-1">
            <p className="font-medium">{user.name}</p>
            {user.email && (
              <p className="text-gray-400 text-[10px]">{user.email}</p>
            )}
            {user.role && (
              <p className="text-gray-400 text-[10px] capitalize">
                {user.role}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
