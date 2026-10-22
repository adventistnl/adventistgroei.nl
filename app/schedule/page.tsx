"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { AppLayout } from "@/components/layouts/app-layout"
import { AccessDenied } from "@/components/access/access-denied"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useInstitution } from "@/contexts/institution-context"
import { usePageTitle } from "@/hooks/use-page-title"
import { useHasPermission } from "@/hooks/use-has-permission"
import { useChurches } from "@/hooks/use-churches"
import { useScheduleOverview } from "@/hooks/use-schedule-overview"
import { useEligiblePreachersForSlot, useInviteToAssignment, useAssignmentInviteTemplates } from "@/hooks/use-assignment-request"
import { useNextMonthlyClose, useTriggerMonthlyClose } from "@/hooks/use-monthly-close"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AssignmentStatus } from "@/types/globalTypes"
import { scheduleAssignmentTranslations } from "@/lib/translations/schedule-assignment"
import { scheduleRequestTranslations } from "@/lib/translations/schedule-request"
import "@/lib/i18n"

const STATUS_COLOR: Record<AssignmentStatus, string> = {
  [AssignmentStatus.DRAFT]: "bg-muted text-muted-foreground",
  [AssignmentStatus.PENDING_CONFIRMATION]: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  [AssignmentStatus.CONFIRMED]: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  [AssignmentStatus.DECLINED]: "bg-red-500/15 text-red-700 dark:text-red-400",
  [AssignmentStatus.LOCKED]: "bg-slate-500/15 text-slate-700 dark:text-slate-400",
}

