"use client"

import * as React from "react"
import { useState } from "react"
import { UserPlus, Mail, Link as LinkIcon, Copy } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { useInstitution } from "@/contexts/institution-context"
import { inviteTranslations } from "@/lib/translations/invite"
import { RoleSelector } from "@/components/shared/role-selector"
import { useInviteUserMutation } from "@/hooks/graphql/use-invite-user-mutation"
import { useSendInviteEmailMutation } from "@/hooks/graphql/use-send-invite-email-mutation"
import { useUser } from "@/hooks/use-user"
import { useRoles } from "@/hooks/use-roles"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { InviteUserVariables } from "@/types/InviteUser"

const inviteSchema = z.object({
  type: z.enum(["email", "link"]),
  email: z.string().email("Invalid email").optional(),
  role: z.string().min(1, "Role is required"),
  message: z.string().optional(),
})

type InviteForm = z.infer<typeof inviteSchema>



interface InviteModalProps {
  children: React.ReactNode
  onInviteSent?: (inviteData: any) => void
}

export function InviteModal({ children, onInviteSent }: InviteModalProps) {
  const { user, loggedUserId } = useUser({});
  const { roles } = useRoles({});
  const [inviteUser] = useInviteUserMutation();
  const [sendInviteEmail] = useSendInviteEmailMutation();
  const { i18n } = useTranslation();
  const { currentInstitutionData } = useInstitution();
  const  churches = currentInstitutionData?.churches || []
  const departments = currentInstitutionData?.departments || []
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const currentLanguage = i18n?.language || "en";
  const t = inviteTranslations[currentLanguage as keyof typeof inviteTranslations] || inviteTranslations.en;

  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      type: "email",
      role: "",
      message: "",
    },
  });

  const inviteType = form.watch("type");
  const selectedRole = form.watch("role");

  // Auto-generate link when role is selected for link type
  React.useEffect(() => {
    if (inviteType === "link" && selectedRole) {
      generateLinkForRole({
            inviter_id: loggedUserId, // Replace with actual inviter ID
            email: '',
            institution_id: currentInstitutionData?.id || "",
            language_preference: currentLanguage,
            role_ids: [selectedRole],
          });
    }
  }, [inviteType, selectedRole]);

  const generateLinkForRole = async (variables: InviteUserVariables): Promise<{ inviteToken: string, generatedLink: string } | undefined> => {
    if (!selectedRole) return;
    
    try {
      // const languagePreference: LanguagePreference = currentLanguage === "en" ? LanguagePreference.En : LanguagePreference.Nl;
      const { data } = await inviteUser({
        variables,
      });

      const inviteToken = data?.inviteUser?.token;
      if (inviteToken) {
        const inviteLink = `${window.location.origin}/register?invite=${inviteToken}`;
        setGeneratedLink(inviteLink);
        return { inviteToken, generatedLink: inviteLink };
      }
      return;
    } catch (error) {
      toast.error(t.generateLinkError);
    }
  };

  const onSubmit = async (data: InviteForm) => {
    setIsSubmitting(true);

    try {
      const loadingToast = toast.loading(t.creating);
      if (data.type === "link") {
        toast.dismiss(loadingToast);
        toast.success(t.invitationSent);
        return;
      }

      if (!data.role || (data.type === "email" && !data.email)) {
        toast.error(t.fillRequiredFields);
        setIsSubmitting(false);
        return;
      }

      if (data.type === "email") {
        const variables: InviteUserVariables = {
          email: data.email!,
          inviter_id: loggedUserId!, // Replace with actual inviter ID
          institution_id: currentInstitutionData?.id || "",
          language_preference: currentLanguage,
          role_ids: [data.role],
        }
        const generated = await generateLinkForRole(variables);

        if (!generated || !generated.inviteToken || !generated.generatedLink) {
          toast.error(t.invitationFailed);
          setIsSubmitting(false);
          return;
        }

        await sendInviteEmail({
          variables: {
            inviter_id: loggedUserId, // Replace with actual inviter ID
            to: data.email!,
            message: data.message || null,
            url: generated.generatedLink,
          },
        });

        toast.dismiss(loadingToast);
        toast.success(t.invitationSent);
        // setOpen(false);
        form.reset();
      }
    } catch (error) {
      toast.error(t.invitationFailed);
    } finally {
      setIsSubmitting(false);
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

  const handleOpenModal = () => {
    if (churches.length === 0 || departments.length === 0) {
      toast.error(t["missingChurchOrDepartment"]);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {!open && (
        <button onClick={handleOpenModal}>{children}</button>
      )}
      {open && (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <WithPermission requiredPermissions={[ PermissionResolverName.Roles, PermissionResolverName.InviteUser, PermissionResolverName.SendInviteEmail ]} >
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
                        roles={roles}
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
                        roles={roles}
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
          </WithPermission>
        </Dialog>
      )}
    </>
  )
}
