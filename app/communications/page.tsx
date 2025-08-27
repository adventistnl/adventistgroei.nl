"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Send,
  Mail,
  Bell,
  Globe,
  Users,
  Calendar,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppLayout } from "@/components/layouts/app-layout"
import { useState } from "react"

const communications = [
  {
    id: 1,
    institution_id: "inst_1",
    title: "Youth Evangelism Campaign Launch",
    content:
      "We're excited to announce the launch of our new youth evangelism campaign targeting young adults in the downtown area.",
    type: "announcement",
    priority: "high",
    status: "scheduled",
    audience: "all",
    languages: "English,Spanish,Portuguese",
    schedule_at: "2024-01-22T10:00:00Z",
    published_at: null,
    author_id: "user_1",
    author_name: "Maria Rodriguez",
    author_role: "Evangelism Leader",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    views: 0,
  },
  {
    id: 2,
    institution_id: "inst_1",
    title: "Mission Trip to Honduras - Registration Open",
    content:
      "Registration is now open for our medical mission trip to Honduras. Join us in serving communities in need.",
    type: "event",
    priority: "medium",
    status: "published",
    audience: "all",
    languages: "English,Spanish",
    schedule_at: "2024-01-19T09:00:00Z",
    published_at: "2024-01-19T09:00:00Z",
    author_id: "user_2",
    author_name: "Dr. John Smith",
    author_role: "Church Leader",
    created_at: "2024-01-19T08:30:00Z",
    updated_at: "2024-01-19T08:30:00Z",
    views: 156,
  },
]

const directMessages = [
  {
    id: 1,
    institution_id: "inst_1",
    sender_id: "user_1",
    sender_name: "Maria Rodriguez",
    title: "Budget Approval for Youth Campaign",
    content:
      "Great news! The budget for our youth evangelism campaign has been approved. We can now proceed with the planned activities.",
    status: "read",
    created_at: "2024-01-20T14:30:00Z",
    sent_at: "2024-01-20T14:30:00Z",
    recipients: ["Evangelism Team"],
    priority: "high",
    hasAttachment: true,
  },
  {
    id: 2,
    institution_id: "inst_1",
    sender_id: "user_2",
    sender_name: "Dr. John Smith",
    title: "Honduras Trip - Final Preparations",
    content:
      "As we approach our departure date, here are the final preparations needed for our mission trip to Honduras.",
    status: "sent",
    created_at: "2024-01-20T10:15:00Z",
    sent_at: "2024-01-20T10:15:00Z",
    recipients: ["Mission Volunteers"],
    priority: "medium",
    hasAttachment: false,
  },
]

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-green-600 text-white"
    case "scheduled":
      return "bg-yellow-600 text-white"
    case "draft":
      return "bg-muted text-muted-foreground"
    case "archived":
      return "bg-gray-500 text-white"
    case "read":
      return "bg-blue-600 text-white"
    case "sent":
      return "bg-green-600 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-600 text-white"
    case "high":
      return "bg-orange-600 text-white"
    case "medium":
      return "bg-blue-600 text-white"
    case "low":
      return "bg-green-600 text-white"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "published":
      return <CheckCircle className="w-4 h-4" />
    case "scheduled":
      return <Clock className="w-4 h-4" />
    case "draft":
      return <Edit className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
  }
}

