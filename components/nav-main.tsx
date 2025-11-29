"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import * as React from "react"
import { it } from "node:test"
import { NavItem } from "@/config/navigation"
import { WithPermission } from "@/hocs/with-permission"

interface NavMainProps {
  items: NavItem[]
}

export const NavMain = React.memo(function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <WithPermission key={item.title} requiredPermissions={item.permissions}>
              <NavMainItem item={item} />
            </WithPermission>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  )
})

// Componente memoizado para cada item
const NavMainItem = React.memo(function NavMainItem({ 
  item 
}: { 
  item: NavMainProps['items'][0] 
}) {
  const { state, setOpen } = useSidebar()
  const router = useRouter()
  
  // Handler para expandir sidebar quando clicar em item com subitens no modo collapsed
  const handleExpandOnClick = React.useCallback(() => {
    if (state === "collapsed" && item.items && item.items.length > 0) {
      setOpen(true)
    }
  }, [state, item.items, setOpen])

  // Handler para navegação instantânea
  const handleNavigation = React.useCallback((url: string) => {
    router.push(url)
  }, [router])

  // Se o item não tem subitens, renderizar como link direto
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip={item.title} 
          isActive={item.isActive}
          onClick={() => handleNavigation(item.url)}
          className="cursor-pointer"
        >
          {item.icon && <item.icon className="sidebar-icon" />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  // Renderizar com subitens
  return (
    <Collapsible
      asChild
      defaultOpen={item.isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={item.title} 
            isActive={item.isActive}
            onClick={handleExpandOnClick}
          >
            {item.icon && <item.icon className="sidebar-icon" />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 sidebar-icon" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <WithPermission key={subItem.title} requiredPermissions={subItem.permissions}>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton 
                    isActive={subItem.isActive}
                    onClick={() => handleNavigation(subItem.url)}
                    className="cursor-pointer"
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </WithPermission>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
})
