"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export interface LoginFieldInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text shown above the input */
  label: string
  /** Field ID — used to link label and input */
  fieldId: string
  /** Error message. When provided the field switches to error state */
  error?: string
  /** Icon rendered inside the input on the left */
  leftIcon?: React.ReactNode
  /** Element rendered inside the input on the right (e.g. show/hide toggle) */
  rightElement?: React.ReactNode
}

/**
 * Reusable login form field.
 * Uses bottom-border-only style (global class: input-underline).
 * Switches to red on error with animated glow underline.
 */
export const LoginFieldInput = React.forwardRef<
  HTMLInputElement,
  LoginFieldInputProps
>(
  (
    {
      label,
      fieldId,
      error,
      leftIcon,
      rightElement,
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error)
    const hasMessage = Boolean(error?.trim())

    return (
      <div className="space-y-2">
        <Label
          htmlFor={fieldId}
          className={cn(
            "font-medium transition-colors duration-200",
            hasError ? "text-destructive" : "text-foreground"
          )}
          style={{ fontSize: "clamp(0.875rem, 2vw, 1rem)" }}
        >
          {label}
        </Label>

        {/* Input wrapper */}
        <div className="relative group">
          {/* Left icon */}
          {leftIcon && (
            <span
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 pointer-events-none",
                hasError ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {leftIcon}
            </span>
          )}

          <Input
            id={fieldId}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={hasMessage ? `${fieldId}-error` : undefined}
            onChange={onChange}
            className={cn(
              "input-underline",
              leftIcon ? "!pl-7" : "!pl-0",
              rightElement ? "!pr-10" : "",
              className
            )}
            style={{
              height: "clamp(3rem, 6vh, 4rem)",
              fontSize: "clamp(0.875rem, 2.5vw, 1.125rem)",
            }}
            {...props}
          />

          {/* Right element (e.g. show/hide password) */}
          {rightElement && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}

          {/* Animated underline glow on focus/error */}
          <span
            className={cn(
              "absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 pointer-events-none",
              "group-focus-within:w-full",
              hasError
                ? "bg-destructive shadow-[0_0_8px_theme(colors.red.500/0.5)]"
                : "bg-primary shadow-[0_0_8px_theme(colors.gray.900/0.3)]"
            )}
          />
        </div>

        {/* Inline error message */}
        {hasMessage && (
          <p
            id={`${fieldId}-error`}
            role="alert"
            className="text-destructive text-xs font-medium flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

LoginFieldInput.displayName = "LoginFieldInput"
