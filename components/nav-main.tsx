"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useNavigateWithLoading } from "@/hooks/use-navigation-loading"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"

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
import { NavItem, NavSection } from "@/config/navigation"

interface NavMainProps {
  items?: NavItem[]
  sections?: NavSection[]
}

export const NavMain = React.memo(function NavMain({ items, sections }: NavMainProps) {
  const { i18n } = useTranslation()
  const t = structureTranslations[i18n.language as keyof typeof structureTranslations] || structureTranslations.en

  // Helper para resolver label de seção traduzido
  const resolveSectionLabel = React.useCallback((section: NavSection) => {
    if (section.translationKey?.startsWith('sidebar.')) {
      const key = section.translationKey.split('.')[1] as keyof typeof t.sidebar
      return t.sidebar[key] || section.label
    }
    return section.label
  }, [t])

  // Se sections foi passado, renderizar por seções
  if (sections) {
    return (
      <>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{resolveSectionLabel(section)}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <NavMainItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </>
    )
  }

  // Fallback para items (compatibilidade)
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item) => (
          <NavMainItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
})

// Componente memoizado para cada item
const NavMainItem = React.memo(function NavMainItem({ 
  item 
}: { 
  item: NavItem
}) {
  const { state, setOpen } = useSidebar()
  const { navigateWithLoading } = useNavigateWithLoading()
  const { i18n } = useTranslation()
  const t = structureTranslations[i18n.language as keyof typeof structureTranslations] || structureTranslations.en
  
  // Handler para expandir sidebar quando clicar em item com subitens no modo collapsed
  const handleExpandOnClick = React.useCallback(() => {
    if (state === "collapsed" && item.items && item.items.length > 0) {
      setOpen(true)
    }
  }, [state, item.items, setOpen])

  // Helper para resolver título traduzido
  const resolveTitle = React.useCallback((navItem: typeof item) => {
    if (navItem.translationKey?.startsWith('sidebar.')) {
      const key = navItem.translationKey.split('.')[1] as keyof typeof t.sidebar
      return t.sidebar[key] || navItem.title
    }
    return navItem.title
  }, [t])

  const title = resolveTitle(item)

  // Handler para navegação instantânea
  const handleNavigation = React.useCallback((url: string, itemTitle: string) => {
    navigateWithLoading(url, {
      message: t.navigationMessages.opening.replace('{{title}}', itemTitle)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateWithLoading, t])

  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton 
          tooltip={title} 
          isActive={item.isActive}
          onClick={() => handleNavigation(item.url, title)}
          className="cursor-pointer"
        >
          {item.icon && <item.icon className="sidebar-icon" />}
          <span>{title}</span>
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
            tooltip={title} 
            isActive={item.isActive}
            onClick={handleExpandOnClick}
          >
            {item.icon && <item.icon className="sidebar-icon" />}
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 sidebar-icon" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const subTitle = resolveTitle(subItem)
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton 
                    isActive={subItem.isActive}
                    onClick={() => handleNavigation(subItem.url, subTitle)}
                    className="cursor-pointer"
                  >
                    <span>{subTitle}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
})
