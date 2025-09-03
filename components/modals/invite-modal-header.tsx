"use client"

import * as React from "react"
import { useState } from "react"
import { UserPlus, Mail, Link as LinkIcon, Shield, Clock, CheckCircle, Copy, ArrowLeft } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import toast from "react-hot-toast"

const inviteSchema = z.object({
  type: z.enum(["email", "link"]),
  email: z.string().email("Invalid email").optional(),
  role: z.string().min(1, "Role is required"),
  institution: z.string().min(1, "Institution is required"),
  region: z.string().optional(),
  church: z.string().optional(),
  expiresIn: z.string().min(1, "Expiration is required"),
  message: z.string().optional(),
  permissions: z.array(z.string()).optional(),
})

type InviteForm = z.infer<typeof inviteSchema>

const ROLES = [
  { value: "member", label: "Member", description: "Basic access to church activities", color: "bg-blue-100 text-blue-700" },
  { value: "volunteer", label: "Volunteer", description: "Can participate in church services", color: "bg-green-100 text-green-700" },
  { value: "leader", label: "Leader", description: "Can manage specific departments", color: "bg-purple-100 text-purple-700" },
  { value: "pastor", label: "Pastor", description: "Full access to pastoral functions", color: "bg-orange-100 text-orange-700" },
  { value: "admin", label: "Administrator", description: "Complete system access", color: "bg-red-100 text-red-700" },
]

const INSTITUTIONS = [
  { value: "usp", label: "União Sul-Paulista" },
  { value: "ucb", label: "União Central Brasileira" },
  { value: "uan", label: "União Amazônica" },
  { value: "une", label: "União Nordeste Brasileira" },
]

const EXPIRY_OPTIONS = [
  { value: "24h", label: "24 hours" },
  { value: "3d", label: "3 days" },
  { value: "7d", label: "1 week" },
  { value: "30d", label: "30 days" },
]

const PERMISSIONS = [
  { value: "view_members", label: "View Members" },
  { value: "manage_events", label: "Manage Events" },
  { value: "approve_subsidies", label: "Approve Subsidies" },
  { value: "send_communications", label: "Send Communications" },
  { value: "view_reports", label: "View Reports" },
  { value: "manage_departments", label: "Manage Departments" },
]

interface InviteModalHeaderProps {
  children: React.ReactNode
  onInviteSent?: (inviteData: any) => void
}

