/**
 * Project History — i18n translations
 *
 * Contains:
 * 1. Event-type labels (type → human-readable)
 * 2. Field-name labels (field_name → human-readable)
 * 3. Value-name labels (status keys, boolean values, etc.)
 * 4. UI strings for the history panel component
 *
 * Usage:
 *   import { projectHistoryTranslations } from "@/lib/translations/project-history"
 *   const tH = projectHistoryTranslations[i18n.language] ?? projectHistoryTranslations.en
 */

export type ProjectHistoryI18n = {
  /** Labels for each history event type */
  types: Record<string, string>
  /** Human-readable labels for field_name values sent by the backend */
  fields: Record<string, string>
  /** Human-readable labels for status keys + boolean values embedded in old_value/new_value */
  values: Record<string, string>
  /** UI panel strings */
  panel: {
    title: string
    noHistory: string
    commentPlaceholder: string
    addComment: string
    saving: string
    deleteLabel: string
    deleteConfirmTitle: string
    deleteConfirmDescription: string
    cancel: string
    confirm: string
    systemEvent: string
    comment: string
    today: string
    yesterday: string
    just_now: string
    minutes_ago: (n: number) => string
    hours_ago: (n: number) => string
    days_ago: (n: number) => string
    onlyCollaboratorsCanComment: string
  }
}

// ─── English ──────────────────────────────────────────────────────────────────
const en: ProjectHistoryI18n = {
  types: {
    COMMENT: "Comment",
    CREATED: "Project created",
    UPDATED: "Project updated",
    STATUS_CHANGED: "Status changed",
    BUDGET_UPDATED: "Budget updated",
    DEADLINE_UPDATED: "Deadline updated",
    OWNER_CHANGED: "Owner changed",
    CO_OWNER_UPDATED: "Co-owner updated",
    DEPARTMENT_CHANGED: "Department changed",
    ACTIVITY_CREATED: "Activity added",
    ACTIVITY_UPDATED: "Activity updated",
    ACTIVITY_DELETED: "Activity removed",
    SUBSIDY_CREATED: "Subsidy request created",
    SUBSIDY_UPDATED: "Subsidy request updated",
    SUBSIDY_DELETED: "Subsidy request deleted",
    SUBSIDY_APPROVED: "Subsidy request approved",
    SUBSIDY_REJECTED: "Subsidy request rejected",
    DELETED: "Project deleted",
    RESTORED: "Project restored",
    ADJUSTMENT_NEEDED: "Adjustment requested",
    ADJUSTMENT_RESOLVED: "Adjustment resolved",
  },
  fields: {
    title: "Title",
    description: "Description",
    budget: "Budget",
    subsidized_budget: "Subsidized budget",
    balance: "Balance",
    start_at: "Start date",
    end_at: "End date",
    deadline: "Deadline",
    status: "Status",
    owner_id: "Owner",
    co_owner_id: "Co-owner",
    department_id: "Department",
    church_id: "Church",
    language_preference: "Language",
    is_private: "Visibility",
    required_volunteers: "Requires volunteers",
    type: "Project type",
    activity_name: "Activity name",
    activity_status: "Activity status",
    activity_budget: "Activity budget",
    requested_amount: "Requested amount",
    approved_amount: "Approved amount",
  },
  values: {
    // Statuses
    DRAFT: "Draft",
    OPEN_REQUEST: "Open Request",
    IN_REVIEW: "In Review",
    ADJUSTMENTS_NEEDED: "Adjustments Needed",
    IN_PROGRESS: "In Progress",
    PENDING_RECEIPT: "Pending Receipt",
    WAITING_REFUND: "Waiting Refund",
    OVERDUE: "Overdue",
    CONCLUDED: "Concluded",
    // Activity statuses
    PENDING: "Pending",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    // Booleans
    true: "Yes",
    false: "No",
    // Types
    Local: "Local",
    Global: "Global",
  },
  panel: {
    title: "Project History",
    noHistory: "No history entries yet.",
    commentPlaceholder: "Leave a progress comment…",
    addComment: "Add comment",
    saving: "Saving…",
    deleteLabel: "Delete entry",
    deleteConfirmTitle: "Delete history entry?",
    deleteConfirmDescription: "This entry will be permanently removed. This action cannot be undone.",
    cancel: "Cancel",
    confirm: "Delete",
    systemEvent: "System event",
    comment: "Comment",
    today: "Today",
    yesterday: "Yesterday",
    just_now: "just now",
    minutes_ago: (n) => `${n}m ago`,
    hours_ago: (n) => `${n}h ago`,
    days_ago: (n) => `${n}d ago`,
    onlyCollaboratorsCanComment: "Only collaborators can leave comments",
  },
}

