/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

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

export enum GenderType {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

/**
 * Idioma preferencial do usuário
 */
export enum LanguagePreference {
  en = "en",
  nl = "nl",
}

export enum ProjectType {
  CHURCH_PLANTING = "CHURCH_PLANTING",
  EVANGELISM = "EVANGELISM",
  MISSION = "MISSION",
  OTHER = "OTHER",
  SOCIAL = "SOCIAL",
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

export interface RejectAnnualBudgetDto {
  reason: string;
}

export interface RequestRevisionAnnualBudgetDto {
  revision_notes: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
