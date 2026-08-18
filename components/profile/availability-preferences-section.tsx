"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Clock, Loader2, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useHasPermission } from "@/hooks/use-has-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AvailabilityStatus, RecurrenceType } from "@/types/globalTypes"
import { useMyAvailabilityRecurrenceRules } from "@/hooks/use-availability"
import { scheduleAvailabilityTranslations } from "@/lib/translations/schedule-availability"
import "@/lib/i18n"

const DAY_KEYS = ["0", "1", "2", "3", "4", "5", "6"] as const

export function AvailabilityPreferencesSection() {
  const { t, i18n } = useTranslation()
  const hasPermission = useHasPermission([PermissionResolverName.MyAvailability])

  useEffect(() => {
    (Object.keys(scheduleAvailabilityTranslations) as Array<keyof typeof scheduleAvailabilityTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { availability: scheduleAvailabilityTranslations[lang] } }, true, true)
    })
  }, [i18n])

  const { rules, saving, setWeeklyRule, setDateRangeRule, deleteRule } = useMyAvailabilityRecurrenceRules()

  const [weeklyDialogOpen, setWeeklyDialogOpen] = useState(false)
  const [weeklyDay, setWeeklyDay] = useState<string>("0")
  const [weeklyStatus, setWeeklyStatus] = useState<AvailabilityStatus>(AvailabilityStatus.AVAILABLE)
  const [weeklyFrom, setWeeklyFrom] = useState("")
  const [weeklyUntil, setWeeklyUntil] = useState("")
  const [weeklyNote, setWeeklyNote] = useState("")

  const [periodDialogOpen, setPeriodDialogOpen] = useState(false)
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [periodStatus, setPeriodStatus] = useState<AvailabilityStatus>(AvailabilityStatus.VACATION)
  const [periodNote, setPeriodNote] = useState("")

  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)

  if (!hasPermission) return null

  const handleSaveWeekly = async () => {
    if (!weeklyFrom) return
    await setWeeklyRule({
      dayOfWeek: Number(weeklyDay),
      status: weeklyStatus,
      effectiveFrom: weeklyFrom,
      effectiveUntil: weeklyUntil || undefined,
      note: weeklyNote || undefined,
    })
    setWeeklyDialogOpen(false)
    setWeeklyNote("")
  }

  const handleSavePeriod = async () => {
    if (!periodStart || !periodEnd) return
    await setDateRangeRule({
      startDate: periodStart,
      endDate: periodEnd,
      status: periodStatus,
      note: periodNote || undefined,
    })
    setPeriodDialogOpen(false)
    setPeriodStart("")
    setPeriodEnd("")
    setPeriodNote("")
  }

  const statusLabel = (status: AvailabilityStatus) => t(`schedule.availability.legend.${status.toLowerCase()}`)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">{t("schedule.availability.preferences.cardTitle")}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{t("schedule.availability.preferences.cardSubtitle")}</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setWeeklyDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("schedule.availability.preferences.addWeekly")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPeriodDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("schedule.availability.preferences.addPeriod")}
          </Button>
        </div>

        {rules.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("schedule.availability.preferences.empty")}</p>
        ) : (
          <ul className="space-y-2">
            {rules.map((rule) => (
              <li key={rule.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <span>
                  {rule.type === RecurrenceType.WEEKLY
                    ? t("schedule.availability.preferences.weeklySummary", {
                        day: t(`schedule.availability.preferences.days.${rule.day_of_week}`),
                        status: statusLabel(rule.status),
                      })
                    : t("schedule.availability.preferences.periodSummary", {
                        startDate: rule.start_date,
                        endDate: rule.end_date,
                        status: statusLabel(rule.status),
                      })}
                </span>
                <Button variant="ghost" size="icon" onClick={() => setRuleToDelete(rule.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {/* Weekly pattern dialog */}
      <Dialog open={weeklyDialogOpen} onOpenChange={setWeeklyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("schedule.availability.preferences.weeklyDialogTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("schedule.availability.preferences.dayOfWeek")}</Label>
              <Select value={weeklyDay} onValueChange={setWeeklyDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_KEYS.map((day) => (
                    <SelectItem key={day} value={day}>{t(`schedule.availability.preferences.days.${day}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.availability.preferences.status")}</Label>
              <Select value={weeklyStatus} onValueChange={(value) => setWeeklyStatus(value as AvailabilityStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.values(AvailabilityStatus) as AvailabilityStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>{statusLabel(status)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("schedule.availability.preferences.startsOn")}</Label>
                <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={weeklyFrom} onChange={(e) => setWeeklyFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("schedule.availability.preferences.endsOn")}</Label>
                <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={weeklyUntil} onChange={(e) => setWeeklyUntil(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.availability.preferences.note")}</Label>
              <Textarea value={weeklyNote} onChange={(e) => setWeeklyNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setWeeklyDialogOpen(false)} disabled={saving}>
              {t("schedule.availability.preferences.cancel")}
            </Button>
            <Button onClick={handleSaveWeekly} disabled={saving || !weeklyFrom}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? t("schedule.availability.preferences.saving") : t("schedule.availability.preferences.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vacation / period dialog */}
      <Dialog open={periodDialogOpen} onOpenChange={setPeriodDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("schedule.availability.preferences.periodDialogTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("schedule.availability.preferences.startDate")}</Label>
                <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("schedule.availability.preferences.endDate")}</Label>
                <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.availability.preferences.status")}</Label>
              <Select value={periodStatus} onValueChange={(value) => setPeriodStatus(value as AvailabilityStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.values(AvailabilityStatus) as AvailabilityStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>{statusLabel(status)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.availability.preferences.note")}</Label>
              <Textarea value={periodNote} onChange={(e) => setPeriodNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPeriodDialogOpen(false)} disabled={saving}>
              {t("schedule.availability.preferences.cancel")}
            </Button>
            <Button onClick={handleSavePeriod} disabled={saving || !periodStart || !periodEnd}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? t("schedule.availability.preferences.saving") : t("schedule.availability.preferences.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!ruleToDelete} onOpenChange={(open) => !open && setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("schedule.availability.preferences.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("schedule.availability.preferences.deleteConfirmDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("schedule.availability.preferences.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (ruleToDelete) void deleteRule(ruleToDelete)
                setRuleToDelete(null)
              }}
            >
              {t("schedule.availability.preferences.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
