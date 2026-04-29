"use client"

import * as React from "react"
import { useState, useMemo } from "react"
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
import { useGetInstitutionsForInviteQuery, InstitutionForInvite } from "@/hooks/graphql/use-get-institutions-for-invite-query"
import { RoleExtraFields } from "./RoleExtraFields"
import { FilterTags, FilterTag } from "@/components/shared/filter-tags"

// Role categories based on key_code patterns
type RoleCategory = "all" | "administration" | "church" | "institutional" | "leadership" | "member"

const getRoleCategory = (keyCode: string): RoleCategory[] => {
  const code = keyCode.toUpperCase()
  const categories: RoleCategory[] = []
  
  if (code.includes("ADMIN") || code.includes("SYSTEM")) categories.push("administration")
  if (code.includes("CHURCH")) categories.push("church")
  if (code.includes("INSTITUTIONAL") || code.includes("INSTITUTION")) categories.push("institutional")
  if (code.includes("LEADER") || code.includes("DIRECTOR") || code.includes("COORDINATOR")) categories.push("leadership")
  if (code.includes("MEMBER") || code.includes("VOLUNTEER")) categories.push("member")
  
  return categories.length > 0 ? categories : ["member"]
}

const inviteSchema = z.object({
  type: z.enum(["email", "link"]),
  email: z.string().email("Invalid email").optional(),
  role: z.string().min(1, "Role is required"),
  message: z.string().optional(),
  churchId: z.string().optional(),
  institutionId: z.string().optional(),
  churchDepartmentId: z.string().optional(),
  institutionDepartmentId: z.string().optional(),
})

type InviteForm = z.infer<typeof inviteSchema>

interface InviteModalProps {
  children: React.ReactNode
  onInviteSent?: (inviteData: any) => void
}

const getSelectedRoleKeyCode = (selectedRoleId: string, roles: any[]) => {
  const found = roles?.find(r => r.id === selectedRoleId);
  return found?.key_code || null;
};

// Função para validar campos extras obrigatórios
function areExtraFieldsValid({
  selectedRoleKeyCode,
  selectedChurch,
  selectedInstitution,
  selectedChurchDepartment,
  selectedInstitutionDepartment,
}: {
  selectedRoleKeyCode?: string | null;
  selectedChurch?: string | undefined;
  selectedInstitution?: string | undefined;
  selectedChurchDepartment?: string | undefined;
  selectedInstitutionDepartment?: string | undefined;
}): boolean {
  if (selectedRoleKeyCode === 'CHURCH_MEMBER') {
    return Boolean(selectedChurch);
  }
  if (selectedRoleKeyCode === 'INSTITUTIONAL_LEADER') {
    return Boolean(selectedInstitution && selectedInstitutionDepartment);
  }
  return true;
}

