/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ActivityPriority {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  URGENT = "URGENT",
}

export enum ActivityStatus {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  TODO = "TODO",
}

export enum ActivityTags {
  ACCOMMODATION = "ACCOMMODATION",
  EQUIPMENT = "EQUIPMENT",
  EVENT = "EVENT",
  FEEDING = "FEEDING",
  MARKETING = "MARKETING",
  MATERIALS = "MATERIALS",
  REFORM = "REFORM",
  SERVICES = "SERVICES",
  TRAINING = "TRAINING",
  TRANSPORT = "TRANSPORT",
  TRAVEL = "TRAVEL",
}

export enum AnnualBudgetCategory {
  EMERGENCY = "EMERGENCY",
  EXPANSION = "EXPANSION",
  MAINTENANCE = "MAINTENANCE",
  OPERATIONAL = "OPERATIONAL",
  PROJECT = "PROJECT",
}

export enum AnnualBudgetEntityType {
  CHURCH = "CHURCH",
  CHURCH_DEPARTMENT = "CHURCH_DEPARTMENT",
  INSTITUTION = "INSTITUTION",
  INSTITUTION_DEPARTMENT = "INSTITUTION_DEPARTMENT",
}

export enum AnnualBudgetPriority {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  URGENT = "URGENT",
}

export enum AnnualBudgetStatus {
  APPROVED = "APPROVED",
  CLOSED = "CLOSED",
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
  REVISION_REQUESTED = "REVISION_REQUESTED",
  SUBMITTED = "SUBMITTED",
}

export enum ChurchType {
  COMPANY = "COMPANY",
  PLANT = "PLANT",
  STANDARD = "STANDARD",
}

export enum EntityType {
  CHURCH = "CHURCH",
  CHURCH_DEPARTMENT = "CHURCH_DEPARTMENT",
  INSTITUTION = "INSTITUTION",
  INSTITUTION_DEPARTMENT = "INSTITUTION_DEPARTMENT",
  REGION = "REGION",
  USER = "USER",
}

export enum EventType {
  evangelism = "evangelism",
  show = "show",
}

export enum GenderType {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

/**
 * Idioma preferencial da instituição
 */
export enum LanguagePreference {
  en = "en",
  nl = "nl",
}

export enum ProjectType {
  Global = "Global",
  Local = "Local",
}

export interface ActivityFundingCreateDto {
  entity_contribution_amount: number;
  entity_contribution_percent: number;
  entity_type: EntityType;
  entity_id: string;
}

export interface AnnualBudgetUpdateDto {
  planned_budget?: number | null;
  description?: string | null;
  justification?: string | null;
  priority?: AnnualBudgetPriority | null;
  category?: AnnualBudgetCategory | null;
  notes?: string | null;
  documents?: string[] | null;
  total_expenses?: number | null;
}

export interface ApproveAnnualBudgetDto {
  approved_amount?: number | null;
  notes?: string | null;
}

export interface EventCreateDto {
  title: string;
  description: string;
  type: EventType;
  max_participants: number;
  ticket_amount: number;
  location: string;
  subscription_expires_at: string;
}

export interface ProjectActivityCreateDto {
  project_id: string;
  name: string;
  description: string;
  budget_amount: number;
  deadline: string;
  owner_id: string;
  tags: ActivityTags[];
  activity_funding: ActivityFundingCreateDto;
}

export interface RejectAnnualBudgetDto {
  reason: string;
}

export interface RequestRevisionAnnualBudgetDto {
  revision_notes: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
