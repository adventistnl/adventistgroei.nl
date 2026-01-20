"use client"

import React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface MyProjectsFilterProps {
  /**
   * Current user object with id, name, email, and optional avatar
   */
  user: {
    id: string
    name: string
    email?: string
    avatar?: string | null
  } | null
  
  /**
   * Whether the filter is currently active (showing only user's projects)
   */
  active: boolean
  
  /**
   * Default active state for the filter (optional)
   */
  defaultActive?: boolean
  
  /**
   * Callback function when filter is toggled
   */
  onToggle: () => void
  
  /**
   * Translations for tooltip messages
   */
  translations?: {
    showMyProjects?: string
    showAllProjects?: string
  }
  
  /**
   * Optional custom className for the button
   */
  className?: string
  
  /**
   * Optional size for the avatar (default: h-8 w-8)
   */
  size?: "sm" | "md" | "lg"
}

/**
 * MyProjectsFilter Component
 * 
 * A reusable filter component that displays the current user's avatar
 * and toggles between showing all projects or only the user's projects.
 * 
 * @example
 * ```tsx
 * const [showMyProjectsOnly, setShowMyProjectsOnly] = useState(false)
 * 
 * <MyProjectsFilter
 *   user={user}
 *   active={showMyProjectsOnly}
 *   onToggle={() => setShowMyProjectsOnly(!showMyProjectsOnly)}
 *   translations={{
 *     showMyProjects: "Show my projects",
 *     showAllProjects: "Show all projects"
 *   }}
 * />
 * ```
 */
export function MyProjectsFilter({
  user,
  active,
  defaultActive = false,
  onToggle,
  translations = {
    showMyProjects: "Show my projects",
    showAllProjects: "Show all projects"
  },
  className = "",
  size = "md"
}: MyProjectsFilterProps) {
  // Don't render if no user is available
  if (!user) {
    return null
  }

  // Avatar size classes
  const avatarSizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }

  // Fallback text size classes
  const fallbackSizeClasses = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm"
  }

  // Generate user initials from name
  const getUserInitials = (name: string): string => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  }

  const tooltipMessage = active 
    ? translations.showAllProjects 
    : translations.showMyProjects

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="default"
          size="icon"
          onClick={onToggle}
          className={`
            relative transition-all duration-200
            ${active 
              ? 'bg-gray-900 rounded-full dark:bg-gray-100 border-gray-600 dark:border-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200' 
              : 'bg-gray-100 rounded-full dark:bg-gray-800 border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
            ${className}
          `}
          aria-label={tooltipMessage}
        >
          <Avatar className={`${avatarSizeClasses[size]} rounded-full`}>
            <AvatarImage 
              src={user.avatar || undefined} 
              alt={user.name} 
            />
            <AvatarFallback className={`
              ${fallbackSizeClasses[size]} rounded-full
              ${active 
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}>
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipMessage}</p>
      </TooltipContent>
    </Tooltip>
  )
}
