/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, ProjectType } from "./globalTypes";

// ====================================================
// GraphQL query operation: InstitutionById
// ====================================================

export interface InstitutionById_institution_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  full_address: string | null;
  postal_code: string | null;
  website: string | null;
  notes: string | null;
  is_primary: boolean;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionById_institution_subsidy_requests {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  total_budget: any;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  institution_id: string;
  requester_id: string;
  department_id: string;
  church_id: string;
  subsidy_statuses_id: string;
  project_id: string;
}

export interface InstitutionById_institution_direct_messages {
  __typename: "DirectMessage";
  id: string;
  institution_id: string;
  sender_id: string;
  title: string;
  content: string;
  status: string;
  sent_at: any;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionById_institution_projects {
  __typename: "Project";
  id: string;
  department_id: string;
  title: string;
  description: string;
  budget: any;
  media_link: string;
  language_preference: LanguagePreference;
  type: ProjectType;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  event_id: string | null;
  institution_id: string | null;
}

export interface InstitutionById_institution_settings {
  __typename: "Setting";
  id: string;
  institution_id: string;
  key: string;
  value: string;
  description: string;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionById_institution_notifications {
  __typename: "Notification";
  id: string;
  institution_id: string;
  user_id: string;
  type: string;
  message: string;
  read_status: boolean;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionById_institution_communications {
  __typename: "Communication";
  id: string;
  institution_id: string;
  title: string;
  content: string;
  type: string;
  priority: string;
  status: string;
  language_preference: LanguagePreference;
  schedule_at: any;
  published_at: any;
  author_id: string;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionById_institution_departments {
  __typename: "Department";
  id: string;
  institution_id: string;
  church_id: string;
  name: string;
  description: string;
  annual_budget: any;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionById_institution_users {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  password: string;
  language_preference: LanguagePreference;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact_id: string | null;
  institution_id: string;
  church_id: string;
  department_id: string;
}

export interface InstitutionById_institution {
  __typename: "Institution";
  id: string;
  name: string;
  denomination: string;
  language_preference: LanguagePreference;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  regions_count: number;
  churches_count: number;
  departments_count: number;
  users_count: number;
  contact: InstitutionById_institution_contact | null;
  subsidy_requests: InstitutionById_institution_subsidy_requests[];
  direct_messages: InstitutionById_institution_direct_messages[];
  projects: InstitutionById_institution_projects[] | null;
  settings: InstitutionById_institution_settings[] | null;
  notifications: InstitutionById_institution_notifications[] | null;
  communications: InstitutionById_institution_communications[] | null;
  departments: InstitutionById_institution_departments[] | null;
  users: InstitutionById_institution_users[] | null;
}

export interface InstitutionById {
  institution: InstitutionById_institution | null;
}

export interface InstitutionByIdVariables {
  id: string;
}
