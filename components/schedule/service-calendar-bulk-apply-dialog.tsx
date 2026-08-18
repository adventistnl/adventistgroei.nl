"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox } from "@/components/ui/combobox"
import { Switch } from "@/components/ui/switch"
import { useSetChurchServiceCalendarBulkMutation } from "@/hooks/graphql/use-church-service-calendar"
import { scheduleServiceCalendarTranslations } from "@/lib/translations/schedule-service-calendar"
import "@/lib/i18n"

interface ServiceCalendarBulkApplyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  churches: { id: string; name: string }[]
  onApplied?: () => void
}

/**
 * R8.1 — lets an admin/department leader apply one weekly service pattern to many churches
 * at once. Never overwrites a date a church's own leader already confirmed (enforced
 * server-side via ChurchServiceCalendar.source).
 */
export function ServiceCalendarBulkApplyDialog({ open, onOpenChange, churches, onApplied }: ServiceCalendarBulkApplyDialogProps) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    (Object.keys(scheduleServiceCalendarTranslations) as Array<keyof typeof scheduleServiceCalendarTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { serviceCalendar: scheduleServiceCalendarTranslations[lang] } }, true, true)
    })
  }, [i18n])

  const [setBulkMutation, { loading: saving }] = useSetChurchServiceCalendarBulkMutation()

  const [selectedChurchIds, setSelectedChurchIds] = useState<string[]>([])
  const [dayOfWeek, setDayOfWeek] = useState("0")
  const [hasService, setHasService] = useState(true)
  const [effectiveFrom, setEffectiveFrom] = useState("")
  const [effectiveUntil, setEffectiveUntil] = useState("")

  const toggleChurch = (id: string) => {
    setSelectedChurchIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const handleApply = async () => {
    if (selectedChurchIds.length === 0 || !effectiveFrom) return
    await setBulkMutation({
      variables: {
        church_ids: selectedChurchIds,
        day_of_week: Number(dayOfWeek),
        has_service: hasService,
        effective_from: effectiveFrom,
        effective_until: effectiveUntil || undefined,
      },
    })
    onOpenChange(false)
    setSelectedChurchIds([])
    setEffectiveFrom("")
    setEffectiveUntil("")
    onApplied?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("schedule.serviceCalendar.weeklyDialog.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("schedule.serviceCalendar.weeklyDialog.dayOfWeek")}</Label>
            <Combobox
              searchable={false}
              value={dayOfWeek}
              onValueChange={setDayOfWeek}
              options={["0", "1", "2", "3", "4", "5", "6"].map((day) => ({ value: day, label: t(`schedule.serviceCalendar.days.${day}`) }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("schedule.serviceCalendar.weeklyDialog.hasService")}</Label>
            <Switch checked={hasService} onCheckedChange={setHasService} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("schedule.serviceCalendar.weeklyDialog.startsOn")}</Label>
              <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.serviceCalendar.weeklyDialog.endsOn")}</Label>
              <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={effectiveUntil} onChange={(e) => setEffectiveUntil(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Churches</Label>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border p-2">
              {churches.map((church) => (
                <label key={church.id} className="flex items-center gap-2 py-1 text-sm">
                  <Checkbox
                    checked={selectedChurchIds.includes(church.id)}
                    onCheckedChange={() => toggleChurch(church.id)}
                  />
                  {church.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            {t("schedule.serviceCalendar.weeklyDialog.cancel")}
          </Button>
          <Button onClick={handleApply} disabled={saving || selectedChurchIds.length === 0 || !effectiveFrom}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? t("schedule.serviceCalendar.weeklyDialog.saving") : t("schedule.serviceCalendar.weeklyDialog.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
