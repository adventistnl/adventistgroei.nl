"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, ReceiptText, CheckCircle2, Clock, XCircle, Building2 } from "lucide-react"
import { useSubsidiesWaitingRefund } from "@/hooks/graphql/use-subsidy-refund"
import { useCurrency } from "@/contexts/currency-context"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SubsidyRefundItem {
  id: string
  description?: string
  total_budget?: number
  approved_amount?: number
  refund_amount?: number
  have_refund?: boolean
  refund_done?: boolean
  created_at?: string
  subsidy_status?: { id: string; name: string } | null
  requester?: { id: string; name: string; email: string } | null
  project?: { id: string; title: string } | null
  institution?: { id: string; name: string } | null
  department?: { id: string; name: string } | null
  church?: { id: string; name: string } | null
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RefundStatusBadge({ haveRefund, refundDone }: { haveRefund?: boolean; refundDone?: boolean }) {
  if (refundDone) {
    return (
      <Badge variant="default" className="bg-green-600 text-white gap-1 text-xs">
        <CheckCircle2 className="w-3 h-3" />
        Concluído
      </Badge>
    )
  }
  if (haveRefund) {
    return (
      <Badge variant="outline" className="border-amber-400 text-amber-600 gap-1 text-xs">
        <Clock className="w-3 h-3" />
        Aguardando
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="border-slate-300 text-slate-500 gap-1 text-xs">
      <XCircle className="w-3 h-3" />
      Sem reembolso
    </Badge>
  )
}

function SubsidyRefundRow({ item, formatCurrency }: { item: SubsidyRefundItem; formatCurrency: (v: number) => string }) {
  const refundAmount = Number(item.refund_amount ?? 0)
  const approvedAmount = Number(item.approved_amount ?? 0)
  const totalBudget = Number(item.total_budget ?? 0)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b last:border-b-0 hover:bg-muted/30 rounded px-2 transition-colors">
      {/* Project + description */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-sm truncate">
            {item.project?.title ?? "—"}
          </span>
          {item.subsidy_status?.name && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {item.subsidy_status.name}
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {item.description}
          </p>
        )}
        {(item.department?.name || item.church?.name) && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Building2 className="w-3 h-3 shrink-0" />
            {item.department?.name ?? item.church?.name}
          </p>
        )}
      </div>

      {/* Amounts */}
      <div className="flex items-center gap-4 shrink-0 text-sm">
        {totalBudget > 0 && (
          <div className="text-center hidden md:block">
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="font-medium">{formatCurrency(totalBudget)}</div>
          </div>
        )}
        {approvedAmount > 0 && (
          <div className="text-center hidden md:block">
            <div className="text-xs text-muted-foreground">Aprovado</div>
            <div className="font-medium text-blue-600">{formatCurrency(approvedAmount)}</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Reembolso</div>
          <div className="font-semibold text-amber-600">{formatCurrency(refundAmount)}</div>
        </div>
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        <RefundStatusBadge haveRefund={item.have_refund} refundDone={item.refund_done} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main card component
// ---------------------------------------------------------------------------

interface ProjectRefundRequestsCardProps {
  /** Optional: skip rendering if no data (default: true — hides card when empty) */
  hideWhenEmpty?: boolean
  className?: string
}

export function ProjectRefundRequestsCard({
  hideWhenEmpty = true,
  className,
}: ProjectRefundRequestsCardProps) {
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const { subsidies, loading, error, refetch } = useSubsidiesWaitingRefund()

  // Hide card entirely when empty and hideWhenEmpty is true
  if (!loading && hideWhenEmpty && subsidies.length === 0) return null

  const pendingCount = subsidies.filter((s: SubsidyRefundItem) => s.have_refund && !s.refund_done).length
  const doneCount = subsidies.filter((s: SubsidyRefundItem) => s.refund_done).length
  const totalRefundAmount = subsidies.reduce(
    (acc: number, s: SubsidyRefundItem) => acc + Number(s.refund_amount ?? 0),
    0
  )

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <CardTitle className="text-base">Reembolsos de Subsídios</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Solicitações aguardando processamento de reembolso
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Summary badges */}
            {!loading && subsidies.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                {pendingCount > 0 && (
                  <Badge variant="outline" className="border-amber-400 text-amber-600 text-xs gap-1">
                    <Clock className="w-3 h-3" />
                    {pendingCount} pendente{pendingCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                {doneCount > 0 && (
                  <Badge variant="default" className="bg-green-600 text-white text-xs gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {doneCount} concluído{doneCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                {totalRefundAmount > 0 && (
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {formatCurrency(totalRefundAmount)}
                  </Badge>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => refetch()}
              title="Atualizar"
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading && subsidies.length === 0 ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded" />
            ))}
          </div>
        ) : error ? (
          <div className="text-sm text-destructive py-4 text-center">
            Erro ao carregar reembolsos. Tente novamente.
          </div>
        ) : subsidies.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            Nenhum reembolso pendente no momento.
          </div>
        ) : (
          <div>
            {subsidies.map((item: SubsidyRefundItem) => (
              <SubsidyRefundRow key={item.id} item={item} formatCurrency={formatCurrency} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
