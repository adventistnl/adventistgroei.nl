"use client"

import * as React from "react"
import { Church } from "lucide-react"

interface RegistrationLayoutProps {
  children: React.ReactNode
  isVisible?: boolean
}

/**
 * Layout principal da página de registro
 * Implementa o design de 7 colunas com sidebar escura
 */
export function RegistrationLayout({ children, isVisible = true }: RegistrationLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className={`grid grid-cols-7 min-h-screen transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Colunas 1-6: Conteúdo Principal */}
        <div className="col-span-6 flex items-center justify-center p-1rem sm:p-2rem">
          <div className="w-full max-w-2xl grid gap-4">
            {children}
          </div>
        </div>
        
        {/* Coluna 7: Sidebar decorativa */}
        <div className="col-span-1 bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
          {/* Logo centralizado no topo */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Church className="w-6 h-6 text-gray-900" />
            </div>
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-48 left-1/4 w-8 h-8 bg-white/60 rounded-full"></div>
            <div className="absolute top-64 right-1/4 w-12 h-12 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/80 rounded-full"></div>
          </div>
          
          {/* Linhas decorativas sutis */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
