"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ColorPickerContext = React.createContext<{
  color: string
  setColor: (color: string) => void
}>({
  color: "#000000",
  setColor: () => {},
})

export const ColorPicker = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onChange?: (color: string) => void
  }
>(({ className, value = "#000000", onChange, children, ...props }, ref) => {
  const [color, setColor] = React.useState(value)

  React.useEffect(() => {
    setColor(value)
  }, [value])

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    onChange?.(newColor)
  }

  return (
    <ColorPickerContext.Provider value={{ color, setColor: handleColorChange }}>
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {children}
      </div>
    </ColorPickerContext.Provider>
  )
})
ColorPicker.displayName = "ColorPicker"

export const ColorPickerSelection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { color } = React.useContext(ColorPickerContext)

  return (
    <div
      ref={ref}
      className={cn(
        "h-32 w-full rounded-md border",
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    />
  )
})
ColorPickerSelection.displayName = "ColorPickerSelection"

export const ColorPickerHue = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const { color, setColor } = React.useContext(ColorPickerContext)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  return (
    <input
      ref={ref}
      type="color"
      value={color}
      onChange={handleChange}
      className={cn("h-8 w-full cursor-pointer rounded border", className)}
      {...props}
    />
  )
})
ColorPickerHue.displayName = "ColorPickerHue"

export const ColorPickerAlpha = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="range"
      min="0"
      max="1"
      step="0.01"
      className={cn("h-2 w-full cursor-pointer rounded", className)}
      {...props}
    />
  )
})
ColorPickerAlpha.displayName = "ColorPickerAlpha"

export const ColorPickerOutput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const { color, setColor } = React.useContext(ColorPickerContext)

  return (
    <input
      ref={ref}
      type="text"
      value={color}
      onChange={(e) => setColor(e.target.value)}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm font-mono",
        className
      )}
      {...props}
    />
  )
})
ColorPickerOutput.displayName = "ColorPickerOutput"

export const ColorPickerFormat = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "h-9 rounded-md border border-input bg-background px-3 text-xs font-medium",
        className
      )}
      {...props}
    >
      HEX
    </button>
  )
})
ColorPickerFormat.displayName = "ColorPickerFormat"

export const ColorPickerEyeDropper = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "h-9 w-9 rounded-md border border-input bg-background flex items-center justify-center",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
      </svg>
    </button>
  )
})
ColorPickerEyeDropper.displayName = "ColorPickerEyeDropper"
