"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"

export function ThemeSwitcher() {
  const [isDark, setIsDark] = React.useState(false)

  // Carregar tema salvo ao inicializar
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
    setIsDark(shouldBeDark)
    
    // Aplicar tema ao documento
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    // Aplicar tema ao documento
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      toast.success('🌙 Dark mode activated', {
        duration: 2000,
        style: { background: '#1f2937', color: '#f9fafb' }
      })
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      toast.success('☀️ Light mode activated', {
        duration: 2000,
        style: { background: '#ffffff', color: '#1f2937' }
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => {
          setIsDark(false)
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
          toast.success('☀️ Light theme applied')
        }}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setIsDark(true)
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
          toast.success('🌙 Dark theme applied')
        }}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
          setIsDark(systemPrefersDark)
          if (systemPrefersDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          localStorage.removeItem('theme')
          toast.success('🖥️ System theme applied')
        }}>
          <div className="mr-2 h-4 w-4 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-current" />
          </div>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
