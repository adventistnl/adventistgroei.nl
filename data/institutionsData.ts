// Comprehensive mock data for institutions page
// Based on ERD structure with proper relationships

// ========== ERD-BASED ENTITIES ==========

// Contacts
export const contacts = [
  { id: "ct1", country: "Netherlands", city: "Amsterdam", address: "Keizersgracht 123", phone: "+31 20 123 4567", email: "info@cgi.nl", website: "https://cgi.nl" },
  { id: "ct2", country: "Brazil", city: "São Paulo", address: "Rua Augusta 456", phone: "+55 11 9999-9999", email: "contato@usp.org.br", website: "https://usp.org.br" },
  { id: "ct3", country: "Brazil", city: "Brasília", address: "SQN 123 Bloco A", phone: "+55 61 8888-8888", email: "info@ucb.org.br", website: "https://ucb.org.br" },
  { id: "ct4", country: "Brazil", city: "Manaus", address: "Av. Amazonas 789", phone: "+55 92 7777-7777", email: "contato@uam.org.br", website: "https://uam.org.br" },
  { id: "ct5", country: "Brazil", city: "Recife", address: "Av. Boa Viagem 321", phone: "+55 81 6666-6666", email: "info@unb.org.br", website: "https://unb.org.br" },
  { id: "ct6", country: "Brazil", city: "Porto Alegre", address: "Rua dos Andradas 654", phone: "+55 51 5555-5555", email: "contato@uso.org.br", website: "https://uso.org.br" },
  { id: "ct7", country: "United States", city: "Silver Spring", address: "12501 Old Columbia Pike", phone: "+1 301 680 6000", email: "info@nad.org", website: "https://nad.org" },
  { id: "ct8", country: "Germany", city: "Berlin", address: "Schönhauser Allee 176", phone: "+49 30 123 456", email: "kontakt@eud.org", website: "https://eud.org" }
]

