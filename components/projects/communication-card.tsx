"use client"

import React from "react"
import { 
  Megaphone, 
  Calendar, 
  User, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface CommunicationCardData {
  id: string
  title: string
  content: string
  type: "announcement" | "update" | "alert" | "newsletter"
  priority: "low" | "medium" | "high" | "urgent"
  status: "draft" | "scheduled" | "published" | "archived"
  schedule_at?: Date | null
  published_at?: Date | null
  author_name: string
  recipients_count?: number
}

interface CommunicationCardProps {
  communication: CommunicationCardData
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
}

const typeConfig = {
  announcement: { label: "Anúncio", variant: "default" as const },
  update: { label: "Atualização", variant: "outline" as const },
  alert: { label: "Alerta", variant: "destructive" as const },
  newsletter: { label: "Newsletter", variant: "secondary" as const },
}

const priorityConfig = {
  low: { label: "Baixa", color: "text-green-600 dark:text-green-400" },
  medium: { label: "Média", color: "text-yellow-600 dark:text-yellow-400" },
  high: { label: "Alta", color: "text-orange-600 dark:text-orange-400" },
  urgent: { label: "Urgente", color: "text-red-600 dark:text-red-400" },
}

const statusConfig = {
  draft: { label: "Rascunho", color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
  scheduled: { label: "Agendado", color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300" },
  published: { label: "Publicado", color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300" },
  archived: { label: "Arquivado", color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" },
}

export function CommunicationCard({
  communication,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
}: CommunicationCardProps) {
  const typeInfo = typeConfig[communication.type]
  const priorityInfo = priorityConfig[communication.priority]
  const statusInfo = statusConfig[communication.status]

  const formattedDate = communication.published_at
    ? new Date(communication.published_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : communication.schedule_at
    ? new Date(communication.schedule_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-1 mb-2">
              {communication.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge className={cn("text-xs", statusInfo.color)}>
                {statusInfo.label}
              </Badge>
              {formattedDate && (
                <span className="text-xs text-muted-foreground">
                  {formattedDate}
                </span>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(communication.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(communication.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(communication.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(communication.id)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {communication.content}
        </p>
      </CardContent>
    </Card>
  )
}
