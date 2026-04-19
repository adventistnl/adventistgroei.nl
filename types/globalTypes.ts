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

export enum AdjustmentStatus {
  CLOSED = "CLOSED",
  IN_PROGRESS = "IN_PROGRESS",
  OPEN = "OPEN",
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

/**
 * Papel do colaborador no projeto
 */
export enum CollaboratorRole {
  assignee = "assignee",
  co_owner = "co_owner",
  finance = "finance",
  owner = "owner",
  requester = "requester",
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
 * Idioma preferencial do usuário
 */
export enum LanguagePreference {
  en = "en",
  nl = "nl",
}

export enum ProjectActivityLogAction {
  ASSIGNED = "ASSIGNED",
  BUDGET_UPDATED = "BUDGET_UPDATED",
  CREATED = "CREATED",
  DEADLINE_UPDATED = "DEADLINE_UPDATED",
  DELETED = "DELETED",
  PRIORITY_CHANGED = "PRIORITY_CHANGED",
  STATUS_CHANGED = "STATUS_CHANGED",
  SUBSIDIZED_CHANGED = "SUBSIDIZED_CHANGED",
  TAG_ADDED = "TAG_ADDED",
  TAG_REMOVED = "TAG_REMOVED",
  UNASSIGNED = "UNASSIGNED",
  UPDATED = "UPDATED",
}

export enum ProjectHistoryType {
  ADJUSTMENT_NEEDED = "ADJUSTMENT_NEEDED",
  BUDGET_UPDATED = "BUDGET_UPDATED",
  COMMENT = "COMMENT",
  CO_OWNER_UPDATED = "CO_OWNER_UPDATED",
  CREATED = "CREATED",
  DEADLINE_UPDATED = "DEADLINE_UPDATED",
  DELETED = "DELETED",
  DEPARTMENT_CHANGED = "DEPARTMENT_CHANGED",
  OWNER_CHANGED = "OWNER_CHANGED",
  RESTORED = "RESTORED",
  STATUS_CHANGED = "STATUS_CHANGED",
  UPDATED = "UPDATED",
}

export enum ProjectStatus {
  ADJUSTMENTS_NEEDED = "ADJUSTMENTS_NEEDED",
  CONCLUDED = "CONCLUDED",
  DRAFT = "DRAFT",
  EXPIRED = "EXPIRED",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  ON_HOLD = "ON_HOLD",
  OPEN_REQUEST = "OPEN_REQUEST",
  OVERDUE = "OVERDUE",
  PENDING_RECEIPT = "PENDING_RECEIPT",
  WAITING_REFUND = "WAITING_REFUND",
}

export enum ProjectType {
  Global = "Global",
  Local = "Local",
}

export enum RefundType {
  PARTIAL = "PARTIAL",
  TOTAL = "TOTAL",
}

export enum SubsidyHistoryType {
  COMMENT = "COMMENT",
  DOCUMENT_ACTION = "DOCUMENT_ACTION",
  PRIORITY_CHANGE = "PRIORITY_CHANGE",
  STATUS_CHANGE = "STATUS_CHANGE",
}

export enum SubsidyRequestPriority {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export enum SubsidyRequestType {
  ADVANCE = "ADVANCE",
  WITHOUT_DOCUMENT = "WITHOUT_DOCUMENT",
  WITH_DOCUMENT = "WITH_DOCUMENT",
}

export interface ActivityFundingCreateDto {
  entity_contribution_amount: number;
  entity_contribution_percent: number;
  entity_type: EntityType;
  entity_id: string;
}

export interface ActivityFundingUpdateDto {
  entity_contribution_amount?: number | null;
  entity_contribution_percent?: number | null;
  entity_type?: EntityType | null;
  entity_id?: string | null;
}

export interface AddAdjustmentTaskDto {
  adjustment_id: string;
  title: string;
  position?: number | null;
}

export interface AdjustmentTaskInput {
  title: string;
  position?: number | null;
}

export interface ApproveAnnualBudgetDto {
  approved_amount?: number | null;
  notes?: string | null;
}

export interface ContactUpdateDto {
  name?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  country?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  full_address?: string | null;
  postal_code?: string | null;
  website?: string | null;
  notes?: string | null;
  id: string;
  is_primary?: boolean | null;
}

export interface CreateAdjustmentDto {
  project_id: string;
  comment?: string | null;
  tasks?: AdjustmentTaskInput[] | null;
}

export interface DepartmentBudgetCreateDto {
  department_id: string;
  year: number;
  planned_budget: number;
  total_expenses?: number | null;
  allocated_amount?: number | null;
  description?: string | null;
  justification?: string | null;
  priority?: AnnualBudgetPriority | null;
  category?: AnnualBudgetCategory | null;
  notes?: string | null;
}

export interface DepartmentBudgetUpdateDto {
  planned_budget?: number | null;
  total_expenses?: number | null;
  allocated_amount?: number | null;
  description?: string | null;
  justification?: string | null;
  priority?: AnnualBudgetPriority | null;
  category?: AnnualBudgetCategory | null;
  notes?: string | null;
  documents?: string[] | null;
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

export interface InstitutionBudgetCreateDto {
  institution_id: string;
  year: number;
  planned_budget: number;
  total_expenses?: number | null;
  allocated_amount?: number | null;
  description?: string | null;
  justification?: string | null;
  priority?: AnnualBudgetPriority | null;
  category?: AnnualBudgetCategory | null;
  notes?: string | null;
}

export interface InstitutionBudgetUpdateDto {
  planned_budget?: number | null;
  total_expenses?: number | null;
  allocated_amount?: number | null;
  description?: string | null;
  justification?: string | null;
  priority?: AnnualBudgetPriority | null;
  category?: AnnualBudgetCategory | null;
  notes?: string | null;
  documents?: string[] | null;
}

export interface ProjectActivityCreateDto {
  name: string;
  description: string;
  budget_amount: number;
  deadline: string;
  assignee_ids?: string[] | null;
  tags: ActivityTags[];
  custom_tags?: string[] | null;
  status?: ActivityStatus | null;
  priority?: ActivityPriority | null;
  is_subsidized?: boolean | null;
  activity_funding: ActivityFundingCreateDto;
  project_id: string;
}

export interface ProjectActivityCreateWithoutProjectDto {
  name: string;
  description: string;
  budget_amount: number;
  deadline: string;
  assignee_ids?: string[] | null;
  tags: ActivityTags[];
  custom_tags?: string[] | null;
  status?: ActivityStatus | null;
  priority?: ActivityPriority | null;
  is_subsidized?: boolean | null;
  activity_funding: ActivityFundingCreateDto;
}

export interface ProjectActivityUpdateDto {
  id: string;
  name?: string | null;
  description?: string | null;
  budget_amount?: number | null;
  deadline?: string | null;
  assignee_ids?: string[] | null;
  tags?: ActivityTags[] | null;
  custom_tags?: string[] | null;
  status?: ActivityStatus | null;
  priority?: ActivityPriority | null;
  is_subsidized?: boolean | null;
  activity_funding?: ActivityFundingUpdateDto | null;
}

export interface ProjectHistoryCreateDto {
  project_id: string;
  type: ProjectHistoryType;
  comment?: string | null;
  field_name?: string | null;
  old_value?: string | null;
  new_value?: string | null;
  metadata?: any | null;
}

export interface RejectAnnualBudgetDto {
  reason: string;
}

export interface RequestRevisionAnnualBudgetDto {
  revision_notes: string;
}

export interface SubsidyRequestCreateDto {
  description: string;
  total_budget: number;
  institution_id?: string | null;
  requester_id: string;
  department_id: string;
  church_id?: string | null;
  subsidy_status_id?: string | null;
  start_as_draft?: boolean | null;
  items?: SubsidyRequestItemInput[] | null;
  project_id: string;
  notes?: string | null;
  request_type?: SubsidyRequestType | null;
  is_for_advance?: boolean | null;
  advance_amount?: number | null;
}

export interface SubsidyRequestItemInput {
  project_activity_id: string;
  requested_amount: number;
  notes?: string | null;
  linked_activity_document_ids?: string[] | null;
  linked_document_amounts?: number[] | null;
}

export interface SubsidyRequestUpdateDto {
  description?: string | null;
  total_budget?: number | null;
  institution_id?: string | null;
  requester_id?: string | null;
  department_id?: string | null;
  church_id?: string | null;
  subsidy_status_id?: string | null;
  items?: SubsidyRequestItemInput[] | null;
  approved_amount?: number | null;
  rejection_reason?: string | null;
  notes?: string | null;
  priority?: SubsidyRequestPriority | null;
}

export interface ToggleAdjustmentTaskDto {
  task_id: string;
  completed: boolean;
}

export interface UpdateAdjustmentStatusDto {
  id: string;
  status: AdjustmentStatus;
}

export interface UploadActivityDocumentDto {
  activity_id: string;
  project_activity_id: string;
  type: string;
}

export interface UserUpdateDto {
  name?: string | null;
  email?: string | null;
  language_preference?: string | null;
  institution_id?: string | null;
  church_id?: string | null;
  department_id?: string | null;
  contact_id?: string | null;
  is_deleted?: boolean | null;
  contact?: ContactUpdateDto | null;
  gender?: GenderType | null;
  phone?: string | null;
  address?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
