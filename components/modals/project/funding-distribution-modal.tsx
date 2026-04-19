"use client"

/**
 * FundingDistributionModal
 *
 * Reusable modal for editing a project's subsidy distribution.
 * Mirrors the Funding Distribution step from the project wizard,
 * but in a compact, minimalist, responsive modal form.
 *
 * Props:
 *  - isOpen           open state controlled by parent
 *  - onOpenChange     setter forwarded to Dialog
 *  - onSave           callback with (subsidizedBudget, balance)
 *  - loading          shows spinner on save button
 *  - totalBudget      total sum of ALL project activities
 *  - subsidizedTotal  sum of SUBSIDIZED activities only
 *  - maxPercent       max allowed percentage (default 65)
 *  - currencySymbol   symbol shown on manual input prefix (default "R$")
 *  - formatCurrency   formatting function from CurrencyContext
 */

import React, { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { TrendingUp, Home, Building } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface FundingDistributionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  /** Called on save with the computed subsidized budget and balance values */
  onSave: (subsidizedBudget: number, balance: number) => void
  loading?: boolean
  /** Total sum of ALL project activity budgets */
  totalBudget: number
  /** Current subsidized budget value (shown as reference) */
  subsidizedTotal: number
  /** Maximum subsidy percentage of total budget allowed (default: 65) */
  maxPercent?: number
  /** Absolute max subsidy amount in any currency (default: 5000) */
  maxAmount?: number
}

// ─────────────────────────────────────────────
// Mode type
// ─────────────────────────────────────────────

