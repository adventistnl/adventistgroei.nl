export interface ProjectActivity {
  id: string
  name: string
  description: string
  budget_amount: number
  request_subsidy: boolean
  is_subsidized: boolean
  institution_requested_amount?: number
  assignee_ids?: string[] // Selected users responsible for this activity
  tags: string[]
}

export interface ProjectFormData {
  title: string
  description: string
  department_id: string
  responsible_id: string
  project_responsible_type: "personal" | "institutional" | "church" | "region" | "department"
  register_as_event: boolean
  is_private: boolean
  activities: ProjectActivity[]
  total_budget: number
  church_contribution: number
  institution_contribution: number
  subsidy_percentage: number
  is_special_case: boolean
  special_case_reason?: string
  location_church_plant?: string
  special_budget?: number
  event?: {
    title: string
    description: string
    contact_id: string
    type: string
    language_preference: "en" | "nl" | "pt" | "es" | "fr" | "de"
    max_participants?: number
    is_paid_event: boolean
    ticket_amount?: number
    payment_description?: string
    required_volunteers: boolean
    start_at?: Date
    end_at?: Date
    subscription_expires_at?: Date
    target_type: "institution" | "region" | "department" | "church" | "user"
    target_id?: string
  }
  communication?: {
    title: string
    content: import('lexical').SerializedEditorState
    communication_type: "announcement" | "invitation" | "newsletter" | "update" | "reminder"
    priority: "low" | "medium" | "high" | "urgent"
    language_preference: "en" | "nl" | "pt" | "es" | "fr" | "de"
    post_now: boolean
    publish_date?: string
    target_type?: "institution" | "region" | "department" | "church" | "user"
    target_id?: string
  }
}
