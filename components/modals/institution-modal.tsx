"use client"

import React, { useState } from "react"
import { useInstitutions } from "@/hooks/use-institutions"
import { useInstitution } from "@/contexts/institution-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Building2 } from "lucide-react"
import toast from "react-hot-toast"

// Schema de validação
const institutionSchema = z.object({
  name: z.string().min(2, "Institution name must be at least 2 characters"),
  denomination: z.string().min(2, "Denomination must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  language_preference: z.enum(["en", "nl"], {
    required_error: "Please select a language preference",
  }),
  description: z.string().optional(),
})

type InstitutionFormData = z.infer<typeof institutionSchema>

interface InstitutionModalProps {
  children: React.ReactNode
  mode?: "create" | "edit"
  initialData?: Partial<InstitutionFormData>
  onSuccess?: (data: InstitutionFormData) => void
}

export function InstitutionModal({
  children,
  mode = "create",
  initialData,
  onSuccess
}: InstitutionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<InstitutionFormData>({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      name: initialData?.name || "",
      denomination: initialData?.denomination || "SDA",
      country: initialData?.country || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      language_preference: initialData?.language_preference || "en",
      description: initialData?.description || "",
    },
  })

  const { createInstitution, refetchInstitutions } = useInstitutions();
  const { setActiveInstitution } = useInstitution();

  const onSubmit = async (data: InstitutionFormData) => {
    setIsLoading(true);
    const loadingToast = toast.loading(
      mode === "create"
        ? "🏢 Creating new institution..."
        : "✏️ Updating institution..."
    );

    try {
      // Chamada real da mutation
      const variables = {
        name: data.name,
        denomination: data.denomination,
        description: data.description || null,
        contactEmail: data.email,
        contactPhone: data.phone || null,
        contactFullAddress: data.address || null,
        contactCountry: data.country || null,
        languagePreference: data.language_preference,
      };
      const result = await createInstitution({ variables });

      // Refetch institutions para atualizar lista global
      refetchInstitutions();

      toast.dismiss(loadingToast);
      toast.success(
        mode === "create"
          ? `🎉 Institution \"${data.name}\" created successfully!`
          : `✅ Institution \"${data.name}\" updated successfully!`,
        { duration: 4000 }
      );

      // Reset form
      if (mode === "create") {
        form.reset();
      }

      // Call success callback
      onSuccess?.(data);

      // Close modal
      setIsOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        mode === "create"
          ? "❌ Failed to create institution"
          : "❌ Failed to update institution"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {mode === "create" ? "Create New Institution" : "Edit Institution"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter institution name"
                          className="bg-background border-border h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="denomination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Denomination *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., SDA, Baptist, Methodist"
                          className="bg-background border-border h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter country"
                          className="bg-background border-border h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language_preference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language Preference *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-border h-12 text-base">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="nl">Nederlands</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@institution.org"
                          className="bg-background border-border h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          className="bg-background border-border h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full address"
                        className="bg-background border-border min-h-[80px] text-base resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description about the institution"
                        className="bg-background border-border min-h-[80px] text-base resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className="h-12 px-6 text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 text-base bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  mode === "create" ? "Create Institution" : "Update Institution"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
