"use client"

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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Clock,
  Users,
  Heart,
  Award,
  Calendar,
  Mail,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  CheckCircle,
  Globe,
  ArrowRight,
  ArrowLeft,
  Check,
  DollarSign,
  MapPin,
  FileText,
  Rss,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppLayout } from "@/components/layouts/app-layout"

const volunteers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-03-15",
    totalHours: 156,
    status: "Active",
    skills: ["Teaching", "Music", "Administration"],
    availability: "Weekends",
    currentRoles: ["Children's Ministry", "Music Team"],
    lastActivity: "2024-01-20",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2023-07-22",
    totalHours: 89,
    status: "Active",
    skills: ["Technology", "Photography", "Youth Work"],
    availability: "Evenings",
    currentRoles: ["Tech Team", "Youth Ministry"],
    lastActivity: "2024-01-19",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2022-11-08",
    totalHours: 234,
    status: "Active",
    skills: ["Counseling", "Languages", "Community Outreach"],
    availability: "Flexible",
    currentRoles: ["Community Service", "Translation Team"],
    lastActivity: "2024-01-21",
  },
  {
    id: 4,
    name: "David Thompson",
    email: "david.thompson@email.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2023-01-12",
    totalHours: 67,
    status: "Inactive",
    skills: ["Construction", "Maintenance", "Security"],
    availability: "Weekends",
    currentRoles: ["Facilities Team"],
    lastActivity: "2023-12-15",
  },
]

const opportunities = [
  {
    id: 1,
    title: "Children's Sunday School Teacher",
    department: "Children's Ministry",
    timeCommitment: "2 hours/week",
    volunteers: 8,
    needed: 12,
    status: "Open",
    urgency: "Medium",
    description: "Teach Sunday school classes for ages 6-10",
    requirements: ["Background check", "Teaching experience preferred"],
    coordinator: "Sarah Williams",
  },
  {
    id: 2,
    title: "Food Bank Coordinator",
    department: "Community Service",
    timeCommitment: "4 hours/week",
    volunteers: 3,
    needed: 5,
    status: "Urgent",
    urgency: "High",
    description: "Organize and distribute food to families in need",
    requirements: ["Physical ability to lift boxes", "Reliable transportation"],
    coordinator: "Michael Brown",
  },
  {
    id: 3,
    title: "Youth Group Leader",
    department: "Youth Ministry",
    timeCommitment: "3 hours/week",
    volunteers: 5,
    needed: 8,
    status: "Open",
    urgency: "Medium",
    description: "Lead weekly youth group activities and mentorship",
    requirements: ["Youth ministry experience", "Background check"],
    coordinator: "Emily Davis",
  },
  {
    id: 4,
    title: "Mission Trip Coordinator",
    department: "Missions",
    timeCommitment: "5 hours/week",
    volunteers: 2,
    needed: 3,
    status: "Open",
    urgency: "Low",
    description: "Plan and coordinate international mission trips",
    requirements: ["Travel experience", "Organizational skills", "Bilingual preferred"],
    coordinator: "John Martinez",
  },
]