export default function CommunicationsPage() {
  const [isNewCommunicationOpen, setIsNewCommunicationOpen] = useState(false)
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isDeleteMessageModalOpen, setIsDeleteMessageModalOpen] = useState(false)
  const [isEditMessageModalOpen, setIsEditMessageModalOpen] = useState(false)
  const [isDeleteCommModalOpen, setIsDeleteCommModalOpen] = useState(false)
  const [isEditCommModalOpen, setIsEditCommModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [selectedComm, setSelectedComm] = useState<any>(null)
  const [communicationType, setCommunicationType] = useState("")
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])

  const templates = [
    {
      id: 1,
      name: "Weekly Announcement",
      type: "announcement",
      priority: "medium",
      title: "Weekly Church Announcements",
      content:
        "Dear church family,\n\nHere are this week's important announcements:\n\n• [Add announcement 1]\n• [Add announcement 2]\n• [Add announcement 3]\n\nBlessings,\n[Your Name]",
      audience: "all",
      languages: "English",
      category: "Regular",
    },
    {
      id: 2,
      name: "Mission Trip Invitation",
      type: "event",
      priority: "high",
      title: "Join Our Mission Trip to [Destination]",
      content:
        "We are excited to invite you to join our upcoming mission trip to [destination]. This is an opportunity to serve communities in need and share God's love.\n\nDates: [Insert dates]\nCost: [Insert cost]\nDeadline: [Insert deadline]\n\nFor more information, contact [contact person].",
      audience: "all",
      languages: "English,Spanish",
      category: "Mission",
    },
    {
      id: 3,
      name: "Budget Approval Request",
      type: "announcement",
      priority: "high",
      title: "Budget Approval Required for [Project Name]",
      content:
        "Dear leadership team,\n\nWe are requesting budget approval for [project name]. Please find the details below:\n\nProject: [Project name]\nBudget: [Amount]\nPurpose: [Purpose]\nTimeline: [Timeline]\n\nPlease review and provide your approval.\n\nThank you,\n[Your Name]",
      audience: "leaders",
      languages: "English",
      category: "Administrative",
    },
  ]

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template)
    setCommunicationType(template.type)
    setIsTemplateModalOpen(false)
    setIsNewCommunicationOpen(true)
  }

  const handleRecipientChange = (recipient: string, checked: boolean) => {
    if (checked) {
      setSelectedRecipients([...selectedRecipients, recipient])
    } else {
      setSelectedRecipients(selectedRecipients.filter((r) => r !== recipient))
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Communication Center</h2>
          <p className="text-muted-foreground">Manage announcements, messages, and international communications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Communications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {communications.filter((c) => c.status === "published").length}
              </div>
              <p className="text-xs text-green-600">
                {communications.filter((c) => c.status === "scheduled").length} scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Direct Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {directMessages.filter((m) => m.status === "sent").length}
              </div>
              <p className="text-xs text-muted-foreground">Total: {directMessages.length}</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Languages Supported</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">6</div>
              <p className="text-xs text-muted-foreground">International reach</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {communications.reduce((sum, c) => sum + c.views, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total views</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search communications..." className="pl-10 w-80 bg-card border-border" />
            </div>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex gap-2">
            <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl">New Direct Message</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Send a direct message to specific users or groups
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="message-title" className="text-foreground">
                      Title *
                    </Label>
                    <Input
                      id="message-title"
                      placeholder="Enter message title"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Recipients *</Label>
                    <div className="grid grid-cols-2 gap-4 p-4 border border-border rounded-lg bg-background">
                      {[
                        "All Members",
                        "Church Leaders",
                        "Evangelism Team",
                        "Financial Officers",
                        "Volunteers",
                        "Mission Team",
                      ].map((recipient) => (
                        <div key={recipient} className="flex items-center space-x-2">
                          <Checkbox
                            id={recipient}
                            checked={selectedRecipients.includes(recipient)}
                            onCheckedChange={(checked) => handleRecipientChange(recipient, checked as boolean)}
                          />
                          <Label htmlFor={recipient} className="text-sm text-foreground">
                            {recipient}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message-priority" className="text-foreground">
                      Priority
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message-content" className="text-foreground">
                      Message Content *
                    </Label>
                    <Textarea
                      id="message-content"
                      placeholder="Enter your message content here..."
                      className="bg-background border-border min-h-[150px]"
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsNewMessageOpen(false)}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      Cancel
                    </Button>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isNewCommunicationOpen} onOpenChange={setIsNewCommunicationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Communication
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground text-xl">New Communication</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Create announcements, events, reminders, or newsletters
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="comm-type" className="text-foreground">
                        Communication Type *
                      </Label>
                      <Select value={communicationType} onValueChange={setCommunicationType}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comm-priority" className="text-foreground">
                        Priority
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comm-title" className="text-foreground">
                      Title *
                    </Label>
                    <Input
                      id="comm-title"
                      placeholder="Enter communication title"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="comm-audience" className="text-foreground">
                        Target Audience
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="all">All Members</SelectItem>
                          <SelectItem value="members">Members Only</SelectItem>
                          <SelectItem value="leaders">Church Leaders</SelectItem>
                          <SelectItem value="custom">Custom Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comm-languages" className="text-foreground">
                        Languages
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select languages" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="nl">Dutch</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="twi">Twi</SelectItem>
                          <SelectItem value="pap">Papiamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comm-content" className="text-foreground">
                      Content *
                    </Label>
                    <Textarea
                      id="comm-content"
                      placeholder="Enter your communication content here..."
                      className="bg-background border-border min-h-[200px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comm-schedule" className="text-foreground">
                      Schedule Date (Optional)
                    </Label>
                    <Input type="datetime-local" id="comm-schedule" className="bg-background border-border" />
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsNewCommunicationOpen(false)}
                      className="border-border text-foreground hover:bg-muted"
                    >
                      Cancel
                    </Button>
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                      Save Draft
                    </Button>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Publish Now
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="communications" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger
              value="communications"
              className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
            >
              Communications
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Direct Messages
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Templates
            </TabsTrigger>
          </TabsList>

          {/* Communications Tab */}
          <TabsContent value="communications">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Church Communications</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage announcements, events, reminders, and newsletters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground">Communication</TableHead>
                      <TableHead className="text-muted-foreground">Author</TableHead>
                      <TableHead className="text-muted-foreground">Audience & Languages</TableHead>
                      <TableHead className="text-muted-foreground">Schedule</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Views</TableHead>
                      <TableHead className="text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communications.map((communication) => (
                      <TableRow key={communication.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{communication.title}</div>
                            <div className="text-sm text-muted-foreground mt-1 max-w-xs truncate">
                              {communication.content}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Badge className={getPriorityBadgeColor(communication.priority)}>
                                {communication.priority}
                              </Badge>
                              <Badge className="bg-muted text-muted-foreground">{communication.type}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm text-foreground">{communication.author_name}</div>
                            <div className="text-xs text-muted-foreground">{communication.author_role}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="text-sm text-foreground flex items-center">
                              <Users className="w-3 h-3 mr-2 text-muted-foreground" />
                              {communication.audience}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {communication.languages
                                .split(",")
                                .slice(0, 2)
                                .map((lang, index) => (
                                  <Badge key={index} className="bg-blue-600 text-white text-xs">
                                    {lang.trim()}
                                  </Badge>
                                ))}
                              {communication.languages.split(",").length > 2 && (
                                <Badge className="bg-muted text-muted-foreground text-xs">
                                  +{communication.languages.split(",").length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-foreground flex items-center">
                              <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                              {new Date(communication.schedule_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Created: {new Date(communication.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusBadgeColor(communication.status)} flex items-center gap-1 w-fit`}
                          >
                            {getStatusIcon(communication.status)}
                            {communication.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-foreground">{communication.views}</div>
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
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-foreground hover:bg-muted"
                                onClick={() => {
                                  setSelectedComm(communication)
                                  setIsEditCommModalOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-foreground hover:bg-muted">
                                <Send className="mr-2 h-4 w-4" />
                                Send Now
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 hover:bg-muted"
                                onClick={() => {
                                  setSelectedComm(communication)
                                  setIsDeleteCommModalOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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

          {/* Direct Messages Tab */}
          <TabsContent value="messages">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Direct Messages</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Direct communication between team members and departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {directMessages.map((message) => (
                    <div key={message.id} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-medium text-foreground">{message.title}</div>
                            <Badge className={getPriorityBadgeColor(message.priority)}>{message.priority}</Badge>
                            <Badge className={getStatusBadgeColor(message.status)}>{message.status}</Badge>
                            {message.hasAttachment && (
                              <Badge className="bg-muted text-muted-foreground">Attachment</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            From: <span className="text-foreground">{message.sender_name}</span> • To:{" "}
                            <span className="text-foreground">{message.recipients.join(", ")}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">{message.content}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(message.sent_at).toLocaleString()}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem className="text-foreground hover:bg-muted">
                              <Eye className="mr-2 h-4 w-4" />
                              View Full
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-foreground hover:bg-muted"
                              onClick={() => {
                                setSelectedMessage(message)
                                setIsEditMessageModalOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-foreground hover:bg-muted">
                              <Send className="mr-2 h-4 w-4" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 hover:bg-muted"
                              onClick={() => {
                                setSelectedMessage(message)
                                setIsDeleteMessageModalOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Communication Templates</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Pre-built templates for common communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <Card key={template.id} className="bg-background border-border">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm text-foreground">{template.name}</CardTitle>
                          <Badge className="bg-muted text-muted-foreground">{template.category}</Badge>
                        </div>
                        <CardDescription className="text-muted-foreground">
                          {template.type} • {template.priority} priority
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="font-medium text-foreground text-sm mb-1">{template.title}</div>
                            <div className="text-xs text-muted-foreground line-clamp-3">{template.content}</div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              <Badge className={getPriorityBadgeColor(template.priority)} className="text-xs">
                                {template.priority}
                              </Badge>
                              <Badge className="bg-blue-600 text-white text-xs">{template.audience}</Badge>
                            </div>
                            <Button
                              size="sm"
                              className="bg-gray-900 hover:bg-gray-800 text-white"
                              onClick={() => handleUseTemplate(template)}
                            >
                              Use Template
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
          <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">Use Template: {selectedTemplate?.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Template information has been pre-filled. You can modify as needed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Communication Type</Label>
                  <Input value={selectedTemplate?.type || ""} className="bg-background border-border" readOnly />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Priority</Label>
                  <Input value={selectedTemplate?.priority || ""} className="bg-background border-border" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Title</Label>
                <Input value={selectedTemplate?.title || ""} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Content</Label>
                <Textarea
                  value={selectedTemplate?.content || ""}
                  className="bg-background border-border min-h-[200px]"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Create Communication</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteMessageModalOpen} onOpenChange={setIsDeleteMessageModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Delete Message</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this message? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteMessageModalOpen(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">Delete Message</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditMessageModalOpen} onOpenChange={setIsEditMessageModalOpen}>
          <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">Edit Message</DialogTitle>
              <DialogDescription className="text-muted-foreground">Update the message details below</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-foreground">Title</Label>
                <Input value={selectedMessage?.title || ""} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Content</Label>
                <Textarea
                  value={selectedMessage?.content || ""}
                  className="bg-background border-border min-h-[150px]"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditMessageModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Update Message</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteCommModalOpen} onOpenChange={setIsDeleteCommModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Delete Communication</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this communication? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteCommModalOpen(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">Delete Communication</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditCommModalOpen} onOpenChange={setIsEditCommModalOpen}>
          <DialogContent className="sm:max-w-[700px] bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground text-xl">Edit Communication</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update the communication details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-foreground">Title</Label>
                <Input value={selectedComm?.title || ""} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Content</Label>
                <Textarea value={selectedComm?.content || ""} className="bg-background border-border min-h-[200px]" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditCommModalOpen(false)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white">Update Communication</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