// ─── Dutch ────────────────────────────────────────────────────────────────────
const nl: ProjectHistoryI18n = {
  types: {
    COMMENT: "Opmerking",
    CREATED: "Project aangemaakt",
    UPDATED: "Project bijgewerkt",
    STATUS_CHANGED: "Status gewijzigd",
    BUDGET_UPDATED: "Budget bijgewerkt",
    DEADLINE_UPDATED: "Deadline bijgewerkt",
    OWNER_CHANGED: "Eigenaar gewijzigd",
    CO_OWNER_UPDATED: "Mede-eigenaar bijgewerkt",
    DEPARTMENT_CHANGED: "Afdeling gewijzigd",
    ACTIVITY_CREATED: "Activiteit toegevoegd",
    ACTIVITY_UPDATED: "Activiteit bijgewerkt",
    ACTIVITY_DELETED: "Activiteit verwijderd",
    SUBSIDY_CREATED: "Subsidieaanvraag aangemaakt",
    SUBSIDY_UPDATED: "Subsidieaanvraag bijgewerkt",
    SUBSIDY_DELETED: "Subsidieaanvraag verwijderd",
    SUBSIDY_APPROVED: "Subsidieaanvraag goedgekeurd",
    SUBSIDY_REJECTED: "Subsidieaanvraag afgewezen",
    DELETED: "Project verwijderd",
    RESTORED: "Project hersteld",
    ADJUSTMENT_NEEDED: "Aanpassing aangevraagd",
    ADJUSTMENT_RESOLVED: "Aanpassing opgelost",
  },
  fields: {
    title: "Titel",
    description: "Beschrijving",
    budget: "Budget",
    subsidized_budget: "Gesubsidieerd budget",
    balance: "Balans",
    start_at: "Startdatum",
    end_at: "Einddatum",
    deadline: "Deadline",
    status: "Status",
    owner_id: "Eigenaar",
    co_owner_id: "Mede-eigenaar",
    department_id: "Afdeling",
    church_id: "Kerk",
    language_preference: "Taal",
    is_private: "Zichtbaarheid",
    required_volunteers: "Vereist vrijwilligers",
    type: "Projecttype",
    activity_name: "Naam activiteit",
    activity_status: "Status activiteit",
    activity_budget: "Budget activiteit",
    requested_amount: "Gevraagd bedrag",
    approved_amount: "Goedgekeurd bedrag",
  },
  values: {
    DRAFT: "Concept",
    OPEN_REQUEST: "Open Verzoek",
    IN_REVIEW: "In Beoordeling",
    ADJUSTMENTS_NEEDED: "Aanpassingen Nodig",
    IN_PROGRESS: "In Uitvoering",
    PENDING_RECEIPT: "Wachten op Bon",
    WAITING_REFUND: "Wachten op Terugbetaling",
    OVERDUE: "Verlopen",
    CONCLUDED: "Afgesloten",
    PENDING: "In behandeling",
    COMPLETED: "Voltooid",
    CANCELLED: "Geannuleerd",
    true: "Ja",
    false: "Nee",
    Local: "Lokaal",
    Global: "Globaal",
  },
  panel: {
    title: "Projectgeschiedenis",
    noHistory: "Nog geen geschiedenisvermeldingen.",
    commentPlaceholder: "Laat een voortgangsopmerking achter…",
    addComment: "Opmerking toevoegen",
    saving: "Opslaan…",
    deleteLabel: "Vermelding verwijderen",
    deleteConfirmTitle: "Geschiedenisvermelde verwijderen?",
    deleteConfirmDescription: "Deze vermelding wordt permanent verwijderd. Deze actie kan niet ongedaan worden gemaakt.",
    cancel: "Annuleren",
    confirm: "Verwijderen",
    systemEvent: "Systeemgebeurtenis",
    comment: "Opmerking",
    today: "Vandaag",
    yesterday: "Gisteren",
    just_now: "zojuist",
    minutes_ago: (n) => `${n}m geleden`,
    hours_ago: (n) => `${n}u geleden`,
    days_ago: (n) => `${n}d geleden`,
    onlyCollaboratorsCanComment: "Alleen medewerkers kunnen opmerkingen plaatsen",
  },
}

