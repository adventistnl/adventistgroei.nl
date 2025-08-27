"use client"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Search,
  Filter,
  Plus,
  MapPin,
  Clock,
  Users,
  Globe,
  Heart,
  CalendarDays,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  Rss,
} from "lucide-react"

const events = [
  {
    id: 1,
    title: "Sunday Worship Service",
    type: "Regular Service",
    date: "2024-01-21",
    time: "10:00 AM",
    location: "Main Sanctuary",
    attendees: 234,
    maxCapacity: 300,
    status: "Active",
    description: "Weekly worship service with sermon and communion",
  },
  {
    id: 2,
    title: "Youth Bible Study",
    type: "Bible Study",
    date: "2024-01-23",
    time: "7:00 PM",
    location: "Youth Hall",
    attendees: 45,
    maxCapacity: 60,
    status: "Active",
    description: "Interactive Bible study for young adults",
  },
  {
    id: 3,
    title: "Community Outreach Program",
    type: "Mission",
    date: "2024-01-25",
    time: "9:00 AM",
    location: "Downtown Community Center",
    attendees: 28,
    maxCapacity: 50,
    status: "Active",
    description: "Food distribution and community service",
  },
  {
    id: 4,
    title: "Evangelism Training Workshop",
    type: "Training",
    date: "2024-01-27",
    time: "2:00 PM",
    location: "Conference Room A",
    attendees: 15,
    maxCapacity: 25,
    status: "Active",
    description: "Training session for evangelism leaders",
  },
]

const missionTrips = [
  {
    id: 1,
    title: "Honduras Medical Mission",
    destination: "Tegucigalpa, Honduras",
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    participants: 12,
    maxParticipants: 20,
    cost: "$1,200",
    status: "Open",
    description: "Medical mission providing healthcare to underserved communities",
  },
  {
    id: 2,
    title: "Philippines Education Mission",
    destination: "Manila, Philippines",
    startDate: "2024-05-10",
    endDate: "2024-05-24",
    participants: 8,
    maxParticipants: 15,
    cost: "$1,800",
    status: "Open",
    description: "Educational support and English teaching mission",
  },
  {
    id: 3,
    title: "Kenya Water Project",
    destination: "Nairobi, Kenya",
    startDate: "2024-07-08",
    endDate: "2024-07-21",
    participants: 18,
    maxParticipants: 18,
    cost: "$2,100",
    status: "Full",
    description: "Clean water infrastructure development project",
  },
]

const volunteerOpportunities = [
  {
    id: 1,
    title: "Children's Ministry Helper",
    department: "Children's Ministry",
    timeCommitment: "2 hours/week",
    volunteers: 8,
    needed: 12,
    status: "Open",
    description: "Assist with Sunday school and children's activities",
  },
  {
    id: 2,
    title: "Food Bank Coordinator",
    department: "Community Service",
    timeCommitment: "4 hours/week",
    volunteers: 3,
    needed: 5,
    status: "Urgent",
    description: "Organize and distribute food to families in need",
  },
  {
    id: 3,
    title: "Music Ministry Pianist",
    department: "Music Ministry",
    timeCommitment: "3 hours/week",
    volunteers: 2,
    needed: 3,
    status: "Open",
    description: "Provide piano accompaniment for worship services",
  },
]

const getEventTypeBadgeColor = (type: string) => {
  switch (type) {
    case "Regular Service":
      return "bg-[#2b7fff] text-white"
    case "Bible Study":
      return "bg-[#00c950] text-white"
    case "Mission":
      return "bg-[#ad46ff] text-white"
    case "Training":
      return "bg-[#efb100] text-white"
    default:
      return "bg-[#717182] text-white"
  }
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
    case "Open":
      return "bg-[#00c950] text-white"
    case "Full":
      return "bg-[#717182] text-white"
    case "Urgent":
      return "bg-[#ff7c7c] text-white"
    default:
      return "bg-[#717182] text-white"
  }
}