export function InviteModal({ children, onInviteSent }: InviteModalProps) {
  const { user, loggedUserId } = useUser({});
  const { roles } = useRoles();
  const [inviteUser] = useInviteUserMutation();
  const [sendInviteEmail] = useSendInviteEmailMutation();
  const { i18n } = useTranslation();
  const { currentInstitutionData } = useInstitution();
  const { data: inviteData } = useGetInstitutionsForInviteQuery();
  const institutions: InstitutionForInvite[] = inviteData?.institutions || [];
  // Lista flat de todas as igrejas disponíveis (usada para roles de igreja)
  const churches = useMemo(() => institutions.flatMap(inst => inst.churches || []), [institutions]);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState<string | undefined>(undefined);
  const [selectedChurch, setSelectedChurch] = useState<string | undefined>(undefined);
  const [selectedChurchDepartment, setSelectedChurchDepartment] = useState<string | undefined>(undefined);
  const [selectedInstitutionDepartment, setSelectedInstitutionDepartment] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<RoleCategory>("all");
  const currentLanguage = i18n?.language || "en";
  const t = inviteTranslations[currentLanguage as keyof typeof inviteTranslations] || inviteTranslations.en;

  // Filter roles by selected category
  const filteredRoles = useMemo(() => {
    if (selectedCategory === "all") return roles;
    return roles.filter(role => {
      const categories = getRoleCategory(role.key_code);
      return categories.includes(selectedCategory);
    });
  }, [roles, selectedCategory]);

  // Category filters configuration
  const categoryFilters: FilterTag[] = [
    { key: "all", label: t.filterAll },
    { key: "administration", label: t.filterAdministration },
    { key: "church", label: t.filterChurch },
    { key: "institutional", label: t.filterInstitutional },
    { key: "leadership", label: t.filterLeadership },
    { key: "member", label: t.filterMember },
  ];

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
  const selectedRoleKeyCode = getSelectedRoleKeyCode(selectedRole, roles);
  const extraFieldsValid = areExtraFieldsValid({
    selectedRoleKeyCode,
    selectedChurch,
    selectedInstitution,
    selectedChurchDepartment,
    selectedInstitutionDepartment,
  });

  // Limpar campos extras ao trocar a role
  React.useEffect(() => {
    setSelectedChurch(undefined);
    setSelectedInstitution(undefined);
    setSelectedChurchDepartment(undefined);
    setSelectedInstitutionDepartment(undefined);
    form.setValue("churchId", "");
    form.setValue("institutionId", "");
    form.setValue("churchDepartmentId", "");
    form.setValue("institutionDepartmentId", "");
  }, [selectedRole]);

  // Adicionar função para limpar o link gerado ao alterar campos relevantes
  React.useEffect(() => {
    setGeneratedLink("");
  }, [selectedRole, selectedChurch, selectedInstitution, selectedChurchDepartment, selectedInstitutionDepartment]);

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
      if (error instanceof Error && error.message.includes("Email already in use")) {
        toast.error(t.emailInUse);
        return;
      } else {
        toast.error(t.generateLinkError);
      }
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
          institution_id:  data.institutionId || currentInstitutionData?.id || "",
          language_preference: currentLanguage,
          role_ids: [data.role],
          church_department_id: data.churchDepartmentId || data.institutionDepartmentId || undefined,
          church_id: data.churchId || undefined,
          institution_department_id: data.institutionDepartmentId || undefined,
        }
        const generated = await generateLinkForRole(variables);

        if (!generated || !generated.inviteToken || !generated.generatedLink) {
          // toast.error(t.invitationFailed);
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
        setOpen(false);
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
    if (!newOpen) {
      setOpen(false);
      // Only reset when closing
      setTimeout(() => {
        form.reset();
        setGeneratedLink("");
      }, 150);
    }
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <WithPermission requiredPermissions={[ PermissionResolverName.Roles, PermissionResolverName.InviteUser, PermissionResolverName.SendInviteEmail ]} partialPermissionCheck >
        <DialogTrigger asChild onClick={handleOpenModal}>
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
              <WithPermission requiredPermissions={[ PermissionResolverName.SendInviteEmail ]} >
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.emailInvitation}
                </TabsTrigger>
              </WithPermission>
              <WithPermission requiredPermissions={[ PermissionResolverName.InviteUser ]} >
                <TabsTrigger value="link" className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  {t.shareableLink}
                </TabsTrigger>
              </WithPermission>
            </TabsList>
            
            <Form {...form}>
              <WithPermission requiredPermissions={[ PermissionResolverName.SendInviteEmail ]} >
                <TabsContent value="email" className="space-y-4 mt-6">
                  {/* Instruction Message */}
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      {t.emailInstructionDesc}
                    </p>
                  </div>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Category Filter - FilterTags Component */}
                    <FilterTags
                      tags={categoryFilters}
                      selectedTag={selectedCategory}
                      onTagSelect={(tag) => setSelectedCategory(tag as RoleCategory)}
                      title={t.filterByCategory}
                      showTitle={false}
                      size="sm"
                      variant="default"
                    />

                    {/* Role Selection - Clickable Tags */}
                    <RoleSelector
                      control={form.control}
                      name="role"
                      label={t.memberRole}
                      roles={filteredRoles}
                    />

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

                    {/* Campos extras dinâmicos agrupados e visíveis */}
                    <RoleExtraFields
                      selectedRoleKeyCode={selectedRoleKeyCode}
                      churches={churches}
                      institutions={institutions}
                      form={form}
                      selectedChurch={selectedChurch}
                      setSelectedChurch={setSelectedChurch}
                      selectedInstitution={selectedInstitution}
                      setSelectedInstitution={setSelectedInstitution}
                      selectedChurchDepartment={selectedChurchDepartment}
                      setSelectedChurchDepartment={setSelectedChurchDepartment}
                      selectedInstitutionDepartment={selectedInstitutionDepartment}
                      setSelectedInstitutionDepartment={setSelectedInstitutionDepartment}
                      t={t.roleExtraFields}
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
                      <Button type="submit" disabled={isSubmitting || !extraFieldsValid}>
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
              </WithPermission>
              <WithPermission requiredPermissions={[ PermissionResolverName.InviteUser ]} >
                <TabsContent value="link" className="space-y-4 mt-6">
                  {/* Instruction Message */}
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <p className="text-sm text-muted-foreground">
                      {t.linkInstructionDesc}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Category Filter - FilterTags Component */}
                    <FilterTags
                      tags={categoryFilters}
                      selectedTag={selectedCategory}
                      onTagSelect={(tag) => setSelectedCategory(tag as RoleCategory)}
                      title={t.filterByCategory}
                      showTitle={true}
                      size="sm"
                      variant="default"
                    />

                    {/* Role Selection - Clickable Tags */}
                    <RoleSelector
                      control={form.control}
                      name="role"
                      label={t.memberRole}
                      roles={filteredRoles}
                    />

                    {/* Campos extras dinâmicos agrupados e visíveis */}
                    <RoleExtraFields
                      selectedRoleKeyCode={selectedRoleKeyCode}
                      churches={churches}
                      institutions={institutions}
                      form={form}
                      selectedChurch={selectedChurch}
                      setSelectedChurch={setSelectedChurch}
                      selectedInstitution={selectedInstitution}
                      setSelectedInstitution={setSelectedInstitution}
                      selectedChurchDepartment={selectedChurchDepartment}
                      setSelectedChurchDepartment={setSelectedChurchDepartment}
                      selectedInstitutionDepartment={selectedInstitutionDepartment}
                      setSelectedInstitutionDepartment={setSelectedInstitutionDepartment}
                      showErrors={!extraFieldsValid}
                      t={t.roleExtraFields}
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
                        {!generatedLink ? (
                          // Botão de gerar link
                          <Button
                            type="button"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground"
                            onClick={async () => {
                              await generateLinkForRole({
                                inviter_id: loggedUserId,
                                email: '',
                                institution_id: currentInstitutionData?.id || "",
                                language_preference: currentLanguage,
                                role_ids: [selectedRole],
                                church_department_id: selectedChurchDepartment,
                                institution_department_id: selectedInstitutionDepartment,
                                church_id: selectedChurch || undefined,
                              });
                            }}
                            disabled={!selectedRole || isSubmitting || !extraFieldsValid}
                          >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            {t.generateLinkButton || "Gerar link de convite"}
                          </Button>
                        ) : (
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
              </WithPermission>
            </Form>
          </Tabs>
        </DialogContent>
      </WithPermission>
    </Dialog>
  );
}
