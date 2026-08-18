"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"
import { AppLayout } from "@/components/layouts/app-layout"
import { AccessDenied } from "@/components/access/access-denied"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { useHasPermission } from "@/hooks/use-has-permission"
import { usePageTitle } from "@/hooks/use-page-title"
import { useGapReport } from "@/hooks/use-schedule-overview"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { scheduleGapReportTranslations } from "@/lib/translations/schedule-gap-report"
import "@/lib/i18n"

export default function GapReportPage() {
  const { t, i18n } = useTranslation()
  const hasPermission = useHasPermission([PermissionResolverName.GapReport])

  useEffect(() => {
    (Object.keys(scheduleGapReportTranslations) as Array<keyof typeof scheduleGapReportTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { gapReport: scheduleGapReportTranslations[lang] } }, true, true)
    })
  }, [i18n])

  usePageTitle({ title: t("schedule.gapReport.page.title"), showBreadcrumbsInHeader: false })

  const [visibleMonth, setVisibleMonth] = useState(new Date())
  const month = useMemo(() => moment(visibleMonth).format("YYYY-MM"), [visibleMonth])
  const { gapReport, loading } = useGapReport(month)

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t("schedule.gapReport.page.title")}</h1>
            <p className="text-muted-foreground">{t("schedule.gapReport.page.subtitle")}</p>
            {gapReport && gapReport.computedAt && (
              <p className="text-xs text-muted-foreground">
                {t("schedule.gapReport.page.lastComputed", { date: moment(gapReport.computedAt).format("LLL") })}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label={t("schedule.gapReport.page.previousMonth")}
              title={t("schedule.gapReport.page.previousMonth")}
              onClick={() => setVisibleMonth(moment(visibleMonth).subtract(1, "month").toDate())}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-32 text-center font-medium">{moment(visibleMonth).format("MMMM YYYY")}</span>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("schedule.gapReport.page.nextMonth")}
              title={t("schedule.gapReport.page.nextMonth")}
              onClick={() => setVisibleMonth(moment(visibleMonth).add(1, "month").toDate())}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t("schedule.gapReport.churches.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!loading && gapReport?.churchesWithoutPreacher.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("schedule.gapReport.churches.empty")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("schedule.gapReport.churches.church")}</TableHead>
                    <TableHead>{t("schedule.gapReport.churches.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gapReport?.churchesWithoutPreacher.map((entry, index) => (
                    <TableRow key={`${entry.churchId}-${index}`}>
                      <TableCell>{entry.churchName}</TableCell>
                      <TableCell>{moment(entry.date).format("LL")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              {t("schedule.gapReport.preachers.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!loading && gapReport?.preachersWithoutAssignment.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("schedule.gapReport.preachers.empty")}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("schedule.gapReport.preachers.preacher")}</TableHead>
                    <TableHead>{t("schedule.gapReport.preachers.date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gapReport?.preachersWithoutAssignment.map((entry, index) => (
                    <TableRow key={`${entry.userId}-${index}`}>
                      <TableCell>{entry.userName}</TableCell>
                      <TableCell>{moment(entry.date).format("LL")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
