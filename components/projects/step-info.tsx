import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StepInfoProps {
  icon: LucideIcon
  title: string
  description: string
  content: string
}

export function StepInfo({ icon: Icon, title, description, content }: StepInfoProps) {
  return (
    <div className="w-full lg:w-1/4 space-y-4">
      <div className="p-6 rounded-lg border border-muted">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p>{content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