const ministryTeams = [
  {
    name: "Children's Ministry",
    volunteers: 15,
    coordinator: "Sarah Williams",
    description: "Sunday school, VBS, and children's programs",
    color: "bg-[#2b7fff]",
  },
  {
    name: "Youth Ministry",
    volunteers: 12,
    coordinator: "Emily Davis",
    description: "Teen programs, youth group, and mentorship",
    color: "bg-[#00c950]",
  },
  {
    name: "Music Team",
    volunteers: 18,
    coordinator: "David Johnson",
    description: "Worship music, choir, and special performances",
    color: "bg-[#ad46ff]",
  },
  {
    name: "Community Service",
    volunteers: 22,
    coordinator: "Michael Brown",
    description: "Food bank, outreach, and community programs",
    color: "bg-[#efb100]",
  },
  {
    name: "Tech Team",
    volunteers: 8,
    coordinator: "Alex Chen",
    description: "Audio/visual, livestream, and technical support",
    color: "bg-[#ff7c7c]",
  },
  {
    name: "Facilities Team",
    volunteers: 10,
    coordinator: "Robert Wilson",
    description: "Maintenance, setup, and building management",
    color: "bg-[#717182]",
  },
]

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
    case "Open":
      return "bg-green-600 text-white"
    case "Inactive":
      return "bg-muted text-muted-foreground"
    case "Urgent":
      return "bg-red-600 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getUrgencyBadgeColor = (urgency: string) => {
  switch (urgency) {
    case "High":
      return "bg-red-600 text-white"
    case "Medium":
      return "bg-yellow-600 text-white"
    case "Low":
      return "bg-green-600 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function VolunteersPage() {
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [missionProject, setMissionProject] = useState({
    title: "",
    description: "",
    country: "",
    budget: "",
    budgetPerPerson: "",
    mediaLink: "",
    language: "en",
    createNews: true,
    newsTitle: "",
    newsContent: "",
  })

  const countries = [
    "Brazil",
    "Mexico",
    "India",
    "Philippines",
    "Kenya",
    "Guatemala",
    "Honduras",
    "Peru",
    "Colombia",
    "Ecuador",
    "Bolivia",
    "Paraguay",
    "Uganda",
    "Tanzania",
    "Rwanda",
    "Ghana",
    "Nigeria",
    "Cambodia",
    "Vietnam",
    "Thailand",
    "Myanmar",
    "Bangladesh",
    "Nepal",
    "Haiti",
  ]

  const languages = [
    { value: "en", label: "English" },
    { value: "pt", label: "Portuguese" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ]

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // Here you would submit the mission project data
    setIsMissionModalOpen(false)
    setCurrentStep(1)
    setMissionProject({
      title: "",
      description: "",
      country: "",
      budget: "",
      budgetPerPerson: "",
      mediaLink: "",
      language: "en",
      createNews: true,
      newsTitle: "",
      newsContent: "",
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Project Details</h3>
              <p className="text-sm text-muted-foreground">Provide basic information about the missionary project</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Project Title *
                </Label>
                <Input
                  id="title"
                  value={missionProject.title}
                  onChange={(e) => setMissionProject({ ...missionProject, title: e.target.value })}
                  placeholder="e.g., Medical Mission to Guatemala"
                  className="bg-card border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Project Description *
                </Label>
                <Textarea
                  id="description"
                  value={missionProject.description}
                  onChange={(e) => setMissionProject({ ...missionProject, description: e.target.value })}
                  placeholder="Describe the mission project, its goals, and activities..."
                  rows={4}
                  className="bg-card border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaLink" className="text-foreground">
                  Media Link (Optional)
                </Label>
                <Input
                  id="mediaLink"
                  value={missionProject.mediaLink}
                  onChange={(e) => setMissionProject({ ...missionProject, mediaLink: e.target.value })}
                  placeholder="https://example.com/project-video"
                  className="bg-card border-border"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Budget Configuration</h3>
              <p className="text-sm text-muted-foreground">Set the total budget and per-person costs for the mission</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-foreground">
                  Total Budget *
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={missionProject.budget}
                  onChange={(e) => setMissionProject({ ...missionProject, budget: e.target.value })}
                  placeholder="10000"
                  className="bg-card border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetPerPerson" className="text-foreground">
                  Budget Per Person *
                </Label>
                <Input
                  id="budgetPerPerson"
                  type="number"
                  value={missionProject.budgetPerPerson}
                  onChange={(e) => setMissionProject({ ...missionProject, budgetPerPerson: e.target.value })}
                  placeholder="1500"
                  className="bg-card border-border"
                />
              </div>

              {missionProject.budget && missionProject.budgetPerPerson && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Estimated Participants</div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.floor(Number(missionProject.budget) / Number(missionProject.budgetPerPerson))} people
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Location & Language</h3>
              <p className="text-sm text-muted-foreground">Select the destination country and project language</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-foreground">
                  Destination Country *
                </Label>
                <Select
                  value={missionProject.country}
                  onValueChange={(value) => setMissionProject({ ...missionProject, country: value })}
                >
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-foreground">
                  Project Language *
                </Label>
                <Select
                  value={missionProject.language}
                  onValueChange={(value) => setMissionProject({ ...missionProject, language: value })}
                >
                  <SelectTrigger className="bg-card border-border">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Rss className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">News & Review</h3>
              <p className="text-sm text-muted-foreground">Create announcement and review your mission project</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="createNews"
                  checked={missionProject.createNews}
                  onCheckedChange={(checked) =>
                    setMissionProject({ ...missionProject, createNews: checked as boolean })
                  }
                />
                <Label htmlFor="createNews" className="text-foreground">
                  Create news announcement for this mission project
                </Label>
              </div>

              {missionProject.createNews && (
                <div className="space-y-4 border border-border rounded-lg p-4">
                  <div className="space-y-2">
                    <Label htmlFor="newsTitle" className="text-foreground">
                      News Title
                    </Label>
                    <Input
                      id="newsTitle"
                      value={missionProject.newsTitle || `New Mission Opportunity: ${missionProject.title}`}
                      onChange={(e) => setMissionProject({ ...missionProject, newsTitle: e.target.value })}
                      className="bg-card border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newsContent" className="text-foreground">
                      News Content
                    </Label>
                    <Textarea
                      id="newsContent"
                      value={
                        missionProject.newsContent ||
                        `We're excited to announce a new mission opportunity: ${missionProject.title} in ${missionProject.country}. ${missionProject.description}`
                      }
                      onChange={(e) => setMissionProject({ ...missionProject, newsContent: e.target.value })}
                      rows={3}
                      className="bg-card border-border"
                    />
                  </div>
                </div>
              )}

              <div className="bg-muted p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-foreground">Project Summary</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Title:</span> {missionProject.title}
                  </div>
                  <div>
                    <span className="font-medium">Country:</span> {missionProject.country}
                  </div>
                  <div>
                    <span className="font-medium">Total Budget:</span> ${missionProject.budget}
                  </div>
                  <div>
                    <span className="font-medium">Per Person:</span> ${missionProject.budgetPerPerson}
                  </div>
                  <div>
                    <span className="font-medium">Language:</span>{" "}
                    {languages.find((l) => l.value === missionProject.language)?.label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">


        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Volunteer Management</h2>
            <p className="text-muted-foreground">Manage volunteers, opportunities, and ministry teams</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Volunteers</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {volunteers.filter((v) => v.status === "Active").length}
                </div>
                <p className="text-xs text-green-600">+5 this month</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {volunteers.reduce((sum, v) => sum + v.totalHours, 0)}
                </div>
                <p className="text-xs text-muted-foreground">This year</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {opportunities.reduce((sum, opp) => sum + (opp.needed - opp.volunteers), 0)}
                </div>
                <p className="text-xs text-red-600">
                  {opportunities.filter((opp) => opp.status === "Urgent").length} urgent
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ministry Teams</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{ministryTeams.length}</div>
                <p className="text-xs text-muted-foreground">Active departments</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search volunteers..." className="pl-10 w-80 bg-card border-border" />
              </div>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Volunteer
              </Button>
              <Dialog open={isMissionModalOpen} onOpenChange={setIsMissionModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Globe className="w-4 h-4 mr-2" />
                    Create Mission Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-foreground text-xl">Create Mission Project</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Step {currentStep} of 4: Create a new missionary volunteer opportunity
                    </DialogDescription>
                  </DialogHeader>

                  {/* Step Indicator */}
                  <div className="flex items-center justify-center space-x-2 py-4">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep
                              ? "bg-blue-600 text-white"
                              : step < currentStep
                                ? "bg-green-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {step < currentStep ? <Check className="w-4 h-4" /> : step}
                        </div>
                        {step < 4 && (
                          <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-green-600" : "bg-muted"}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step Content */}
                  <div className="py-6">{renderStepContent()}</div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={currentStep === 1}
                      className="border-border bg-transparent"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        onClick={handleNextStep}
                        disabled={
                          (currentStep === 1 && (!missionProject.title || !missionProject.description)) ||
                          (currentStep === 2 && (!missionProject.budget || !missionProject.budgetPerPerson)) ||
                          (currentStep === 3 && (!missionProject.country || !missionProject.language))
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="w-4 h-4 mr-2" />
                        Create Project
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="volunteers" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="volunteers" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                Volunteers
              </TabsTrigger>
              <TabsTrigger
                value="opportunities"
                className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                Opportunities
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
                Ministry Teams
              </TabsTrigger>
            </TabsList>

            {/* Volunteers Tab */}
            <TabsContent value="volunteers">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Volunteer Directory</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage volunteer information, skills, and assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground">Volunteer</TableHead>
                        <TableHead className="text-muted-foreground">Contact</TableHead>
                        <TableHead className="text-muted-foreground">Skills & Availability</TableHead>
                        <TableHead className="text-muted-foreground">Current Roles</TableHead>
                        <TableHead className="text-muted-foreground">Hours</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {volunteers.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">{volunteer.name}</div>
                              <div className="text-sm text-muted-foreground flex items-center mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                Joined {new Date(volunteer.joinDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-foreground flex items-center">
                                <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                                {volunteer.email}
                              </div>
                              <div className="text-sm text-foreground flex items-center">
                                <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                                {volunteer.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1">
                                {volunteer.skills.slice(0, 2).map((skill, index) => (
                                  <Badge key={index} className="bg-blue-600 text-white text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {volunteer.skills.length > 2 && (
                                  <Badge className="bg-muted text-muted-foreground text-xs">
                                    +{volunteer.skills.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {volunteer.availability}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {volunteer.currentRoles.map((role, index) => (
                                <div key={index} className="text-sm text-foreground">
                                  {role}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium text-foreground">{volunteer.totalHours}h</div>
                            <div className="text-xs text-muted-foreground">
                              Last: {new Date(volunteer.lastActivity).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(volunteer.status)}>{volunteer.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                <DropdownMenuItem className="text-foreground hover:bg-muted">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-foreground hover:bg-muted">
                                  <Award className="mr-2 h-4 w-4" />
                                  View Hours
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-foreground hover:bg-muted">
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Assign Role
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 hover:bg-muted">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
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

            {/* Opportunities Tab */}
            <TabsContent value="opportunities">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-foreground">{opportunity.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadgeColor(opportunity.status)}>{opportunity.status}</Badge>
                          <Badge className={getUrgencyBadgeColor(opportunity.urgency)}>{opportunity.urgency}</Badge>
                        </div>
                      </div>
                      <CardDescription className="text-muted-foreground">{opportunity.department}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-foreground">
                          <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                          {opportunity.timeCommitment}
                        </div>
                        <div className="flex items-center text-sm text-foreground">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {opportunity.volunteers}/{opportunity.needed} volunteers
                        </div>
                        <div className="flex items-center text-sm text-foreground">
                          <UserCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                          Coordinator: {opportunity.coordinator}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Requirements:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {opportunity.requirements.map((req, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(opportunity.volunteers / opportunity.needed) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          disabled={opportunity.volunteers >= opportunity.needed}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          {opportunity.volunteers >= opportunity.needed ? "Full" : "Apply"}
                        </Button>
                        <Button size="sm" variant="outline" className="border-border bg-transparent">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Ministry Teams Tab */}
            <TabsContent value="teams">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ministryTeams.map((team, index) => (
                  <Card key={index} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${team.color}`}></div>
                        <CardTitle className="text-lg text-foreground">{team.name}</CardTitle>
                      </div>
                      <CardDescription className="text-muted-foreground">{team.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-foreground">
                          <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                          {team.volunteers} volunteers
                        </div>
                        <div className="flex items-center text-sm text-foreground">
                          <UserCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                          Coordinator: {team.coordinator}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1 border-border bg-transparent">
                          <Users className="w-4 h-4 mr-2" />
                          View Team
                        </Button>
                        <Button size="sm" variant="outline" className="border-border bg-transparent">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