export default function EventsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [eventType, setEventType] = useState("")
  const [createNews, setCreateNews] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    location: "",
    maxCapacity: "",
    cost: "",
    institutionId: "",
    churchId: "",
    destination: "",
    duration: "",
    department: "",
    timeCommitment: "",
    skillsRequired: "",
    newsTitle: "",
    newsContent: "",
    language: "en",
  })

  const router = useRouter()

  const resetForm = () => {
    setCurrentStep(1)
    setEventType("")
    setCreateNews(false)
    setFormData({
      title: "",
      description: "",
      eventType: "",
      date: "",
      time: "",
      endDate: "",
      endTime: "",
      location: "",
      maxCapacity: "",
      cost: "",
      institutionId: "",
      churchId: "",
      destination: "",
      duration: "",
      department: "",
      timeCommitment: "",
      skillsRequired: "",
      newsTitle: "",
      newsContent: "",
      language: "en",
    })
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    console.log("[v0] Submitting event:", formData)
    console.log("[v0] Create news:", createNews)
    setIsCreateModalOpen(false)
    resetForm()
  }

  const institutions = [
    { id: "1", name: "Grace Community Church" },
    { id: "2", name: "Faith Baptist Church" },
    { id: "3", name: "Hope Methodist Church" },
  ]

  const churches = [
    { id: "1", name: "Main Campus", institutionId: "1" },
    { id: "2", name: "North Campus", institutionId: "1" },
    { id: "3", name: "Downtown Campus", institutionId: "2" },
  ]

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Event Type & Basic Information"
      case 2:
        return "Event Details & Scheduling"
      case 3:
        return "Additional Options & News"
      case 4:
        return "Review & Submit"
      default:
        return "Create Event"
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Choose the type of event and provide basic information"
      case 2:
        return "Set the date, time, location and other event details"
      case 3:
        return "Configure additional options and optionally create a news announcement"
      case 4:
        return "Review all information before creating the event"
      default:
        return ""
    }
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Event Management</h2>
            <p className="text-muted-foreground">Manage church events, mission trips, and volunteer opportunities</p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search events..." className="pl-10 w-80 bg-card border-border" />
              </div>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] bg-card border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl">{getStepTitle()}</DialogTitle>
                  <p className="text-muted-foreground">{getStepDescription()}</p>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {step < currentStep ? <Check className="w-4 h-4" /> : step}
                      </div>
                      {step < 4 && (
                        <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Event Type & Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-foreground text-base font-medium">Select Event Type</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            type: "church-event",
                            label: "Church Event",
                            icon: Calendar,
                            description: "Regular services, bible studies, workshops",
                          },
                          {
                            type: "mission-trip",
                            label: "Mission Trip",
                            icon: Globe,
                            description: "International missions and outreach",
                          },
                          {
                            type: "volunteer",
                            label: "Volunteer Opportunity",
                            icon: Heart,
                            description: "Ministry roles and community service",
                          },
                        ].map((option) => (
                          <div
                            key={option.type}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${eventType === option.type
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                              }`}
                            onClick={() => {
                              setEventType(option.type)
                              setFormData({ ...formData, eventType: option.type })
                            }}
                          >
                            <option.icon className="w-6 h-6 text-primary mb-2" />
                            <h3 className="font-medium text-foreground">{option.label}</h3>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="institution" className="text-foreground">
                          Institution *
                        </Label>
                        <Select
                          value={formData.institutionId}
                          onValueChange={(value) => setFormData({ ...formData, institutionId: value })}
                        >
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue placeholder="Select institution" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {institutions.map((institution) => (
                              <SelectItem key={institution.id} value={institution.id}>
                                {institution.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="church" className="text-foreground">
                          Church *
                        </Label>
                        <Select
                          value={formData.churchId}
                          onValueChange={(value) => setFormData({ ...formData, churchId: value })}
                          disabled={!formData.institutionId}
                        >
                          <SelectTrigger className="bg-card border-border">
                            <SelectValue placeholder="Select church" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {churches
                              .filter((church) => church.institutionId === formData.institutionId)
                              .map((church) => (
                                <SelectItem key={church.id} value={church.id}>
                                  {church.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-foreground">
                        Event Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter event title"
                        className="bg-card border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-foreground">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the event"
                        className="bg-card border-border min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Event Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-foreground">
                          Start Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="bg-card border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time" className="text-foreground">
                          Start Time *
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="bg-card border-border"
                        />
                      </div>
                    </div>

                    {eventType === "mission-trip" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="endDate" className="text-foreground">
                            End Date *
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="bg-card border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination" className="text-foreground">
                            Destination *
                          </Label>
                          <Input
                            id="destination"
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            placeholder="e.g., Manila, Philippines"
                            className="bg-card border-border"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-foreground">
                        {eventType === "mission-trip" ? "Meeting Location" : "Location"} *
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder={eventType === "mission-trip" ? "Departure location" : "Event location"}
                        className="bg-card border-border"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxCapacity" className="text-foreground">
                          {eventType === "volunteer" ? "Volunteers Needed" : "Max Capacity"} *
                        </Label>
                        <Input
                          id="maxCapacity"
                          type="number"
                          value={formData.maxCapacity}
                          onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                          placeholder="Enter number"
                          className="bg-card border-border"
                        />
                      </div>
                      {(eventType === "mission-trip" || eventType === "church-event") && (
                        <div className="space-y-2">
                          <Label htmlFor="cost" className="text-foreground">
                            Cost (Optional)
                          </Label>
                          <Input
                            id="cost"
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            placeholder="e.g., $50 or Free"
                            className="bg-card border-border"
                          />
                        </div>
                      )}
                    </div>

                    {eventType === "volunteer" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-foreground">
                            Department *
                          </Label>
                          <Input
                            id="department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            placeholder="e.g., Children's Ministry"
                            className="bg-card border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeCommitment" className="text-foreground">
                            Time Commitment *
                          </Label>
                          <Input
                            id="timeCommitment"
                            value={formData.timeCommitment}
                            onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                            placeholder="e.g., 2 hours/week"
                            className="bg-card border-border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Additional Options & News */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="createNews" checked={createNews} onCheckedChange={setCreateNews} />
                        <Label htmlFor="createNews" className="text-foreground font-medium">
                          Create news announcement for this event
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatically create a news post to announce this event to your community
                      </p>
                    </div>

                    {createNews && (
                      <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 mb-4">
                          <Rss className="w-5 h-5 text-primary" />
                          <h3 className="font-medium text-foreground">News Announcement</h3>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newsTitle" className="text-foreground">
                            News Title
                          </Label>
                          <Input
                            id="newsTitle"
                            value={formData.newsTitle}
                            onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
                            placeholder="Auto-filled from event title"
                            className="bg-card border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newsContent" className="text-foreground">
                            News Content
                          </Label>
                          <Textarea
                            id="newsContent"
                            value={formData.newsContent}
                            onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
                            placeholder="Auto-filled from event description"
                            className="bg-card border-border min-h-[120px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="language" className="text-foreground">
                            Language
                          </Label>
                          <Select
                            value={formData.language}
                            onValueChange={(value) => setFormData({ ...formData, language: value })}
                          >
                            <SelectTrigger className="bg-card border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="pt">Portuguese</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {eventType === "volunteer" && (
                      <div className="space-y-2">
                        <Label htmlFor="skillsRequired" className="text-foreground">
                          Skills Required (Optional)
                        </Label>
                        <Textarea
                          id="skillsRequired"
                          value={formData.skillsRequired}
                          onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
                          placeholder="List any specific skills or qualifications needed"
                          className="bg-card border-border"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-foreground">Event Summary</h3>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">Event Type</p>
                          <p className="font-medium text-foreground capitalize">{eventType?.replace("-", " ")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Title</p>
                          <p className="font-medium text-foreground">{formData.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date & Time</p>
                          <p className="font-medium text-foreground">
                            {formData.date} at {formData.time}
                            {formData.endDate && ` - ${formData.endDate}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium text-foreground">{formData.location}</p>
                        </div>
                        {formData.destination && (
                          <div>
                            <p className="text-sm text-muted-foreground">Destination</p>
                            <p className="font-medium text-foreground">{formData.destination}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {eventType === "volunteer" ? "Volunteers Needed" : "Max Capacity"}
                          </p>
                          <p className="font-medium text-foreground">{formData.maxCapacity}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Description</p>
                        <p className="text-foreground">{formData.description}</p>
                      </div>

                      {createNews && (
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <h4 className="font-medium text-foreground mb-2">News Announcement</h4>
                          <p className="text-sm text-muted-foreground mb-1">
                            Title: {formData.newsTitle || formData.title}
                          </p>
                          <p className="text-sm text-muted-foreground">Language: {formData.language.toUpperCase()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="border-border bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreateModalOpen(false)
                        resetForm()
                      }}
                      className="border-border"
                    >
                      Cancel
                    </Button>
                    {currentStep === 4 ? (
                      <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Create Event
                      </Button>
                    ) : (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs for different event types */}
          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="bg-[#ffffff] border border-[#e1e2e2]">
              <TabsTrigger value="events" className="data-[state=active]:bg-[#2b7fff] data-[state=active]:text-white">
                Church Events
              </TabsTrigger>
              <TabsTrigger value="missions" className="data-[state=active]:bg-[#2b7fff] data-[state=active]:text-white">
                Mission Trips
              </TabsTrigger>
              <TabsTrigger value="volunteers" className="data-[state=active]:bg-[#2b7fff] data-[state=active]:text-white">
                Volunteer Opportunities
              </TabsTrigger>
            </TabsList>

            {/* Church Events Tab */}
            <TabsContent value="events">
              <Card className="bg-[#ffffff] border-[#e1e2e2]">
                <CardHeader>
                  <CardTitle className="text-[#000000]">Upcoming Church Events</CardTitle>
                  <CardDescription className="text-[#717182]">
                    {events.length} events scheduled with online registration available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[#717182]">Event</TableHead>
                        <TableHead className="text-[#717182]">Date & Time</TableHead>
                        <TableHead className="text-[#717182]">Location</TableHead>
                        <TableHead className="text-[#717182]">Attendance</TableHead>
                        <TableHead className="text-[#717182]">Status</TableHead>
                        <TableHead className="text-[#717182]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-[#000000]">{event.title}</div>
                              <Badge className={`mt-1 ${getEventTypeBadgeColor(event.type)}`}>{event.type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-[#000000] flex items-center">
                                <CalendarDays className="w-3 h-3 mr-2 text-[#717182]" />
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-[#000000] flex items-center">
                                <Clock className="w-3 h-3 mr-2 text-[#717182]" />
                                {event.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-[#000000] flex items-center">
                              <MapPin className="w-3 h-3 mr-2 text-[#717182]" />
                              {event.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-[#000000] flex items-center">
                              <Users className="w-3 h-3 mr-2 text-[#717182]" />
                              {event.attendees}/{event.maxCapacity}
                            </div>
                            <div className="w-full bg-[#e1e2e2] rounded-full h-2 mt-1">
                              <div
                                className="bg-[#2b7fff] h-2 rounded-full"
                                style={{ width: `${(event.attendees / event.maxCapacity) * 100}%` }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(event.status)}>{event.status}</Badge>
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
                                    setEditingEvent(event)
                                    setIsEditModalOpen(true)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-foreground hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    router.push(`/events/${event.id}`)
                                  }}
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  View Registrations
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive hover:bg-muted cursor-pointer">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancel Event
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

            {/* Mission Trips Tab */}
            <TabsContent value="missions">
              <Card className="bg-[#ffffff] border-[#e1e2e2]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-[#000000]">Mission Trip Opportunities</CardTitle>
                    <CardDescription className="text-[#717182] flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-[#717182]" />
                      {missionTrips.map((trip) => (
                        <div key={trip.id}>{trip.destination}</div>
                      ))}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {missionTrips.map((trip) => (
                      <Card key={trip.id} className="border-[#e1e2e2]">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg text-[#000000]">{trip.title}</CardTitle>
                            <Badge className={getStatusBadgeColor(trip.status)}>{trip.status}</Badge>
                          </div>
                          <CardDescription className="text-[#717182] flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-[#717182]" />
                            {trip.destination}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-[#000000]">
                              <CalendarDays className="w-4 h-4 mr-2 text-[#717182]" />
                              {new Date(trip.startDate).toLocaleDateString()} -{" "}
                              {new Date(trip.endDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-[#000000]">
                              <Users className="w-4 h-4 mr-2 text-[#717182]" />
                              {trip.participants}/{trip.maxParticipants} participants
                            </div>
                            <div className="flex items-center text-sm text-[#000000]">
                              <DollarSign className="w-4 h-4 mr-2 text-[#717182]" />
                              {trip.cost} per person
                            </div>
                          </div>
                          <p className="text-sm text-[#717182]">{trip.description}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-[#2b7fff] hover:bg-[#1e5fd9] text-white"
                              disabled={trip.status === "Full"}
                            >
                              {trip.status === "Full" ? "Full" : "Register"}
                            </Button>
                            <Button size="sm" variant="outline" className="border-[#e1e2e2] bg-transparent">
                              Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Volunteer Opportunities Tab */}
            <TabsContent value="volunteers">
              <Card className="bg-[#ffffff] border-[#e1e2e2]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-[#000000]">Volunteer Opportunities</CardTitle>
                    <CardDescription className="text-[#717182]">
                      Join our ministry teams and serve the community
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {volunteerOpportunities.map((opportunity) => (
                      <Card key={opportunity.id} className="border-[#e1e2e2]">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg text-[#000000]">{opportunity.title}</CardTitle>
                            <Badge className={getStatusBadgeColor(opportunity.status)}>{opportunity.status}</Badge>
                          </div>
                          <CardDescription className="text-[#717182]">{opportunity.department}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-[#000000]">
                              <Clock className="w-4 h-4 mr-2 text-[#717182]" />
                              {opportunity.timeCommitment}
                            </div>
                            <div className="flex items-center text-sm text-[#000000]">
                              <Users className="w-4 h-4 mr-2 text-[#717182]" />
                              {opportunity.volunteers}/{opportunity.needed} volunteers
                            </div>
                          </div>
                          <p className="text-sm text-[#717182]">{opportunity.description}</p>
                          <div className="w-full bg-[#e1e2e2] rounded-full h-2">
                            <div
                              className="bg-[#00c950] h-2 rounded-full"
                              style={{ width: `${(opportunity.volunteers / opportunity.needed) * 100}%` }}
                            ></div>
                          </div>
                          <Button className="w-full bg-[#00c950] hover:bg-[#00a843] text-white">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Volunteer
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Event Statistics */}
          <div className="grid grid-cols-4 gap-6 mt-8">
            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Total Events</CardTitle>
                <Calendar className="h-4 w-4 text-[#717182]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">{events.length}</div>
                <p className="text-xs text-[#00c950]">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Mission Trips</CardTitle>
                <Globe className="h-4 w-4 text-[#717182]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">{missionTrips.length}</div>
                <p className="text-xs text-[#717182]">Available trips</p>
              </CardContent>
            </Card>

            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Volunteer Roles</CardTitle>
                <Heart className="h-4 w-4 text-[#717182]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">{volunteerOpportunities.length}</div>
                <p className="text-xs text-[#717182]">Open positions</p>
              </CardContent>
            </Card>

            <Card className="bg-[#ffffff] border-[#e1e2e2]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#717182]">Total Registrations</CardTitle>
                <Users className="h-4 w-4 text-[#717182]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000000]">
                  {events.reduce((sum, event) => sum + event.attendees, 0)}
                </div>
                <p className="text-xs text-[#00c950]">+15% from last month</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[800px] bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">Edit Event</DialogTitle>
              <p className="text-muted-foreground">Update event information and settings</p>
            </DialogHeader>

            {/* Reuse the same wizard component but in edit mode */}
            {editingEvent && (
              <div className="space-y-6">
                {/* Event editing form would go here - similar to create wizard */}
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Edit functionality will be implemented here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will reuse the same wizard component from event creation
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
