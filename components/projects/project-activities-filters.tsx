"use client"

import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

interface ProjectActivitiesFiltersProps {
  subsidyFilter: string
  statusFilter: string
  priorityFilter: string
  tagFilter: string
  searchQuery: string
  onSubsidyChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPriorityChange: (value: string) => void
  onTagChange: (value: string) => void
  onSearchChange: (value: string) => void
  onClearFilters: () => void
  onAddActivity: () => void
}

export function ProjectActivitiesFilters({
  subsidyFilter,
  statusFilter,
  priorityFilter,
  tagFilter,
  searchQuery,
  onSubsidyChange,
  onStatusChange,
  onPriorityChange,
  onTagChange,
  onSearchChange,
  onClearFilters,
  onAddActivity
}: ProjectActivitiesFiltersProps) {
  return (
    <div className="flex items-center justify-between m-0">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar atividades..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50"
        />
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center gap-3">
        <Select value={subsidyFilter} onValueChange={onSubsidyChange}>
          <SelectTrigger className="w-40 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Atividades</SelectItem>
            <SelectItem value="subsidized">Subsidiadas</SelectItem>
            <SelectItem value="non-subsidized">Não Subsidiadas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-32 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-32 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={onTagChange}>
          <SelectTrigger className="w-32 h-9 bg-background border-2 border-border hover:border-primary/50 focus:border-primary dark:bg-background dark:border-border dark:hover:border-primary/50">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="reforma">Reforma</SelectItem>
            <SelectItem value="material">Material</SelectItem>
            <SelectItem value="training">Treinamento</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onClearFilters} className="h-9 border-2">
          Limpar
        </Button>

        <Button onClick={onAddActivity} size="sm" className="h-9">
          <Plus className="w-4 h-4 mr-2" />
          Nova Atividade
        </Button>
      </div>
    </div>
  )
}