export function InviteModalHeader({ children, onInviteSent }: InviteModalHeaderProps) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedLink, setGeneratedLink] = useState("")

  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      type: "email",
      role: "",
      institution: "",
      region: "",
      church: "",
      expiresIn: "7d",
      message: "",
      permissions: [],
    },
  })

  const inviteType = form.watch("type")
  const selectedRole = form.watch("role")
  const progress = (currentStep / 3) * 100

  const onSubmit = async (data: InviteForm) => {
    setIsSubmitting(true)
    
    try {
      // Toast de loading
      const loadingToast = toast.loading("🔄 Creating invitation...")
      
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular geração de JWT token
      const mockJWT = btoa(JSON.stringify({
        ...data,
        expiresAt: Date.now() + (parseInt(data.expiresIn) * 24 * 60 * 60 * 1000),
        invitedBy: "current-user-id",
        timestamp: Date.now()
      }))

      const inviteLink = `${window.location.origin}/register?invite=${mockJWT}`
      setGeneratedLink(inviteLink)
      
      toast.dismiss(loadingToast)
      toast.success(
        `🎉 Invitation created successfully!\n📧 ${data.type === "email" ? `Sent to ${data.email}` : "Link ready to share"}`,
        {
          duration: 5000,
          style: { minWidth: '350px' }
        }
      )
      
      onInviteSent?.({ ...data, inviteLink })
      
      setCurrentStep(1)
      setOpen(false)
      form.reset()
      
    } catch (error) {
      toast.error("❌ Failed to create invitation. Please try again.", {
        duration: 4000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (currentStep >= 3) return

    let fieldsToValidate: (keyof InviteForm)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['type', 'role']
      if (inviteType === "email") {
        fieldsToValidate.push('email')
      }
    } else if (currentStep === 2) {
      fieldsToValidate = ['institution', 'expiresIn']
    }

    const isValid = await form.trigger(fieldsToValidate)
    
    if (!isValid) {
      toast.error("⚠️ Please fill in all required fields before continuing.", {
        duration: 4000
      })
      return
    }

    toast.success("✅ Step completed!", { duration: 1500 })
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("📋 Link copied to clipboard!", { duration: 3000 })
    } catch (error) {
      toast.error("❌ Failed to copy link", { duration: 4000 })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Invite New Member
          </DialogTitle>
          <DialogDescription>
            Send a secure invitation for new members to join the system
          </DialogDescription>
          
          {/* Progress */}
          <div className="space-y-2 pt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Step {currentStep} of 3
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Invitation Type & Role */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Alert>
                  <UserPlus className="h-4 w-4" />
                  <AlertTitle>Invitation Setup</AlertTitle>
                  <AlertDescription>
                    Configure the type of invitation and member role
                  </AlertDescription>
                </Alert>

                {/* Invitation Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">Invitation Type</FormLabel>
                      <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-12">
                          <TabsTrigger value="email" className="flex items-center gap-2 h-10">
                            <Mail className="w-4 h-4" />
                            Email Invitation
                          </TabsTrigger>
                          <TabsTrigger value="link" className="flex items-center gap-2 h-10">
                            <LinkIcon className="w-4 h-4" />
                            Shareable Link
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="email" className="mt-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Email Invitation</CardTitle>
                              <CardDescription>
                                Send invitation directly to specific email address
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem className="space-y-3">
                                    <FormLabel className="text-base font-medium">Email Address</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="member@example.com" 
                                        type="email"
                                        className="h-12 text-base flex-1"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        </TabsContent>
                        
                        <TabsContent value="link" className="mt-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Shareable Link</CardTitle>
                              <CardDescription>
                                Anyone with this link can register with the selected role
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <LinkIcon className="w-4 h-4" />
                                Link will be generated after configuring the options below
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </FormItem>
                  )}
                />

                {/* Role Selection */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="flex items-center gap-2 text-base font-medium">
                        <Shield className="w-5 h-5" />
                        Member Role
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ROLES.map((role) => (
                          <Card 
                            key={role.value}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              field.value === role.value 
                                ? "ring-2 ring-primary bg-accent/50" 
                                : "hover:bg-accent/30"
                            }`}
                            onClick={() => field.onChange(role.value)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  field.value === role.value ? "bg-primary" : "bg-muted"
                                }`} />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{role.label}</div>
                                  <div className="text-xs text-muted-foreground">{role.description}</div>
                                </div>
                                <Badge variant="secondary" className={role.color}>
                                  {role.label}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Institution & Permissions */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Access Configuration</AlertTitle>
                  <AlertDescription>
                    Configure institution access and specific permissions
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="institution"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Institution</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base flex-1">
                              <SelectValue placeholder="Select institution" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INSTITUTIONS.map((institution) => (
                              <SelectItem key={institution.value} value={institution.value}>
                                <div className="py-2">
                                  <span className="font-medium">{institution.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiresIn"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2 text-base font-medium">
                          <Clock className="w-5 h-5" />
                          Invitation Expires
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base flex-1">
                              <SelectValue placeholder="Select expiration time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXPIRY_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Permissions */}
                <FormField
                  control={form.control}
                  name="permissions"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-medium">
                        Specific Permissions (Optional)
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {PERMISSIONS.map((permission) => (
                          <Card 
                            key={permission.value}
                            className={`cursor-pointer transition-all hover:shadow-sm ${
                              field.value?.includes(permission.value)
                                ? "ring-1 ring-primary bg-accent/30" 
                                : "hover:bg-accent/20"
                            }`}
                            onClick={() => {
                              const current = field.value || []
                              const updated = current.includes(permission.value)
                                ? current.filter(p => p !== permission.value)
                                : [...current, permission.value]
                              field.onChange(updated)
                            }}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  field.value?.includes(permission.value) ? "bg-primary" : "bg-muted"
                                }`} />
                                <span className="text-sm font-medium flex-1">{permission.label}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <FormDescription>
                        Select specific permissions for this member role
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Message */}
                {inviteType === "email" && (
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">
                          Personal Message (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add a personal message to the invitation..."
                            className="resize-none text-base flex-1"
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This message will be included in the invitation email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Step 3: Review & Confirm */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Review Invitation</AlertTitle>
                  <AlertDescription>
                    Please review all details before sending the invitation
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Invitation Details */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Invitation Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">
                          {form.getValues("type") === "email" ? "Email" : "Shareable Link"}
                        </Badge>
                      </div>
                      {form.getValues("email") && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">{form.getValues("email")}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Role:</span>
                        <Badge className={ROLES.find(r => r.value === selectedRole)?.color}>
                          {ROLES.find(r => r.value === selectedRole)?.label}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="font-medium">
                          {EXPIRY_OPTIONS.find(o => o.value === form.getValues("expiresIn"))?.label}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Access Details */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Access Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Institution:</span>
                        <span className="font-medium">
                          {INSTITUTIONS.find(i => i.value === form.getValues("institution"))?.label}
                        </span>
                      </div>
                      {form.getValues("permissions") && form.getValues("permissions")!.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Permissions:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {form.getValues("permissions")!.map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {PERMISSIONS.find(p => p.value === perm)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {generatedLink && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Generated Invitation Link</CardTitle>
                      <CardDescription>
                        Share this link with the new member
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Input 
                          value={generatedLink} 
                          readOnly 
                          className="font-mono text-xs flex-1"
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
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Separator />

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center justify-center gap-2 h-12 text-base"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center gap-2 h-12 text-base"
                >
                  Next
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 h-12 text-base min-w-48"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Send Invitation
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
