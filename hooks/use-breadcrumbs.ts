"use client"

import { usePathname } from "next/navigation"
import { useMemo } from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

export function useBreadcrumbs() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = []

    // Always start with Dashboard
    items.push({
      label: "Dashboard",
      href: "/dashboard",
      isActive: pathname === "/dashboard"
    })

    // Build breadcrumbs based on path
    let currentPath = ""
    
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`
      const segment = segments[i]
      
      // Map segments to readable labels
      let label = segment
      switch (segment) {
        case "projects":
          label = "Projects"
          break
        case "reports":
          label = "Reports"
          break
        case "annual-reports":
          label = "Annual Reports"
          break
        case "mission-projects":
          label = "Mission Projects"
          break
        case "users":
          label = "Users"
          break
        case "access":
          label = "Access Management"
          break
        case "subsidies":
          label = "Subsidies"
          break
        case "my-subsidies":
          label = "My Subsidies"
          break
        case "activities":
          label = "Activities"
          break
        case "receipts":
          label = "Receipts"
          break
        case "events":
          label = "Events"
          break
        case "communications":
          label = "Communications"
          break
        case "structure":
          label = "Structure"
          break
        case "regions":
          label = "Regions"
          break
        case "churches":
          label = "Churches"
          break
        case "departments":
          label = "Departments"
          break
        default:
          // For dynamic segments like project IDs, try to get a meaningful name
          if (i > 0 && segments[i-1] === "projects" && segment !== "projects") {
            // This is likely a project ID, we'll handle this in the component
            label = "Project Details"
          } else {
            // Capitalize first letter
            label = segment.charAt(0).toUpperCase() + segment.slice(1)
          }
      }

      items.push({
        label,
        href: currentPath,
        isActive: i === segments.length - 1
      })
    }

    return items
  }, [pathname])

  return { breadcrumbs }
}
