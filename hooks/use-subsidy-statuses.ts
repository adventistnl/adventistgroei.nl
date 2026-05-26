/**
 * hooks/use-subsidy-statuses.ts
 *
 * Single source of truth for all Subsidy-Request status metadata.
 *
 * Adding a new status:
 *   1. Add the ID to ALL_SUBSIDY_STATUSES in lib/subsidy-kanban-rules.ts
 *   2. Add its visual entry (color, variant) in STATUS_VISUAL below
 *   3. Add its label to subsidyRequestTranslations (kanban.groups + statusRules)
 *      in lib/translations/subsidy-approvals.ts for each language
 *
 * Nothing else needs changing — the Kanban groups, chart config, legend,
 * and data aggregation all derive from this hook automatically.
 */

import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ALL_SUBSIDY_STATUSES, SubsidyKanbanStatus } from "@/lib/subsidy-kanban-rules"
import { subsidyRequestTranslations } from "@/lib/translations/subsidy-approvals"
import type { KanbanGroup } from "@/components/ui/kanban-board"

// ─── Visual metadata (never changes at runtime) ───────────────────────────────

interface StatusVisual {
  /** Hex colour used for the Kanban group dot / column header accent */
  kanbanColor: string
  /** HSL color string used by Recharts Area/Bar stroke and gradient */
  chartColor: string
  /** Tailwind class for the legend dot */
  dotClass: string
  /** shadcn StatusBadge variant */
  variant: "success" | "warning" | "error" | "info" | "neutral"
}

// Order matches the subsidy workflow for consistent rendering
const STATUS_VISUAL: Record<SubsidyKanbanStatus, StatusVisual> = {
  pending:           { kanbanColor: "#f59e0b", chartColor: "hsl(45, 93%, 47%)",   dotClass: "bg-amber-500",    variant: "warning" },
  in_review:         { kanbanColor: "#3b82f6", chartColor: "hsl(217, 91%, 60%)",  dotClass: "bg-blue-500",     variant: "info"    },
  approved:          { kanbanColor: "#10b981", chartColor: "hsl(142, 76%, 36%)",  dotClass: "bg-green-600",    variant: "success" },
  rejected:          { kanbanColor: "#ef4444", chartColor: "hsl(0, 84%, 60%)",    dotClass: "bg-red-500",      variant: "error"   },
  advanced_closed:   { kanbanColor: "#7c3aed", chartColor: "hsl(262, 83%, 57%)",  dotClass: "bg-purple-600",   variant: "neutral" },
  waiting_documents: { kanbanColor: "#ea580c", chartColor: "hsl(21, 90%, 48%)",   dotClass: "bg-orange-700",   variant: "warning" },
  waiting_refund:    { kanbanColor: "#f97316", chartColor: "hsl(24, 95%, 53%)",   dotClass: "bg-orange-500",   variant: "warning" },
  closed:            { kanbanColor: "#059669", chartColor: "hsl(160, 84%, 39%)",  dotClass: "bg-emerald-600",  variant: "neutral" },
}

// ─── Public interface ─────────────────────────────────────────────────────────

export interface SubsidyStatusDef extends StatusVisual {
  /** Status identifier — matches the API value */
  id: SubsidyKanbanStatus
  /** Translated display label (reactive to language changes) */
  label: string
  /** Translated tooltip / description used in Kanban group headers */
  tooltip: string
}

/** Shape compatible with Recharts ChartContainer `config` prop */
export type SubsidyChartConfig = Record<SubsidyKanbanStatus, { label: string; color: string }>

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSubsidyStatuses() {
  const { i18n } = useTranslation()

  // Pick the translation block for the current language
  const tr = subsidyRequestTranslations[i18n.language as keyof typeof subsidyRequestTranslations]
    ?? subsidyRequestTranslations.en

  // Full status definition list — re-derived when language changes
  const statuses: SubsidyStatusDef[] = useMemo(
    () =>
      ALL_SUBSIDY_STATUSES.map((id) => ({
        id,
        ...STATUS_VISUAL[id],
        label:   tr.kanban?.groups?.[id as keyof typeof tr.kanban.groups]   ?? id,
        tooltip: tr.statusRules?.[id as keyof typeof tr.statusRules]         ?? "",
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language] // tr is derived from i18n.language; not a stable ref itself
  )

  // ── Kanban ──────────────────────────────────────────────────────────────────
  /** Drop-in KanbanGroup[] array for <KanbanBoard groups={...} /> */
  const kanbanGroups: KanbanGroup[] = useMemo(
    () =>
      statuses.map((s) => ({
        id:      s.id,
        name:    s.label,
        color:   s.kanbanColor,
        tooltip: s.tooltip,
      })),
    [statuses]
  )

  // ── Chart ───────────────────────────────────────────────────────────────────
  /** Drop-in config for Recharts <ChartContainer config={...} /> */
  const chartConfig: SubsidyChartConfig = useMemo(
    () =>
      Object.fromEntries(
        statuses.map((s) => [s.id, { label: s.label, color: s.chartColor }])
      ) as SubsidyChartConfig,
    [statuses]
  )

  // ── Utilities ───────────────────────────────────────────────────────────────
  const getStatus = (id: string): SubsidyStatusDef | undefined =>
    statuses.find((s) => s.id === (id as SubsidyKanbanStatus))

  return {
    /** Full list of statuses in workflow order */
    statuses,
    /** Ready-to-use KanbanGroup[] for <KanbanBoard> */
    kanbanGroups,
    /** Ready-to-use config for Recharts <ChartContainer> */
    chartConfig,
    /** Look up a single status by ID */
    getStatus,
  }
}