// ─── Portuguese ───────────────────────────────────────────────────────────────
const pt: ProjectHistoryI18n = {
  types: {
    COMMENT: "Comentário",
    CREATED: "Projeto criado",
    UPDATED: "Projeto atualizado",
    STATUS_CHANGED: "Status alterado",
    BUDGET_UPDATED: "Orçamento atualizado",
    DEADLINE_UPDATED: "Prazo atualizado",
    OWNER_CHANGED: "Responsável alterado",
    CO_OWNER_UPDATED: "Co-responsável atualizado",
    DEPARTMENT_CHANGED: "Departamento alterado",
    ACTIVITY_CREATED: "Atividade adicionada",
    ACTIVITY_UPDATED: "Atividade atualizada",
    ACTIVITY_DELETED: "Atividade removida",
    SUBSIDY_CREATED: "Solicitação de subsídio criada",
    SUBSIDY_UPDATED: "Solicitação de subsídio atualizada",
    SUBSIDY_DELETED: "Solicitação de subsídio excluída",
    SUBSIDY_APPROVED: "Solicitação de subsídio aprovada",
    SUBSIDY_REJECTED: "Solicitação de subsídio rejeitada",
    DELETED: "Projeto excluído",
    RESTORED: "Projeto restaurado",
    ADJUSTMENT_NEEDED: "Ajuste solicitado",
    ADJUSTMENT_RESOLVED: "Ajuste resolvido",
  },
  fields: {
    title: "Título",
    description: "Descrição",
    budget: "Orçamento",
    subsidized_budget: "Orçamento subsidiado",
    balance: "Saldo",
    start_at: "Data de início",
    end_at: "Data de término",
    deadline: "Prazo final",
    status: "Status",
    owner_id: "Responsável",
    co_owner_id: "Co-responsável",
    department_id: "Departamento",
    church_id: "Igreja",
    language_preference: "Idioma",
    is_private: "Visibilidade",
    required_volunteers: "Requer voluntários",
    type: "Tipo de projeto",
    activity_name: "Nome da atividade",
    activity_status: "Status da atividade",
    activity_budget: "Orçamento da atividade",
    requested_amount: "Valor solicitado",
    approved_amount: "Valor aprovado",
  },
  values: {
    DRAFT: "Rascunho",
    OPEN_REQUEST: "Solicitação Aberta",
    IN_REVIEW: "Em Análise",
    ADJUSTMENTS_NEEDED: "Ajustes Necessários",
    IN_PROGRESS: "Em Andamento",
    PENDING_RECEIPT: "Aguardando Comprovante",
    WAITING_REFUND: "Aguardando Reembolso",
    OVERDUE: "Vencido",
    CONCLUDED: "Concluído",
    PENDING: "Pendente",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
    true: "Sim",
    false: "Não",
    Local: "Local",
    Global: "Global",
  },
  panel: {
    title: "Histórico do Projeto",
    noHistory: "Nenhum registro de histórico ainda.",
    commentPlaceholder: "Deixe um comentário de andamento…",
    addComment: "Adicionar comentário",
    saving: "Salvando…",
    deleteLabel: "Excluir registro",
    deleteConfirmTitle: "Excluir registro de histórico?",
    deleteConfirmDescription: "Este registro será removido permanentemente. Esta ação não pode ser desfeita.",
    cancel: "Cancelar",
    confirm: "Excluir",
    systemEvent: "Evento do sistema",
    comment: "Comentário",
    today: "Hoje",
    yesterday: "Ontem",
    just_now: "agora mesmo",
    minutes_ago: (n) => `${n}min atrás`,
    hours_ago: (n) => `${n}h atrás`,
    days_ago: (n) => `${n}d atrás`,
    onlyCollaboratorsCanComment: "Apenas colaboradores podem deixar comentários",
  },
}

export const projectHistoryTranslations: Record<string, ProjectHistoryI18n> = {
  en,
  nl,
  pt,
}

// ─── Helper: translate a field name ──────────────────────────────────────────
export function translateFieldName(fieldName: string | null | undefined, tH: ProjectHistoryI18n): string {
  if (!fieldName) return ""
  return tH.fields[fieldName] ?? fieldName
}

// ─── Helper: translate a value (status key, boolean, etc.) ───────────────────
export function translateValue(value: string | null | undefined, tH: ProjectHistoryI18n): string {
  if (value === null || value === undefined) return ""
  return tH.values[value] ?? value
}

// ─── Helper: format an auto event into a single readable sentence ─────────────
export function formatHistoryEvent(
  entry: { type: string; field_name?: string | null; old_value?: string | null; new_value?: string | null },
  tH: ProjectHistoryI18n
): string {
  const label = tH.types[entry.type] ?? entry.type
  const parts: string[] = [label]

  if (entry.field_name) {
    parts.push(`(${translateFieldName(entry.field_name, tH)})`)
  }
  if (entry.old_value && entry.new_value) {
    parts.push(
      `"${translateValue(entry.old_value, tH)}" → "${translateValue(entry.new_value, tH)}"`
    )
  } else if (entry.new_value) {
    parts.push(`→ "${translateValue(entry.new_value, tH)}"`)
  }

  return parts.join(" ")
}

// ─── Helper: relative time label ─────────────────────────────────────────────
export function relativeTime(dateStr: string, tH: ProjectHistoryI18n): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  if (diffMins < 1) return tH.panel.just_now
  if (diffMins < 60) return tH.panel.minutes_ago(diffMins)
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return tH.panel.hours_ago(diffHours)
  return tH.panel.days_ago(Math.floor(diffHours / 24))
}
