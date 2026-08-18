"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { Calendar as BigCalendar, momentLocalizer, Views, type SlotInfo } from "react-big-calendar"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, CalendarClock, CheckCircle2, Loader2, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePageTitle } from "@/hooks/use-page-title"
import { useChurchForServiceCalendar, useChurchServiceCalendar } from "@/hooks/use-church-service-calendar"
import { ServiceCalendarSource } from "@/types/globalTypes"
import { scheduleServiceCalendarTranslations } from "@/lib/translations/schedule-service-calendar"
import "@/lib/i18n"

const localizer = momentLocalizer(moment)

const SOURCE_STYLE: Record<ServiceCalendarSource, { opacity: number }> = {
  [ServiceCalendarSource.CHURCH_CONFIRMED]: { opacity: 1 },
  [ServiceCalendarSource.BULK_DEFAULT]: { opacity: 0.55 },
}

function toDateOnlyString(date: Date): string {
  return moment(date).format("YYYY-MM-DD")
}

export default function ChurchServiceCalendarPage() {
  const { t, i18n } = useTranslation()
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const churchId = params.id

  useEffect(() => {
    (Object.keys(scheduleServiceCalendarTranslations) as Array<keyof typeof scheduleServiceCalendarTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { serviceCalendar: scheduleServiceCalendarTranslations[lang] } }, true, true)
    })
  }, [i18n])

  const { church } = useChurchForServiceCalendar(churchId)
  const isLeader = !!user?.id && church?.leader_id === user.id

  usePageTitle({ title: t("schedule.serviceCalendar.page.title"), showBreadcrumbsInHeader: false })

  const [visibleMonth, setVisibleMonth] = useState(new Date())
  const month = useMemo(() => moment(visibleMonth).format("YYYY-MM"), [visibleMonth])

  const { entries, saving, setSingleDate, setWeeklyDefault } = useChurchServiceCalendar(churchId, month)

  const [savedBannerVisible, setSavedBannerVisible] = useState(false)

  const [dialogDate, setDialogDate] = useState<Date | null>(null)
  const [dialogHasService, setDialogHasService] = useState(true)

  const [weeklyDialogOpen, setWeeklyDialogOpen] = useState(false)
  const [weeklyDay, setWeeklyDay] = useState("0")
  const [weeklyHasService, setWeeklyHasService] = useState(true)
  const [weeklyFrom, setWeeklyFrom] = useState("")
  const [weeklyUntil, setWeeklyUntil] = useState("")

  const entriesByDate = useMemo(() => {
    const map = new Map<string, (typeof entries)[number]>()
    entries.forEach((entry) => map.set(entry.date, entry))
    return map
  }, [entries])

  const calendarEvents = useMemo(
    () =>
      entries.map((entry) => ({
        id: entry.id,
        title: t(entry.has_service ? "schedule.serviceCalendar.legend.hasService" : "schedule.serviceCalendar.legend.noService"),
        start: new Date(entry.date),
        end: new Date(entry.date),
        allDay: true,
        resource: entry,
      })),
    [entries, t],
  )

  const openDialogForDate = (date: Date) => {
    if (!isLeader) return
    const key = toDateOnlyString(date)
    const existing = entriesByDate.get(key)
    setDialogDate(date)
    setDialogHasService(existing?.has_service ?? true)
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => openDialogForDate(slotInfo.start)
  const handleSelectEvent = (event: { resource: { date: string } }) => openDialogForDate(new Date(event.resource.date))

  const handleSaveOne = async () => {
    if (!dialogDate) return
    await setSingleDate(toDateOnlyString(dialogDate), dialogHasService)
    setDialogDate(null)
    setSavedBannerVisible(true)
  }

  const handleSaveWeekly = async () => {
    if (!weeklyFrom) return
    await setWeeklyDefault(Number(weeklyDay), weeklyHasService, weeklyFrom, weeklyUntil || undefined)
    setWeeklyDialogOpen(false)
    setSavedBannerVisible(true)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/churches")} className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("schedule.serviceCalendar.page.back")}
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">{t("schedule.serviceCalendar.page.title")}</h1>
          <p className="text-muted-foreground">
            {t("schedule.serviceCalendar.page.subtitle", { churchName: church?.name ?? "" })}
          </p>
        </div>

        {!isLeader && (
          <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            {t("schedule.serviceCalendar.notLeader")}
          </div>
        )}

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

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            {t("schedule.serviceCalendar.legend.hasService")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            {t("schedule.serviceCalendar.legend.noService")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border-2 border-dashed border-muted-foreground" />
            {t("schedule.serviceCalendar.legend.pending")}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 opacity-50" />
            {t("schedule.serviceCalendar.legend.bulkDefault")}
          </span>
        </div>

        {isLeader && (
          <div>
            <Button onClick={() => setWeeklyDialogOpen(true)}>
              <CalendarClock className="mr-2 h-4 w-4" />
              {t("schedule.serviceCalendar.weeklyDialog.action")}
            </Button>
          </div>
        )}

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
                selectable={isLeader}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={(event: any) => ({
                  style: {
                    backgroundColor: event.resource.has_service ? "#10b981" : "#ef4444",
                    borderRadius: 6,
                    color: "white",
                    ...SOURCE_STYLE[event.resource.source as ServiceCalendarSource],
                  },
                })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Single-date dialog */}
      <Dialog open={!!dialogDate} onOpenChange={(open) => !open && setDialogDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("schedule.serviceCalendar.dateDialog.title", { date: dialogDate ? moment(dialogDate).format("LL") : "" })}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between">
            <Label>{t("schedule.serviceCalendar.dateDialog.hasService", { churchName: church?.name ?? "" })}</Label>
            <Switch checked={dialogHasService} onCheckedChange={setDialogHasService} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogDate(null)} disabled={saving}>
              {t("schedule.serviceCalendar.dateDialog.cancel")}
            </Button>
            <Button onClick={handleSaveOne} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? t("schedule.serviceCalendar.dateDialog.saving") : t("schedule.serviceCalendar.dateDialog.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weekly default dialog */}
      <Dialog open={weeklyDialogOpen} onOpenChange={setWeeklyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("schedule.serviceCalendar.weeklyDialog.title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("schedule.serviceCalendar.weeklyDialog.dayOfWeek")}</Label>
              <Select value={weeklyDay} onValueChange={setWeeklyDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["0", "1", "2", "3", "4", "5", "6"].map((day) => (
                    <SelectItem key={day} value={day}>{t(`schedule.serviceCalendar.days.${day}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>{t("schedule.serviceCalendar.weeklyDialog.hasService")}</Label>
              <Switch checked={weeklyHasService} onCheckedChange={setWeeklyHasService} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("schedule.serviceCalendar.weeklyDialog.startsOn")}</Label>
                <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={weeklyFrom} onChange={(e) => setWeeklyFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("schedule.serviceCalendar.weeklyDialog.endsOn")}</Label>
                <input type="date" className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" value={weeklyUntil} onChange={(e) => setWeeklyUntil(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setWeeklyDialogOpen(false)} disabled={saving}>
              {t("schedule.serviceCalendar.weeklyDialog.cancel")}
            </Button>
            <Button onClick={handleSaveWeekly} disabled={saving || !weeklyFrom}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? t("schedule.serviceCalendar.weeklyDialog.saving") : t("schedule.serviceCalendar.weeklyDialog.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
