"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Download,
  Eye,
  MoreHorizontal,
  Edit,
  AlertCircle,
  Trash2,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { AppLayout } from "@/components/layouts/app-layout"
import { useState } from "react"

const subsidyRequests = [
  {
    id: "SUB-2024-001",
    title: "Youth Evangelism Campaign",
    requestedBy: "Maria Rodriguez",
    role: "Evangelism Leader",
    requestedAmount: 5000,
    approvedAmount: 4500,
    status: "Approved",
    submissionDate: "2024-01-15",
    approvalDate: "2024-01-18",
    deadline: "2024-01-21",
    activities: [
      { name: "Promotional Materials", budget: 1500, approved: 1200 },
      { name: "Venue Rental", budget: 2000, approved: 2000 },
      { name: "Equipment Rental", budget: 1000, approved: 800 },
      { name: "Refreshments", budget: 500, approved: 500 },
    ],
    receiptsUploaded: 3,
    receiptsRequired: 4,
    description: "Community outreach program targeting young adults in downtown area",
    institution: "North American Division",
    church: "Grace Community Church",
    budget: 5000,
  },
  {
    id: "SUB-2024-002",
    title: "Medical Mission Preparation",
    requestedBy: "Dr. John Smith",
    role: "Church Leader",
    requestedAmount: 8000,
    approvedAmount: 0,
    status: "Under Review",
    submissionDate: "2024-01-20",
    approvalDate: null,
    deadline: "2024-01-21",
    activities: [
      { name: "Medical Supplies", budget: 4000, approved: 0 },
      { name: "Transportation", budget: 2500, approved: 0 },
      { name: "Accommodation", budget: 1500, approved: 0 },
    ],
    receiptsUploaded: 0,
    receiptsRequired: 0,
    description: "Preparation for Honduras medical mission trip",
    institution: "South American Division",
    church: "Faith Baptist Church",
    budget: 8000,
  },
  {
    id: "SUB-2024-003",
    title: "Community Food Program",
    requestedBy: "Sarah Williams",
    role: "Financial Officer",
    requestedAmount: 3000,
    approvedAmount: 3000,
    status: "Completed",
    submissionDate: "2024-01-10",
    approvalDate: "2024-01-12",
    deadline: "2024-01-21",
    activities: [
      { name: "Food Supplies", budget: 2500, approved: 2500 },
      { name: "Distribution Materials", budget: 500, approved: 500 },
    ],
    receiptsUploaded: 2,
    receiptsRequired: 2,
    description: "Monthly food distribution for families in need",
    institution: "European Division",
    church: "Unity Methodist Church",
    budget: 3000,
  },
  {
    id: "SUB-2024-004",
    title: "Bible Study Materials",
    requestedBy: "Michael Brown",
    role: "Member",
    requestedAmount: 1200,
    approvedAmount: 0,
    status: "Rejected",
    submissionDate: "2024-01-18",
    approvalDate: "2024-01-19",
    deadline: "2024-01-21",
    activities: [
      { name: "Study Guides", budget: 800, approved: 0 },
      { name: "Audio Equipment", budget: 400, approved: 0 },
    ],
    receiptsUploaded: 0,
    receiptsRequired: 0,
    description: "Materials for weekly Bible study sessions",
    institution: "African Division",
    church: "Hope Fellowship",
    budget: 1200,
  },
]

const budgetOverview = {
  totalBudget: 50000,
  allocatedFunds: 32500,
  pendingRequests: 8000,
  availableFunds: 9500,
  completedProjects: 12,
  activeProjects: 3,
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-[#00c950] text-white"
    case "Under Review":
      return "bg-[#efb100] text-white"
    case "Completed":
      return "bg-[#2b7fff] text-white"
    case "Rejected":
      return "bg-[#ff7c7c] text-white"
    case "Pending":
      return "bg-[#717182] text-white"
    default:
      return "bg-[#717182] text-white"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Approved":
    case "Completed":
      return <CheckCircle className="w-4 h-4" />
    case "Under Review":
    case "Pending":
      return <Clock className="w-4 h-4" />
    case "Rejected":
      return <XCircle className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
  }
}

