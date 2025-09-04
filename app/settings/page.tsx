import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  User,
  Shield,
  Globe,
  Bell,
  Database,
  Palette,
  Users,
  Mail,
  Lock,
  Download,
  Upload,
  Save,
  RefreshCw,
  Building,
  Church,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  UserCheck,
} from "lucide-react"
import { AppLayout } from "@/components/layouts/app-layout"

const userRoles = [
  {
    name: "Admin",
    description: "Full system access and control",
    permissions: ["All permissions", "User management", "System configuration", "Data export"],
    users: 2,
    color: "bg-foreground",
  },
  {
    name: "Church Leader",
    description: "Church management and oversight",
    permissions: ["Member management", "Event creation", "Volunteer coordination", "Reports viewing"],
    users: 5,
    color: "bg-muted-foreground",
  },
  {
    name: "Evangelism Leader",
    description: "Evangelism project management",
    permissions: ["Subsidy requests", "Project management", "Training access", "Communication tools"],
    users: 8,
    color: "bg-foreground",
  },
  {
    name: "Financial Officer",
    description: "Financial oversight and approval",
    permissions: ["Budget management", "Subsidy approval", "Financial reports", "Audit trails"],
    users: 3,
    color: "bg-muted-foreground",
  },
  {
    name: "Member",
    description: "Basic member access",
    permissions: ["Profile management", "Event registration", "Academy access", "Communication viewing"],
    users: 167,
    color: "bg-muted",
  },
]

const systemLanguages = [
  { code: "en", name: "English", flag: "🇺🇸", enabled: true, completion: 100 },
  { code: "es", name: "Spanish", flag: "🇪🇸", enabled: true, completion: 95 },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", enabled: true, completion: 92 },
  { code: "nl", name: "Dutch", flag: "🇳🇱", enabled: true, completion: 88 },
  { code: "twi", name: "Twi", flag: "🇬🇭", enabled: true, completion: 75 },
  { code: "pap", name: "Papiamento", flag: "🇦🇼", enabled: true, completion: 68 },
]

const institutions = [
  {
    id: "inst-1",
    name: "North American Division",
    denomination: "Seventh-day Adventist",
    country: "United States",
    address: "12501 Old Columbia Pike, Silver Spring, MD 20904",
    contact_email: "info@nad.adventist.org",
    churches: 15,
    members: 1247,
    created_at: "2020-01-15",
  },
  {
    id: "inst-2",
    name: "Inter-American Division",
    denomination: "Seventh-day Adventist",
    country: "Panama",
    address: "P.O. Box 0819-10235, Panama City, Panama",
    contact_email: "info@interamerica.org",
    churches: 23,
    members: 2156,
    created_at: "2019-08-22",
  },
  {
    id: "inst-3",
    name: "South American Division",
    denomination: "Seventh-day Adventist",
    country: "Brazil",
    address: "Rodovia SP 332, Km 160, Engenheiro Coelho, SP",
    contact_email: "info@dsa.org.br",
    churches: 31,
    members: 3421,
    created_at: "2018-11-10",
  },
]

