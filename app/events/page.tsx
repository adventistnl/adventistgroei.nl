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
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar as BigCalendar, momentLocalizer, Views, Event as CalendarEvent, View } from "react-big-calendar"
import moment from "moment"
import "moment/locale/pt-br"

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
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react"

// Configurar moment com locale português brasileiro
moment.locale('pt-br')
const localizer = momentLocalizer(moment)

// Eventos expandidos com dados de todo o ano para demonstrar KPIs
const events = [
  // Janeiro 2025
  {
    id: 1,
    title: "Sunday Worship Service",
    type: "Regular Service",
    date: "2025-01-05",
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
    date: "2025-01-08",
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
    date: "2025-01-12",
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
    date: "2025-01-15",
    time: "2:00 PM",
    location: "Conference Room A",
    attendees: 15,
    maxCapacity: 25,
    status: "Active",
    description: "Training session for evangelism leaders",
  },
  // Fevereiro 2025
  {
    id: 5,
    title: "Valentine's Day Service",
    type: "Regular Service",
    date: "2025-02-14",
    time: "6:00 PM",
    location: "Main Sanctuary",
    attendees: 180,
    maxCapacity: 300,
    status: "Active",
    description: "Special service celebrating love and relationships",
  },
  {
    id: 6,
    title: "Marriage Enrichment Retreat",
    type: "Training",
    date: "2025-02-21",
    time: "9:00 AM",
    location: "Conference Center",
    attendees: 40,
    maxCapacity: 50,
    status: "Active",
    description: "Weekend retreat for married couples",
  },
  // Março 2025
  {
    id: 7,
    title: "Spring Revival Week",
    type: "Regular Service",
    date: "2025-03-10",
    time: "7:00 PM",
    location: "Main Sanctuary",
    attendees: 450,
    maxCapacity: 500,
    status: "Active",
    description: "Week-long revival meetings with guest speakers",
  },
  {
    id: 8,
    title: "Easter Celebration",
    type: "Regular Service",
    date: "2025-03-31",
    time: "10:00 AM",
    location: "Main Sanctuary",
    attendees: 500,
    maxCapacity: 500,
    status: "Full",
    description: "Easter Sunday celebration service",
  },
  // Abril 2025
  {
    id: 9,
    title: "Children's Ministry Training",
    type: "Training",
    date: "2025-04-05",
    time: "2:00 PM",
    location: "Youth Hall",
    attendees: 20,
    maxCapacity: 30,
    status: "Active",
    description: "Training for children's ministry volunteers",
  },
  {
    id: 10,
    title: "Community Health Fair",
    type: "Mission",
    date: "2025-04-19",
    time: "10:00 AM",
    location: "Church Parking Lot",
    attendees: 200,
    maxCapacity: 300,
    status: "Active",
    description: "Free health screenings and wellness education",
  },
  // Setembro-Outubro 2025 (eventos atuais)
  {
    id: 11,
    title: "Fall Harvest Festival",
    type: "Regular Service",
    date: "2025-10-05",
    time: "3:00 PM",
    location: "Church Grounds",
    attendees: 250,
    maxCapacity: 400,
    status: "Active",
    description: "Annual harvest celebration with food and activities",
  },
  {
    id: 12,
    title: "Prayer Week",
    type: "Regular Service",
    date: "2025-10-08",
    time: "7:00 PM",
    location: "Prayer Room",
    attendees: 80,
    maxCapacity: 100,
    status: "Active",
    description: "Week of prayer and spiritual renewal",
  },
  // Novembro 2025
  {
    id: 13,
    title: "Thanksgiving Service",
    type: "Regular Service",
    date: "2025-11-27",
    time: "10:00 AM",
    location: "Main Sanctuary",
    attendees: 320,
    maxCapacity: 400,
    status: "Active",
    description: "Special Thanksgiving gratitude service",
  },
  // Dezembro 2025
  {
    id: 14,
    title: "Christmas Concert",
    type: "Regular Service",
    date: "2025-12-21",
    time: "6:00 PM",
    location: "Main Sanctuary",
    attendees: 400,
    maxCapacity: 500,
    status: "Active",
    description: "Annual Christmas musical presentation",
  },
  {
    id: 15,
    title: "Christmas Eve Service",
    type: "Regular Service",
    date: "2025-12-24",
    time: "7:00 PM",
    location: "Main Sanctuary",
    attendees: 480,
    maxCapacity: 500,
    status: "Active",
    description: "Christmas Eve candlelight service",
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
      return "bg-blue-500 text-white"
    case "Bible Study":
      return "bg-green-500 text-white"
    case "Mission":
      return "bg-purple-500 text-white"
    case "Training":
      return "bg-amber-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
    case "Open":
      return "bg-green-500 text-white"
    case "Full":
      return "bg-gray-500 text-white"
    case "Urgent":
      return "bg-red-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export default function EventsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [eventType, setEventType] = useState("")
  const [createNews, setCreateNews] = useState(false)
  const [calendarView, setCalendarView] = useState<View>(Views.MONTH)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(moment())
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

  // Atualizar horário atual a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Função para calcular KPIs por período
  const calculateEventStats = useMemo(() => {
    const now = moment()
    const currentYear = now.year()
    const currentMonth = now.month()
    const startOfWeek = now.clone().startOf('week')
    const endOfWeek = now.clone().endOf('week')

    const totalEvents = events.length
    
    const yearlyEvents = events.filter(event => 
      moment(event.date).year() === currentYear
    ).length

    const monthlyEvents = events.filter(event => {
      const eventDate = moment(event.date)
      return eventDate.year() === currentYear && eventDate.month() === currentMonth
    }).length

    const weeklyEvents = events.filter(event => {
      const eventDate = moment(event.date)
      return eventDate.isBetween(startOfWeek, endOfWeek, null, '[]')
    }).length

    const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0)
    
    return {
      total: totalEvents,
      yearly: yearlyEvents,
      monthly: monthlyEvents,
      weekly: weeklyEvents,
      totalAttendees
    }
  }, [])

  // Converter eventos para formato do calendário
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: moment(`${event.date} ${event.time}`, 'YYYY-MM-DD HH:mm A').toDate(),
      end: moment(`${event.date} ${event.time}`, 'YYYY-MM-DD HH:mm A').add(2, 'hours').toDate(),
      resource: {
        type: event.type,
        location: event.location,
        attendees: event.attendees,
        maxCapacity: event.maxCapacity,
        description: event.description
      }
    }))
  }, [])

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

  const handleEventStyleGetter = (event: CalendarEvent) => {
    const eventType = event.resource?.type
    let backgroundColor = 'hsl(var(--primary))'
    
    switch (eventType) {
      case 'Regular Service':
        backgroundColor = '#3b82f6'
        break
      case 'Bible Study':
        backgroundColor = '#10b981'
        break
      case 'Mission':
        backgroundColor = '#8b5cf6'
        break
      case 'Training':
        backgroundColor = '#f59e0b'
        break
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        padding: '2px 6px',
      }
    }
  }

  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Gestão de Eventos</h2>
            <p className="text-muted-foreground">Gerencie eventos da igreja, viagens missionárias e oportunidades de voluntariado</p>
          </div>

          {/* KPIs por Período */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Geral</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{calculateEventStats.total}</div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Todos os eventos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Este Ano</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{calculateEventStats.yearly}</div>
                <p className="text-xs text-blue-600">2025</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Este Mês</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{calculateEventStats.monthly}</div>
                <p className="text-xs text-purple-600">{moment().format('MMMM')}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Esta Semana</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{calculateEventStats.weekly}</div>
                <p className="text-xs text-amber-600">Eventos ativos</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Buscar eventos..." className="pl-10 w-80 bg-card border-border" />
              </div>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Evento
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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

                {/* Formulário das etapas será omitido para brevidade */}
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Formulário de criação de eventos (etapas 1-4)</p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="border-border bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
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
                      Cancelar
                    </Button>
                    {currentStep === 4 ? (
                      <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Criar Evento
                      </Button>
                    ) : (
                      <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Calendário Principal */}
          <Card className="bg-card border-border mb-8">
            {/* <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-foreground flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    {moment(selectedDate).format('MMMM YYYY')}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {currentTime.format('dddd, DD [de] MMMM [de] YYYY')} • {currentTime.format('HH:mm')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={calendarView === Views.MONTH ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView(Views.MONTH)}
                  >
                    Mês
                  </Button>
                  <Button
                    variant={calendarView === Views.WEEK ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView(Views.WEEK)}
                  >
                    Semana
                  </Button>
                  <Button
                    variant={calendarView === Views.DAY ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView(Views.DAY)}
                  >
                    Dia
                  </Button>
                  <Button
                    variant={calendarView === Views.AGENDA ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView(Views.AGENDA)}
                  >
                    Agenda
                  </Button>
                </div>
              </div>
            </CardHeader> */}
            <CardContent className="p-6">
              <div style={{ height: '600px' }}>
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  view={calendarView}
                  onView={setCalendarView}
                  date={selectedDate}
                  onNavigate={(date) => {
                    setSelectedDate(date)
                    setCurrentTime(moment())
                  }}
                  eventPropGetter={handleEventStyleGetter}
                  popup
                  showMultiDayTimes
                  step={30}
                  showAllEvents
                  culture="pt-BR"
                  messages={{
                    next: "Próximo",
                    previous: "Anterior", 
                    today: "Hoje",
                    month: "Mês",
                    week: "Semana",
                    day: "Dia", 
                    agenda: "Agenda",
                    date: "Data",
                    time: "Horário",
                    event: "Evento",
                    allDay: "Dia todo",
                    noEventsInRange: "Nenhum evento neste período",
                    showMore: (total) => `+ Ver mais ${total}`
                  }}
                  formats={{
                    monthHeaderFormat: 'MMMM YYYY',
                    dayHeaderFormat: 'dddd DD/MM',
                    dayRangeHeaderFormat: ({ start, end }) => 
                      `${moment(start).format('DD/MM')} — ${moment(end).format('DD/MM')}`,
                    agendaHeaderFormat: ({ start, end }) => 
                      `${moment(start).format('DD/MM/YYYY')} — ${moment(end).format('DD/MM/YYYY')}`,
                    dateFormat: 'DD',
                    dayFormat: 'DD/MM',
                    weekdayFormat: 'ddd',
                    timeGutterFormat: 'HH:mm',
                    eventTimeRangeFormat: ({ start, end }) => 
                      `${moment(start).format('HH:mm')} — ${moment(end).format('HH:mm')}`
                  }}
                  onSelectEvent={(event) => {
                    // Aqui você pode abrir um modal com detalhes do evento
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabs para diferentes tipos de eventos */}
          <Tabs defaultValue="events" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Eventos da Igreja
              </TabsTrigger>
              <TabsTrigger value="missions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Viagens Missionárias
              </TabsTrigger>
              <TabsTrigger value="volunteers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Oportunidades de Voluntariado
              </TabsTrigger>
            </TabsList>

            {/* Church Events Tab */}
            <TabsContent value="events">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Próximos Eventos da Igreja</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {events.length} eventos agendados com inscrição online disponível
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground">Evento</TableHead>
                        <TableHead className="text-muted-foreground">Data & Horário</TableHead>
                        <TableHead className="text-muted-foreground">Local</TableHead>
                        <TableHead className="text-muted-foreground">Participação</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.slice(0, 6).map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">{event.title}</div>
                              <Badge className={`mt-1 ${getEventTypeBadgeColor(event.type)}`}>{event.type}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-foreground flex items-center">
                                <CalendarDays className="w-3 h-3 mr-2 text-muted-foreground" />
                                {moment(event.date).format('DD/MM/YYYY')}
                              </div>
                              <div className="text-sm text-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-2 text-muted-foreground" />
                                {event.time}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground flex items-center">
                              <MapPin className="w-3 h-3 mr-2 text-muted-foreground" />
                              {event.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-foreground flex items-center">
                              <Users className="w-3 h-3 mr-2 text-muted-foreground" />
                              {event.attendees}/{event.maxCapacity}
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mt-1">
                              <div
                                className="bg-primary h-2 rounded-full"
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
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-foreground hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    router.push(`/events/${event.id}`)
                                  }}
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Ver Inscrições
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive hover:bg-muted cursor-pointer">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancelar Evento
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
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Oportunidades de Viagem Missionária</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Participe de missões ao redor do mundo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {missionTrips.map((trip) => (
                      <Card key={trip.id} className="border-border">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg text-foreground">{trip.title}</CardTitle>
                            <Badge className={getStatusBadgeColor(trip.status)}>{trip.status}</Badge>
                          </div>
                          <CardDescription className="text-muted-foreground flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                            {trip.destination}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-foreground">
                              <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
                              {moment(trip.startDate).format('DD/MM/YYYY')} - {moment(trip.endDate).format('DD/MM/YYYY')}
                            </div>
                            <div className="flex items-center text-sm text-foreground">
                              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                              {trip.participants}/{trip.maxParticipants} participantes
                            </div>
                            <div className="flex items-center text-sm text-foreground">
                              <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                              {trip.cost} por pessoa
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{trip.description}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                              disabled={trip.status === "Full"}
                            >
                              {trip.status === "Full" ? "Lotado" : "Inscrever-se"}
                            </Button>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              Detalhes
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
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Oportunidades de Voluntariado</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Junte-se às nossas equipes de ministério e sirva à comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {volunteerOpportunities.map((opportunity) => (
                      <Card key={opportunity.id} className="border-border">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg text-foreground">{opportunity.title}</CardTitle>
                            <Badge className={getStatusBadgeColor(opportunity.status)}>{opportunity.status}</Badge>
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
                              {opportunity.volunteers}/{opportunity.needed} voluntários
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(opportunity.volunteers / opportunity.needed) * 100}%` }}
                            ></div>
                          </div>
                          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Voluntariar-se
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}