"use client"

import * as React from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
  description?: string
  deletable?: boolean
}

export function ConfirmDeleteSubsidyModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Excluir solicitação",
  description = "Tem certeza que deseja excluir esta solicitação? Essa ação não poderá ser desfeita.",
  deletable = true,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
      <div className="w-[420px] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          {deletable ? (
            <Button onClick={() => { onConfirm && onConfirm(); onClose(); }} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="w-4 h-4 mr-2" />Excluir
            </Button>
          ) : (
            <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white">
              Fechar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