const churches = [
  {
    id: "church-1",
    name: "Central SDA Church",
    institution_id: "inst-1",
    address: "123 Main Street, Washington, DC 20001",
    pastor: "Elder John Smith",
    members: 245,
    established: "1995-03-15",
  },
  {
    id: "church-2",
    name: "Riverside Community Church",
    institution_id: "inst-1",
    address: "456 River Road, Baltimore, MD 21201",
    pastor: "Pastor Maria Garcia",
    members: 189,
    established: "2001-07-20",
  },
  {
    id: "church-3",
    name: "Mountain View SDA",
    institution_id: "inst-2",
    address: "789 Hill Avenue, San José, Costa Rica",
    pastor: "Pastor Carlos Rodriguez",
    members: 312,
    established: "1987-12-05",
  },
]

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="flex min-h-screen bg-background">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Settings & Configuration</h2>
            <p className="text-muted-foreground">Manage system settings, user roles, and church configuration</p>
          </div>

          {/* Tabs for different settings categories */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-card border border-border">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="institutions"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Institutions & Churches
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Users & Roles
              </TabsTrigger>
              <TabsTrigger
                value="languages"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Languages
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                Security
              </TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                Data & Backup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="institutions">
              <div className="space-y-6">
                {/* Institutions Management */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <Building className="w-5 h-5" />
                          Institution Management
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          Manage institutions and their hierarchical relationships
                        </CardDescription>
                      </div>
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Institution
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {institutions.map((institution) => (
                        <div key={institution.id} className="border border-border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Building className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-semibold text-foreground text-lg">{institution.name}</h3>
                                <p className="text-muted-foreground">{institution.denomination}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {institution.country}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Church className="w-4 h-4" />
                                    {institution.churches} churches
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {institution.members} members
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="border-border bg-transparent">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border bg-transparent text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-foreground">Contact Information</Label>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {institution.contact_email}
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 mt-0.5" />
                                  <span>{institution.address}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-foreground">Institution Details</Label>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  Established: {new Date(institution.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <UserCheck className="w-4 h-4" />
                                  Status: Active
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-4 bg-border" />

                          {/* Churches under this institution */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm font-medium text-foreground">Associated Churches</Label>
                              <Button size="sm" variant="outline" className="border-border bg-transparent">
                                <Plus className="w-4 h-4 mr-1" />
                                Add Church
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {churches
                                .filter((church) => church.institution_id === institution.id)
                                .map((church) => (
                                  <div key={church.id} className="bg-muted rounded-lg p-4 border border-border">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 className="font-medium text-foreground">{church.name}</h4>
                                        <p className="text-sm text-muted-foreground">{church.pastor}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {church.address}
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                          <Users className="w-3 h-3" />
                                          {church.members} members
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          Est. {new Date(church.established).getFullYear()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Relationship Management */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Relationship Management
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage user-church-institution relationships and hierarchies
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Institution Level</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <div className="text-sm font-medium text-foreground">Total Institutions</div>
                            <div className="text-2xl font-bold text-foreground">{institutions.length}</div>
                          </div>
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <div className="text-sm font-medium text-foreground">Countries Covered</div>
                            <div className="text-2xl font-bold text-foreground">
                              {new Set(institutions.map((i) => i.country)).size}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Church Level</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <div className="text-sm font-medium text-foreground">Total Churches</div>
                            <div className="text-2xl font-bold text-foreground">{churches.length}</div>
                          </div>
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <div className="text-sm font-medium text-foreground">Avg. per Institution</div>
                            <div className="text-2xl font-bold text-foreground">
                              {Math.round(churches.length / institutions.length)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Member Level</h4>
                        <div className="space-y-2">
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <div className="text-sm font-medium text-foreground">Total Members</div>
                            <div className="text-2xl font-bold text-foreground">
                              {institutions.reduce((sum, inst) => sum + inst.members, 0)}
                            </div>
                          </div>
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <div className="text-sm font-medium text-foreground">Avg. per Church</div>
                            <div className="text-2xl font-bold text-foreground">
                              {Math.round(churches.reduce((sum, church) => sum + church.members, 0) / churches.length)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6 bg-border" />

                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Quick Actions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                          <Building className="w-4 h-4 mr-2" />
                          Add Institution
                        </Button>
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                          <Church className="w-4 h-4 mr-2" />
                          Add Church
                        </Button>
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                          <Users className="w-4 h-4 mr-2" />
                          Assign Members
                        </Button>
                        <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                          <Download className="w-4 h-4 mr-2" />
                          Export Hierarchy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* General Settings Tab */}
            <TabsContent value="general">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Church Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Basic information about your church organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="churchName" className="text-foreground">
                        Church Name
                      </Label>
                      <Input
                        id="churchName"
                        defaultValue="Seventh-day Adventist Church"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="churchAddress" className="text-foreground">
                        Address
                      </Label>
                      <Textarea
                        id="churchAddress"
                        defaultValue="123 Church Street, City, State, Country"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="churchPhone" className="text-foreground">
                          Phone
                        </Label>
                        <Input
                          id="churchPhone"
                          defaultValue="+1 (555) 123-4567"
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="churchEmail" className="text-foreground">
                          Email
                        </Label>
                        <Input
                          id="churchEmail"
                          defaultValue="info@sdachurch.org"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-foreground">
                        Timezone
                      </Label>
                      <Select defaultValue="utc-5">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                          <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      System Preferences
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Configure system behavior and appearance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="defaultLanguage" className="text-foreground">
                        Default Language
                      </Label>
                      <Select defaultValue="en">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                          <SelectItem value="nl">Dutch</SelectItem>
                          <SelectItem value="twi">Twi</SelectItem>
                          <SelectItem value="pap">Papiamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat" className="text-foreground">
                        Date Format
                      </Label>
                      <Select defaultValue="mm-dd-yyyy">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-foreground">
                        Currency
                      </Label>
                      <Select defaultValue="usd">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="cad">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Dark Mode</Label>
                        <div className="text-sm text-muted-foreground">Enable dark theme</div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Auto-save</Label>
                        <div className="text-sm text-muted-foreground">Automatically save changes</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="bg-foreground hover:bg-muted-foreground text-background">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* Users & Roles Tab */}
            <TabsContent value="users">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Roles & Permissions
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage user roles and their permissions across the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {userRoles.map((role, index) => (
                      <div key={index} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                            <div>
                              <h4 className="font-medium text-foreground">{role.name}</h4>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-foreground">{role.users} users</div>
                            <Button size="sm" variant="outline" className="mt-2 border-border bg-transparent">
                              Edit Role
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-foreground">Permissions:</div>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission, permIndex) => (
                              <span
                                key={permIndex}
                                className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded border border-border"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6 bg-border" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Role Management Actions</h4>
                    <div className="flex gap-4">
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                        <Users className="w-4 h-4 mr-2" />
                        Create New Role
                      </Button>
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                        <Shield className="w-4 h-4 mr-2" />
                        Manage Permissions
                      </Button>
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                        <User className="w-4 h-4 mr-2" />
                        Assign Users
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Languages Tab */}
            <TabsContent value="languages">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Multi-Language Configuration
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage supported languages and translation completeness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemLanguages.map((language, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{language.flag}</span>
                          <div>
                            <div className="font-medium text-foreground">{language.name}</div>
                            <div className="text-sm text-muted-foreground">Code: {language.code}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-foreground">{language.completion}% complete</div>
                            <div className="w-24 bg-muted rounded-full h-2 mt-1">
                              <div
                                className="bg-foreground h-2 rounded-full"
                                style={{ width: `${language.completion}%` }}
                              ></div>
                            </div>
                          </div>
                          <Switch defaultChecked={language.enabled} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-6 bg-border" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Language Management</h4>
                    <div className="flex gap-4">
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                        <Globe className="w-4 h-4 mr-2" />
                        Add Language
                      </Button>
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Translations
                      </Button>
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        Export Translations
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Email Notifications
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Configure email notification preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">New Member Registration</Label>
                        <div className="text-sm text-muted-foreground">Notify when new members join</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Subsidy Requests</Label>
                        <div className="text-sm text-muted-foreground">Notify about new subsidy applications</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Event Registrations</Label>
                        <div className="text-sm text-muted-foreground">Notify about event sign-ups</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Volunteer Applications</Label>
                        <div className="text-sm text-muted-foreground">Notify about new volunteer sign-ups</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">System Updates</Label>
                        <div className="text-sm text-muted-foreground">Notify about system maintenance</div>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Configuration
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Configure SMTP settings for email delivery
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost" className="text-foreground">
                        SMTP Host
                      </Label>
                      <Input id="smtpHost" placeholder="smtp.gmail.com" className="bg-background border-border" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort" className="text-foreground">
                          Port
                        </Label>
                        <Input id="smtpPort" placeholder="587" className="bg-background border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpSecurity" className="text-foreground">
                          Security
                        </Label>
                        <Select defaultValue="tls">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername" className="text-foreground">
                        Username
                      </Label>
                      <Input
                        id="smtpUsername"
                        placeholder="your-email@domain.com"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword" className="text-foreground">
                        Password
                      </Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        placeholder="••••••••"
                        className="bg-background border-border"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                    >
                      Test Connection
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Configure security and authentication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Two-Factor Authentication</Label>
                        <div className="text-sm text-muted-foreground">Require 2FA for admin accounts</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Password Complexity</Label>
                        <div className="text-sm text-muted-foreground">Enforce strong password requirements</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Session Timeout</Label>
                        <div className="text-sm text-muted-foreground">Auto-logout after inactivity</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout" className="text-foreground">
                        Session Timeout (minutes)
                      </Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        defaultValue="30"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts" className="text-foreground">
                        Max Login Attempts
                      </Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        defaultValue="5"
                        className="bg-background border-border"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy & Compliance
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Data privacy and compliance settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Data Encryption</Label>
                        <div className="text-sm text-muted-foreground">Encrypt sensitive data at rest</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Audit Logging</Label>
                        <div className="text-sm text-muted-foreground">Log all user actions</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">GDPR Compliance</Label>
                        <div className="text-sm text-muted-foreground">Enable GDPR data protection</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention" className="text-foreground">
                        Data Retention Period (years)
                      </Label>
                      <Input id="dataRetention" type="number" defaultValue="7" className="bg-background border-border" />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Privacy Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Data & Backup Tab */}
            <TabsContent value="data">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Data Management
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage system data and database operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-foreground">Database Size</span>
                          <span className="text-muted-foreground">2.4 GB</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-foreground">Total Records</span>
                          <span className="text-muted-foreground">15,847</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">Last Backup</span>
                          <span className="text-muted-foreground">2 hours ago</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                          <Download className="w-4 h-4 mr-2" />
                          Create Backup
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Restore Backup
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      Automated Backups
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Configure automatic backup schedules
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Enable Auto Backup</Label>
                        <div className="text-sm text-muted-foreground">Automatically backup data</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency" className="text-foreground">
                        Backup Frequency
                      </Label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupRetention" className="text-foreground">
                        Retention Period (days)
                      </Label>
                      <Input
                        id="backupRetention"
                        type="number"
                        defaultValue="30"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupLocation" className="text-foreground">
                        Backup Location
                      </Label>
                      <Select defaultValue="cloud">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="local">Local Storage</SelectItem>
                          <SelectItem value="cloud">Cloud Storage</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card border-border mt-6">
                <CardHeader>
                  <CardTitle className="text-foreground">Data Export & Import</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Export data for reporting or import data from external sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Members
                    </Button>
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Events
                    </Button>
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Subsidies
                    </Button>
                    <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
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
