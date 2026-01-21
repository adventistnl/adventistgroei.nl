"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Palette } from "lucide-react"
import { cn } from "@/lib/utils"

// Cores pré-definidas para seleção rápida - Dark Tones
export const PRESET_COLORS = [
  { name: 'Slate', value: '#475569' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Zinc', value: '#52525B' },
  { name: 'Stone', value: '#57534E' },
  { name: 'Red', value: '#991B1B' },
  { name: 'Orange', value: '#9A3412' },
  { name: 'Amber', value: '#92400E' },
  { name: 'Yellow', value: '#854D0E' },
  { name: 'Lime', value: '#3F6212' },
  { name: 'Green', value: '#14532D' },
  { name: 'Emerald', value: '#064E3B' },
  { name: 'Teal', value: '#134E4A' },
  { name: 'Cyan', value: '#164E63' },
  { name: 'Sky', value: '#0C4A6E' },
  { name: 'Blue', value: '#1E3A8A' },
  { name: 'Indigo', value: '#312E81' },
  { name: 'Violet', value: '#4C1D95' },
  { name: 'Purple', value: '#581C87' },
  { name: 'Fuchsia', value: '#701A75' },
  { name: 'Pink', value: '#831843' },
]

export interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  disabled?: boolean
  label?: string
  showPreview?: boolean
}

export function ColorPicker({
  value,
  onChange,
  disabled = false,
  label = "Region Color",
  showPreview = true,
}: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-3">
        {/* Preview Circle */}
        {showPreview && (
          <div 
            className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm flex-shrink-0"
            style={{ backgroundColor: value || "#475569" }}
          />
        )}
        
        {/* Color Code */}
        <span className="text-xs font-mono text-muted-foreground flex-1">
          {value}
        </span>

        {/* Button to open color picker */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              type="button"
              disabled={disabled}
            >
              <Palette className="w-4 h-4 mr-2" />
              Choose Color
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Choose Color</DialogTitle>
              <DialogDescription className="text-sm">
                Select a color or use the custom picker
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Preset Colors Grid - Compact */}
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                  Preset Colors
                </Label>
                <div className="grid grid-cols-10 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => onChange(color.value)}
                      className={cn(
                        "w-8 h-8 rounded-md border-2 transition-all hover:scale-110",
                        value === color.value 
                          ? "border-gray-900 ring-2 ring-offset-2 ring-gray-900" 
                          : "border-gray-200 hover:border-gray-400"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Custom Color Picker - Minimal */}
              <div>
                <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                  Custom Color
                </Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={value || "#475569"}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-20 rounded border border-gray-200 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={value || "#475569"}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
