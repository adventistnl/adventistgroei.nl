"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { Calendar as BigCalendar, momentLocalizer, Views, type SlotInfo } from "react-big-calendar"
import { AppLayout } from "@/components/layouts/app-layout"
import { AccessDenied } from "@/components/access/access-denied"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarRange, CheckCircle2, Loader2, X } from "lucide-react"
import { useHasPermission } from "@/hooks/use-has-permission"
import { usePageTitle } from "@/hooks/use-page-title"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AvailabilityStatus } from "@/types/globalTypes"
import { useMyAvailability } from "@/hooks/use-availability"
import { scheduleAvailabilityTranslations } from "@/lib/translations/schedule-availability"
import "@/lib/i18n"
// shadcn-big-calendar.css is already imported globally via app/globals.css — no per-page import needed.

const localizer = momentLocalizer(moment)

// UX rule 4 (§6.1) — fixed, documented color meaning, never reused for a second purpose.
const STATUS_COLORS: Record<AvailabilityStatus, string> = {
  [AvailabilityStatus.AVAILABLE]: "#10b981",
  [AvailabilityStatus.UNAVAILABLE]: "#ef4444",
  [AvailabilityStatus.VACATION]: "#8b5cf6",
}

function toDateOnlyString(date: Date): string {
  return moment(date).format("YYYY-MM-DD")
}