type InputMode = "auto" | "manual"

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function FundingDistributionModal({
  isOpen,
  onOpenChange,
  onSave,
  loading = false,
  totalBudget,
  subsidizedTotal,
  maxPercent = 65,
  maxAmount = 5000,
}: FundingDistributionModalProps) {
  const { t } = useTranslation()
  const { formatCurrency, selectedCurrency } = useCurrency()

  // ── Cap: lesser of (maxPercent% of total) or maxAmount ─
  const hardCap = Math.min((totalBudget * maxPercent) / 100, maxAmount)

  // ── Internal state ─────────────────────────
  const [mode, setMode] = useState<InputMode>("auto")
  const [percentage, setPercentage] = useState(maxPercent)
  const [amount, setAmount] = useState(0)

  // ── Derived values ─────────────────────────
  // percentage is always relative to totalBudget
  const computedAmount = Math.min(
    mode === "manual" ? amount : (totalBudget * percentage) / 100,
    hardCap
  )
  const computedSelf = totalBudget - computedAmount

  // ── Sync initial values when modal opens ───
  useEffect(() => {
    if (!isOpen) return
    // Seed from current subsidized value, capped at hardCap
    const seedAmount = Math.min(subsidizedTotal, hardCap)
    const seedPct = totalBudget > 0 ? Math.min((seedAmount / totalBudget) * 100, maxPercent) : maxPercent
    setPercentage(seedPct)
    setAmount(seedAmount)
    setMode("auto")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // ── Handlers ───────────────────────────────

  const handlePercentageChange = useCallback(
    (value: number) => {
      const clamped = Math.min(value, maxPercent)
      setPercentage(clamped)
      setAmount(Math.min((totalBudget * clamped) / 100, hardCap))
    },
    [maxPercent, totalBudget, hardCap]
  )

  const handleAmountChange = useCallback(
    (value: number) => {
      const clamped = Math.min(value, hardCap)
      setAmount(clamped)
      if (totalBudget > 0) {
        setPercentage(Math.min((clamped / totalBudget) * 100, maxPercent))
      }
    },
    [maxPercent, totalBudget, hardCap]
  )

  const handleToggleMode = () => {
    const next: InputMode = mode === "auto" ? "manual" : "auto"
    if (next === "manual") setAmount(computedAmount)
    setMode(next)
  }

  const handleSave = () => {
    onSave(computedAmount, computedSelf)
  }

  // ── Derived UI ─────────────────────────────
  // Badge only appears when the absolute monetary limit (maxAmount) is exceeded
  const isOverLimit = computedAmount > maxAmount

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Responsive: full-screen on mobile, 2xl wide on md+ */}
      <DialogContent className="w-full sm:max-w-2xl gap-0 p-0 overflow-hidden flex flex-col max-h-[90dvh]">
        {/* ── Header ─────────────────────────── */}
        <div className="px-5 pt-5 pb-4 border-b shrink-0">
          <DialogHeader className="gap-1">
            <DialogTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4 text-primary shrink-0" />
              {t("details.fundingModal.title", "Distribuição de Subsídio")}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed">
              {t(
                "details.fundingModal.description",
                "Ajuste o valor ou percentual solicitado para este projeto."
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ── Scrollable body ───────────────── */}
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x overflow-y-auto flex-1 min-h-0">
          {/* Left — overview ───────────────── */}
          <OverviewPanel
            totalBudget={totalBudget}
            subsidizedTotal={subsidizedTotal}
            computedAmount={computedAmount}
            computedSelf={computedSelf}
            maxPercent={maxPercent}
            maxAmount={maxAmount}
            hardCap={hardCap}
            isOverLimit={isOverLimit}
          />

          {/* Right — controls ──────────────── */}
          <ControlsPanel
            mode={mode}
            percentage={percentage}
            amount={amount}
            computedAmount={computedAmount}
            computedSelf={computedSelf}
            totalBudget={totalBudget}
            maxPercent={maxPercent}
            hardCap={hardCap}
            onToggleMode={handleToggleMode}
            onPercentageChange={handlePercentageChange}
            onAmountChange={handleAmountChange}
          />
        </div>

        {/* ── Footer ────────────────────────── */}
        <DialogFooter className="px-5 py-4 border-t bg-muted/20 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            {loading
              ? t("details.fundingModal.saving", "Salvando…")
              : t("common.save", "Salvar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─────────────────────────────────────────────
// Sub-component: Overview Panel (left column)
// ─────────────────────────────────────────────

interface OverviewPanelProps {
  totalBudget: number
  subsidizedTotal: number
  computedAmount: number
  computedSelf: number
  maxPercent: number
  maxAmount: number
  hardCap: number
  isOverLimit: boolean
}

function OverviewPanel({
  totalBudget,
  subsidizedTotal,
  computedAmount,
  computedSelf,
  maxPercent,
  maxAmount,
  isOverLimit,
}: OverviewPanelProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()

  // Visual bar: % of totalBudget that will be requested
  const requestedPct = totalBudget > 0 ? (computedAmount / totalBudget) * 100 : 0
  const selfPct = 100 - requestedPct

  return (
    <div className="w-full md:w-5/12 p-5 space-y-4 bg-muted/10">
      {/* Section label */}
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("details.fundingModal.overviewTitle", "Visão Geral")}
      </p>

      {/* Total project cost */}
      <div className="rounded-md border bg-card px-3 py-2.5 space-y-0.5">
        <p className="text-xs text-muted-foreground">
          {t("projectRegister.fundingDistribution.totalProjectCost", "Total do Projeto")}
        </p>
        <p className="text-lg font-bold tabular-nums">{formatCurrency(totalBudget)}</p>
      </div>

      {/* Current subsidized budget */}
      <div className="rounded-md border bg-card px-3 py-2.5 space-y-0.5">
        <p className="text-xs text-muted-foreground">
          {t("details.fundingModal.currentSubsidy", "Subsídio Atual")}
        </p>
        <p className="text-base font-semibold tabular-nums text-green-600">
          {formatCurrency(subsidizedTotal)}
        </p>
      </div>

      {/* Stacked bar */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-foreground">
          {t(
            "projectRegister.fundingDistribution.responsibilityDistribution",
            "Distribuição"
          )}
        </p>
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          <div
            className="bg-blue-500 transition-all duration-200"
            style={{ width: `${selfPct}%` }}
          />
          <div
            className="bg-green-500 transition-all duration-200"
            style={{ width: `${requestedPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Home className="w-3 h-3 text-blue-500" />
            {t("projectRegister.fundingDistribution.self", "Igreja")}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Building className="w-3 h-3 text-green-500" />
            {t("projectRegister.fundingDistribution.request", "Solicitado")}
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-blue-600 tabular-nums">{formatCurrency(computedSelf)}</span>
          <span className="text-green-600 tabular-nums">{formatCurrency(computedAmount)}</span>
        </div>
      </div>

      {/* Policy badges */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t">
        <Badge variant="outline" className="text-xs font-normal">
          {t("details.fundingModal.maxPercent", "Máx. {{percent}}%").replace(
            "{{percent}}",
            String(maxPercent)
          )}
        </Badge>
        <Badge variant="outline" className="text-xs font-normal">
          {t("details.fundingModal.maxAmount", "Máx. {{amount}} / projeto").replace(
            "{{amount}}",
            formatCurrency(maxAmount)
          )}
        </Badge>
        {isOverLimit && (
          <Badge variant="destructive" className="text-xs">
            {t("details.fundingModal.limitExceeded", "Limite excedido")}
          </Badge>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-component: Controls Panel (right column)
// ─────────────────────────────────────────────

interface ControlsPanelProps {
  mode: InputMode
  percentage: number
  amount: number
  computedAmount: number
  computedSelf: number
  totalBudget: number
  maxPercent: number
  hardCap: number
  onToggleMode: () => void
  onPercentageChange: (v: number) => void
  onAmountChange: (v: number) => void
}

function ControlsPanel({
  mode,
  percentage,
  amount,
  computedAmount,
  computedSelf,
  totalBudget,
  maxPercent,
  hardCap,
  onToggleMode,
  onPercentageChange,
  onAmountChange,
}: ControlsPanelProps) {
  const { t } = useTranslation()
  const { formatCurrency, selectedCurrency } = useCurrency()
  const isManual = mode === "manual"

  return (
    <div className="w-full md:w-7/12 p-5 space-y-5">
      {/* Mode toggle row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium leading-none">
            {isManual
              ? t("details.fundingModal.modeManual", "Entrada Manual")
              : t("details.fundingModal.modeAuto", "Ajuste Automático")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isManual
              ? t("details.fundingModal.modeManualDesc", "Insira o valor diretamente")
              : t("details.fundingModal.modeAutoDesc", "Use o slider para ajustar")}
          </p>
        </div>
        <Button
          variant={isManual ? "default" : "outline"}
          size="sm"
          className="shrink-0 text-xs h-7 px-3"
          onClick={onToggleMode}
        >
          {isManual
            ? t("details.fundingModal.manual", "Manual")
            : t("details.fundingModal.auto", "Auto")}
        </Button>
      </div>

      {/* ── Auto mode — slider ─────────────── */}
      {!isManual && (
        <SliderControl
          percentage={percentage}
          maxPercent={maxPercent}
          hardCap={hardCap}
          totalBudget={totalBudget}
          onPercentageChange={onPercentageChange}
        />
      )}

      {/* ── Manual mode — inputs ───────────── */}
      {isManual && (
        <ManualInputs
          amount={amount}
          percentage={
            totalBudget > 0
              ? Math.round((amount / totalBudget) * 100)
              : percentage
          }
          hardCap={hardCap}
          currencySymbol={selectedCurrency.symbol}
          onAmountChange={onAmountChange}
          onPercentageChange={onPercentageChange}
        />
      )}

      {/* Live summary strip */}
      <div
        className={cn(
          "flex justify-between items-center rounded-md px-3 py-2 text-xs font-medium",
          "bg-muted/30 border"
        )}
      >
        <span className="text-blue-600">
          {t("projectRegister.fundingDistribution.self", "Igreja")}:{" "}
          {formatCurrency(computedSelf)}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-green-600">
          {t("projectRegister.fundingDistribution.request", "Solicitado")}:{" "}
          {formatCurrency(computedAmount)}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-component: Slider Control
// ─────────────────────────────────────────────

interface SliderControlProps {
  percentage: number
  maxPercent: number
  hardCap: number
  totalBudget: number
  onPercentageChange: (v: number) => void
}

function SliderControl({
  percentage,
  maxPercent,
  hardCap,
  totalBudget,
  onPercentageChange,
}: SliderControlProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()

  // Effective percent cap: may be lower than maxPercent when hardCap kicks in
  const capPct = totalBudget > 0 ? Math.min((hardCap / totalBudget) * 100, maxPercent) : maxPercent

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm">
          {t(
            "projectRegister.fundingCalculator.subsidyPercentage",
            "Percentual de Subsídio"
          )}
        </Label>
        <span className="text-sm font-bold text-primary tabular-nums">
          {Math.round(percentage)}%
        </span>
      </div>

      <Slider
        value={[percentage]}
        min={0}
        max={capPct}
        step={0.5}
        onValueChange={([v]) => onPercentageChange(v)}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0%</span>
        <span>{Math.round(capPct)}%</span>
      </div>

      {/* Amount label beneath slider */}
      <p className="text-xs text-center text-muted-foreground">
        {formatCurrency((totalBudget * percentage) / 100)}
        <span className="mx-1 opacity-40">/</span>
        {formatCurrency(hardCap)}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-component: Manual Inputs
// ─────────────────────────────────────────────

interface ManualInputsProps {
  amount: number
  percentage: number
  hardCap: number
  currencySymbol: string
  onAmountChange: (v: number) => void
  onPercentageChange: (v: number) => void
}

function ManualInputs({
  amount,
  percentage,
  hardCap,
  currencySymbol,
  onAmountChange,
  onPercentageChange,
}: ManualInputsProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Amount */}
      <div className="space-y-1.5">
        <Label className="text-xs">
          {t(
            "projectRegister.fundingDistribution.requestContributionValue",
            "Valor Solicitado"
          )}
        </Label>
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {currencySymbol}
          </span>
          <Input
            type="number"
            min={0}
            max={hardCap}
            value={amount || ""}
            placeholder="0"
            className="pl-8 h-8 text-sm"
            onChange={(e) =>
              onAmountChange(e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {t("details.fundingModal.maxAmount", "Máx. {{amount}} / projeto").replace(
            "{{amount}}",
            formatCurrency(hardCap)
          )}
        </p>
      </div>

      {/* Percentage */}
      <div className="space-y-1.5">
        <Label className="text-xs">
          {t("details.fundingModal.percentage", "Percentual (%)")}
        </Label>
        <div className="relative">
          <Input
            type="number"
            min={0}
            value={percentage || ""}
            placeholder="0"
            className="pr-7 h-8 text-sm"
            onChange={(e) =>
              onPercentageChange(e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            %
          </span>
        </div>
      </div>
    </div>
  )
}

