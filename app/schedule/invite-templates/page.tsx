"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { AccessDenied } from "@/components/access/access-denied"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useHasPermission } from "@/hooks/use-has-permission"
import { usePageTitle } from "@/hooks/use-page-title"
import { useAssignmentInviteTemplates } from "@/hooks/use-assignment-request"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { scheduleRequestTranslations } from "@/lib/translations/schedule-request"
import "@/lib/i18n"

export default function InviteTemplatesPage() {
  const { t, i18n } = useTranslation()
  const hasPermission = useHasPermission([PermissionResolverName.AssignmentInviteTemplates])

  useEffect(() => {
    (Object.keys(scheduleRequestTranslations) as Array<keyof typeof scheduleRequestTranslations>).forEach((lang) => {
      i18n.addResourceBundle(lang, "translation", { schedule: { request: scheduleRequestTranslations[lang] } }, true, true)
    })
  }, [i18n])

  usePageTitle({ title: t("schedule.request.templates.title"), showBreadcrumbsInHeader: false })

  const { templates, saving, create, update, remove } = useAssignmentInviteTemplates()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const openNew = () => {
    setEditingId(null)
    setName("")
    setSubject("")
    setBody("")
    setDialogOpen(true)
  }

  const openEdit = (tpl: { id: string; name: string; subject: string; body: string }) => {
    setEditingId(tpl.id)
    setName(tpl.name)
    setSubject(tpl.subject)
    setBody(tpl.body)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name || !subject || !body) return
    if (editingId) {
      await update(editingId, name, subject, body)
    } else {
      await create(name, subject, body)
    }
    setDialogOpen(false)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{t("schedule.request.templates.title")}</h1>
            <p className="text-muted-foreground">{t("schedule.request.templates.subtitle")}</p>
          </div>
          <Button onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            {t("schedule.request.templates.new")}
          </Button>
        </div>

        {templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("schedule.request.templates.empty")}</p>
        ) : (
          <div className="space-y-3">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="bg-card border-border">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="cursor-pointer" onClick={() => openEdit(tpl)}>
                    <p className="font-medium">{tpl.name}</p>
                    <p className="text-sm text-muted-foreground">{tpl.subject}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(tpl.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? name : t("schedule.request.templates.new")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("schedule.request.templates.name")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.request.templates.subject")}</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("schedule.request.templates.body")}</Label>
              <Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
              <p className="text-xs text-muted-foreground">{t("schedule.request.templates.bodyHint")}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={saving}>
              {t("schedule.request.templates.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving || !name || !subject || !body}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? t("schedule.request.templates.saving") : t("schedule.request.templates.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("schedule.request.templates.deleteConfirmTitle")}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("schedule.request.templates.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteTarget) void remove(deleteTarget)
                setDeleteTarget(null)
              }}
            >
              {t("schedule.request.templates.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
