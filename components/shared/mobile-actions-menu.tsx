"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MoreVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileActionsMenuProps {
  children: React.ReactNode
  className?: string
}

export function MobileActionsMenu({ children, className }: MobileActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Converter children em array para animar individualmente
  const childrenArray = React.Children.toArray(children)

  return (
    <div className={cn("relative", className)}>
      {/* Botão Trigger - Hambúrguer/Sanduíche */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 relative mr-3 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MoreVertical className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Dropdown com Animação */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Fechar ao clicar fora */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 top-12 z-40 w-14 rounded-lg border bg-popover p-2 shadow-lg md:hidden"
            >
              <div className="flex flex-col gap-2">
                {childrenArray.map((child, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.08, // Stagger effect - cada item aparece 80ms após o anterior
                      ease: "easeOut"
                    }}
                  >
                    <div
                      className="w-full"
                      onClick={(e) => {
                        // Fechar menu após clicar em qualquer botão
                        // Usar setTimeout para permitir a ação do botão antes de fechar
                        setTimeout(() => setIsOpen(false), 150)
                      }}
                    >
                      {child}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