export default function AvailabilityPage() {
  const { t, i18n } = useTranslation()
  const hasPermission = useHasPermission([PermissionResolverName.MyAvailability])

  useEffect(() => {
    (Object.keys(scheduleAvailabilityTranslations) as Array<keyof typeof scheduleAvailabilityTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { availability: scheduleAvailabilityTranslations[lang] } }, true, true)
    })
  }, [i18n])

  usePageTitle({ title: t("schedule.availability.page.title"), showBreadcrumbsInHeader: false })

  const [visibleMonth, setVisibleMonth] = useState(new Date())
  const month = useMemo(() => moment(visibleMonth).format("YYYY-MM"), [visibleMonth])

  const { availability, loading, saving, setAvailability, setAvailabilityBulk } = useMyAvailability(month)

  const [savedBannerVisible, setSavedBannerVisible] = useState(false)

  const [dialogDate, setDialogDate] = useState<Date | null>(null)
  const [dialogStatus, setDialogStatus] = useState<AvailabilityStatus>(AvailabilityStatus.AVAILABLE)
  const [dialogNote, setDialogNote] = useState("")

  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)
  const [bulkStart, setBulkStart] = useState("")
  const [bulkEnd, setBulkEnd] = useState("")
  const [bulkStatus, setBulkStatus] = useState<AvailabilityStatus>(AvailabilityStatus.UNAVAILABLE)
  const [bulkNote, setBulkNote] = useState("")

  const availabilityByDate = useMemo(() => {
    const map = new Map<string, (typeof availability)[number]>()
    availability.forEach((entry) => map.set(entry.date, entry))
    return map
  }, [availability])

  const calendarEvents = useMemo(
    () =>
      availability.map((entry) => ({
        id: entry.id,
        title: t(`schedule.availability.legend.${entry.status.toLowerCase()}`),
        start: new Date(entry.date),
        end: new Date(entry.date),
        allDay: true,
        resource: entry,
      })),
    [availability, t],
  )

  const openDialogForDate = (date: Date) => {
    const key = toDateOnlyString(date)
    const existing = availabilityByDate.get(key)
    setDialogDate(date)
    setDialogStatus(existing?.status ?? AvailabilityStatus.AVAILABLE)
    setDialogNote(existing?.note ?? "")
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => openDialogForDate(slotInfo.start)
  const handleSelectEvent = (event: { resource: { date: string } }) => openDialogForDate(new Date(event.resource.date))

  const handleSaveOne = async () => {
    if (!dialogDate) return
    await setAvailability(toDateOnlyString(dialogDate), dialogStatus, dialogNote || undefined)
    setDialogDate(null)
    setSavedBannerVisible(true)
  }

  const handleApplyBulk = async () => {
    if (!bulkStart || !bulkEnd) return
    await setAvailabilityBulk(bulkStart, bulkEnd, bulkStatus, bulkNote || undefined)
    setBulkDialogOpen(false)
    setBulkStart("")
    setBulkEnd("")
    setBulkNote("")
    setSavedBannerVisible(true)
  }

  if (!hasPermission) {
    return (
      <AppLayout>
        <AccessDenied />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t("schedule.availability.page.title")}</h1>
          <p className="text-muted-foreground">{t("schedule.availability.page.subtitle")}</p>
        </div>

        {/* UX rule 5 — persistent confirmation banner, not a toast that disappears */}
        {savedBannerVisible && (
          <div className="flex items-center justify-between rounded-md border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t("schedule.availability.savedBanner")}
            </span>
            <button onClick={() => setSavedBannerVisible(false)} aria-label="dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Fixed color legend — UX rule 4 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {(Object.values(AvailabilityStatus) as AvailabilityStatus[]).map((status) => (
            <span key={status} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[status] }} />
              {t(`schedule.availability.legend.${status.toLowerCase()}`)}
            </span>
          ))}
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-dashed border-muted-foreground" />
            {t("schedule.availability.legend.pending")}
          </span>
        </div>

        {/* UX rule 2 — one always-visible action, never hidden behind a context menu */}
        <div>
          <Button onClick={() => setBulkDialogOpen(true)}>
            <CalendarRange className="mr-2 h-4 w-4" />
            {t("schedule.availability.bulk.action")}
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div style={{ height: 650 }}>
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                view={Views.MONTH}
                views={[Views.MONTH]}
                date={visibleMonth}
                onNavigate={setVisibleMonth}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={(event: any) => ({
                  style: {
                    backgroundColor: STATUS_COLORS[event.resource.status as AvailabilityStatus],
                    borderRadius: 6,
                    color: "white",
                  },
                })}
              />
            </div>
            {loading && <p className="mt-4 text-sm text-muted-foreground">{t("common.loading") || "Loading..."}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Single-date dialog */}
      <Dialog open={!!dialogDate} onOpenChange={(open) => !open && setDialogDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("schedule.availability.dialog.title", { date: dialogDate ? moment(dialogDate).format("LL") : "" })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("schedule.availability.dialog.status")}</Label>
              <Select value={dialogStatus} onValueChange={(value) => setDialogStatus(value as AvailabilityStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.values(AvailabilityStatus) as AvailabilityStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`schedule.availability.legend.${status.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.availability.dialog.note")}</Label>
              <Textarea value={dialogNote} onChange={(e) => setDialogNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogDate(null)} disabled={saving}>
              {t("schedule.availability.dialog.cancel")}
            </Button>
            <Button onClick={handleSaveOne} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? t("schedule.availability.dialog.saving") : t("schedule.availability.dialog.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk range dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("schedule.availability.bulk.title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{t("schedule.availability.bulk.example")}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("schedule.availability.bulk.startDate")}</Label>
                <input
                  type="date"
                  className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={bulkStart}
                  onChange={(e) => setBulkStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("schedule.availability.bulk.endDate")}</Label>
                <input
                  type="date"
                  className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={bulkEnd}
                  onChange={(e) => setBulkEnd(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.availability.bulk.status")}</Label>
              <Select value={bulkStatus} onValueChange={(value) => setBulkStatus(value as AvailabilityStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.values(AvailabilityStatus) as AvailabilityStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {t(`schedule.availability.legend.${status.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.availability.bulk.note")}</Label>
              <Textarea value={bulkNote} onChange={(e) => setBulkNote(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBulkDialogOpen(false)} disabled={saving}>
              {t("schedule.availability.bulk.cancel")}
            </Button>
            <Button onClick={handleApplyBulk} disabled={saving || !bulkStart || !bulkEnd}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? t("schedule.availability.bulk.applying") : t("schedule.availability.bulk.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
