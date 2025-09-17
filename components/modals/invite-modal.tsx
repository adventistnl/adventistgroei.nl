"use client"

import * as React from "react"
import { useState } from "react"
import { UserPlus, Mail, Link as LinkIcon, Shield, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useInstitution } from "@/contexts/institution-context"
import { inviteTranslations } from "@/lib/translations/invite"
import { RoleSelector } from "@/components/shared/role-selector"

const inviteSchema = z.object({
  type: z.enum(["email", "link"]),
  email: z.string().email("Invalid email").optional(),
  role: z.string().min(1, "Role is required"),
  message: z.string().optional(),
})

type InviteForm = z.infer<typeof inviteSchema>

const ROLES = [
  { value: "member", label: "Member", description: "Basic access to church activities" },
  { value: "volunteer", label: "Volunteer", description: "Can participate in church services" },
  { value: "leader", label: "Leader", description: "Can manage specific departments" },
  { value: "pastor", label: "Pastor", description: "Full access to pastoral functions" },
  { value: "admin", label: "Administrator", description: "Complete system access" },
]


interface InviteModalProps {
  children: React.ReactNode
  onInviteSent?: (inviteData: any) => void
}

export function InviteModal({ children, onInviteSent }: InviteModalProps) {
  const { i18n } = useTranslation()
  const { activeInstitution } = useInstitution()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedLink, setGeneratedLink] = useState("")

  // Get translations for current language with fallback
  const currentLanguage = i18n?.language || 'en'
  const t = inviteTranslations[currentLanguage as keyof typeof inviteTranslations] || inviteTranslations.en


  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      type: "email",
      role: "",
      message: "",
    },
  })

  const inviteType = form.watch("type")
  const selectedRole = form.watch("role")

  // Auto-generate link when role is selected for link type
  React.useEffect(() => {
    if (inviteType === "link" && selectedRole && !generatedLink) {
      generateLinkForRole()
    }
  }, [inviteType, selectedRole, generatedLink])

  const generateLinkForRole = async () => {
    if (!selectedRole) return
    
    try {
      const mockJWT = btoa(JSON.stringify({
        type: "link",
        role: selectedRole,
        institution: activeInstitution?.id || "default-institution",
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days default
        invitedBy: "current-user-id",
        timestamp: Date.now()
      }))

      const inviteLink = `${window.location.origin}/register?invite=${mockJWT}`
      setGeneratedLink(inviteLink)
    } catch (error) {
      console.error('Error generating link:', error)
    }
  }

  const onSubmit = async (data: InviteForm) => {
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!data.role || (data.type === "email" && !data.email)) {
        toast.error(t.fillRequiredFields)
        setIsSubmitting(false)
        return
      }

      const loadingToast = toast.loading(t.creating)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate JWT token
      const mockJWT = btoa(JSON.stringify({
        ...data,
        institution: activeInstitution?.id || "default-institution",
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days default
        invitedBy: "current-user-id",
        timestamp: Date.now()
      }))

      const inviteLink = `${window.location.origin}/register?invite=${mockJWT}`
      setGeneratedLink(inviteLink)
      
      toast.dismiss(loadingToast)
      toast.success(t.invitationSent)
      
      onInviteSent?.({ ...data, inviteLink })
      
      // For email invitations, close modal
      if (data.type === "email") {
        setOpen(false)
        form.reset()
      }
      
    } catch (error) {
      toast.error(t.invitationFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(t.linkCopied)
    } catch (error) {
      toast.error(t.copyFailed)
    }
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
    setGeneratedLink("")
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Only reset when closing
      setTimeout(() => {
        form.reset()
        setGeneratedLink("")
      }, 150)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <UserPlus className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={inviteType} onValueChange={(value) => form.setValue("type", value as "email" | "link")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t.emailInvitation}
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              {t.shareableLink}
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <TabsContent value="email" className="space-y-4 mt-6">
              {/* Instruction Message */}
              <div className="p-3 bg-muted/30 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  {t.emailInstructionDesc}
                </p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Input */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.emailAddress}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t.emailPlaceholder} 
                          type="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role Selection - Clickable Tags */}
                <RoleSelector
                  control={form.control}
                  name="role"
                  label={t.memberRole}
                  roles={ROLES}
                />

                {/* Personal Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.personalMessage}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t.personalMessagePlaceholder}
                          className="resize-none"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        {t.personalMessageDesc}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                  >
                    {t.cancel}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t.creating}
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        {t.sendInvitation}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="link" className="space-y-4 mt-6">
              {/* Instruction Message */}
              <div className="p-3 bg-muted/30 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  {t.linkInstructionDesc}
                </p>
              </div>

              <div className="space-y-4">
                {/* Role Selection - Clickable Tags */}
                <RoleSelector
                  control={form.control}
                  name="role"
                  label={t.memberRole}
                  roles={ROLES}
                />

                {/* Generated Link Display */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      {t.shareableLinkTitle}
                    </CardTitle>
                    <CardDescription>
                      {selectedRole ? t.shareableLinkDesc : t.selectRoleToGenerate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedLink ? (
                      <div className="flex gap-2">
                        <Input 
                          value={generatedLink} 
                          readOnly 
                          className="font-mono text-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(generatedLink)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {t.linkNotAvailable}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                  >
                    {t.cancel}
                  </Button>
                  {generatedLink && (
                    <Button
                      type="button"
                      onClick={() => copyToClipboard(generatedLink)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {t.copyLink}
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
