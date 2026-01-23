"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border-2 shadow-xs transition-all outline-none",
        // Unchecked state - cinza escuro
        "border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800",
        // Checked state - cinza mais escuro
        "data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700",
        "data-[state=checked]:text-white",
        "dark:data-[state=checked]:bg-gray-600 dark:data-[state=checked]:border-gray-600",
        // Hover state
        "hover:border-gray-500 dark:hover:border-gray-500",
        "data-[state=checked]:hover:bg-gray-800 dark:data-[state=checked]:hover:bg-gray-700",
        // Focus state
        "focus-visible:ring-[3px] focus-visible:ring-gray-300 dark:focus-visible:ring-gray-700",
        "focus-visible:border-gray-600 dark:focus-visible:border-gray-500",
        // Invalid state
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
