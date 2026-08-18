"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { AppLayout } from "@/components/layouts/app-layout"
import { AccessDenied } from "@/components/access/access-denied"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useHasPermission } from "@/hooks/use-has-permission"
import { usePageTitle } from "@/hooks/use-page-title"
import { useMyAssignmentRequests, useOpenSlotsForPreacher } from "@/hooks/use-assignment-request"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { RequestStatus, RequestType } from "@/types/globalTypes"
import { scheduleRequestTranslations } from "@/lib/translations/schedule-request"
import "@/lib/i18n"

export default function InvitationsPage() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const hasPermission = useHasPermission([PermissionResolverName.MyAssignmentRequests])

  useEffect(() => {
    (Object.keys(scheduleRequestTranslations) as Array<keyof typeof scheduleRequestTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { request: scheduleRequestTranslations[lang] } }, true, true)
    })
  }, [i18n])

  usePageTitle({ title: t("schedule.request.page.title"), showBreadcrumbsInHeader: false })

  const { requests, responding, respond } = useMyAssignmentRequests()

  const month = useMemo(() => moment().format("YYYY-MM"), [])
  const { openSlots, requesting, request } = useOpenSlotsForPreacher(month)

  const [savedBannerVisible, setSavedBannerVisible] = useState(false)
  const [respondTarget, setRespondTarget] = useState<{ id: string; accept: boolean; churchName: string; userName: string; date: string } | null>(null)
  const [requestTarget, setRequestTarget] = useState<{ churchId: string; churchName: string; date: string } | null>(null)

  // myAssignmentRequests is always scoped to the caller as the preacher (R5) — CHURCH_INVITED
  // rows are invites received, PREACHER_REQUESTED rows are the caller's own candidatures sent.
  const received = useMemo(() => requests.filter((r) => r.type === RequestType.CHURCH_INVITED), [requests])
  const sent = useMemo(() => requests.filter((r) => r.type === RequestType.PREACHER_REQUESTED), [requests])

  const handleRespond = async () => {
    if (!respondTarget) return
    await respond(respondTarget.id, respondTarget.accept)
    setRespondTarget(null)
    setSavedBannerVisible(true)
  }

  const handleRequest = async () => {
    if (!requestTarget) return
    await request(requestTarget.churchId, requestTarget.date)
    setRequestTarget(null)
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
          <h1 className="text-2xl font-semibold text-foreground">{t("schedule.request.page.title")}</h1>
          <p className="text-muted-foreground">{t("schedule.request.page.subtitle")}</p>
        </div>

        {savedBannerVisible && (
          <div className="rounded-md border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            {t("schedule.request.savedBanner")}
          </div>
        )}

        <Tabs defaultValue="received">
          <TabsList>
            <TabsTrigger value="received">
              {t("schedule.request.tabs.received")}
              {received.filter((r) => r.status === RequestStatus.PENDING).length > 0 && (
                <Badge variant="secondary" className="ml-2">{received.filter((r) => r.status === RequestStatus.PENDING).length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent">{t("schedule.request.tabs.sent")}</TabsTrigger>
            <TabsTrigger value="openSlots">{t("schedule.request.tabs.openSlots")}</TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-3">
            {received.length === 0 && <p className="text-sm text-muted-foreground">{t("schedule.request.empty.received")}</p>}
            {received.map((r) => (
              <Card key={r.id} className="bg-card border-border">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{r.church.name} — {moment(r.date).format("LL")}</p>
                    <p className="text-sm text-muted-foreground">{t(`schedule.request.type.${r.type}`)} · {t(`schedule.request.status.${r.status}`)}</p>
                  </div>
                  {r.status === RequestStatus.PENDING && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setRespondTarget({ id: r.id, accept: true, churchName: r.church.name, userName: r.user.name, date: r.date })}
                      >
                        {t("schedule.request.actions.accept")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRespondTarget({ id: r.id, accept: false, churchName: r.church.name, userName: r.user.name, date: r.date })}
                      >
                        {t("schedule.request.actions.decline")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* "Sent" only shows the caller's own candidatures (PREACHER_REQUESTED) — the church/admin
              side of accepting those happens on the Overview grid, not here (myAssignmentRequests
              is always scoped to the caller as the preacher, never to requests from other preachers). */}
          <TabsContent value="sent" className="space-y-3">
            {sent.length === 0 && <p className="text-sm text-muted-foreground">{t("schedule.request.empty.sent")}</p>}
            {sent.map((r) => (
              <Card key={r.id} className="bg-card border-border">
                <CardContent className="flex items-center justify-between p-4">
                  <p className="font-medium">{r.church.name} — {moment(r.date).format("LL")}</p>
                  <Badge variant="secondary">{t(`schedule.request.status.${r.status}`)}</Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="openSlots" className="space-y-3">
            {openSlots.length === 0 && <p className="text-sm text-muted-foreground">{t("schedule.request.empty.openSlots")}</p>}
            {openSlots.map((slot, index) => (
              <Card key={`${slot.churchId}-${index}`} className="bg-card border-border">
                <CardContent className="flex items-center justify-between p-4">
                  <p className="font-medium">{slot.churchName} — {moment(slot.date).format("LL")}</p>
                  <Button
                    size="sm"
                    onClick={() => setRequestTarget({ churchId: slot.churchId, churchName: slot.churchName, date: slot.date })}
                  >
                    {t("schedule.request.actions.requestToPreach")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* UX rule 8.2 — explicit confirmation before requesting a slot */}
      <AlertDialog open={!!requestTarget} onOpenChange={(open) => !open && setRequestTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("schedule.request.confirm.requestTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("schedule.request.confirm.requestDescription", { churchName: requestTarget?.churchName, date: requestTarget ? moment(requestTarget.date).format("LL") : "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("schedule.request.confirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRequest} disabled={requesting}>
              {requesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("schedule.request.confirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* UX rule 8.2 — explicit confirmation before accepting/declining */}
      <AlertDialog open={!!respondTarget} onOpenChange={(open) => !open && setRespondTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {respondTarget?.accept ? t("schedule.request.confirm.acceptTitle") : t("schedule.request.confirm.declineTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {respondTarget?.accept
                ? t("schedule.request.confirm.acceptDescription", { userName: respondTarget?.userName, churchName: respondTarget?.churchName, date: respondTarget ? moment(respondTarget.date).format("LL") : "" })
                : t("schedule.request.confirm.declineDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("schedule.request.confirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRespond} disabled={responding}>
              {responding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("schedule.request.confirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
