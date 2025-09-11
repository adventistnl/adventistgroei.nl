export interface Project {
  id: string
  department_id: string
  title: string
  description: string
  budget: number
  is_private: boolean
  request_volunteers: boolean
  start_at: string
  end_at: string
  language_preference: "en" | "nl"
  institutionId: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface ProjectFormData {
  title: string
  description: string
  budget: number
  is_private: boolean
  request_volunteers: boolean
  start_at: string
  end_at: string
  language_preference: "en" | "nl"
  department_id: string
}

export interface Department {
  id: string
  name: string
  description?: string
}