export default function SubsidiesPage() {
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    description: "",
    deadline: "",
    institution_id: "",
    church_id: "",
    activities: [{ name: "", description: "", budget_amount: "", activity_date: "" }],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const institutions = [
    { id: "inst-1", name: "North American Division" },
    { id: "inst-2", name: "South American Division" },
    { id: "inst-3", name: "European Division" },
    { id: "inst-4", name: "African Division" },
  ]

  const churches = [
    { id: "church-1", name: "Grace Community Church", institution_id: "inst-1" },
    { id: "church-2", name: "Hope Fellowship", institution_id: "inst-1" },
    { id: "church-3", name: "Faith Baptist Church", institution_id: "inst-2" },
    { id: "church-4", name: "Unity Methodist Church", institution_id: "inst-2" },
  ]

  const addActivity = () => {
    setFormData((prev) => ({
      ...prev,
      activities: [...prev.activities, { name: "", description: "", budget_amount: "", activity_date: "" }],
    }))
  }

  const removeActivity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index),
    }))
  }

  const updateActivity = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.map((activity, i) => (i === index ? { ...activity, [field]: value } : activity)),
    }))
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.institution_id) newErrors.institution_id = "Institution is required"
    if (!formData.church_id) newErrors.church_id = "Church is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.deadline) newErrors.deadline = "Deadline is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    formData.activities.forEach((activity, index) => {
      if (!activity.name.trim()) {
        newErrors[`activity_name_${index}`] = "Activity name is required"
      }
      if (!activity.budget_amount || Number.parseFloat(activity.budget_amount) <= 0) {
        newErrors[`activity_budget_${index}`] = "Valid budget amount is required"
      }
      if (!activity.activity_date) {
        newErrors[`activity_date_${index}`] = "Activity date is required"
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    let isValid = false
    switch (currentStep) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      default:
        isValid = true
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateTotal = () => {
    return formData.activities.reduce((total, activity) => {
      return total + (Number.parseFloat(activity.budget_amount) || 0)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep2()) {
      console.log("[v0] Submitting subsidy request:", formData)
      setIsNewRequestModalOpen(false)
      setCurrentStep(1)
      setFormData({
        description: "",
        deadline: "",
        institution_id: "",
        church_id: "",
        activities: [{ name: "", description: "", budget_amount: "", activity_date: "" }],
      })
      setErrors({})
    }
  }

  const getFilteredChurches = () => {
    return churches.filter((church) => church.institution_id === formData.institution_id)
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#000000] mb-2">Subsidy Management</h2>
            <p className="text-[#717182]">Manage evangelism subsidies, budgets, and financial accountability</p>
          </div>

          {/* Budget Overview Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-[#717182]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">${budgetOverview.totalBudget.toLocaleString()}</div>
                <p className="text-xs text-[#717182]">Annual allocation</p>
              </CardContent>
            </Card>

            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Allocated Funds</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#00c950]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">${budgetOverview.allocatedFunds.toLocaleString()}</div>
                <p className="text-xs text-[#00c950]">
                  {Math.round((budgetOverview.allocatedFunds / budgetOverview.totalBudget) * 100)}% of budget
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-[#efb100]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">
                  ${budgetOverview.pendingRequests.toLocaleString()}
                </div>
                <p className="text-xs text-[#efb100]">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Available Funds</CardTitle>
                <DollarSign className="h-4 w-4 text-[#2b7fff]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">${budgetOverview.availableFunds.toLocaleString()}</div>
                <p className="text-xs text-[#2b7fff]">Ready to allocate</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search subsidy requests..." className="pl-10 w-80 bg-card border-border" />
              </div>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-foreground text-xl">New Subsidy Request</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Submit a new evangelism subsidy request with detailed budget breakdown
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex items-center justify-between mb-6">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">Project Setup</h3>
                          <p className="text-sm text-muted-foreground">
                            Select the institution and church, then provide project details and deadline
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="institution" className="text-foreground flex items-center gap-2">
                              Institution *{formData.institution_id && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </Label>
                            <Select
                              value={formData.institution_id}
                              onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, institution_id: value, church_id: "" }))
                                setErrors((prev) => ({ ...prev, institution_id: "" }))
                              }}
                            >
                              <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select the institution" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {institutions.map((institution) => (
                                  <SelectItem key={institution.id} value={institution.id}>
                                    {institution.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.institution_id && <p className="text-sm text-destructive">{errors.institution_id}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="church" className="text-foreground flex items-center gap-2">
                              Church *
                              {formData.institution_id && formData.church_id && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </Label>
                            <Select
                              value={formData.church_id}
                              onValueChange={(value) => {
                                setFormData((prev) => ({ ...prev, church_id: value }))
                                setErrors((prev) => ({ ...prev, church_id: "" }))
                              }}
                              disabled={!formData.institution_id}
                            >
                              <SelectTrigger className="bg-background border-border">
                                <SelectValue placeholder="Select the church" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {getFilteredChurches().map((church) => (
                                  <SelectItem key={church.id} value={church.id}>
                                    {church.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.church_id && <p className="text-sm text-destructive">{errors.church_id}</p>}
                            {!formData.institution_id && (
                              <p className="text-xs text-muted-foreground">Please select an institution first</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-foreground">
                            Project Description *
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Describe the evangelism project, its objectives, target audience, and expected outcomes..."
                            value={formData.description}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, description: e.target.value }))
                              setErrors((prev) => ({ ...prev, description: "" }))
                            }}
                            className="bg-background border-border min-h-[120px]"
                          />
                          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deadline" className="text-foreground">
                            Budget Approval Deadline *
                          </Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => {
                              setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                              setErrors((prev) => ({ ...prev, deadline: "" }))
                            }}
                            className="bg-background border-border"
                          />
                          {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
                          <p className="text-xs text-muted-foreground">
                            When do you need the budget approval to proceed with your project?
                          </p>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">Budget Activities</h3>
                          <p className="text-sm text-muted-foreground">
                            Define the specific activities, their dates, and budget requirements for your project
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-foreground text-base">Project Activities *</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addActivity}
                              className="border-border text-foreground hover:bg-muted bg-transparent"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Activity
                            </Button>
                          </div>

                          {formData.activities.map((activity, index) => (
                            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-foreground">Activity {index + 1}</h4>
                                {formData.activities.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeActivity(index)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <Label className="text-foreground">Activity Name *</Label>
                                  <Input
                                    placeholder="e.g., Promotional Materials"
                                    value={activity.name}
                                    onChange={(e) => {
                                      updateActivity(index, "name", e.target.value)
                                      setErrors((prev) => ({ ...prev, [`activity_name_${index}`]: "" }))
                                    }}
                                    className="bg-background border-border"
                                  />
                                  {errors[`activity_name_${index}`] && (
                                    <p className="text-sm text-destructive">{errors[`activity_name_${index}`]}</p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-foreground">Budget Amount *</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={activity.budget_amount}
                                    onChange={(e) => {
                                      updateActivity(index, "budget_amount", e.target.value)
                                      setErrors((prev) => ({ ...prev, [`activity_budget_${index}`]: "" }))
                                    }}
                                    className="bg-background border-border"
                                  />
                                  {errors[`activity_budget_${index}`] && (
                                    <p className="text-sm text-destructive">{errors[`activity_budget_${index}`]}</p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-foreground">Activity Date *</Label>
                                <Input
                                  type="date"
                                  value={activity.activity_date}
                                  onChange={(e) => {
                                    updateActivity(index, "activity_date", e.target.value)
                                    setErrors((prev) => ({ ...prev, [`activity_date_${index}`]: "" }))
                                  }}
                                  className="bg-background border-border"
                                />
                                {errors[`activity_date_${index}`] && (
                                  <p className="text-sm text-destructive">{errors[`activity_date_${index}`]}</p>
                                )}
                                <p className="text-xs text-muted-foreground">When will this activity take place?</p>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-foreground">Activity Description</Label>
                                <Textarea
                                  placeholder="Describe this activity in detail..."
                                  value={activity.description}
                                  onChange={(e) => updateActivity(index, "description", e.target.value)}
                                  className="bg-background border-border"
                                  rows={2}
                                />
                              </div>
                            </div>
                          ))}

                          <div className="bg-muted/50 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <span className="text-foreground font-medium">Total Budget:</span>
                              <span className="text-xl font-bold text-foreground">
                                ${calculateTotal().toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">Review Complete Budget Request</h3>
                          <p className="text-sm text-muted-foreground">
                            Please review all information before submitting your complete subsidy request
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="border border-border rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-foreground">Institution & Church</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Institution:</span>
                                <span className="text-foreground ml-2">
                                  {institutions.find((i) => i.id === formData.institution_id)?.name || "Not selected"}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Church:</span>
                                <span className="text-foreground ml-2">
                                  {churches.find((c) => c.id === formData.church_id)?.name || "Not selected"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border border-border rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-foreground">Project Information</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Description:</span>
                                <p className="text-foreground mt-1">{formData.description}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Budget Approval Deadline:</span>
                                <span className="text-foreground ml-2">
                                  {formData.deadline ? new Date(formData.deadline).toLocaleDateString() : "Not set"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border border-border rounded-lg p-4 space-y-3">
                            <h4 className="font-medium text-foreground">Budget Activities & Schedule</h4>
                            <div className="space-y-3">
                              {formData.activities.map((activity, index) => (
                                <div key={index} className="border border-muted rounded p-3 space-y-2">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-foreground">{activity.name}</h5>
                                      {activity.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                      )}
                                    </div>
                                    <span className="font-medium text-foreground ml-4">
                                      ${Number.parseFloat(activity.budget_amount || "0").toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    <span>Scheduled for: </span>
                                    <span className="text-foreground">
                                      {activity.activity_date
                                        ? new Date(activity.activity_date).toLocaleDateString()
                                        : "Not set"}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              <div className="border-t border-border pt-3 mt-3">
                                <div className="flex justify-between items-center font-medium">
                                  <span className="text-foreground">Total Budget Request:</span>
                                  <span className="text-xl text-foreground">${calculateTotal().toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={currentStep === 1 ? () => setIsNewRequestModalOpen(false) : prevStep}
                        className="border-border text-foreground hover:bg-muted"
                      >
                        {currentStep === 1 ? "Cancel" : "Previous"}
                      </Button>

                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          onClick={nextStep}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Next Step
                        </Button>
                      ) : (
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                          Submit Request
                        </Button>
                      )}
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tabs for different views */}
          <Tabs defaultValue="requests" className="space-y-6">
            <TabsList className="bg-[#ffffff] border border-[#e1e2e2]">
              <TabsTrigger value="requests" className="data-[state=active]:bg-[#2b7fff] data-[state=active]:text-white">
                Subsidy Requests
              </TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-[#2b7fff] data-[state=active]:text-white">
                Approved Projects
              </TabsTrigger>
              <TabsTrigger value="receipts" className="data-[state=active]:bg-[#2b7fff] data-[state=active]:text-white">
                Receipt Management
              </TabsTrigger>
            </TabsList>

            {/* Subsidy Requests Tab */}
            <TabsContent value="requests">
              <Card className="bg-[#ffffff] border-[#e1e2e2]">
                <CardHeader>
                  <CardTitle className="text-[#000000]">Subsidy Requests</CardTitle>
                  <CardDescription className="text-[#717182]">
                    Manage evangelism subsidy applications and approval workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[#717182]">Request ID</TableHead>
                        <TableHead className="text-[#717182]">Project</TableHead>
                        <TableHead className="text-[#717182]">Requested By</TableHead>
                        <TableHead className="text-[#717182]">Amount</TableHead>
                        <TableHead className="text-[#717182]">Status</TableHead>
                        <TableHead className="text-[#717182]">Deadline</TableHead>
                        <TableHead className="text-[#717182]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subsidyRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="font-medium text-[#000000]">{request.id}</div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#000000]">{request.title}</div>
                              <div className="text-sm text-[#717182] mt-1">{request.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm text-[#000000]">{request.requestedBy}</div>
                              <div className="text-xs text-[#717182]">{request.role}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm font-medium text-[#000000]">
                                ${request.requestedAmount.toLocaleString()}
                              </div>
                              {request.approvedAmount > 0 && (
                                <div className="text-xs text-[#00c950]">
                                  Approved: ${request.approvedAmount.toLocaleString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadgeColor(request.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-[#000000]">
                              {new Date(request.deadline).toLocaleDateString()}
                            </div>
                            {new Date(request.deadline) < new Date() && request.status !== "Completed" && (
                              <div className="text-xs text-[#ff7c7c]">Overdue</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                <DropdownMenuItem
                                  className="text-foreground hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsViewDetailsModalOpen(true)
                                  }}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-foreground hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsEditModalOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Request
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-foreground hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setIsReportModalOpen(true)
                                  }}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Generate Report
                                </DropdownMenuItem>
                                {request.status === "Under Review" && (
                                  <>
                                    <DropdownMenuItem className="text-green-600 hover:bg-muted cursor-pointer">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 hover:bg-muted cursor-pointer">
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Approved Projects Tab */}
            <TabsContent value="approved">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subsidyRequests
                  .filter((request) => request.status === "Approved" || request.status === "Completed")
                  .map((request) => (
                    <Card key={request.id} className="bg-[#ffffff] border-[#e1e2e2]">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-[#000000]">{request.title}</CardTitle>
                          <Badge className={getStatusBadgeColor(request.status)}>{request.status}</Badge>
                        </div>
                        <CardDescription className="text-[#717182]">
                          {request.requestedBy} • {request.id}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-[#717182]">Approved Amount:</span>
                            <span className="font-medium text-[#000000]">${request.approvedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[#717182]">Receipts Progress:</span>
                            <span className="text-[#000000]">
                              {request.receiptsUploaded}/{request.receiptsRequired}
                            </span>
                          </div>
                          <Progress
                            value={
                              request.receiptsRequired > 0
                                ? (request.receiptsUploaded / request.receiptsRequired) * 100
                                : 0
                            }
                            className="h-2"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-[#000000]">Budget Breakdown:</h4>
                          {request.activities.map((activity, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-[#717182]">{activity.name}</span>
                              <span className="text-[#000000]">${activity.approved.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 border-[#e1e2e2] bg-transparent">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Receipt
                          </Button>
                          <Button size="sm" variant="outline" className="border-[#e1e2e2] bg-transparent">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Receipt Management Tab */}
            <TabsContent value="receipts">
              <Card className="bg-[#ffffff] border-[#e1e2e2]">
                <CardHeader>
                  <CardTitle className="text-[#000000]">Receipt Management</CardTitle>
                  <CardDescription className="text-[#717182]">
                    Track receipt submissions and financial accountability (Deadline: January 21st)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subsidyRequests
                      .filter((request) => request.status === "Approved" || request.status === "Completed")
                      .map((request) => (
                        <div key={request.id} className="border border-[#e1e2e2] rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-[#000000]">{request.title}</h4>
                              <p className="text-sm text-[#717182]">{request.id}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-[#000000]">
                                {request.receiptsUploaded}/{request.receiptsRequired} receipts
                              </div>
                              <div className="text-xs text-[#717182]">
                                Due: {new Date(request.deadline).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Progress
                            value={
                              request.receiptsRequired > 0
                                ? (request.receiptsUploaded / request.receiptsRequired) * 100
                                : 0
                            }
                            className="h-2 mb-3"
                          />
                          <div className="flex justify-between items-center">
                            <Badge
                              className={
                                request.receiptsUploaded === request.receiptsRequired
                                  ? "bg-[#00c950] text-white"
                                  : new Date(request.deadline) < new Date()
                                    ? "bg-[#ff7c7c] text-white"
                                    : "bg-[#efb100] text-white"
                              }
                            >
                              {request.receiptsUploaded === request.receiptsRequired
                                ? "Complete"
                                : new Date(request.deadline) < new Date()
                                  ? "Overdue"
                                  : "Pending"}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-[#e1e2e2] bg-transparent">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                              <Button size="sm" variant="outline" className="border-[#e1e2e2] bg-transparent">
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isViewDetailsModalOpen} onOpenChange={setIsViewDetailsModalOpen}>
            <DialogContent className="sm:max-w-[800px] bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground text-xl">Request Details</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Complete information about the subsidy request
                </DialogDescription>
              </DialogHeader>

              {selectedRequest && (
                <div className="space-y-6">
                  {/* Request Information */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Request Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Request ID</p>
                        <p className="font-medium text-foreground">{selectedRequest.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : selectedRequest.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedRequest.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Institution</p>
                        <p className="font-medium text-foreground">{selectedRequest.institution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Church</p>
                        <p className="font-medium text-foreground">{selectedRequest.church}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Budget</p>
                        <p className="font-medium text-foreground">${selectedRequest.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-medium text-foreground">{selectedRequest.deadline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Project Description</h3>
                    <p className="text-foreground">{selectedRequest.description}</p>
                  </div>

                  {/* Activities */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Budget Activities</h3>
                    <div className="space-y-3">
                      {selectedRequest.activities?.map((activity: any, index: number) => (
                        <div key={index} className="border border-border p-3 rounded-lg bg-card">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-foreground">{activity.name}</h4>
                            <span className="font-semibold text-foreground">${activity.budget}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">Date: {activity.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground text-xl">Edit Subsidy Request</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Update your subsidy request information
                </DialogDescription>
              </DialogHeader>

              {/* Reuse the same wizard component but with edit mode */}
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-foreground" : "bg-muted"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-muted-foreground text-center">
                  Edit mode: All fields are pre-filled with current request data
                </p>

                {/* Navigation buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="border-border"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (currentStep === 3) {
                        // Handle update submission
                        setIsEditModalOpen(false)
                        setCurrentStep(1)
                      } else {
                        setCurrentStep(currentStep + 1)
                      }
                    }}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    {currentStep === 3 ? "Update Request" : "Next"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
            <DialogContent className="sm:max-w-[900px] bg-card border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground text-xl">Generate Report</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Preview and download the subsidy request report
                </DialogDescription>
              </DialogHeader>

              {selectedRequest && (
                <div className="space-y-4">
                  {/* PDF Preview Area */}
                  <div className="bg-muted/30 border-2 border-dashed border-border rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">PDF Report Preview</h3>
                    <p className="text-muted-foreground mb-4">Subsidy Request Report - {selectedRequest.id}</p>
                    <div className="bg-card border border-border rounded-lg p-4 max-w-md w-full text-left">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Institution:</span>
                          <span className="text-foreground">{selectedRequest.institution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Church:</span>
                          <span className="text-foreground">{selectedRequest.church}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Budget:</span>
                          <span className="text-foreground font-semibold">${selectedRequest.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="text-foreground">{selectedRequest.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setIsReportModalOpen(false)} className="border-border">
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Handle PDF download
                        console.log("[v0] Downloading PDF report for request:", selectedRequest.id)
                        setIsReportModalOpen(false)
                      }}
                      className="bg-foreground text-background hover:bg-foreground/90"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AppLayout>
  )
}
