"use client"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Edit, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppLayout } from "@/components/layouts/app-layout"

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id

  // Mock event data - in real app, fetch based on eventId
  const event = {
    id: eventId,
    title: "Youth Ministry Conference",
    type: "Church Event",
    date: "2024-03-15",
    time: "09:00",
    location: "Main Sanctuary",
    description: "Annual youth ministry conference with workshops and activities",
    capacity: 100,
    registered: 45,
    status: "Active",
  }

  // Mock registrations data
  const registrations = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@email.com",
      phone: "+55 11 99999-9999",
      registeredAt: "2024-01-15",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "+55 11 88888-8888",
      registeredAt: "2024-01-16",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro@email.com",
      phone: "+55 11 77777-7777",
      registeredAt: "2024-01-17",
      status: "Pending",
    },
    {
      id: 4,
      name: "Ana Oliveira",
      email: "ana@email.com",
      phone: "+55 11 66666-6666",
      registeredAt: "2024-01-18",
      status: "Confirmed",
    },
    {
      id: 5,
      name: "Carlos Lima",
      email: "carlos@email.com",
      phone: "+55 11 55555-5555",
      registeredAt: "2024-01-19",
      status: "Confirmed",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-foreground hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{event.title}</h1>
                <p className="text-muted-foreground">Event Details & Registrations</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Edit className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
            </div>
          </div>

          {/* Event Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {event.registered}/{event.capacity} registered
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Registration Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{event.registered}</div>
                  <div className="text-muted-foreground">Total Registrations</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confirmed</span>
                    <span className="text-foreground">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="text-foreground">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="text-foreground">{event.capacity}</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-foreground h-2 rounded-full"
                    style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registrations Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Event Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Phone</TableHead>
                    <TableHead className="text-muted-foreground">Registered</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{registration.name}</TableCell>
                      <TableCell className="text-muted-foreground">{registration.email}</TableCell>
                      <TableCell className="text-muted-foreground">{registration.phone}</TableCell>
                      <TableCell className="text-muted-foreground">{registration.registeredAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant={registration.status === "Confirmed" ? "default" : "secondary"}
                          className={
                            registration.status === "Confirmed"
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {registration.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
