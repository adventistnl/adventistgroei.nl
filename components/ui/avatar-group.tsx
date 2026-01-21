"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AvatarGroupContextType {
  size?: "sm" | "md" | "lg"
}

const AvatarGroupContext = React.createContext<AvatarGroupContextType>({
  size: "md"
})

interface AvatarGroupProps {
  children: React.ReactNode
  className?: string
  size?: "sm" | "md" | "lg"
  max?: number
}

/**
 * AvatarGroup - Stacked avatars with overlap effect
 * 
 * @example
 * ```tsx
 * <AvatarGroup>
 *   <Avatar>
 *     <AvatarImage src="..." />
 *     <AvatarFallback>JD</AvatarFallback>
 *     <AvatarGroupTooltip>John Doe</AvatarGroupTooltip>
 *   </Avatar>
 * </AvatarGroup>
 * ```
 */
export function AvatarGroup({ 
  children, 
  className,
  size = "md",
  max 
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children)
  const displayedChildren = max ? childrenArray.slice(0, max) : childrenArray
  const remainingCount = max && childrenArray.length > max ? childrenArray.length - max : 0

  return (
    <AvatarGroupContext.Provider value={{ size }}>
      <div className={cn("flex -space-x-2", className)}>
        {displayedChildren.map((child, index) => (
          <div 
            key={index}
            className="relative transition-transform hover:scale-110 hover:z-10"
            style={{ zIndex: displayedChildren.length - index }}
          >
            {child}
          </div>
        ))}
        {remainingCount > 0 && (
          <div 
            className={cn(
              "flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-background",
              "text-xs font-medium text-gray-600 dark:text-gray-300",
              size === "sm" && "size-8",
              size === "md" && "size-10",
              size === "lg" && "size-12"
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </AvatarGroupContext.Provider>
  )
}

interface AvatarGroupTooltipProps {
  children: React.ReactNode
}

/**
 * AvatarGroupTooltip - Tooltip for individual avatars in a group
 * Must be used as child of Avatar component within AvatarGroup
 */
export function AvatarGroupTooltip({ children }: AvatarGroupTooltipProps) {
  const parentAvatar = React.useContext(AvatarGroupContext)
  
  // This component wraps its parent Avatar with a tooltip
  // It should be rendered by the Avatar component itself
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="contents" />
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Hook to use AvatarGroup context
export function useAvatarGroup() {
  return React.useContext(AvatarGroupContext)
}
