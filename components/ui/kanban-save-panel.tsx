"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, X } from "lucide-react"

export interface KanbanSavePanelProps {
  pendingChangesCount: number
  isSaving: boolean
  onSave: () => void
  onDiscard: () => void
}

export function KanbanSavePanel({
  pendingChangesCount,
  isSaving,
  onSave,
  onDiscard,
}: KanbanSavePanelProps) {
  if (pendingChangesCount === 0) return null
  
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
      <Card className="shadow-xl border-2 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <div className="text-sm">
                <span className="font-semibold">{pendingChangesCount}</span>
                <span className="text-muted-foreground ml-1">
                  unsaved change{pendingChangesCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDiscard}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Discard
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
