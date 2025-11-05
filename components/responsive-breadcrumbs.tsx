"use client"

import * as React from "react"
import { useState } from "react"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface BreadcrumbData {
  name: string
  href?: string
  onClick?: () => void
}

interface ResponsiveBreadcrumbsProps {
  breadcrumbs: BreadcrumbData[]
  pageTitle?: string
  maxVisibleItems?: number
}

export function ResponsiveBreadcrumbs({ 
  breadcrumbs, 
  pageTitle,
  maxVisibleItems = 2 
}: ResponsiveBreadcrumbsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // If no breadcrumbs, show just the page title
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return (
      <div className="text-sm font-medium text-foreground">
        {pageTitle || "Dashboard"}
      </div>
    )
  }

  // For mobile/tablet - show compressed version with expand option
  const shouldCompress = breadcrumbs.length > maxVisibleItems

  if (shouldCompress && !isExpanded) {
    const lastItems = breadcrumbs.slice(-maxVisibleItems)
    const hiddenItems = breadcrumbs.slice(0, -maxVisibleItems)

    return (
      <div className="flex items-center gap-2">
        {/* Dropdown for hidden items */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs hover:bg-muted"
              onMouseEnter={() => setIsExpanded(true)}
            >
              <MoreHorizontal className="w-3 h-3" />
              <span className="ml-1">{hiddenItems.length}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {hiddenItems.map((crumb, index) => (
              <DropdownMenuItem key={index} asChild>
                {crumb.href ? (
                  <a href={crumb.href} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    {crumb.name}
                  </a>
                ) : crumb.onClick ? (
                  <button onClick={crumb.onClick} className="flex items-center gap-2 w-full text-left">
                    <ChevronRight className="w-3 h-3" />
                    {crumb.name}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    {crumb.name}
                  </div>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ChevronRight className="w-3 h-3 text-muted-foreground" />

        {/* Visible items */}
        <Breadcrumb>
          <BreadcrumbList>
            {lastItems.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href} className="text-sm">
                      {crumb.name}
                    </BreadcrumbLink>
                  ) : crumb.onClick ? (
                    <BreadcrumbLink asChild className="text-sm cursor-pointer">
                      <button onClick={crumb.onClick}>
                        {crumb.name}
                      </button>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-sm font-medium">
                      {crumb.name}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    )
  }

  // Full breadcrumbs or expanded view
  return (
    <div 
      className="relative"
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink href={crumb.href} className="text-sm">
                    {crumb.name}
                  </BreadcrumbLink>
                ) : crumb.onClick ? (
                  <BreadcrumbLink asChild className="text-sm cursor-pointer">
                    <button onClick={crumb.onClick}>
                      {crumb.name}
                    </button>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-sm font-medium">
                    {crumb.name}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
