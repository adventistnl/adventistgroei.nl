"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface MockDataIndicatorProps {
  queryName: string
  description: string
  className?: string
}

export function MockDataIndicator({ queryName, description, className }: MockDataIndicatorProps) {
  return (
    <Badge
      variant="destructive"
      className={`inline-flex items-center gap-1 text-xs font-medium ${className}`}
      title={`${queryName}: ${description}`}
    >
      <AlertTriangle className="w-3 h-3" />
      🔴 MOCK_DATA: {queryName}
    </Badge>
  )
}

// Hook para verificar se deve mostrar indicadores de mock data
export function useShowMockIndicators(): boolean {
  // Em desenvolvimento, sempre mostrar
  // Em produção, pode ser controlado por uma flag de ambiente
  if (typeof window !== 'undefined') {
    return process.env.NODE_ENV === 'development' ||
           localStorage.getItem('show-mock-indicators') === 'true'
  }
  return false
}