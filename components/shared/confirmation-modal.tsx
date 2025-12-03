"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LucideIcon, AlertTriangle, CheckCircle, Info, XCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export type ConfirmationVariant = "default" | "danger" | "success" | "warning" | "info"

export interface ConfirmationModalProps {
  // Control
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  
  // Content
  title: string
  description?: string | React.ReactNode
  children?: React.ReactNode // For custom content
  
  // Customization
  variant?: ConfirmationVariant
  icon?: LucideIcon
  showIcon?: boolean
  
  // Buttons
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  
  // States
  isLoading?: boolean
  disabled?: boolean
  
  // Advanced
  impacts?: string[] // List of impact points
  size?: "sm" | "default" | "lg"
  closeOnConfirm?: boolean // Auto-close after confirm
}

// Variant configurations - Minimalist monochromatic with color accents
const variantConfig = {
  default: {
    icon: Info,
    iconColor: "text-foreground/70",
    bgColor: "bg-muted/50",
    borderColor: "border-border",
    textColor: "text-foreground",
    subtextColor: "text-muted-foreground",
    buttonClass: "bg-foreground text-background hover:bg-foreground/90",
  },
  danger: {
    icon: AlertTriangle,
    iconColor: "text-red-600 dark:text-red-500",
    bgColor: "bg-muted/50",
    borderColor: "border-red-600/20 dark:border-red-500/20",
    textColor: "text-foreground",
    subtextColor: "text-muted-foreground",
    buttonClass: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-foreground/70",
    bgColor: "bg-muted/50",
    borderColor: "border-border",
    textColor: "text-foreground",
    subtextColor: "text-muted-foreground",
    buttonClass: "bg-foreground text-background hover:bg-foreground/90",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-500",
    bgColor: "bg-muted/50",
    borderColor: "border-yellow-600/20 dark:border-yellow-500/20",
    textColor: "text-foreground",
    subtextColor: "text-muted-foreground",
    buttonClass: "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-700",
  },
  info: {
    icon: Info,
    iconColor: "text-foreground/70",
    bgColor: "bg-muted/50",
    borderColor: "border-border",
    textColor: "text-foreground",
    subtextColor: "text-muted-foreground",
    buttonClass: "bg-foreground text-background hover:bg-foreground/90",
  },
}

const sizeConfig = {
  sm: "sm:max-w-[400px]",
  default: "sm:max-w-[500px]",
  lg: "sm:max-w-[600px]",
}

export function ConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  children,
  variant = "default",
  icon,
  showIcon = true,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showCancel = true,
  isLoading = false,
  disabled = false,
  impacts,
  size = "default",
  closeOnConfirm = true,
}: ConfirmationModalProps) {
  const config = variantConfig[variant]
  const Icon = icon || config.icon

  const handleConfirm = async () => {
    try {
      await onConfirm()
      if (closeOnConfirm) {
        onOpenChange(false)
      }
    } catch (error) {
      // Error handling is responsibility of the parent
      console.error("Confirmation error:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeConfig[size])}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {showIcon && <Icon className={cn("w-5 h-5", config.iconColor)} />}
            <span>{title}</span>
          </DialogTitle>
          
          {(description || children || impacts) && (
            <DialogDescription className="space-y-3 pt-2">
              {/* Main description */}
              {description && (
                <div className="text-muted-foreground">
                  {typeof description === "string" ? <p>{description}</p> : description}
                </div>
              )}

              {/* Custom children content */}
              {children}

              {/* Impact list */}
              {impacts && impacts.length > 0 && (
                <div className={cn("border rounded-md p-4", config.bgColor, config.borderColor)}>
                  <div className="flex gap-3">
                    <AlertTriangle className={cn("w-4 h-4 flex-shrink-0 mt-0.5", config.iconColor)} />
                    <div className="space-y-2 flex-1">
                      <p className={cn("text-sm font-medium", config.textColor)}>
                        Important:
                      </p>
                      <ul className={cn("text-sm space-y-1.5", config.subtextColor)}>
                        {impacts.map((impact, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-muted-foreground/50">•</span>
                            <span>{impact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2 mt-2">
          {showCancel && (
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={disabled || isLoading}
            className={cn(config.buttonClass, "min-w-[100px]")}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