// Institutions
export const institutions = [
  { id: "i1", name: "CGI Netherlands", denomination: "Seventh-day Adventist", language_preference: "nl", contact_id: "ct1", created_at: "2020-01-15T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "i2", name: "União Sul-Paulista", denomination: "Seventh-day Adventist", language_preference: "pt", contact_id: "ct2", created_at: "2019-03-20T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "i3", name: "União Central Brasileira", denomination: "Seventh-day Adventist", language_preference: "pt", contact_id: "ct3", created_at: "2018-07-10T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "i4", name: "União Amazônica", denomination: "Seventh-day Adventist", language_preference: "pt", contact_id: "ct4", created_at: "2020-11-05T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "i5", name: "União Nordeste Brasileira", denomination: "Seventh-day Adventist", language_preference: "pt", contact_id: "ct5", created_at: "2019-09-12T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "i6", name: "União Sul-Oeste", denomination: "Seventh-day Adventist", language_preference: "pt", contact_id: "ct6", created_at: "2021-02-28T00:00:00Z", updated_at: "2024-08-22T16:45:00Z" },
  { id: "i7", name: "North American Division", denomination: "Seventh-day Adventist", language_preference: "en", contact_id: "ct7", created_at: "2017-05-15T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" },
  { id: "i8", name: "Euro-Africa Division", denomination: "Seventh-day Adventist", language_preference: "en", contact_id: "ct8", created_at: "2018-12-03T00:00:00Z", updated_at: "2024-08-20T13:20:00Z" }
]

// Regions
export const regions = [
  { id: "r1", institution_id: "i1", name: "North Holland", parent_region_id: null, created_at: "2020-02-01T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "r2", institution_id: "i1", name: "South Holland", parent_region_id: null, created_at: "2020-02-01T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "r3", institution_id: "i1", name: "Utrecht", parent_region_id: null, created_at: "2020-02-01T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "r4", institution_id: "i2", name: "São Paulo Capital", parent_region_id: null, created_at: "2019-04-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "r5", institution_id: "i2", name: "Interior Paulista", parent_region_id: null, created_at: "2019-04-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "r6", institution_id: "i2", name: "Baixada Santista", parent_region_id: null, created_at: "2019-04-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "r7", institution_id: "i2", name: "Vale do Paraíba", parent_region_id: null, created_at: "2019-04-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "r8", institution_id: "i3", name: "Distrito Federal", parent_region_id: null, created_at: "2018-08-01T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "r9", institution_id: "i3", name: "Goiás", parent_region_id: null, created_at: "2018-08-01T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "r10", institution_id: "i4", name: "Amazonas", parent_region_id: null, created_at: "2020-12-01T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "r11", institution_id: "i4", name: "Pará", parent_region_id: null, created_at: "2020-12-01T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "r12", institution_id: "i5", name: "Pernambuco", parent_region_id: null, created_at: "2019-10-01T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "r13", institution_id: "i5", name: "Bahia", parent_region_id: null, created_at: "2019-10-01T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "r14", institution_id: "i5", name: "Ceará", parent_region_id: null, created_at: "2019-10-01T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "r15", institution_id: "i6", name: "Rio Grande do Sul", parent_region_id: null, created_at: "2021-03-01T00:00:00Z", updated_at: "2024-08-22T16:45:00Z" },
  { id: "r16", institution_id: "i7", name: "Atlantic Union", parent_region_id: null, created_at: "2017-06-01T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" },
  { id: "r17", institution_id: "i7", name: "Pacific Union", parent_region_id: null, created_at: "2017-06-01T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" },
  { id: "r18", institution_id: "i8", name: "German Union", parent_region_id: null, created_at: "2018-12-15T00:00:00Z", updated_at: "2024-08-20T13:20:00Z" }
]

// Churches
export const churches = [
  { id: "c1", institution_id: "i1", region_id: "r1", name: "Amsterdam Central Church", address: "Nieuwezijds Voorburgwal 147", pastor: "Ds. Jan de Vries", contact_email: "amsterdam@cgi.nl", phone: "+31 20 555 0101", member_count: 450, created_at: "2020-03-15T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "c2", institution_id: "i1", region_id: "r1", name: "Haarlem Community Church", address: "Grote Markt 16", pastor: "Ds. Maria van der Berg", contact_email: "haarlem@cgi.nl", phone: "+31 23 555 0102", member_count: 320, created_at: "2020-05-20T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "c3", institution_id: "i1", region_id: "r2", name: "Rotterdam Harbor Church", address: "Coolsingel 123", pastor: "Ds. Pieter Jansen", contact_email: "rotterdam@cgi.nl", phone: "+31 10 555 0103", member_count: 280, created_at: "2020-07-10T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "c4", institution_id: "i1", region_id: "r3", name: "Utrecht Central Church", address: "Oudegracht 456", pastor: "Ds. Anna Bakker", contact_email: "utrecht@cgi.nl", phone: "+31 30 555 0104", member_count: 380, created_at: "2020-09-05T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "c5", institution_id: "i2", region_id: "r4", name: "Igreja Central de São Paulo", address: "Rua da Consolação 896", pastor: "Pr. João Silva", contact_email: "central@usp.org.br", phone: "+55 11 3333-0001", member_count: 850, created_at: "2019-06-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "c6", institution_id: "i2", region_id: "r4", name: "Igreja do Morumbi", address: "Av. Giovanni Gronchi 5930", pastor: "Pr. Ana Santos", contact_email: "morumbi@usp.org.br", phone: "+55 11 3333-0002", member_count: 620, created_at: "2019-08-15T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "c7", institution_id: "i2", region_id: "r5", name: "Igreja de Campinas", address: "Rua Barão de Jaguara 1230", pastor: "Pr. Carlos Lima", contact_email: "campinas@usp.org.br", phone: "+55 19 3333-0003", member_count: 480, created_at: "2019-10-10T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "c8", institution_id: "i2", region_id: "r6", name: "Igreja de Santos", address: "Av. Ana Costa 789", pastor: "Pr. Lucia Ferreira", contact_email: "santos@usp.org.br", phone: "+55 13 3333-0004", member_count: 390, created_at: "2020-01-20T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "c9", institution_id: "i3", region_id: "r8", name: "Igreja de Brasília", address: "SQS 316 Bloco B", pastor: "Pr. Pedro Costa", contact_email: "brasilia@ucb.org.br", phone: "+55 61 3333-0005", member_count: 720, created_at: "2018-09-01T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "c10", institution_id: "i3", region_id: "r9", name: "Igreja de Goiânia", address: "Av. T-4 1234", pastor: "Pr. Roberto Almeida", contact_email: "goiania@ucb.org.br", phone: "+55 62 3333-0006", member_count: 560, created_at: "2018-11-15T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "c11", institution_id: "i4", region_id: "r10", name: "Igreja de Manaus", address: "Rua Ramos Ferreira 1009", pastor: "Pr. José Oliveira", contact_email: "manaus@uam.org.br", phone: "+55 92 3333-0007", member_count: 380, created_at: "2021-01-15T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "c12", institution_id: "i4", region_id: "r11", name: "Igreja de Belém", address: "Av. Nazaré 567", pastor: "Pr. Carmen Rodrigues", contact_email: "belem@uam.org.br", phone: "+55 91 3333-0008", member_count: 420, created_at: "2021-03-10T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "c13", institution_id: "i5", region_id: "r12", name: "Igreja do Recife", address: "Av. Conde da Boa Vista 1234", pastor: "Pr. Maria Ferreira", contact_email: "recife@unb.org.br", phone: "+55 81 3333-0009", member_count: 540, created_at: "2019-11-20T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "c14", institution_id: "i5", region_id: "r13", name: "Igreja de Salvador", address: "Av. Sete de Setembro 890", pastor: "Pr. Antonio Nascimento", contact_email: "salvador@unb.org.br", phone: "+55 71 3333-0010", member_count: 480, created_at: "2020-02-05T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "c15", institution_id: "i6", region_id: "r15", name: "Igreja de Porto Alegre", address: "Rua da Praia 456", pastor: "Pr. Fernando Souza", contact_email: "poa@uso.org.br", phone: "+55 51 3333-0011", member_count: 350, created_at: "2021-04-10T00:00:00Z", updated_at: "2024-08-22T16:45:00Z" },
  { id: "c16", institution_id: "i7", region_id: "r16", name: "New York Central Church", address: "123 Broadway", pastor: "Pastor John Smith", contact_email: "nyc@nad.org", phone: "+1 212 555 0001", member_count: 680, created_at: "2017-08-01T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" },
  { id: "c17", institution_id: "i7", region_id: "r17", name: "Los Angeles Community Church", address: "456 Sunset Blvd", pastor: "Pastor Sarah Johnson", contact_email: "la@nad.org", phone: "+1 213 555 0002", member_count: 520, created_at: "2017-10-15T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" },
  { id: "c18", institution_id: "i8", region_id: "r18", name: "Berlin Central Church", address: "Unter den Linden 789", pastor: "Pastor Klaus Weber", contact_email: "berlin@eud.org", phone: "+49 30 555 0001", member_count: 420, created_at: "2019-01-20T00:00:00Z", updated_at: "2024-08-20T13:20:00Z" }
]

// Users
export const users = [
  { id: "u1", institution_id: "i1", church_id: "c1", name: "Jan de Vries", email: "jan@cgi.nl", phone: "+31 20 555 1001", created_at: "2020-03-20T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "u2", institution_id: "i1", church_id: "c2", name: "Maria van der Berg", email: "maria@cgi.nl", phone: "+31 23 555 1002", created_at: "2020-05-25T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "u3", institution_id: "i1", church_id: "c3", name: "Pieter Jansen", email: "pieter@cgi.nl", phone: "+31 10 555 1003", created_at: "2020-07-15T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "u4", institution_id: "i2", church_id: "c5", name: "João Silva", email: "joao@usp.org.br", phone: "+55 11 9999-1001", created_at: "2019-06-05T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "u5", institution_id: "i2", church_id: "c6", name: "Ana Santos", email: "ana@usp.org.br", phone: "+55 11 9999-1002", created_at: "2019-08-20T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "u6", institution_id: "i2", church_id: "c7", name: "Carlos Lima", email: "carlos@usp.org.br", phone: "+55 19 9999-1003", created_at: "2019-10-15T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "u7", institution_id: "i3", church_id: "c9", name: "Pedro Costa", email: "pedro@ucb.org.br", phone: "+55 61 9999-1004", created_at: "2018-09-05T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "u8", institution_id: "i4", church_id: "c11", name: "José Oliveira", email: "jose@uam.org.br", phone: "+55 92 9999-1005", created_at: "2021-01-20T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "u9", institution_id: "i5", church_id: "c13", name: "Maria Ferreira", email: "maria.f@unb.org.br", phone: "+55 81 9999-1006", created_at: "2019-11-25T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "u10", institution_id: "i6", church_id: "c15", name: "Fernando Souza", email: "fernando@uso.org.br", phone: "+55 51 9999-1007", created_at: "2021-04-15T00:00:00Z", updated_at: "2024-08-22T16:45:00Z" }
]

// Roles
export const roles = [
  { id: "role1", name: "Super Admin", key_code: "super_admin", description: "Full system access" },
  { id: "role2", name: "Institution Admin", key_code: "institution_admin", description: "Institution-level administration" },
  { id: "role3", name: "Church Admin", key_code: "church_admin", description: "Church-level administration" },
  { id: "role4", name: "Pastor", key_code: "pastor", description: "Church pastor" },
  { id: "role5", name: "Department Leader", key_code: "department_leader", description: "Department leadership" },
  { id: "role6", name: "Member", key_code: "member", description: "Regular member" }
]

// User Roles (many-to-many relationship)
export const user_roles = [
  { id: "ur1", user_id: "u1", role_id: "role4" },
  { id: "ur2", user_id: "u2", role_id: "role4" },
  { id: "ur3", user_id: "u3", role_id: "role4" },
  { id: "ur4", user_id: "u4", role_id: "role4" },
  { id: "ur5", user_id: "u5", role_id: "role4" },
  { id: "ur6", user_id: "u6", role_id: "role4" },
  { id: "ur7", user_id: "u7", role_id: "role4" },
  { id: "ur8", user_id: "u8", role_id: "role4" },
  { id: "ur9", user_id: "u9", role_id: "role4" },
  { id: "ur10", user_id: "u10", role_id: "role4" },
  { id: "ur11", user_id: "u1", role_id: "role2" }, // Jan is also institution admin
  { id: "ur12", user_id: "u4", role_id: "role2" }, // João is also institution admin
  { id: "ur13", user_id: "u7", role_id: "role2" }, // Pedro is also institution admin
  { id: "ur14", user_id: "u1", role_id: "role3" }, // Jan is also church admin
  { id: "ur15", user_id: "u4", role_id: "role3" }  // João is also church admin
]

// Departments
export const departments = [
  { id: "d1", institution_id: "i1", church_id: "c1", name: "Youth Ministry", annual_budget: 15000, created_at: "2020-04-01T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "d2", institution_id: "i1", church_id: "c1", name: "Evangelism", annual_budget: 25000, created_at: "2020-04-01T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "d3", institution_id: "i1", church_id: "c2", name: "Education", annual_budget: 18000, created_at: "2020-06-01T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "d4", institution_id: "i2", church_id: "c5", name: "Education", annual_budget: 35000, created_at: "2019-07-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "d5", institution_id: "i2", church_id: "c5", name: "Health Ministry", annual_budget: 20000, created_at: "2019-07-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "d6", institution_id: "i2", church_id: "c6", name: "Youth Ministry", annual_budget: 22000, created_at: "2019-09-01T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "d7", institution_id: "i3", church_id: "c9", name: "Communication", annual_budget: 18000, created_at: "2018-10-01T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "d8", institution_id: "i3", church_id: "c9", name: "Evangelism", annual_budget: 28000, created_at: "2018-10-01T00:00:00Z", updated_at: "2024-08-25T09:45:00Z" },
  { id: "d9", institution_id: "i4", church_id: "c11", name: "Community Outreach", annual_budget: 16000, created_at: "2021-02-01T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "d10", institution_id: "i5", church_id: "c13", name: "Women's Ministry", annual_budget: 12000, created_at: "2020-01-01T00:00:00Z", updated_at: "2024-08-23T11:15:00Z" },
  { id: "d11", institution_id: "i6", church_id: "c15", name: "Music Ministry", annual_budget: 14000, created_at: "2021-05-01T00:00:00Z", updated_at: "2024-08-22T16:45:00Z" },
  { id: "d12", institution_id: "i7", church_id: "c16", name: "Youth Ministry", annual_budget: 30000, created_at: "2017-09-01T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" },
  { id: "d13", institution_id: "i7", church_id: "c17", name: "Evangelism", annual_budget: 32000, created_at: "2017-11-01T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" },
  { id: "d14", institution_id: "i8", church_id: "c18", name: "Education", annual_budget: 24000, created_at: "2019-02-01T00:00:00Z", updated_at: "2024-08-20T13:20:00Z" }
]

// Subsidy Statuses
export const subsidy_statuses = [
  { id: "ss_pending", status: "pending", description: "Pending review" },
  { id: "ss_approved", status: "approved", description: "Approved for funding" },
  { id: "ss_rejected", status: "rejected", description: "Rejected" },
  { id: "ss_under_review", status: "under_review", description: "Under review" }
]

// Subsidy Requests (12 months of data for charts)
export const subsidy_requests = [
  // 2024 data
  { id: "s1", institution_id: "i1", requester_id: "u1", department_project_id: "d1", church_id: "c1", total_budget: 5000, subsidy_statuses_id: "ss_approved", created_at: "2024-01-15T00:00:00Z", updated_at: "2024-02-01T10:30:00Z" },
  { id: "s2", institution_id: "i1", requester_id: "u2", department_project_id: "d2", church_id: "c1", total_budget: 8000, subsidy_statuses_id: "ss_approved", created_at: "2024-01-20T00:00:00Z", updated_at: "2024-02-05T15:20:00Z" },
  { id: "s3", institution_id: "i2", requester_id: "u4", department_project_id: "d4", church_id: "c5", total_budget: 12000, subsidy_statuses_id: "ss_approved", created_at: "2024-02-10T00:00:00Z", updated_at: "2024-02-25T09:45:00Z" },
  { id: "s4", institution_id: "i2", requester_id: "u5", department_project_id: "d5", church_id: "c6", total_budget: 6500, subsidy_statuses_id: "ss_under_review", created_at: "2024-02-15T00:00:00Z", updated_at: "2024-08-24T14:30:00Z" },
  { id: "s5", institution_id: "i3", requester_id: "u7", department_project_id: "d7", church_id: "c9", total_budget: 9000, subsidy_statuses_id: "ss_approved", created_at: "2024-03-05T00:00:00Z", updated_at: "2024-03-20T11:15:00Z" },
  { id: "s6", institution_id: "i1", requester_id: "u3", department_project_id: "d3", church_id: "c2", total_budget: 4500, subsidy_statuses_id: "ss_pending", created_at: "2024-03-12T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "s7", institution_id: "i4", requester_id: "u8", department_project_id: "d9", church_id: "c11", total_budget: 7200, subsidy_statuses_id: "ss_approved", created_at: "2024-04-08T00:00:00Z", updated_at: "2024-04-22T16:45:00Z" },
  { id: "s8", institution_id: "i2", requester_id: "u6", department_project_id: "d6", church_id: "c6", total_budget: 8800, subsidy_statuses_id: "ss_under_review", created_at: "2024-04-18T00:00:00Z", updated_at: "2024-08-26T15:20:00Z" },
  { id: "s9", institution_id: "i5", requester_id: "u9", department_project_id: "d10", church_id: "c13", total_budget: 5500, subsidy_statuses_id: "ss_rejected", created_at: "2024-05-03T00:00:00Z", updated_at: "2024-05-20T11:15:00Z" },
  { id: "s10", institution_id: "i6", requester_id: "u10", department_project_id: "d11", church_id: "c15", total_budget: 6800, subsidy_statuses_id: "ss_pending", created_at: "2024-05-15T00:00:00Z", updated_at: "2024-08-22T16:45:00Z" },
  { id: "s11", institution_id: "i7", requester_id: "u1", department_project_id: "d12", church_id: "c16", total_budget: 15000, subsidy_statuses_id: "ss_approved", created_at: "2024-06-10T00:00:00Z", updated_at: "2024-06-25T08:30:00Z" },
  { id: "s12", institution_id: "i8", requester_id: "u1", department_project_id: "d14", church_id: "c18", total_budget: 11200, subsidy_statuses_id: "ss_under_review", created_at: "2024-06-20T00:00:00Z", updated_at: "2024-08-20T13:20:00Z" },
  { id: "s13", institution_id: "i1", requester_id: "u1", department_project_id: "d1", church_id: "c1", total_budget: 5800, subsidy_statuses_id: "ss_pending", created_at: "2024-07-05T00:00:00Z", updated_at: "2024-08-27T10:30:00Z" },
  { id: "s14", institution_id: "i2", requester_id: "u4", department_project_id: "d4", church_id: "c5", total_budget: 9500, subsidy_statuses_id: "ss_approved", created_at: "2024-07-15T00:00:00Z", updated_at: "2024-07-30T15:20:00Z" },
  { id: "s15", institution_id: "i3", requester_id: "u7", department_project_id: "d8", church_id: "c9", total_budget: 13000, subsidy_statuses_id: "ss_approved", created_at: "2024-08-02T00:00:00Z", updated_at: "2024-08-15T09:45:00Z" },
  { id: "s16", institution_id: "i7", requester_id: "u1", department_project_id: "d13", church_id: "c17", total_budget: 16800, subsidy_statuses_id: "ss_pending", created_at: "2024-08-10T00:00:00Z", updated_at: "2024-08-21T08:30:00Z" }
]

// ========== AGGREGATED DATA FOR CHARTS ==========

// Helper functions for data aggregation
export const getInstitutionData = () => {
  return institutions.map(inst => {
    const contact = contacts.find(c => c.id === inst.contact_id)
    const institutionRegions = regions.filter(r => r.institution_id === inst.id)
    const institutionChurches = churches.filter(c => c.institution_id === inst.id)
    const institutionUsers = users.filter(u => u.institution_id === inst.id)
    const institutionSubsidies = subsidy_requests.filter(s => s.institution_id === inst.id)
    const institutionDepartments = departments.filter(d => d.institution_id === inst.id)
    
    const totalMembers = institutionChurches.reduce((sum, church) => sum + church.member_count, 0)
    const totalBudget = institutionSubsidies.reduce((sum, sub) => sum + sub.total_budget, 0)
    const annualBudget = institutionDepartments.reduce((sum, dept) => sum + dept.annual_budget, 0)
    
    return {
      ...inst,
      contact,
      regions_count: institutionRegions.length,
      churches_count: institutionChurches.length,
      users_count: institutionUsers.length,
      members_count: totalMembers,
      total_subsidy_budget: totalBudget,
      annual_department_budget: annualBudget,
      pending_subsidies: institutionSubsidies.filter(s => s.subsidy_statuses_id === 'ss_pending').length
    }
  })
}

// Churches by Region data for bar chart
export const getChurchesByRegionData = (institutionId?: string) => {
  const filteredRegions = institutionId 
    ? regions.filter(r => r.institution_id === institutionId)
    : regions
  
  return filteredRegions.map(region => {
    const regionChurches = churches.filter(c => c.region_id === region.id)
    return {
      region: region.name,
      churches: regionChurches.length,
      members: regionChurches.reduce((sum, church) => sum + church.member_count, 0)
    }
  }).filter(item => item.churches > 0) // Only show regions with churches
}

// Users by Role data for pie chart
export const getUsersByRoleData = (institutionId?: string) => {
  const filteredUsers = institutionId 
    ? users.filter(u => u.institution_id === institutionId)
    : users
  
  const roleCount = roles.map(role => {
    const usersWithRole = user_roles
      .filter(ur => ur.role_id === role.id)
      .filter(ur => filteredUsers.some(u => u.id === ur.user_id))
    
    return {
      name: role.name,
      value: usersWithRole.length,
      color: getRoleColor(role.key_code)
    }
  }).filter(item => item.value > 0)
  
  return roleCount
}

// Helper function for role colors
const getRoleColor = (roleCode: string): string => {
  const colors: { [key: string]: string } = {
    'super_admin': '#ef4444',
    'institution_admin': '#f59e0b',
    'church_admin': '#3b82f6',
    'pastor': '#10b981',
    'department_leader': '#8b5cf6',
    'member': '#6b7280'
  }
  return colors[roleCode] || '#6b7280'
}

// Subsidy requests over time (monthly)
export const getSubsidyRequestsOverTime = (institutionId?: string) => {
  const filteredRequests = institutionId 
    ? subsidy_requests.filter(s => s.institution_id === institutionId)
    : subsidy_requests
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  return months.map((month, index) => {
    const monthRequests = filteredRequests.filter(request => {
      const date = new Date(request.created_at)
      return date.getMonth() === index && date.getFullYear() === 2024
    })
    
    return {
      month,
      requests: monthRequests.length,
      amount: monthRequests.reduce((sum, req) => sum + req.total_budget, 0)
    }
  })
}

// Revenue vs Budget data (by institution or overall)
export const getRevenueVsBudgetData = (institutionId?: string) => {
  const filteredInstitutions = institutionId 
    ? institutions.filter(i => i.id === institutionId)
    : institutions
  
  return filteredInstitutions.map(inst => {
    const instSubsidies = subsidy_requests.filter(s => s.institution_id === inst.id)
    const instDepartments = departments.filter(d => d.institution_id === inst.id)
    
    const approvedSubsidies = instSubsidies
      .filter(s => s.subsidy_statuses_id === 'ss_approved')
      .reduce((sum, s) => sum + s.total_budget, 0)
    
    const totalBudget = instDepartments.reduce((sum, d) => sum + d.annual_budget, 0)
    
    return {
      institution: inst.name,
      revenue: approvedSubsidies,
      budget: totalBudget,
      utilization: totalBudget > 0 ? Math.round((approvedSubsidies / totalBudget) * 100) : 0
    }
  })
}

// Monthly subsidy data for area chart
export const getMonthlySubsidyData = (institutionId?: string) => {
  const filteredRequests = institutionId 
    ? subsidy_requests.filter(s => s.institution_id === institutionId)
    : subsidy_requests
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  return months.map((month, index) => {
    const monthRequests = filteredRequests.filter(request => {
      const date = new Date(request.created_at)
      return date.getMonth() === index && date.getFullYear() === 2024
    })
    
    const approved = monthRequests.filter(r => r.subsidy_statuses_id === 'ss_approved')
    const pending = monthRequests.filter(r => r.subsidy_statuses_id === 'ss_pending')
    const underReview = monthRequests.filter(r => r.subsidy_statuses_id === 'ss_under_review')
    
    return {
      month,
      approved: approved.reduce((sum, req) => sum + req.total_budget, 0),
      pending: pending.reduce((sum, req) => sum + req.total_budget, 0),
      under_review: underReview.reduce((sum, req) => sum + req.total_budget, 0)
    }
  })
}

// Institution KPIs
export const getInstitutionKPIs = (institutionId?: string) => {
  if (institutionId) {
    const inst = institutions.find(i => i.id === institutionId)
    if (!inst) return null
    
    const institutionData = getInstitutionData().find(i => i.id === institutionId)
    return institutionData
  }
  
  // Overall KPIs
  const totalRegions = regions.length
  const totalChurches = churches.length
  const totalUsers = users.length
  const totalMembers = churches.reduce((sum, church) => sum + church.member_count, 0)
  const totalSubsidyBudget = subsidy_requests.reduce((sum, sub) => sum + sub.total_budget, 0)
  const totalAnnualBudget = departments.reduce((sum, dept) => sum + dept.annual_budget, 0)
  const pendingSubsidies = subsidy_requests.filter(s => s.subsidy_statuses_id === 'ss_pending').length
  
  return {
    institutions_count: institutions.length,
    regions_count: totalRegions,
    churches_count: totalChurches,
    users_count: totalUsers,
    members_count: totalMembers,
    total_subsidy_budget: totalSubsidyBudget,
    annual_department_budget: totalAnnualBudget,
    pending_subsidies: pendingSubsidies,
    budget_utilization: totalAnnualBudget > 0 ? Math.round((totalSubsidyBudget / totalAnnualBudget) * 100) : 0
  }
}