export default function ScheduleOverviewPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { currentInstitutionData } = useInstitution()
  const hasOverviewPermission = useHasPermission([PermissionResolverName.ScheduleOverview])
  const hasAnyChurchPermission = useHasPermission([PermissionResolverName.SetAssignmentAny])
  const hasOwnChurchPermission = useHasPermission([PermissionResolverName.SetAssignment])
  const hasMonthlyClosePermission = useHasPermission([PermissionResolverName.TriggerMonthlyClose])

  useEffect(() => {
    (Object.keys(scheduleAssignmentTranslations) as Array<keyof typeof scheduleAssignmentTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { assignment: scheduleAssignmentTranslations[lang] } }, true, true)
    })
    ;(Object.keys(scheduleRequestTranslations) as Array<keyof typeof scheduleRequestTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { request: scheduleRequestTranslations[lang] } }, true, true)
    })
  }, [i18n])

  usePageTitle({ title: t("schedule.assignment.page.title"), showBreadcrumbsInHeader: false })

  const [visibleMonth, setVisibleMonth] = useState(new Date())
  const month = useMemo(() => moment(visibleMonth).format("YYYY-MM"), [visibleMonth])
  const daysInMonth = useMemo(() => moment(visibleMonth).daysInMonth(), [visibleMonth])
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth])

  const { churches } = useChurches()
  const { assignments, saving, setAssignment, setAssignmentAny } = useScheduleOverview(month)

  const [savedBannerVisible, setSavedBannerVisible] = useState(false)
  const [dialogChurch, setDialogChurch] = useState<{ id: string; name: string; leader_id?: string | null } | null>(null)
  const [dialogDate, setDialogDate] = useState<number | null>(null)
  const [dialogUserId, setDialogUserId] = useState<string>("")

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteUserId, setInviteUserId] = useState<string>("")
  const [inviteTemplateId, setInviteTemplateId] = useState<string>("")
  const dialogDateStr = dialogDate ? moment(visibleMonth).date(dialogDate).format("YYYY-MM-DD") : ""
  const { preachers: eligiblePreachers } = useEligiblePreachersForSlot(dialogChurch?.id ?? "", dialogDateStr, !inviteDialogOpen || !dialogChurch)
  const { invite, inviteAny, inviting } = useInviteToAssignment()
  const { templates } = useAssignmentInviteTemplates()

  const { closeDate, closedMonthLabel } = useNextMonthlyClose()
  const { trigger: triggerMonthlyClose, loading: closingMonth } = useTriggerMonthlyClose()
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false)
  const [closeResultBanner, setCloseResultBanner] = useState<string | null>(null)
  const visibleMonthLabel = moment(visibleMonth).format("MMMM YYYY")

  const handleConfirmMonthlyClose = async () => {
    const result = await triggerMonthlyClose(month)
    setCloseConfirmOpen(false)
    const summary = result.data?.triggerMonthlyClose
    if (summary) {
      setCloseResultBanner(
        t("schedule.assignment.monthlyClose.resultBanner", {
          month: visibleMonthLabel,
          autoAccepted: summary.autoAccepted,
          locked: summary.locked,
        }),
      )
    }
  }

  const assignmentByKey = useMemo(() => {
    const map = new Map<string, (typeof assignments)[number]>()
    assignments.forEach((a) => map.set(`${a.church_id}|${moment(a.date).format("YYYY-MM-DD")}`, a))
    return map
  }, [assignments])

  const churchesByRegion = useMemo(() => {
    const groups = new Map<string, { regionName: string; churches: typeof churches }>()
    churches.forEach((church: any) => {
      const regionId = church.region_id || "none"
      const regionName = church.region?.name || "—"
      if (!groups.has(regionId)) groups.set(regionId, { regionName, churches: [] })
      groups.get(regionId)!.churches.push(church)
    })
    return Array.from(groups.values())
  }, [churches, t])

  const institutionUsers = currentInstitutionData?.users || []

  const canEditChurch = (church: { leader_id?: string | null }) =>
    hasAnyChurchPermission || (hasOwnChurchPermission && church.leader_id === user?.id)

  const openDialog = (church: { id: string; name: string; leader_id?: string | null }, day: number) => {
    if (!canEditChurch(church)) return
    const key = `${church.id}|${moment(visibleMonth).date(day).format("YYYY-MM-DD")}`
    setDialogUserId(assignmentByKey.get(key)?.user_id || "")
    setDialogChurch(church)
    setDialogDate(day)
  }

  const handleSave = async () => {
    if (!dialogChurch || !dialogDate) return
    const date = moment(visibleMonth).date(dialogDate).format("YYYY-MM-DD")
    const mutate = hasAnyChurchPermission ? setAssignmentAny : setAssignment
    await mutate(dialogChurch.id, date, dialogUserId || undefined)
    setDialogChurch(null)
    setDialogDate(null)
    setSavedBannerVisible(true)
  }

  const canInvite = hasAnyChurchPermission || (hasOwnChurchPermission && dialogChurch?.leader_id === user?.id)

  const handleSendInvite = async () => {
    if (!dialogChurch || !inviteUserId) return
    const mutate = hasAnyChurchPermission ? inviteAny : invite
    await mutate(dialogChurch.id, dialogDateStr, inviteUserId, inviteTemplateId || undefined)
    setInviteDialogOpen(false)
    setInviteUserId("")
    setInviteTemplateId("")
    setDialogChurch(null)
    setDialogDate(null)
    setSavedBannerVisible(true)
  }

  if (!hasOverviewPermission) {
    return (
      <AppLayout>
        <AccessDenied />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t("schedule.assignment.page.title")}</h1>
            <p className="text-muted-foreground">{t("schedule.assignment.page.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={t("schedule.assignment.grid.previousMonth")}
              title={t("schedule.assignment.grid.previousMonth")}
              onClick={() => setVisibleMonth(moment(visibleMonth).subtract(1, "month").toDate())}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-32 text-center font-medium">{moment(visibleMonth).format("MMMM YYYY")}</span>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("schedule.assignment.grid.nextMonth")}
              title={t("schedule.assignment.grid.nextMonth")}
              onClick={() => setVisibleMonth(moment(visibleMonth).add(1, "month").toDate())}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("schedule.assignment.monthlyClose.indicator", { date: moment(closeDate).format("LL"), month: closedMonthLabel })}
          </span>
          {hasMonthlyClosePermission && (
            <Button variant="outline" size="sm" onClick={() => setCloseConfirmOpen(true)}>
              {t("schedule.assignment.monthlyClose.triggerButton")}
            </Button>
          )}
        </div>

        {closeResultBanner && (
          <div className="flex items-center justify-between rounded-md border border-blue-600/30 bg-blue-600/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {closeResultBanner}
            </span>
            <button onClick={() => setCloseResultBanner(null)} aria-label={t("schedule.assignment.dismiss")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {savedBannerVisible && (
          <div className="flex items-center justify-between rounded-md border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t("schedule.assignment.savedBanner")}
            </span>
            <button onClick={() => setSavedBannerVisible(false)} aria-label={t("schedule.assignment.dismiss")}>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <Card className="bg-card border-border">
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 bg-card px-4 py-2 text-left font-medium">{t("schedule.assignment.grid.churchColumn")}</th>
                  {days.map((day) => (
                    <th key={day} className="min-w-[110px] px-2 py-2 text-center font-medium">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {churchesByRegion.map((group) => (
                  <Fragment key={`region-${group.regionName}`}>
                    <tr className="bg-muted/40">
                      <td colSpan={days.length + 1} className="px-4 py-1 text-xs font-semibold uppercase text-muted-foreground">
                        {group.regionName}
                      </td>
                    </tr>
                    {group.churches.map((church: any) => (
                      <tr key={church.id} className="border-b border-border">
                        <td className="sticky left-0 z-10 bg-card px-4 py-2 font-medium">{church.name}</td>
                        {days.map((day) => {
                          const key = `${church.id}|${moment(visibleMonth).date(day).format("YYYY-MM-DD")}`
                          const assignment = assignmentByKey.get(key)
                          const editable = canEditChurch(church)
                          return (
                            <td
                              key={day}
                              className={`px-2 py-2 text-center ${editable ? "cursor-pointer hover:bg-muted/50" : ""}`}
                              onClick={() => openDialog(church, day)}
                            >
                              {assignment ? (
                                <Badge variant="secondary" className={STATUS_COLOR[assignment.status as AssignmentStatus]}>
                                  {assignment.user?.name || t(`schedule.assignment.status.${assignment.status}`)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">{t("schedule.assignment.cell.empty")}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!dialogChurch} onOpenChange={(open) => !open && setDialogChurch(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("schedule.assignment.dialog.title", {
                churchName: dialogChurch?.name ?? "",
                date: dialogDate ? moment(visibleMonth).date(dialogDate).format("LL") : "",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>{t("schedule.assignment.dialog.preacher")}</Label>
            <Combobox
              value={dialogUserId || "__none__"}
              onValueChange={(value) => setDialogUserId(value === "__none__" ? "" : value)}
              options={[
                { value: "__none__", label: t("schedule.assignment.dialog.unassigned") },
                ...institutionUsers.map((u: any) => ({ value: u.id, label: u.name })),
              ]}
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
            {canInvite && (
              <Button variant="secondary" onClick={() => setInviteDialogOpen(true)} disabled={saving}>
                {t("schedule.request.actions.invite")}
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDialogChurch(null)} disabled={saving}>
                {t("schedule.assignment.dialog.cancel")}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? t("schedule.assignment.dialog.saving") : t("schedule.assignment.dialog.save")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* R5 (church/admin invites) + R6 (reach, filtered entirely server-side) */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("schedule.request.inviteDialog.title", {
                churchName: dialogChurch?.name ?? "",
                date: dialogDate ? moment(visibleMonth).date(dialogDate).format("LL") : "",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("schedule.request.inviteDialog.preacher")}</Label>
              <Combobox
                value={inviteUserId}
                onValueChange={setInviteUserId}
                options={eligiblePreachers.map((p) => ({ value: p.id, label: p.name }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.request.inviteDialog.template")}</Label>
              <Combobox
                value={inviteTemplateId || "__none__"}
                onValueChange={(value) => setInviteTemplateId(value === "__none__" ? "" : value)}
                options={[
                  { value: "__none__", label: t("schedule.request.inviteDialog.noTemplate") },
                  ...templates.map((tpl) => ({ value: tpl.id, label: tpl.name })),
                ]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteDialogOpen(false)} disabled={inviting}>
              {t("schedule.request.inviteDialog.cancel")}
            </Button>
            <Button onClick={handleSendInvite} disabled={inviting || !inviteUserId}>
              {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {inviting ? t("schedule.request.inviteDialog.sending") : t("schedule.request.inviteDialog.send")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("schedule.assignment.monthlyClose.confirmTitle", { month: visibleMonthLabel })}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t("schedule.assignment.monthlyClose.confirmBody", { month: visibleMonthLabel })}
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCloseConfirmOpen(false)} disabled={closingMonth}>
              {t("schedule.assignment.monthlyClose.cancel")}
            </Button>
            <Button onClick={handleConfirmMonthlyClose} disabled={closingMonth}>
              {closingMonth && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {closingMonth ? t("schedule.assignment.monthlyClose.triggering") : t("schedule.assignment.monthlyClose.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
