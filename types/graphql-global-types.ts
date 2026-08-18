import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  Decimal: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type ActivityBudgetSummary = {
  __typename?: 'ActivityBudgetSummary';
  activity_id: Scalars['ID']['output'];
  activity_name: Scalars['String']['output'];
  allocated: Scalars['Float']['output'];
  available: Scalars['Float']['output'];
  budget: Scalars['Float']['output'];
};

export type ActivityDocuments = {
  __typename?: 'ActivityDocuments';
  activity_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  drive_file_id?: Maybe<Scalars['String']['output']>;
  file_url: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_validated: Scalars['Boolean']['output'];
  project_activity?: Maybe<ProjectActivity>;
  project_activity_id?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by?: Maybe<Scalars['String']['output']>;
  uploaded_by: Scalars['String']['output'];
  validated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type ActivityDocumentsListRelationFilter = {
  every?: InputMaybe<ActivityDocumentsWhereInput>;
  none?: InputMaybe<ActivityDocumentsWhereInput>;
  some?: InputMaybe<ActivityDocumentsWhereInput>;
};

export type ActivityDocumentsWhereInput = {
  AND?: InputMaybe<Array<ActivityDocumentsWhereInput>>;
  NOT?: InputMaybe<Array<ActivityDocumentsWhereInput>>;
  OR?: InputMaybe<Array<ActivityDocumentsWhereInput>>;
  activity_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  drive_file_id?: InputMaybe<StringNullableFilter>;
  file_url?: InputMaybe<StringFilter>;
  filename?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_validated?: InputMaybe<BoolFilter>;
  project_activity?: InputMaybe<ProjectActivityNullableScalarRelationFilter>;
  project_activity_id?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringNullableFilter>;
  uploaded_by?: InputMaybe<StringFilter>;
  validated_at?: InputMaybe<DateTimeNullableFilter>;
};

export type ActivityFunding = {
  __typename?: 'ActivityFunding';
  activity: ProjectActivity;
  activity_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by?: Maybe<Scalars['String']['output']>;
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  entity_contribution_amount: Scalars['Decimal']['output'];
  entity_contribution_percent: Scalars['Float']['output'];
  entity_id: Scalars['String']['output'];
  entity_type: EntityType;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by?: Maybe<Scalars['String']['output']>;
  validated: Scalars['Boolean']['output'];
};

export type ActivityFundingCreateDto = {
  entity_contribution_amount: Scalars['Float']['input'];
  entity_contribution_percent: Scalars['Float']['input'];
  entity_id: Scalars['String']['input'];
  entity_type: EntityType;
};

export type ActivityFundingNullableScalarRelationFilter = {
  is?: InputMaybe<ActivityFundingWhereInput>;
  isNot?: InputMaybe<ActivityFundingWhereInput>;
};

export type ActivityFundingUpdateDto = {
  entity_contribution_amount?: InputMaybe<Scalars['Float']['input']>;
  entity_contribution_percent?: InputMaybe<Scalars['Float']['input']>;
  entity_id?: InputMaybe<Scalars['String']['input']>;
  entity_type?: InputMaybe<EntityType>;
};

export type ActivityFundingWhereInput = {
  AND?: InputMaybe<Array<ActivityFundingWhereInput>>;
  NOT?: InputMaybe<Array<ActivityFundingWhereInput>>;
  OR?: InputMaybe<Array<ActivityFundingWhereInput>>;
  activity?: InputMaybe<ProjectActivityScalarRelationFilter>;
  activity_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringNullableFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  entity_contribution_amount?: InputMaybe<DecimalFilter>;
  entity_contribution_percent?: InputMaybe<FloatFilter>;
  entity_id?: InputMaybe<StringFilter>;
  entity_type?: InputMaybe<EnumEntityTypeFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringNullableFilter>;
  validated?: InputMaybe<BoolFilter>;
};

export enum ActivityPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Urgent = 'URGENT'
}

export enum ActivityStatus {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  OnHold = 'ON_HOLD',
  Todo = 'TODO'
}

export enum ActivityTags {
  Accommodation = 'ACCOMMODATION',
  Equipment = 'EQUIPMENT',
  Event = 'EVENT',
  Feeding = 'FEEDING',
  Marketing = 'MARKETING',
  Materials = 'MATERIALS',
  Reform = 'REFORM',
  Services = 'SERVICES',
  Training = 'TRAINING',
  Transport = 'TRANSPORT',
  Travel = 'TRAVEL'
}

export type AddAdjustmentTaskDto = {
  adjustment_id: Scalars['String']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type AddProjectVoluntaryDto = {
  project_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export enum AdjustmentStatus {
  Closed = 'CLOSED',
  InProgress = 'IN_PROGRESS',
  Open = 'OPEN'
}

export type AdjustmentTask = {
  __typename?: 'AdjustmentTask';
  adjustment: ProjectAdjustment;
  adjustment_id: Scalars['String']['output'];
  completed: Scalars['Boolean']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type AdjustmentTaskInput = {
  position?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type AdjustmentTaskListRelationFilter = {
  every?: InputMaybe<AdjustmentTaskWhereInput>;
  none?: InputMaybe<AdjustmentTaskWhereInput>;
  some?: InputMaybe<AdjustmentTaskWhereInput>;
};

export type AdjustmentTaskWhereInput = {
  AND?: InputMaybe<Array<AdjustmentTaskWhereInput>>;
  NOT?: InputMaybe<Array<AdjustmentTaskWhereInput>>;
  OR?: InputMaybe<Array<AdjustmentTaskWhereInput>>;
  adjustment?: InputMaybe<ProjectAdjustmentScalarRelationFilter>;
  adjustment_id?: InputMaybe<StringFilter>;
  completed?: InputMaybe<BoolFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  position?: InputMaybe<IntFilter>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type AnnualBudget = {
  __typename?: 'AnnualBudget';
  _count: AnnualBudgetCount;
  allocated_amount: Scalars['Float']['output'];
  approval_date?: Maybe<Scalars['DateTime']['output']>;
  approvedAmount: Scalars['Float']['output'];
  approved_amount?: Maybe<Scalars['Decimal']['output']>;
  approved_by?: Maybe<Scalars['String']['output']>;
  approved_user?: Maybe<User>;
  balance: Scalars['Float']['output'];
  category: AnnualBudgetCategory;
  church?: Maybe<Church>;
  church_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department?: Maybe<Department>;
  department_id?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Scalars['JSON']['output']>;
  entity_type: AnnualBudgetEntityType;
  has_budget_record: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  institution?: Maybe<Institution>;
  institution_id?: Maybe<Scalars['String']['output']>;
  is_deleted: Scalars['Boolean']['output'];
  is_locked: Scalars['Boolean']['output'];
  justification?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  planned_budget: Scalars['Decimal']['output'];
  priority: AnnualBudgetPriority;
  remainingAmount: Scalars['Float']['output'];
  requested_by: Scalars['String']['output'];
  review_date?: Maybe<Scalars['DateTime']['output']>;
  reviewed_by?: Maybe<Scalars['String']['output']>;
  spentAmount: Scalars['Float']['output'];
  status: AnnualBudgetStatus;
  submitted_date: Scalars['DateTime']['output'];
  total_expenses: Scalars['Float']['output'];
  transactions?: Maybe<Array<BudgetTransaction>>;
  transfers_in?: Maybe<Array<BudgetTransfer>>;
  transfers_out?: Maybe<Array<BudgetTransfer>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  usagePercentage: Scalars['Float']['output'];
  year: Scalars['Int']['output'];
};

export enum AnnualBudgetCategory {
  Emergency = 'EMERGENCY',
  Expansion = 'EXPANSION',
  Maintenance = 'MAINTENANCE',
  Operational = 'OPERATIONAL',
  Project = 'PROJECT'
}

export type AnnualBudgetCount = {
  __typename?: 'AnnualBudgetCount';
  transactions: Scalars['Int']['output'];
  transfers_in: Scalars['Int']['output'];
  transfers_out: Scalars['Int']['output'];
};

export enum AnnualBudgetEntityType {
  Church = 'CHURCH',
  ChurchDepartment = 'CHURCH_DEPARTMENT',
  Institution = 'INSTITUTION',
  InstitutionDepartment = 'INSTITUTION_DEPARTMENT'
}

export type AnnualBudgetListRelationFilter = {
  every?: InputMaybe<AnnualBudgetWhereInput>;
  none?: InputMaybe<AnnualBudgetWhereInput>;
  some?: InputMaybe<AnnualBudgetWhereInput>;
};

export type AnnualBudgetNullableScalarRelationFilter = {
  is?: InputMaybe<AnnualBudgetWhereInput>;
  isNot?: InputMaybe<AnnualBudgetWhereInput>;
};

export type AnnualBudgetOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type AnnualBudgetOrderByWithRelationInput = {
  approval_date?: InputMaybe<SortOrderInput>;
  approved_amount?: InputMaybe<SortOrderInput>;
  approved_by?: InputMaybe<SortOrderInput>;
  approved_user?: InputMaybe<UserOrderByWithRelationInput>;
  category?: InputMaybe<SortOrder>;
  church?: InputMaybe<ChurchOrderByWithRelationInput>;
  church_id?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  created_by?: InputMaybe<SortOrder>;
  deleted_at?: InputMaybe<SortOrderInput>;
  deleted_by?: InputMaybe<SortOrderInput>;
  department?: InputMaybe<DepartmentOrderByWithRelationInput>;
  department_id?: InputMaybe<SortOrderInput>;
  description?: InputMaybe<SortOrderInput>;
  documents?: InputMaybe<SortOrderInput>;
  entity_type?: InputMaybe<SortOrder>;
  has_budget_record?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  institution?: InputMaybe<InstitutionOrderByWithRelationInput>;
  institution_id?: InputMaybe<SortOrderInput>;
  is_deleted?: InputMaybe<SortOrder>;
  is_locked?: InputMaybe<SortOrder>;
  justification?: InputMaybe<SortOrderInput>;
  notes?: InputMaybe<SortOrderInput>;
  planned_budget?: InputMaybe<SortOrder>;
  priority?: InputMaybe<SortOrder>;
  requested_by?: InputMaybe<SortOrder>;
  review_date?: InputMaybe<SortOrderInput>;
  reviewed_by?: InputMaybe<SortOrderInput>;
  status?: InputMaybe<SortOrder>;
  submitted_date?: InputMaybe<SortOrder>;
  transactions?: InputMaybe<BudgetTransactionOrderByRelationAggregateInput>;
  transfers_in?: InputMaybe<BudgetTransferOrderByRelationAggregateInput>;
  transfers_out?: InputMaybe<BudgetTransferOrderByRelationAggregateInput>;
  updated_at?: InputMaybe<SortOrder>;
  updated_by?: InputMaybe<SortOrder>;
  year?: InputMaybe<SortOrder>;
};

export enum AnnualBudgetPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Urgent = 'URGENT'
}

export enum AnnualBudgetScalarFieldEnum {
  ApprovalDate = 'approval_date',
  ApprovedAmount = 'approved_amount',
  ApprovedBy = 'approved_by',
  Category = 'category',
  ChurchId = 'church_id',
  CreatedAt = 'created_at',
  CreatedBy = 'created_by',
  DeletedAt = 'deleted_at',
  DeletedBy = 'deleted_by',
  DepartmentId = 'department_id',
  Description = 'description',
  Documents = 'documents',
  EntityType = 'entity_type',
  HasBudgetRecord = 'has_budget_record',
  Id = 'id',
  InstitutionId = 'institution_id',
  IsDeleted = 'is_deleted',
  IsLocked = 'is_locked',
  Justification = 'justification',
  Notes = 'notes',
  PlannedBudget = 'planned_budget',
  Priority = 'priority',
  RequestedBy = 'requested_by',
  ReviewDate = 'review_date',
  ReviewedBy = 'reviewed_by',
  Status = 'status',
  SubmittedDate = 'submitted_date',
  UpdatedAt = 'updated_at',
  UpdatedBy = 'updated_by',
  Year = 'year'
}

export type AnnualBudgetScalarRelationFilter = {
  is?: InputMaybe<AnnualBudgetWhereInput>;
  isNot?: InputMaybe<AnnualBudgetWhereInput>;
};

export enum AnnualBudgetStatus {
  Approved = 'APPROVED',
  Closed = 'CLOSED',
  Draft = 'DRAFT',
  InProgress = 'IN_PROGRESS',
  Rejected = 'REJECTED',
  RevisionRequested = 'REVISION_REQUESTED',
  Submitted = 'SUBMITTED'
}

export type AnnualBudgetWhereInput = {
  AND?: InputMaybe<Array<AnnualBudgetWhereInput>>;
  NOT?: InputMaybe<Array<AnnualBudgetWhereInput>>;
  OR?: InputMaybe<Array<AnnualBudgetWhereInput>>;
  approval_date?: InputMaybe<DateTimeNullableFilter>;
  approved_amount?: InputMaybe<DecimalNullableFilter>;
  approved_by?: InputMaybe<StringNullableFilter>;
  approved_user?: InputMaybe<UserNullableScalarRelationFilter>;
  category?: InputMaybe<EnumAnnualBudgetCategoryFilter>;
  church?: InputMaybe<ChurchNullableScalarRelationFilter>;
  church_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department?: InputMaybe<DepartmentNullableScalarRelationFilter>;
  department_id?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  documents?: InputMaybe<JsonNullableFilter>;
  entity_type?: InputMaybe<EnumAnnualBudgetEntityTypeFilter>;
  has_budget_record?: InputMaybe<BoolFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionNullableScalarRelationFilter>;
  institution_id?: InputMaybe<StringNullableFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_locked?: InputMaybe<BoolFilter>;
  justification?: InputMaybe<StringNullableFilter>;
  notes?: InputMaybe<StringNullableFilter>;
  planned_budget?: InputMaybe<DecimalFilter>;
  priority?: InputMaybe<EnumAnnualBudgetPriorityFilter>;
  requested_by?: InputMaybe<StringFilter>;
  review_date?: InputMaybe<DateTimeNullableFilter>;
  reviewed_by?: InputMaybe<StringNullableFilter>;
  status?: InputMaybe<EnumAnnualBudgetStatusFilter>;
  submitted_date?: InputMaybe<DateTimeFilter>;
  transactions?: InputMaybe<BudgetTransactionListRelationFilter>;
  transfers_in?: InputMaybe<BudgetTransferListRelationFilter>;
  transfers_out?: InputMaybe<BudgetTransferListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  year?: InputMaybe<IntFilter>;
};

export type AnnualBudgetWhereUniqueInput = {
  AND?: InputMaybe<Array<AnnualBudgetWhereInput>>;
  NOT?: InputMaybe<Array<AnnualBudgetWhereInput>>;
  OR?: InputMaybe<Array<AnnualBudgetWhereInput>>;
  approval_date?: InputMaybe<DateTimeNullableFilter>;
  approved_amount?: InputMaybe<DecimalNullableFilter>;
  approved_by?: InputMaybe<StringNullableFilter>;
  approved_user?: InputMaybe<UserNullableScalarRelationFilter>;
  category?: InputMaybe<EnumAnnualBudgetCategoryFilter>;
  church?: InputMaybe<ChurchNullableScalarRelationFilter>;
  church_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department?: InputMaybe<DepartmentNullableScalarRelationFilter>;
  department_id?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  documents?: InputMaybe<JsonNullableFilter>;
  entity_type?: InputMaybe<EnumAnnualBudgetEntityTypeFilter>;
  has_budget_record?: InputMaybe<BoolFilter>;
  id?: InputMaybe<Scalars['String']['input']>;
  institution?: InputMaybe<InstitutionNullableScalarRelationFilter>;
  institution_id?: InputMaybe<StringNullableFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_locked?: InputMaybe<BoolFilter>;
  justification?: InputMaybe<StringNullableFilter>;
  notes?: InputMaybe<StringNullableFilter>;
  planned_budget?: InputMaybe<DecimalFilter>;
  priority?: InputMaybe<EnumAnnualBudgetPriorityFilter>;
  requested_by?: InputMaybe<StringFilter>;
  review_date?: InputMaybe<DateTimeNullableFilter>;
  reviewed_by?: InputMaybe<StringNullableFilter>;
  status?: InputMaybe<EnumAnnualBudgetStatusFilter>;
  submitted_date?: InputMaybe<DateTimeFilter>;
  transactions?: InputMaybe<BudgetTransactionListRelationFilter>;
  transfers_in?: InputMaybe<BudgetTransferListRelationFilter>;
  transfers_out?: InputMaybe<BudgetTransferListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  year?: InputMaybe<IntFilter>;
};

export type AnnualReport = {
  __typename?: 'AnnualReport';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department: Department;
  department_id: Scalars['String']['output'];
  file_path: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  submission_date: Scalars['DateTime']['output'];
  text: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type AnnualReportListRelationFilter = {
  every?: InputMaybe<AnnualReportWhereInput>;
  none?: InputMaybe<AnnualReportWhereInput>;
  some?: InputMaybe<AnnualReportWhereInput>;
};

export type AnnualReportOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type AnnualReportWhereInput = {
  AND?: InputMaybe<Array<AnnualReportWhereInput>>;
  NOT?: InputMaybe<Array<AnnualReportWhereInput>>;
  OR?: InputMaybe<Array<AnnualReportWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department?: InputMaybe<DepartmentScalarRelationFilter>;
  department_id?: InputMaybe<StringFilter>;
  file_path?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  submission_date?: InputMaybe<DateTimeFilter>;
  text?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type ApproveAnnualBudgetDto = {
  approved_amount?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};

export type ApproveBudgetResponse = {
  __typename?: 'ApproveBudgetResponse';
  approval_date?: Maybe<Scalars['DateTime']['output']>;
  approved_amount?: Maybe<Scalars['Float']['output']>;
  approved_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

/**
 * A church + date slot. Created directly (R8 — "self-filled"/admin-assigned, via
 * setAssignment/setAssignmentAny) in Phase 3; Phase 4 adds the request/invite flow that also
 * produces confirmed rows here.
 */
export type Assignment = {
  __typename?: 'Assignment';
  church: Church;
  church_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  locked_at?: Maybe<Scalars['DateTime']['output']>;
  origin: AssignmentOrigin;
  status: AssignmentStatus;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user?: Maybe<User>;
  user_id?: Maybe<Scalars['String']['output']>;
};

/**
 * R8.2 — reusable invite message templates, rendered through the existing MustacheService
 * (same mechanism as system emails) at send time. Distinct from the locale email JSON files,
 * which are fixed platform copy — this is per-institution, admin-authored content.
 */
export type AssignmentInviteTemplate = {
  __typename?: 'AssignmentInviteTemplate';
  _count: AssignmentInviteTemplateCount;
  body: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  requests?: Maybe<Array<AssignmentRequest>>;
  subject: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type AssignmentInviteTemplateCount = {
  __typename?: 'AssignmentInviteTemplateCount';
  requests: Scalars['Int']['output'];
};

export type AssignmentInviteTemplateListRelationFilter = {
  every?: InputMaybe<AssignmentInviteTemplateWhereInput>;
  none?: InputMaybe<AssignmentInviteTemplateWhereInput>;
  some?: InputMaybe<AssignmentInviteTemplateWhereInput>;
};

export type AssignmentInviteTemplateNullableScalarRelationFilter = {
  is?: InputMaybe<AssignmentInviteTemplateWhereInput>;
  isNot?: InputMaybe<AssignmentInviteTemplateWhereInput>;
};

export type AssignmentInviteTemplateOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type AssignmentInviteTemplateWhereInput = {
  AND?: InputMaybe<Array<AssignmentInviteTemplateWhereInput>>;
  NOT?: InputMaybe<Array<AssignmentInviteTemplateWhereInput>>;
  OR?: InputMaybe<Array<AssignmentInviteTemplateWhereInput>>;
  body?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  name?: InputMaybe<StringFilter>;
  requests?: InputMaybe<AssignmentRequestListRelationFilter>;
  subject?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type AssignmentListRelationFilter = {
  every?: InputMaybe<AssignmentWhereInput>;
  none?: InputMaybe<AssignmentWhereInput>;
  some?: InputMaybe<AssignmentWhereInput>;
};

export type AssignmentOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum AssignmentOrigin {
  AdminAssigned = 'ADMIN_ASSIGNED',
  ChurchInvited = 'CHURCH_INVITED',
  PreacherRequested = 'PREACHER_REQUESTED',
  SelfFilled = 'SELF_FILLED'
}

/**
 * R5 — a pending candidature (preacher applied) or invite (church/admin invited), converging
 * on the same accept/decline flow (respondToAssignmentRequest). R7 — accepting one supersedes
 * every other pending request for the same church+date.
 */
export type AssignmentRequest = {
  __typename?: 'AssignmentRequest';
  church: Church;
  church_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  decided_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  status: RequestStatus;
  template?: Maybe<AssignmentInviteTemplate>;
  template_id?: Maybe<Scalars['String']['output']>;
  type: RequestType;
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type AssignmentRequestListRelationFilter = {
  every?: InputMaybe<AssignmentRequestWhereInput>;
  none?: InputMaybe<AssignmentRequestWhereInput>;
  some?: InputMaybe<AssignmentRequestWhereInput>;
};

export type AssignmentRequestOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type AssignmentRequestWhereInput = {
  AND?: InputMaybe<Array<AssignmentRequestWhereInput>>;
  NOT?: InputMaybe<Array<AssignmentRequestWhereInput>>;
  OR?: InputMaybe<Array<AssignmentRequestWhereInput>>;
  church?: InputMaybe<ChurchScalarRelationFilter>;
  church_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  date?: InputMaybe<DateTimeFilter>;
  decided_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  status?: InputMaybe<EnumRequestStatusFilter>;
  template?: InputMaybe<AssignmentInviteTemplateNullableScalarRelationFilter>;
  template_id?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<EnumRequestTypeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export enum AssignmentStatus {
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED',
  Draft = 'DRAFT',
  Locked = 'LOCKED',
  PendingConfirmation = 'PENDING_CONFIRMATION'
}

export type AssignmentWhereInput = {
  AND?: InputMaybe<Array<AssignmentWhereInput>>;
  NOT?: InputMaybe<Array<AssignmentWhereInput>>;
  OR?: InputMaybe<Array<AssignmentWhereInput>>;
  church?: InputMaybe<ChurchScalarRelationFilter>;
  church_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  date?: InputMaybe<DateTimeFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  locked_at?: InputMaybe<DateTimeNullableFilter>;
  origin?: InputMaybe<EnumAssignmentOriginFilter>;
  status?: InputMaybe<EnumAssignmentStatusFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserNullableScalarRelationFilter>;
  user_id?: InputMaybe<StringNullableFilter>;
};

export type AuthModel = {
  __typename?: 'AuthModel';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Float']['output'];
  user: UserWithRoles;
};

export type Availability = {
  __typename?: 'Availability';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  note?: Maybe<Scalars['String']['output']>;
  recurrence_rule?: Maybe<AvailabilityRecurrenceRule>;
  recurrence_rule_id?: Maybe<Scalars['String']['output']>;
  source: AvailabilitySource;
  status: AvailabilityStatus;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type AvailabilityListRelationFilter = {
  every?: InputMaybe<AvailabilityWhereInput>;
  none?: InputMaybe<AvailabilityWhereInput>;
  some?: InputMaybe<AvailabilityWhereInput>;
};

export type AvailabilityOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

/**
 * A preacher's weekly/date-range availability pattern, set from their Profile screen.
 * Never read directly by gap-report/overview/invite logic — those only ever read
 * materialized Availability rows (see Availability.source above).
 */
export type AvailabilityRecurrenceRule = {
  __typename?: 'AvailabilityRecurrenceRule';
  _count: AvailabilityRecurrenceRuleCount;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  day_of_week?: Maybe<Scalars['Int']['output']>;
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  effective_from: Scalars['DateTime']['output'];
  effective_until?: Maybe<Scalars['DateTime']['output']>;
  end_date?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  materialized_availabilities?: Maybe<Array<Availability>>;
  note?: Maybe<Scalars['String']['output']>;
  start_date?: Maybe<Scalars['DateTime']['output']>;
  status: AvailabilityStatus;
  type: RecurrenceType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type AvailabilityRecurrenceRuleCount = {
  __typename?: 'AvailabilityRecurrenceRuleCount';
  materialized_availabilities: Scalars['Int']['output'];
};

export type AvailabilityRecurrenceRuleListRelationFilter = {
  every?: InputMaybe<AvailabilityRecurrenceRuleWhereInput>;
  none?: InputMaybe<AvailabilityRecurrenceRuleWhereInput>;
  some?: InputMaybe<AvailabilityRecurrenceRuleWhereInput>;
};

export type AvailabilityRecurrenceRuleNullableScalarRelationFilter = {
  is?: InputMaybe<AvailabilityRecurrenceRuleWhereInput>;
  isNot?: InputMaybe<AvailabilityRecurrenceRuleWhereInput>;
};

export type AvailabilityRecurrenceRuleOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type AvailabilityRecurrenceRuleWhereInput = {
  AND?: InputMaybe<Array<AvailabilityRecurrenceRuleWhereInput>>;
  NOT?: InputMaybe<Array<AvailabilityRecurrenceRuleWhereInput>>;
  OR?: InputMaybe<Array<AvailabilityRecurrenceRuleWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  day_of_week?: InputMaybe<IntNullableFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  effective_from?: InputMaybe<DateTimeFilter>;
  effective_until?: InputMaybe<DateTimeNullableFilter>;
  end_date?: InputMaybe<DateTimeNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  materialized_availabilities?: InputMaybe<AvailabilityListRelationFilter>;
  note?: InputMaybe<StringNullableFilter>;
  start_date?: InputMaybe<DateTimeNullableFilter>;
  status?: InputMaybe<EnumAvailabilityStatusFilter>;
  type?: InputMaybe<EnumRecurrenceTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

/**
 * MANUAL = the preacher (or an admin) set this exact date directly, always wins.
 * RECURRENCE_RULE = materialized from an AvailabilityRecurrenceRule; overwritten when the
 * rule regenerates, unless a later MANUAL edit on the same date takes precedence.
 */
export enum AvailabilitySource {
  Manual = 'MANUAL',
  RecurrenceRule = 'RECURRENCE_RULE'
}

export enum AvailabilityStatus {
  Available = 'AVAILABLE',
  Unavailable = 'UNAVAILABLE',
  Vacation = 'VACATION'
}

export type AvailabilityWhereInput = {
  AND?: InputMaybe<Array<AvailabilityWhereInput>>;
  NOT?: InputMaybe<Array<AvailabilityWhereInput>>;
  OR?: InputMaybe<Array<AvailabilityWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  date?: InputMaybe<DateTimeFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  note?: InputMaybe<StringNullableFilter>;
  recurrence_rule?: InputMaybe<AvailabilityRecurrenceRuleNullableScalarRelationFilter>;
  recurrence_rule_id?: InputMaybe<StringNullableFilter>;
  source?: InputMaybe<EnumAvailabilitySourceFilter>;
  status?: InputMaybe<EnumAvailabilityStatusFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type BoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type BudgetDistribution = {
  __typename?: 'BudgetDistribution';
  allocated: Scalars['Float']['output'];
  available: Scalars['Float']['output'];
  percentageUsed: Scalars['Float']['output'];
  spent: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type BudgetKpIs = {
  __typename?: 'BudgetKPIs';
  /** Número de departments ativos (sempre 0 para budgets da instituição) */
  activeDepartments: Scalars['Int']['output'];
  budgetRemaining: Scalars['Float']['output'];
  budgetUtilization: Scalars['Float']['output'];
  totalAllocated: Scalars['Float']['output'];
  totalInstitutionBudget: Scalars['Float']['output'];
  totalSpent: Scalars['Float']['output'];
};

export type BudgetTransaction = {
  __typename?: 'BudgetTransaction';
  annual_budget: AnnualBudget;
  annual_budget_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  delta_allocated: Scalars['Decimal']['output'];
  delta_expenses: Scalars['Decimal']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  project?: Maybe<Project>;
  project_id?: Maybe<Scalars['String']['output']>;
  subsidy_request?: Maybe<SubsidyRequest>;
  subsidy_request_id?: Maybe<Scalars['String']['output']>;
  type: BudgetTransactionType;
};

export type BudgetTransactionListRelationFilter = {
  every?: InputMaybe<BudgetTransactionWhereInput>;
  none?: InputMaybe<BudgetTransactionWhereInput>;
  some?: InputMaybe<BudgetTransactionWhereInput>;
};

export type BudgetTransactionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum BudgetTransactionType {
  AllocationReleased = 'ALLOCATION_RELEASED',
  AllocationReserved = 'ALLOCATION_RESERVED',
  ExpenseApproved = 'EXPENSE_APPROVED',
  InitialBalance = 'INITIAL_BALANCE',
  ManualAdjustment = 'MANUAL_ADJUSTMENT',
  RefundPartial = 'REFUND_PARTIAL',
  RefundTotal = 'REFUND_TOTAL'
}

export type BudgetTransactionWhereInput = {
  AND?: InputMaybe<Array<BudgetTransactionWhereInput>>;
  NOT?: InputMaybe<Array<BudgetTransactionWhereInput>>;
  OR?: InputMaybe<Array<BudgetTransactionWhereInput>>;
  annual_budget?: InputMaybe<AnnualBudgetScalarRelationFilter>;
  annual_budget_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  delta_allocated?: InputMaybe<DecimalFilter>;
  delta_expenses?: InputMaybe<DecimalFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  project?: InputMaybe<ProjectNullableScalarRelationFilter>;
  project_id?: InputMaybe<StringNullableFilter>;
  subsidy_request?: InputMaybe<SubsidyRequestNullableScalarRelationFilter>;
  subsidy_request_id?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<EnumBudgetTransactionTypeFilter>;
};

export type BudgetTransfer = {
  __typename?: 'BudgetTransfer';
  amount: Scalars['Decimal']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  description: Scalars['String']['output'];
  from_budget?: Maybe<AnnualBudget>;
  from_budget_id?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  to_budget?: Maybe<AnnualBudget>;
  to_budget_id?: Maybe<Scalars['String']['output']>;
  type: TransferType;
};

export type BudgetTransferListRelationFilter = {
  every?: InputMaybe<BudgetTransferWhereInput>;
  none?: InputMaybe<BudgetTransferWhereInput>;
  some?: InputMaybe<BudgetTransferWhereInput>;
};

export type BudgetTransferOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type BudgetTransferWhereInput = {
  AND?: InputMaybe<Array<BudgetTransferWhereInput>>;
  NOT?: InputMaybe<Array<BudgetTransferWhereInput>>;
  OR?: InputMaybe<Array<BudgetTransferWhereInput>>;
  amount?: InputMaybe<DecimalFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  from_budget?: InputMaybe<AnnualBudgetNullableScalarRelationFilter>;
  from_budget_id?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  to_budget?: InputMaybe<AnnualBudgetNullableScalarRelationFilter>;
  to_budget_id?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<EnumTransferTypeFilter>;
};

export type Church = {
  __typename?: 'Church';
  _count: ChurchCount;
  annual_budgets?: Maybe<Array<AnnualBudget>>;
  assignment_requests?: Maybe<Array<AssignmentRequest>>;
  assignments?: Maybe<Array<Assignment>>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<Array<Department>>;
  house_number?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  leader?: Maybe<User>;
  leader_id?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  region?: Maybe<Region>;
  region_id?: Maybe<Scalars['String']['output']>;
  service_calendar?: Maybe<Array<ChurchServiceCalendar>>;
  subsidy_requests?: Maybe<Array<SubsidyRequest>>;
  type: ChurchType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
  zip_code?: Maybe<Scalars['String']['output']>;
};

export type ChurchActivityData = {
  __typename?: 'ChurchActivityData';
  activity_score: Scalars['Float']['output'];
  church_id: Scalars['String']['output'];
  church_name: Scalars['String']['output'];
  department_count: Scalars['Float']['output'];
  has_new_users: Scalars['Boolean']['output'];
  has_recent_activity: Scalars['Boolean']['output'];
  has_recent_departments: Scalars['Boolean']['output'];
  has_recent_projects: Scalars['Boolean']['output'];
  has_updated_church: Scalars['Boolean']['output'];
  month: Scalars['String']['output'];
  project_count: Scalars['Float']['output'];
  user_count: Scalars['Float']['output'];
  year: Scalars['Float']['output'];
};

export type ChurchChartData = {
  __typename?: 'ChurchChartData';
  activeMembers: Scalars['Float']['output'];
  activeProjects: Scalars['Float']['output'];
  church: Scalars['String']['output'];
  fill: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  members: Scalars['Float']['output'];
  projects: Scalars['Float']['output'];
};

export type ChurchCount = {
  __typename?: 'ChurchCount';
  annual_budgets: Scalars['Int']['output'];
  assignment_requests: Scalars['Int']['output'];
  assignments: Scalars['Int']['output'];
  departments: Scalars['Int']['output'];
  projects: Scalars['Int']['output'];
  service_calendar: Scalars['Int']['output'];
  subsidy_requests: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type ChurchCreateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  house_number?: InputMaybe<Scalars['Int']['input']>;
  institution_id: Scalars['String']['input'];
  leader_id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  type?: InputMaybe<ChurchType>;
  zip_code?: InputMaybe<Scalars['String']['input']>;
};

export type ChurchGapEntry = {
  __typename?: 'ChurchGapEntry';
  churchId: Scalars['String']['output'];
  churchName: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
};

export type ChurchKpiData = {
  __typename?: 'ChurchKPIData';
  avgMembersPerChurch: Scalars['Float']['output'];
  budgetUtilization: Scalars['Float']['output'];
  totalBudget: Scalars['Float']['output'];
  totalChurches: Scalars['Float']['output'];
  totalDepartments: Scalars['Float']['output'];
  totalMembers: Scalars['Float']['output'];
  totalSubsidyRequests: Scalars['Float']['output'];
  totalUsedBudget: Scalars['Float']['output'];
};

export type ChurchListRelationFilter = {
  every?: InputMaybe<ChurchWhereInput>;
  none?: InputMaybe<ChurchWhereInput>;
  some?: InputMaybe<ChurchWhereInput>;
};

export type ChurchNullableScalarRelationFilter = {
  is?: InputMaybe<ChurchWhereInput>;
  isNot?: InputMaybe<ChurchWhereInput>;
};

export type ChurchOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ChurchOrderByWithRelationInput = {
  annual_budgets?: InputMaybe<AnnualBudgetOrderByRelationAggregateInput>;
  assignment_requests?: InputMaybe<AssignmentRequestOrderByRelationAggregateInput>;
  assignments?: InputMaybe<AssignmentOrderByRelationAggregateInput>;
  contact?: InputMaybe<ContactOrderByWithRelationInput>;
  contact_id?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  created_by?: InputMaybe<SortOrder>;
  deleted_at?: InputMaybe<SortOrderInput>;
  deleted_by?: InputMaybe<SortOrderInput>;
  departments?: InputMaybe<DepartmentOrderByRelationAggregateInput>;
  house_number?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  institution?: InputMaybe<InstitutionOrderByWithRelationInput>;
  institution_id?: InputMaybe<SortOrder>;
  is_deleted?: InputMaybe<SortOrder>;
  leader?: InputMaybe<UserOrderByWithRelationInput>;
  leader_id?: InputMaybe<SortOrderInput>;
  name?: InputMaybe<SortOrder>;
  projects?: InputMaybe<ProjectOrderByRelationAggregateInput>;
  region?: InputMaybe<RegionOrderByWithRelationInput>;
  region_id?: InputMaybe<SortOrderInput>;
  service_calendar?: InputMaybe<ChurchServiceCalendarOrderByRelationAggregateInput>;
  subsidy_requests?: InputMaybe<SubsidyRequestOrderByRelationAggregateInput>;
  type?: InputMaybe<SortOrder>;
  updated_at?: InputMaybe<SortOrder>;
  updated_by?: InputMaybe<SortOrder>;
  users?: InputMaybe<UserOrderByRelationAggregateInput>;
  zip_code?: InputMaybe<SortOrderInput>;
};

export type ChurchScalarRelationFilter = {
  is?: InputMaybe<ChurchWhereInput>;
  isNot?: InputMaybe<ChurchWhereInput>;
};

export type ChurchServiceCalendar = {
  __typename?: 'ChurchServiceCalendar';
  church: Church;
  church_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  has_service: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  source: ServiceCalendarSource;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type ChurchServiceCalendarListRelationFilter = {
  every?: InputMaybe<ChurchServiceCalendarWhereInput>;
  none?: InputMaybe<ChurchServiceCalendarWhereInput>;
  some?: InputMaybe<ChurchServiceCalendarWhereInput>;
};

export type ChurchServiceCalendarOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ChurchServiceCalendarWhereInput = {
  AND?: InputMaybe<Array<ChurchServiceCalendarWhereInput>>;
  NOT?: InputMaybe<Array<ChurchServiceCalendarWhereInput>>;
  OR?: InputMaybe<Array<ChurchServiceCalendarWhereInput>>;
  church?: InputMaybe<ChurchScalarRelationFilter>;
  church_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  date?: InputMaybe<DateTimeFilter>;
  has_service?: InputMaybe<BoolFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  source?: InputMaybe<EnumServiceCalendarSourceFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export enum ChurchType {
  Company = 'COMPANY',
  Plant = 'PLANT',
  Standard = 'STANDARD'
}

export type ChurchUpdateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  departmens?: InputMaybe<Array<Scalars['String']['input']>>;
  house_number?: InputMaybe<Scalars['Int']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  leader_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subsidy_requests?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<ChurchType>;
  users?: InputMaybe<Array<Scalars['String']['input']>>;
  zip_code?: InputMaybe<Scalars['String']['input']>;
};

export type ChurchWhereInput = {
  AND?: InputMaybe<Array<ChurchWhereInput>>;
  NOT?: InputMaybe<Array<ChurchWhereInput>>;
  OR?: InputMaybe<Array<ChurchWhereInput>>;
  annual_budgets?: InputMaybe<AnnualBudgetListRelationFilter>;
  assignment_requests?: InputMaybe<AssignmentRequestListRelationFilter>;
  assignments?: InputMaybe<AssignmentListRelationFilter>;
  contact?: InputMaybe<ContactNullableScalarRelationFilter>;
  contact_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  departments?: InputMaybe<DepartmentListRelationFilter>;
  house_number?: InputMaybe<IntNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  leader?: InputMaybe<UserNullableScalarRelationFilter>;
  leader_id?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  projects?: InputMaybe<ProjectListRelationFilter>;
  region?: InputMaybe<RegionNullableScalarRelationFilter>;
  region_id?: InputMaybe<StringNullableFilter>;
  service_calendar?: InputMaybe<ChurchServiceCalendarListRelationFilter>;
  subsidy_requests?: InputMaybe<SubsidyRequestListRelationFilter>;
  type?: InputMaybe<EnumChurchTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  users?: InputMaybe<UserListRelationFilter>;
  zip_code?: InputMaybe<StringNullableFilter>;
};

export type ChurchesByRegionData = {
  __typename?: 'ChurchesByRegionData';
  churches: Scalars['Float']['output'];
  color?: Maybe<Scalars['String']['output']>;
  fill: Scalars['String']['output'];
  name: Scalars['String']['output'];
  region: Scalars['String']['output'];
};

/** Papel do colaborador no projeto */
export enum CollaboratorRole {
  Assignee = 'assignee',
  CoOwner = 'co_owner',
  Finance = 'finance',
  Owner = 'owner',
  Requester = 'requester'
}

export type Communication = {
  __typename?: 'Communication';
  _count: CommunicationCount;
  author: User;
  author_id: Scalars['String']['output'];
  communication_recipients?: Maybe<Array<CommunicationRecipient>>;
  content: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  language_preference: LanguagePreference;
  priority: Scalars['String']['output'];
  published_at: Scalars['DateTime']['output'];
  schedule_at: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type CommunicationCount = {
  __typename?: 'CommunicationCount';
  communication_recipients: Scalars['Int']['output'];
};

export type CommunicationCreateDto = {
  author_id: Scalars['String']['input'];
  content: Scalars['String']['input'];
  institution_id: Scalars['String']['input'];
  language_preference: LanguagePreference;
  priority: Scalars['String']['input'];
  published_at: Scalars['DateTime']['input'];
  schedule_at: Scalars['DateTime']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CommunicationListRelationFilter = {
  every?: InputMaybe<CommunicationWhereInput>;
  none?: InputMaybe<CommunicationWhereInput>;
  some?: InputMaybe<CommunicationWhereInput>;
};

export type CommunicationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type CommunicationRecipient = {
  __typename?: 'CommunicationRecipient';
  communication: Communication;
  communication_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  target_id?: Maybe<Scalars['String']['output']>;
  target_type: EventTargetType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type CommunicationRecipientListRelationFilter = {
  every?: InputMaybe<CommunicationRecipientWhereInput>;
  none?: InputMaybe<CommunicationRecipientWhereInput>;
  some?: InputMaybe<CommunicationRecipientWhereInput>;
};

export type CommunicationRecipientWhereInput = {
  AND?: InputMaybe<Array<CommunicationRecipientWhereInput>>;
  NOT?: InputMaybe<Array<CommunicationRecipientWhereInput>>;
  OR?: InputMaybe<Array<CommunicationRecipientWhereInput>>;
  communication?: InputMaybe<CommunicationScalarRelationFilter>;
  communication_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  target_id?: InputMaybe<StringNullableFilter>;
  target_type?: InputMaybe<EnumEventTargetTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type CommunicationScalarRelationFilter = {
  is?: InputMaybe<CommunicationWhereInput>;
  isNot?: InputMaybe<CommunicationWhereInput>;
};

export type CommunicationUpdateDto = {
  author_id?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  language_preference?: InputMaybe<LanguagePreference>;
  priority?: InputMaybe<Scalars['String']['input']>;
  published_at?: InputMaybe<Scalars['DateTime']['input']>;
  schedule_at?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type CommunicationWhereInput = {
  AND?: InputMaybe<Array<CommunicationWhereInput>>;
  NOT?: InputMaybe<Array<CommunicationWhereInput>>;
  OR?: InputMaybe<Array<CommunicationWhereInput>>;
  author?: InputMaybe<UserScalarRelationFilter>;
  author_id?: InputMaybe<StringFilter>;
  communication_recipients?: InputMaybe<CommunicationRecipientListRelationFilter>;
  content?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  language_preference?: InputMaybe<EnumLanguagePreferenceFilter>;
  priority?: InputMaybe<StringFilter>;
  published_at?: InputMaybe<DateTimeFilter>;
  schedule_at?: InputMaybe<DateTimeFilter>;
  status?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type Contact = {
  __typename?: 'Contact';
  Church?: Maybe<Array<Church>>;
  Department?: Maybe<Array<Department>>;
  Event?: Maybe<Array<Event>>;
  Institution?: Maybe<Institution>;
  User?: Maybe<Array<User>>;
  _count: ContactCount;
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  full_address?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_primary: Scalars['Boolean']['output'];
  mobile?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  postal_code?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type ContactCount = {
  __typename?: 'ContactCount';
  Church: Scalars['Int']['output'];
  Department: Scalars['Int']['output'];
  Event: Scalars['Int']['output'];
  User: Scalars['Int']['output'];
};

export type ContactCreateDto = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_address?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type ContactNullableScalarRelationFilter = {
  is?: InputMaybe<ContactWhereInput>;
  isNot?: InputMaybe<ContactWhereInput>;
};

export type ContactOrderByWithRelationInput = {
  Church?: InputMaybe<ChurchOrderByRelationAggregateInput>;
  Department?: InputMaybe<DepartmentOrderByRelationAggregateInput>;
  Event?: InputMaybe<EventOrderByRelationAggregateInput>;
  Institution?: InputMaybe<InstitutionOrderByWithRelationInput>;
  User?: InputMaybe<UserOrderByRelationAggregateInput>;
  address?: InputMaybe<SortOrderInput>;
  city?: InputMaybe<SortOrderInput>;
  country?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  created_by?: InputMaybe<SortOrder>;
  deleted_at?: InputMaybe<SortOrderInput>;
  deleted_by?: InputMaybe<SortOrderInput>;
  email?: InputMaybe<SortOrderInput>;
  full_address?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  is_deleted?: InputMaybe<SortOrder>;
  is_primary?: InputMaybe<SortOrder>;
  mobile?: InputMaybe<SortOrderInput>;
  name?: InputMaybe<SortOrderInput>;
  notes?: InputMaybe<SortOrderInput>;
  phone?: InputMaybe<SortOrderInput>;
  postal_code?: InputMaybe<SortOrderInput>;
  state?: InputMaybe<SortOrderInput>;
  updated_at?: InputMaybe<SortOrder>;
  updated_by?: InputMaybe<SortOrder>;
  website?: InputMaybe<SortOrderInput>;
};

export type ContactScalarRelationFilter = {
  is?: InputMaybe<ContactWhereInput>;
  isNot?: InputMaybe<ContactWhereInput>;
};

export type ContactUpdateDto = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_address?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  is_primary?: InputMaybe<Scalars['Boolean']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type ContactWhereInput = {
  AND?: InputMaybe<Array<ContactWhereInput>>;
  Church?: InputMaybe<ChurchListRelationFilter>;
  Department?: InputMaybe<DepartmentListRelationFilter>;
  Event?: InputMaybe<EventListRelationFilter>;
  Institution?: InputMaybe<InstitutionNullableScalarRelationFilter>;
  NOT?: InputMaybe<Array<ContactWhereInput>>;
  OR?: InputMaybe<Array<ContactWhereInput>>;
  User?: InputMaybe<UserListRelationFilter>;
  address?: InputMaybe<StringNullableFilter>;
  city?: InputMaybe<StringNullableFilter>;
  country?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  email?: InputMaybe<StringNullableFilter>;
  full_address?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_primary?: InputMaybe<BoolFilter>;
  mobile?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringNullableFilter>;
  notes?: InputMaybe<StringNullableFilter>;
  phone?: InputMaybe<StringNullableFilter>;
  postal_code?: InputMaybe<StringNullableFilter>;
  state?: InputMaybe<StringNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  website?: InputMaybe<StringNullableFilter>;
};

export type CreateAdjustmentDto = {
  comment?: InputMaybe<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  tasks?: InputMaybe<Array<AdjustmentTaskInput>>;
};

export type CreateAssignmentInviteTemplateInput = {
  body: Scalars['String']['input'];
  name: Scalars['String']['input'];
  subject: Scalars['String']['input'];
};

export type CreateRoleInput = {
  description: Scalars['String']['input'];
  key_code: Scalars['String']['input'];
  name: Scalars['String']['input'];
  permissionIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateSubsidyStatusDto = {
  assigned_to: Scalars['String']['input'];
  department_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  order: Scalars['Int']['input'];
};

export type CreateWithoutDocumentSubsidyRequestDto = {
  church_id?: InputMaybe<Scalars['String']['input']>;
  department_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  institution_id?: InputMaybe<Scalars['String']['input']>;
  items: Array<SubsidyRequestItemInput>;
  notes?: InputMaybe<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  requester_id: Scalars['String']['input'];
  total_budget: Scalars['Float']['input'];
};

export type DateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type DecimalFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type DecimalNullableFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type DeleteBudgetResponse = {
  __typename?: 'DeleteBudgetResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Department = {
  __typename?: 'Department';
  _count: DepartmentCount;
  annual_budgets: Array<AnnualBudget>;
  annual_reports?: Maybe<Array<AnnualReport>>;
  church?: Maybe<Church>;
  church_id?: Maybe<Scalars['String']['output']>;
  church_projects?: Maybe<Array<Project>>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  leader?: Maybe<User>;
  leader_id?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  subsidy_requests?: Maybe<Array<SubsidyRequest>>;
  subsidy_statuses?: Maybe<Array<SubsidyStatus>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
};

export type DepartmentActivityData = {
  __typename?: 'DepartmentActivityData';
  activity_count: Scalars['Int']['output'];
  allocated_amount: Scalars['Float']['output'];
  completed_projects: Scalars['Int']['output'];
  department_id: Scalars['String']['output'];
  department_name: Scalars['String']['output'];
  open_projects: Scalars['Int']['output'];
  project_count: Scalars['Int']['output'];
  spent_amount: Scalars['Float']['output'];
  user_count: Scalars['Int']['output'];
};

export type DepartmentBudgetCreateDto = {
  allocated_amount?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<AnnualBudgetCategory>;
  department_id: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  justification?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  planned_budget: Scalars['Float']['input'];
  priority?: InputMaybe<AnnualBudgetPriority>;
  total_expenses?: InputMaybe<Scalars['Float']['input']>;
  year: Scalars['Int']['input'];
};

export type DepartmentBudgetTimeline = {
  __typename?: 'DepartmentBudgetTimeline';
  allocated: Scalars['Float']['output'];
  department_id: Scalars['String']['output'];
  department_name: Scalars['String']['output'];
  month: Scalars['String']['output'];
  spent: Scalars['Float']['output'];
};

export type DepartmentBudgetUpdateDto = {
  allocated_amount?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<AnnualBudgetCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  documents?: InputMaybe<Array<Scalars['String']['input']>>;
  justification?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  planned_budget?: InputMaybe<Scalars['Float']['input']>;
  priority?: InputMaybe<AnnualBudgetPriority>;
  total_expenses?: InputMaybe<Scalars['Float']['input']>;
};

export type DepartmentCount = {
  __typename?: 'DepartmentCount';
  annual_budgets: Scalars['Int']['output'];
  annual_reports: Scalars['Int']['output'];
  church_projects: Scalars['Int']['output'];
  projects: Scalars['Int']['output'];
  subsidy_requests: Scalars['Int']['output'];
  subsidy_statuses: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type DepartmentCreateDto = {
  church?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<ContactCreateDto>;
  description: Scalars['String']['input'];
  institution: Scalars['String']['input'];
  leader_id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type DepartmentKpIs = {
  __typename?: 'DepartmentKPIs';
  activeDepartments: Scalars['Int']['output'];
  averageBudgetPerDepartment: Scalars['Float']['output'];
  averageUsersPerDepartment: Scalars['Float']['output'];
  completedProjects: Scalars['Int']['output'];
  departmentsWithBudget: Scalars['Int']['output'];
  openProjects: Scalars['Int']['output'];
  totalAllocatedBudget: Scalars['Float']['output'];
  totalDepartments: Scalars['Int']['output'];
  totalProjects: Scalars['Int']['output'];
  totalSpentBudget: Scalars['Float']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type DepartmentListRelationFilter = {
  every?: InputMaybe<DepartmentWhereInput>;
  none?: InputMaybe<DepartmentWhereInput>;
  some?: InputMaybe<DepartmentWhereInput>;
};

export type DepartmentMonthlySpending = {
  __typename?: 'DepartmentMonthlySpending';
  amount: Scalars['Float']['output'];
  departmentId: Scalars['String']['output'];
  departmentName: Scalars['String']['output'];
};

export type DepartmentNullableScalarRelationFilter = {
  is?: InputMaybe<DepartmentWhereInput>;
  isNot?: InputMaybe<DepartmentWhereInput>;
};

export type DepartmentOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type DepartmentOrderByWithRelationInput = {
  annual_budgets?: InputMaybe<AnnualBudgetOrderByRelationAggregateInput>;
  annual_reports?: InputMaybe<AnnualReportOrderByRelationAggregateInput>;
  church?: InputMaybe<ChurchOrderByWithRelationInput>;
  church_id?: InputMaybe<SortOrderInput>;
  church_projects?: InputMaybe<ProjectOrderByRelationAggregateInput>;
  contact?: InputMaybe<ContactOrderByWithRelationInput>;
  contact_id?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  created_by?: InputMaybe<SortOrder>;
  deleted_at?: InputMaybe<SortOrderInput>;
  deleted_by?: InputMaybe<SortOrderInput>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  institution?: InputMaybe<InstitutionOrderByWithRelationInput>;
  institution_id?: InputMaybe<SortOrder>;
  is_deleted?: InputMaybe<SortOrder>;
  leader?: InputMaybe<UserOrderByWithRelationInput>;
  leader_id?: InputMaybe<SortOrderInput>;
  name?: InputMaybe<SortOrder>;
  projects?: InputMaybe<ProjectOrderByRelationAggregateInput>;
  subsidy_requests?: InputMaybe<SubsidyRequestOrderByRelationAggregateInput>;
  subsidy_statuses?: InputMaybe<SubsidyStatusOrderByRelationAggregateInput>;
  updated_at?: InputMaybe<SortOrder>;
  updated_by?: InputMaybe<SortOrder>;
  users?: InputMaybe<UserOrderByRelationAggregateInput>;
};

export type DepartmentScalarRelationFilter = {
  is?: InputMaybe<DepartmentWhereInput>;
  isNot?: InputMaybe<DepartmentWhereInput>;
};

export type DepartmentSpending = {
  __typename?: 'DepartmentSpending';
  approved: Scalars['Float']['output'];
  available: Scalars['Float']['output'];
  institution: Scalars['String']['output'];
  name: Scalars['String']['output'];
  planned: Scalars['Float']['output'];
  reserved: Scalars['Float']['output'];
  spent: Scalars['Float']['output'];
};

export type DepartmentUpdateDto = {
  church_id?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<ContactCreateDto>;
  description?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  leader_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type DepartmentWhereInput = {
  AND?: InputMaybe<Array<DepartmentWhereInput>>;
  NOT?: InputMaybe<Array<DepartmentWhereInput>>;
  OR?: InputMaybe<Array<DepartmentWhereInput>>;
  annual_budgets?: InputMaybe<AnnualBudgetListRelationFilter>;
  annual_reports?: InputMaybe<AnnualReportListRelationFilter>;
  church?: InputMaybe<ChurchNullableScalarRelationFilter>;
  church_id?: InputMaybe<StringNullableFilter>;
  church_projects?: InputMaybe<ProjectListRelationFilter>;
  contact?: InputMaybe<ContactNullableScalarRelationFilter>;
  contact_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  leader?: InputMaybe<UserNullableScalarRelationFilter>;
  leader_id?: InputMaybe<StringNullableFilter>;
  name?: InputMaybe<StringFilter>;
  projects?: InputMaybe<ProjectListRelationFilter>;
  subsidy_requests?: InputMaybe<SubsidyRequestListRelationFilter>;
  subsidy_statuses?: InputMaybe<SubsidyStatusListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  users?: InputMaybe<UserListRelationFilter>;
};

export type DirectMessage = {
  __typename?: 'DirectMessage';
  _count: DirectMessageCount;
  content: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  direct_message_recipients?: Maybe<Array<DirectMessageRecipient>>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  sender: User;
  sender_id: Scalars['String']['output'];
  sent_at: Scalars['DateTime']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type DirectMessageCount = {
  __typename?: 'DirectMessageCount';
  direct_message_recipients: Scalars['Int']['output'];
};

export type DirectMessageCreateDto = {
  content: Scalars['String']['input'];
  institution_id: Scalars['String']['input'];
  recipient_id: Scalars['String']['input'];
  sender_id: Scalars['String']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type DirectMessageListRelationFilter = {
  every?: InputMaybe<DirectMessageWhereInput>;
  none?: InputMaybe<DirectMessageWhereInput>;
  some?: InputMaybe<DirectMessageWhereInput>;
};

export type DirectMessageOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type DirectMessageRecipient = {
  __typename?: 'DirectMessageRecipient';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  direct_message: DirectMessage;
  direct_message_id: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  read_at: Scalars['DateTime']['output'];
  recipient_role: Role;
  recipient_role_id: Scalars['String']['output'];
  recipient_user: User;
  recipient_user_id: Scalars['String']['output'];
  sent_at: Scalars['DateTime']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type DirectMessageRecipientListRelationFilter = {
  every?: InputMaybe<DirectMessageRecipientWhereInput>;
  none?: InputMaybe<DirectMessageRecipientWhereInput>;
  some?: InputMaybe<DirectMessageRecipientWhereInput>;
};

export type DirectMessageRecipientOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type DirectMessageRecipientWhereInput = {
  AND?: InputMaybe<Array<DirectMessageRecipientWhereInput>>;
  NOT?: InputMaybe<Array<DirectMessageRecipientWhereInput>>;
  OR?: InputMaybe<Array<DirectMessageRecipientWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  direct_message?: InputMaybe<DirectMessageScalarRelationFilter>;
  direct_message_id?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  read_at?: InputMaybe<DateTimeFilter>;
  recipient_role?: InputMaybe<RoleScalarRelationFilter>;
  recipient_role_id?: InputMaybe<StringFilter>;
  recipient_user?: InputMaybe<UserScalarRelationFilter>;
  recipient_user_id?: InputMaybe<StringFilter>;
  sent_at?: InputMaybe<DateTimeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type DirectMessageScalarRelationFilter = {
  is?: InputMaybe<DirectMessageWhereInput>;
  isNot?: InputMaybe<DirectMessageWhereInput>;
};

export type DirectMessageUpdateDto = {
  content?: InputMaybe<Scalars['String']['input']>;
  recipient_id?: InputMaybe<Scalars['String']['input']>;
};

export type DirectMessageWhereInput = {
  AND?: InputMaybe<Array<DirectMessageWhereInput>>;
  NOT?: InputMaybe<Array<DirectMessageWhereInput>>;
  OR?: InputMaybe<Array<DirectMessageWhereInput>>;
  content?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  direct_message_recipients?: InputMaybe<DirectMessageRecipientListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  sender?: InputMaybe<UserScalarRelationFilter>;
  sender_id?: InputMaybe<StringFilter>;
  sent_at?: InputMaybe<DateTimeFilter>;
  status?: InputMaybe<StringFilter>;
  title?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type EmailVerificationResponse = {
  __typename?: 'EmailVerificationResponse';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type EntityDistribution = {
  __typename?: 'EntityDistribution';
  amount: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  percentage: Scalars['Float']['output'];
};

export enum EntityType {
  Church = 'CHURCH',
  ChurchDepartment = 'CHURCH_DEPARTMENT',
  Institution = 'INSTITUTION',
  InstitutionDepartment = 'INSTITUTION_DEPARTMENT',
  Region = 'REGION',
  User = 'USER'
}

export type EnumActivityPriorityFilter = {
  equals?: InputMaybe<ActivityPriority>;
  in?: InputMaybe<Array<ActivityPriority>>;
  not?: InputMaybe<NestedEnumActivityPriorityFilter>;
  notIn?: InputMaybe<Array<ActivityPriority>>;
};

export type EnumActivityStatusFilter = {
  equals?: InputMaybe<ActivityStatus>;
  in?: InputMaybe<Array<ActivityStatus>>;
  not?: InputMaybe<NestedEnumActivityStatusFilter>;
  notIn?: InputMaybe<Array<ActivityStatus>>;
};

export type EnumActivityTagsNullableListFilter = {
  equals?: InputMaybe<Array<ActivityTags>>;
  has?: InputMaybe<ActivityTags>;
  hasEvery?: InputMaybe<Array<ActivityTags>>;
  hasSome?: InputMaybe<Array<ActivityTags>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EnumAdjustmentStatusFilter = {
  equals?: InputMaybe<AdjustmentStatus>;
  in?: InputMaybe<Array<AdjustmentStatus>>;
  not?: InputMaybe<NestedEnumAdjustmentStatusFilter>;
  notIn?: InputMaybe<Array<AdjustmentStatus>>;
};

export type EnumAnnualBudgetCategoryFilter = {
  equals?: InputMaybe<AnnualBudgetCategory>;
  in?: InputMaybe<Array<AnnualBudgetCategory>>;
  not?: InputMaybe<NestedEnumAnnualBudgetCategoryFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetCategory>>;
};

export type EnumAnnualBudgetEntityTypeFilter = {
  equals?: InputMaybe<AnnualBudgetEntityType>;
  in?: InputMaybe<Array<AnnualBudgetEntityType>>;
  not?: InputMaybe<NestedEnumAnnualBudgetEntityTypeFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetEntityType>>;
};

export type EnumAnnualBudgetPriorityFilter = {
  equals?: InputMaybe<AnnualBudgetPriority>;
  in?: InputMaybe<Array<AnnualBudgetPriority>>;
  not?: InputMaybe<NestedEnumAnnualBudgetPriorityFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetPriority>>;
};

export type EnumAnnualBudgetStatusFilter = {
  equals?: InputMaybe<AnnualBudgetStatus>;
  in?: InputMaybe<Array<AnnualBudgetStatus>>;
  not?: InputMaybe<NestedEnumAnnualBudgetStatusFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetStatus>>;
};

export type EnumAssignmentOriginFilter = {
  equals?: InputMaybe<AssignmentOrigin>;
  in?: InputMaybe<Array<AssignmentOrigin>>;
  not?: InputMaybe<NestedEnumAssignmentOriginFilter>;
  notIn?: InputMaybe<Array<AssignmentOrigin>>;
};

export type EnumAssignmentStatusFilter = {
  equals?: InputMaybe<AssignmentStatus>;
  in?: InputMaybe<Array<AssignmentStatus>>;
  not?: InputMaybe<NestedEnumAssignmentStatusFilter>;
  notIn?: InputMaybe<Array<AssignmentStatus>>;
};

export type EnumAvailabilitySourceFilter = {
  equals?: InputMaybe<AvailabilitySource>;
  in?: InputMaybe<Array<AvailabilitySource>>;
  not?: InputMaybe<NestedEnumAvailabilitySourceFilter>;
  notIn?: InputMaybe<Array<AvailabilitySource>>;
};

export type EnumAvailabilityStatusFilter = {
  equals?: InputMaybe<AvailabilityStatus>;
  in?: InputMaybe<Array<AvailabilityStatus>>;
  not?: InputMaybe<NestedEnumAvailabilityStatusFilter>;
  notIn?: InputMaybe<Array<AvailabilityStatus>>;
};

export type EnumBudgetTransactionTypeFilter = {
  equals?: InputMaybe<BudgetTransactionType>;
  in?: InputMaybe<Array<BudgetTransactionType>>;
  not?: InputMaybe<NestedEnumBudgetTransactionTypeFilter>;
  notIn?: InputMaybe<Array<BudgetTransactionType>>;
};

export type EnumChurchTypeFilter = {
  equals?: InputMaybe<ChurchType>;
  in?: InputMaybe<Array<ChurchType>>;
  not?: InputMaybe<NestedEnumChurchTypeFilter>;
  notIn?: InputMaybe<Array<ChurchType>>;
};

export type EnumEntityTypeFilter = {
  equals?: InputMaybe<EntityType>;
  in?: InputMaybe<Array<EntityType>>;
  not?: InputMaybe<NestedEnumEntityTypeFilter>;
  notIn?: InputMaybe<Array<EntityType>>;
};

export type EnumEventRegistrationStatusFilter = {
  equals?: InputMaybe<EventRegistrationStatus>;
  in?: InputMaybe<Array<EventRegistrationStatus>>;
  not?: InputMaybe<NestedEnumEventRegistrationStatusFilter>;
  notIn?: InputMaybe<Array<EventRegistrationStatus>>;
};

export type EnumEventTargetTypeFilter = {
  equals?: InputMaybe<EventTargetType>;
  in?: InputMaybe<Array<EventTargetType>>;
  not?: InputMaybe<NestedEnumEventTargetTypeFilter>;
  notIn?: InputMaybe<Array<EventTargetType>>;
};

export type EnumEventTypeFilter = {
  equals?: InputMaybe<EventType>;
  in?: InputMaybe<Array<EventType>>;
  not?: InputMaybe<NestedEnumEventTypeFilter>;
  notIn?: InputMaybe<Array<EventType>>;
};

export type EnumGenderTypeNullableFilter = {
  equals?: InputMaybe<GenderType>;
  in?: InputMaybe<Array<GenderType>>;
  not?: InputMaybe<NestedEnumGenderTypeNullableFilter>;
  notIn?: InputMaybe<Array<GenderType>>;
};

export type EnumInstitutionPositionTypeFilter = {
  equals?: InputMaybe<InstitutionPositionType>;
  in?: InputMaybe<Array<InstitutionPositionType>>;
  not?: InputMaybe<NestedEnumInstitutionPositionTypeFilter>;
  notIn?: InputMaybe<Array<InstitutionPositionType>>;
};

export type EnumLanguagePreferenceFilter = {
  equals?: InputMaybe<LanguagePreference>;
  in?: InputMaybe<Array<LanguagePreference>>;
  not?: InputMaybe<NestedEnumLanguagePreferenceFilter>;
  notIn?: InputMaybe<Array<LanguagePreference>>;
};

export type EnumPermissionGroupNullableFilter = {
  equals?: InputMaybe<PermissionGroup>;
  in?: InputMaybe<Array<PermissionGroup>>;
  not?: InputMaybe<NestedEnumPermissionGroupNullableFilter>;
  notIn?: InputMaybe<Array<PermissionGroup>>;
};

export type EnumPermissionResolverNameFilter = {
  equals?: InputMaybe<PermissionResolverName>;
  in?: InputMaybe<Array<PermissionResolverName>>;
  not?: InputMaybe<NestedEnumPermissionResolverNameFilter>;
  notIn?: InputMaybe<Array<PermissionResolverName>>;
};

export type EnumProjectActivityLogActionFilter = {
  equals?: InputMaybe<ProjectActivityLogAction>;
  in?: InputMaybe<Array<ProjectActivityLogAction>>;
  not?: InputMaybe<NestedEnumProjectActivityLogActionFilter>;
  notIn?: InputMaybe<Array<ProjectActivityLogAction>>;
};

export type EnumProjectHistoryTypeFilter = {
  equals?: InputMaybe<ProjectHistoryType>;
  in?: InputMaybe<Array<ProjectHistoryType>>;
  not?: InputMaybe<NestedEnumProjectHistoryTypeFilter>;
  notIn?: InputMaybe<Array<ProjectHistoryType>>;
};

export type EnumProjectStatusFilter = {
  equals?: InputMaybe<ProjectStatus>;
  in?: InputMaybe<Array<ProjectStatus>>;
  not?: InputMaybe<NestedEnumProjectStatusFilter>;
  notIn?: InputMaybe<Array<ProjectStatus>>;
};

export type EnumProjectTypeFilter = {
  equals?: InputMaybe<ProjectType>;
  in?: InputMaybe<Array<ProjectType>>;
  not?: InputMaybe<NestedEnumProjectTypeFilter>;
  notIn?: InputMaybe<Array<ProjectType>>;
};

export type EnumRecurrenceTypeFilter = {
  equals?: InputMaybe<RecurrenceType>;
  in?: InputMaybe<Array<RecurrenceType>>;
  not?: InputMaybe<NestedEnumRecurrenceTypeFilter>;
  notIn?: InputMaybe<Array<RecurrenceType>>;
};

export type EnumRefundTypeNullableFilter = {
  equals?: InputMaybe<RefundType>;
  in?: InputMaybe<Array<RefundType>>;
  not?: InputMaybe<NestedEnumRefundTypeNullableFilter>;
  notIn?: InputMaybe<Array<RefundType>>;
};

export type EnumRequestStatusFilter = {
  equals?: InputMaybe<RequestStatus>;
  in?: InputMaybe<Array<RequestStatus>>;
  not?: InputMaybe<NestedEnumRequestStatusFilter>;
  notIn?: InputMaybe<Array<RequestStatus>>;
};

export type EnumRequestTypeFilter = {
  equals?: InputMaybe<RequestType>;
  in?: InputMaybe<Array<RequestType>>;
  not?: InputMaybe<NestedEnumRequestTypeFilter>;
  notIn?: InputMaybe<Array<RequestType>>;
};

export type EnumServiceCalendarSourceFilter = {
  equals?: InputMaybe<ServiceCalendarSource>;
  in?: InputMaybe<Array<ServiceCalendarSource>>;
  not?: InputMaybe<NestedEnumServiceCalendarSourceFilter>;
  notIn?: InputMaybe<Array<ServiceCalendarSource>>;
};

export type EnumSubsidyHistoryTypeFilter = {
  equals?: InputMaybe<SubsidyHistoryType>;
  in?: InputMaybe<Array<SubsidyHistoryType>>;
  not?: InputMaybe<NestedEnumSubsidyHistoryTypeFilter>;
  notIn?: InputMaybe<Array<SubsidyHistoryType>>;
};

export type EnumSubsidyRequestPriorityFilter = {
  equals?: InputMaybe<SubsidyRequestPriority>;
  in?: InputMaybe<Array<SubsidyRequestPriority>>;
  not?: InputMaybe<NestedEnumSubsidyRequestPriorityFilter>;
  notIn?: InputMaybe<Array<SubsidyRequestPriority>>;
};

export type EnumSubsidyRequestTypeFilter = {
  equals?: InputMaybe<SubsidyRequestType>;
  in?: InputMaybe<Array<SubsidyRequestType>>;
  not?: InputMaybe<NestedEnumSubsidyRequestTypeFilter>;
  notIn?: InputMaybe<Array<SubsidyRequestType>>;
};

export type EnumTransferTypeFilter = {
  equals?: InputMaybe<TransferType>;
  in?: InputMaybe<Array<TransferType>>;
  not?: InputMaybe<NestedEnumTransferTypeFilter>;
  notIn?: InputMaybe<Array<TransferType>>;
};

export type Event = {
  __typename?: 'Event';
  _count: EventCount;
  contact: Contact;
  contact_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  end_at?: Maybe<Scalars['DateTime']['output']>;
  event_recipients?: Maybe<Array<EventRecipient>>;
  event_registrations?: Maybe<Array<EventRegistration>>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_private: Scalars['Boolean']['output'];
  language_preference: LanguagePreference;
  location?: Maybe<Scalars['String']['output']>;
  max_participants: Scalars['Int']['output'];
  projects?: Maybe<Array<Project>>;
  required_volunteers: Scalars['Boolean']['output'];
  start_at?: Maybe<Scalars['DateTime']['output']>;
  subscription_expires_at: Scalars['DateTime']['output'];
  target_id?: Maybe<Scalars['String']['output']>;
  target_type: EventTargetType;
  ticket_amount: Scalars['Decimal']['output'];
  title: Scalars['String']['output'];
  type: EventType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type EventCount = {
  __typename?: 'EventCount';
  event_recipients: Scalars['Int']['output'];
  event_registrations: Scalars['Int']['output'];
  projects: Scalars['Int']['output'];
};

export type EventCreateDto = {
  description: Scalars['String']['input'];
  location: Scalars['String']['input'];
  max_participants: Scalars['Float']['input'];
  subscription_expires_at: Scalars['String']['input'];
  ticket_amount: Scalars['Float']['input'];
  title: Scalars['String']['input'];
  type: EventType;
};

export type EventListRelationFilter = {
  every?: InputMaybe<EventWhereInput>;
  none?: InputMaybe<EventWhereInput>;
  some?: InputMaybe<EventWhereInput>;
};

export type EventNullableScalarRelationFilter = {
  is?: InputMaybe<EventWhereInput>;
  isNot?: InputMaybe<EventWhereInput>;
};

export type EventOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type EventRecipient = {
  __typename?: 'EventRecipient';
  User?: Maybe<User>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  event: Event;
  event_id: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  target_id: Scalars['String']['output'];
  target_type: EventTargetType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type EventRecipientListRelationFilter = {
  every?: InputMaybe<EventRecipientWhereInput>;
  none?: InputMaybe<EventRecipientWhereInput>;
  some?: InputMaybe<EventRecipientWhereInput>;
};

export type EventRecipientOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type EventRecipientWhereInput = {
  AND?: InputMaybe<Array<EventRecipientWhereInput>>;
  NOT?: InputMaybe<Array<EventRecipientWhereInput>>;
  OR?: InputMaybe<Array<EventRecipientWhereInput>>;
  User?: InputMaybe<UserNullableScalarRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  event?: InputMaybe<EventScalarRelationFilter>;
  event_id?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  target_id?: InputMaybe<StringFilter>;
  target_type?: InputMaybe<EnumEventTargetTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  userId?: InputMaybe<StringNullableFilter>;
};

export type EventRegistration = {
  __typename?: 'EventRegistration';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  event: Event;
  event_id: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  status: EventRegistrationStatus;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type EventRegistrationListRelationFilter = {
  every?: InputMaybe<EventRegistrationWhereInput>;
  none?: InputMaybe<EventRegistrationWhereInput>;
  some?: InputMaybe<EventRegistrationWhereInput>;
};

export type EventRegistrationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum EventRegistrationStatus {
  Approved = 'approved',
  Canceled = 'canceled',
  Paid = 'paid',
  Pendent = 'pendent',
  Reserved = 'reserved'
}

export type EventRegistrationWhereInput = {
  AND?: InputMaybe<Array<EventRegistrationWhereInput>>;
  NOT?: InputMaybe<Array<EventRegistrationWhereInput>>;
  OR?: InputMaybe<Array<EventRegistrationWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  event?: InputMaybe<EventScalarRelationFilter>;
  event_id?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  status?: InputMaybe<EnumEventRegistrationStatusFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type EventScalarRelationFilter = {
  is?: InputMaybe<EventWhereInput>;
  isNot?: InputMaybe<EventWhereInput>;
};

export enum EventTargetType {
  Church = 'church',
  Department = 'department',
  Institution = 'institution',
  Region = 'region',
  User = 'user'
}

export enum EventType {
  Evangelism = 'evangelism',
  Show = 'show'
}

export type EventWhereInput = {
  AND?: InputMaybe<Array<EventWhereInput>>;
  NOT?: InputMaybe<Array<EventWhereInput>>;
  OR?: InputMaybe<Array<EventWhereInput>>;
  contact?: InputMaybe<ContactScalarRelationFilter>;
  contact_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringFilter>;
  end_at?: InputMaybe<DateTimeNullableFilter>;
  event_recipients?: InputMaybe<EventRecipientListRelationFilter>;
  event_registrations?: InputMaybe<EventRegistrationListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_private?: InputMaybe<BoolFilter>;
  language_preference?: InputMaybe<EnumLanguagePreferenceFilter>;
  location?: InputMaybe<StringNullableFilter>;
  max_participants?: InputMaybe<IntFilter>;
  projects?: InputMaybe<ProjectListRelationFilter>;
  required_volunteers?: InputMaybe<BoolFilter>;
  start_at?: InputMaybe<DateTimeNullableFilter>;
  subscription_expires_at?: InputMaybe<DateTimeFilter>;
  target_id?: InputMaybe<StringNullableFilter>;
  target_type?: InputMaybe<EnumEventTargetTypeFilter>;
  ticket_amount?: InputMaybe<DecimalFilter>;
  title?: InputMaybe<StringFilter>;
  type?: InputMaybe<EnumEventTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type FloatFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type ForgotPasswordResponse = {
  __typename?: 'ForgotPasswordResponse';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  resetToken?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GapReport = {
  __typename?: 'GapReport';
  churchesWithoutPreacher: Array<ChurchGapEntry>;
  computedAt: Scalars['DateTime']['output'];
  month: Scalars['String']['output'];
  preachersWithoutAssignment: Array<PreacherGapEntry>;
};

/**
 * R9 — computed by a daily cron job (never at request time), one row per institution+month.
 * Query.gapReport only ever reads the latest snapshot.
 */
export type GapReportSnapshot = {
  __typename?: 'GapReportSnapshot';
  churches_without_preacher: Scalars['JSON']['output'];
  computed_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  month: Scalars['String']['output'];
  preachers_without_assignment: Scalars['JSON']['output'];
};

export type GapReportSnapshotListRelationFilter = {
  every?: InputMaybe<GapReportSnapshotWhereInput>;
  none?: InputMaybe<GapReportSnapshotWhereInput>;
  some?: InputMaybe<GapReportSnapshotWhereInput>;
};

export type GapReportSnapshotOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type GapReportSnapshotWhereInput = {
  AND?: InputMaybe<Array<GapReportSnapshotWhereInput>>;
  NOT?: InputMaybe<Array<GapReportSnapshotWhereInput>>;
  OR?: InputMaybe<Array<GapReportSnapshotWhereInput>>;
  churches_without_preacher?: InputMaybe<JsonFilter>;
  computed_at?: InputMaybe<DateTimeFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  month?: InputMaybe<StringFilter>;
  preachers_without_assignment?: InputMaybe<JsonFilter>;
};

export enum GenderType {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type GetSubsidyReceiptsDto = {
  project_activity_id?: InputMaybe<Scalars['String']['input']>;
  subsidy_request_id?: InputMaybe<Scalars['String']['input']>;
  subsidy_request_item_id?: InputMaybe<Scalars['String']['input']>;
};

export type Institution = {
  __typename?: 'Institution';
  _count: InstitutionCount;
  activeChurchesChartData: Array<ChurchChartData>;
  annual_budgets: Array<AnnualBudget>;
  assignment_invite_templates?: Maybe<Array<AssignmentInviteTemplate>>;
  assignment_requests?: Maybe<Array<AssignmentRequest>>;
  assignments?: Maybe<Array<Assignment>>;
  availabilities?: Maybe<Array<Availability>>;
  availability_recurrence_rules?: Maybe<Array<AvailabilityRecurrenceRule>>;
  church_service_calendar_entries?: Maybe<Array<ChurchServiceCalendar>>;
  churches?: Maybe<Array<Church>>;
  churchesActivityData: Array<ChurchActivityData>;
  churchesKpiData: ChurchKpiData;
  churches_count: Scalars['Int']['output'];
  communications?: Maybe<Array<Communication>>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  current_year_budget: Scalars['Float']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  denomination: Scalars['String']['output'];
  departments?: Maybe<Array<Department>>;
  departments_count: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  direct_messages: Array<DirectMessage>;
  gap_report_snapshots?: Maybe<Array<GapReportSnapshot>>;
  has_budget_record: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  institutionChartsData: InstitutionChartsData;
  is_deleted: Scalars['Boolean']['output'];
  language_preference: LanguagePreference;
  name: Scalars['String']['output'];
  notifications?: Maybe<Array<Notification>>;
  positions?: Maybe<Array<InstitutionPosition>>;
  preacher_region_access?: Maybe<Array<PreacherRegionAccess>>;
  projects?: Maybe<Array<Project>>;
  settings?: Maybe<Array<Setting>>;
  subsidy_requests: Array<SubsidyRequest>;
  total_budget: Scalars['Float']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
  users_count: Scalars['Int']['output'];
};

export type InstitutionBudgetCreateDto = {
  allocated_amount?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<AnnualBudgetCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  institution_id: Scalars['String']['input'];
  justification?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  planned_budget: Scalars['Float']['input'];
  priority?: InputMaybe<AnnualBudgetPriority>;
  total_expenses?: InputMaybe<Scalars['Float']['input']>;
  year: Scalars['Int']['input'];
};

export type InstitutionBudgetUpdateDto = {
  allocated_amount?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<AnnualBudgetCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  documents?: InputMaybe<Array<Scalars['String']['input']>>;
  justification?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  planned_budget?: InputMaybe<Scalars['Float']['input']>;
  priority?: InputMaybe<AnnualBudgetPriority>;
  total_expenses?: InputMaybe<Scalars['Float']['input']>;
};

export type InstitutionChartsData = {
  __typename?: 'InstitutionChartsData';
  churchesByRegion: Array<ChurchesByRegionData>;
  monthlyUserGrowth?: Maybe<Scalars['Float']['output']>;
  usersByRole: Array<UsersByRoleData>;
};

export type InstitutionCount = {
  __typename?: 'InstitutionCount';
  annual_budgets: Scalars['Int']['output'];
  assignment_invite_templates: Scalars['Int']['output'];
  assignment_requests: Scalars['Int']['output'];
  assignments: Scalars['Int']['output'];
  availabilities: Scalars['Int']['output'];
  availability_recurrence_rules: Scalars['Int']['output'];
  church_service_calendar_entries: Scalars['Int']['output'];
  churches: Scalars['Int']['output'];
  communications: Scalars['Int']['output'];
  departments: Scalars['Int']['output'];
  direct_messages: Scalars['Int']['output'];
  gap_report_snapshots: Scalars['Int']['output'];
  notifications: Scalars['Int']['output'];
  positions: Scalars['Int']['output'];
  preacher_region_access: Scalars['Int']['output'];
  projects: Scalars['Int']['output'];
  settings: Scalars['Int']['output'];
  subsidy_requests: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type InstitutionCreateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  denomination: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  language_preference: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type InstitutionNullableScalarRelationFilter = {
  is?: InputMaybe<InstitutionWhereInput>;
  isNot?: InputMaybe<InstitutionWhereInput>;
};

export type InstitutionOrderByWithRelationInput = {
  annual_budgets?: InputMaybe<AnnualBudgetOrderByRelationAggregateInput>;
  assignment_invite_templates?: InputMaybe<AssignmentInviteTemplateOrderByRelationAggregateInput>;
  assignment_requests?: InputMaybe<AssignmentRequestOrderByRelationAggregateInput>;
  assignments?: InputMaybe<AssignmentOrderByRelationAggregateInput>;
  availabilities?: InputMaybe<AvailabilityOrderByRelationAggregateInput>;
  availability_recurrence_rules?: InputMaybe<AvailabilityRecurrenceRuleOrderByRelationAggregateInput>;
  church_service_calendar_entries?: InputMaybe<ChurchServiceCalendarOrderByRelationAggregateInput>;
  churches?: InputMaybe<ChurchOrderByRelationAggregateInput>;
  communications?: InputMaybe<CommunicationOrderByRelationAggregateInput>;
  contact?: InputMaybe<ContactOrderByWithRelationInput>;
  contact_id?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  created_by?: InputMaybe<SortOrder>;
  deleted_at?: InputMaybe<SortOrderInput>;
  deleted_by?: InputMaybe<SortOrderInput>;
  denomination?: InputMaybe<SortOrder>;
  departments?: InputMaybe<DepartmentOrderByRelationAggregateInput>;
  description?: InputMaybe<SortOrderInput>;
  direct_messages?: InputMaybe<DirectMessageOrderByRelationAggregateInput>;
  gap_report_snapshots?: InputMaybe<GapReportSnapshotOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  is_deleted?: InputMaybe<SortOrder>;
  language_preference?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  notifications?: InputMaybe<NotificationOrderByRelationAggregateInput>;
  positions?: InputMaybe<InstitutionPositionOrderByRelationAggregateInput>;
  preacher_region_access?: InputMaybe<PreacherRegionAccessOrderByRelationAggregateInput>;
  projects?: InputMaybe<ProjectOrderByRelationAggregateInput>;
  settings?: InputMaybe<SettingOrderByRelationAggregateInput>;
  subsidy_requests?: InputMaybe<SubsidyRequestOrderByRelationAggregateInput>;
  updated_at?: InputMaybe<SortOrder>;
  updated_by?: InputMaybe<SortOrder>;
  users?: InputMaybe<UserOrderByRelationAggregateInput>;
};

export type InstitutionPosition = {
  __typename?: 'InstitutionPosition';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  position_type: InstitutionPositionType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type InstitutionPositionCreateDto = {
  institution_id: Scalars['String']['input'];
  position_type: InstitutionPositionType;
  user_id: Scalars['String']['input'];
};

export type InstitutionPositionListRelationFilter = {
  every?: InputMaybe<InstitutionPositionWhereInput>;
  none?: InputMaybe<InstitutionPositionWhereInput>;
  some?: InputMaybe<InstitutionPositionWhereInput>;
};

export type InstitutionPositionOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum InstitutionPositionType {
  FinanceManager = 'FINANCE_MANAGER',
  President = 'PRESIDENT',
  Secretary = 'SECRETARY'
}

export type InstitutionPositionUpdateDto = {
  position_type?: InputMaybe<InstitutionPositionType>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type InstitutionPositionWhereInput = {
  AND?: InputMaybe<Array<InstitutionPositionWhereInput>>;
  NOT?: InputMaybe<Array<InstitutionPositionWhereInput>>;
  OR?: InputMaybe<Array<InstitutionPositionWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  position_type?: InputMaybe<EnumInstitutionPositionTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type InstitutionScalarRelationFilter = {
  is?: InputMaybe<InstitutionWhereInput>;
  isNot?: InputMaybe<InstitutionWhereInput>;
};

export type InstitutionUpdateDto = {
  contact?: InputMaybe<ContactUpdateDto>;
  denomination?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  language_preference?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type InstitutionWhereInput = {
  AND?: InputMaybe<Array<InstitutionWhereInput>>;
  NOT?: InputMaybe<Array<InstitutionWhereInput>>;
  OR?: InputMaybe<Array<InstitutionWhereInput>>;
  annual_budgets?: InputMaybe<AnnualBudgetListRelationFilter>;
  assignment_invite_templates?: InputMaybe<AssignmentInviteTemplateListRelationFilter>;
  assignment_requests?: InputMaybe<AssignmentRequestListRelationFilter>;
  assignments?: InputMaybe<AssignmentListRelationFilter>;
  availabilities?: InputMaybe<AvailabilityListRelationFilter>;
  availability_recurrence_rules?: InputMaybe<AvailabilityRecurrenceRuleListRelationFilter>;
  church_service_calendar_entries?: InputMaybe<ChurchServiceCalendarListRelationFilter>;
  churches?: InputMaybe<ChurchListRelationFilter>;
  communications?: InputMaybe<CommunicationListRelationFilter>;
  contact?: InputMaybe<ContactNullableScalarRelationFilter>;
  contact_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  denomination?: InputMaybe<StringFilter>;
  departments?: InputMaybe<DepartmentListRelationFilter>;
  description?: InputMaybe<StringNullableFilter>;
  direct_messages?: InputMaybe<DirectMessageListRelationFilter>;
  gap_report_snapshots?: InputMaybe<GapReportSnapshotListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  language_preference?: InputMaybe<EnumLanguagePreferenceFilter>;
  name?: InputMaybe<StringFilter>;
  notifications?: InputMaybe<NotificationListRelationFilter>;
  positions?: InputMaybe<InstitutionPositionListRelationFilter>;
  preacher_region_access?: InputMaybe<PreacherRegionAccessListRelationFilter>;
  projects?: InputMaybe<ProjectListRelationFilter>;
  settings?: InputMaybe<SettingListRelationFilter>;
  subsidy_requests?: InputMaybe<SubsidyRequestListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  users?: InputMaybe<UserListRelationFilter>;
};

export type InstitutionalDepartmentsKpIs = {
  __typename?: 'InstitutionalDepartmentsKPIs';
  departmentsWithBudget: Scalars['Int']['output'];
  totalAllocated: Scalars['Float']['output'];
  totalAvailable: Scalars['Float']['output'];
  totalDepartments: Scalars['Int']['output'];
  totalPlanned: Scalars['Float']['output'];
  totalSpent: Scalars['Float']['output'];
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type InviteEmailDto = {
  inviter_id: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type InviteModel = {
  __typename?: 'InviteModel';
  token: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type InviteUserDto = {
  church_department_id?: InputMaybe<Scalars['String']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  institution_department_id?: InputMaybe<Scalars['String']['input']>;
  institution_id: Scalars['String']['input'];
  inviter_id: Scalars['String']['input'];
  language_preference?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  role_ids: Array<Scalars['String']['input']>;
};

export type JsonFilter = {
  array_contains?: InputMaybe<Scalars['JSON']['input']>;
  array_ends_with?: InputMaybe<Scalars['JSON']['input']>;
  array_starts_with?: InputMaybe<Scalars['JSON']['input']>;
  equals?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['JSON']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type JsonNullableFilter = {
  array_contains?: InputMaybe<Scalars['JSON']['input']>;
  array_ends_with?: InputMaybe<Scalars['JSON']['input']>;
  array_starts_with?: InputMaybe<Scalars['JSON']['input']>;
  equals?: InputMaybe<Scalars['JSON']['input']>;
  gt?: InputMaybe<Scalars['JSON']['input']>;
  gte?: InputMaybe<Scalars['JSON']['input']>;
  lt?: InputMaybe<Scalars['JSON']['input']>;
  lte?: InputMaybe<Scalars['JSON']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<Scalars['JSON']['input']>;
  path?: InputMaybe<Array<Scalars['String']['input']>>;
  string_contains?: InputMaybe<Scalars['String']['input']>;
  string_ends_with?: InputMaybe<Scalars['String']['input']>;
  string_starts_with?: InputMaybe<Scalars['String']['input']>;
};

/** Idioma preferencial do usuário */
export enum LanguagePreference {
  En = 'en',
  Nl = 'nl'
}

export type LedgerHistoryEntry = {
  __typename?: 'LedgerHistoryEntry';
  amount: Scalars['Float']['output'];
  balanceAfter?: Maybe<Scalars['Float']['output']>;
  category: Scalars['String']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  createdByName?: Maybe<Scalars['String']['output']>;
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  entityName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  impactType: Scalars['String']['output'];
  label: Scalars['String']['output'];
  relatedEntity?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type LedgerHistoryFilterInput = {
  churchId?: InputMaybe<Scalars['String']['input']>;
  departmentId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  institutionId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  regionId?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};

export type LedgerHistoryPageInfo = {
  __typename?: 'LedgerHistoryPageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  totalPages: Scalars['Int']['output'];
};

export type LedgerHistoryPaginatedResponse = {
  __typename?: 'LedgerHistoryPaginatedResponse';
  items: Array<LedgerHistoryEntry>;
  pageInfo: LedgerHistoryPageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LinkContactDto = {
  contact_id: Scalars['String']['input'];
  target: Scalars['String']['input'];
  target_id: Scalars['String']['input'];
};

export type LinkContactResult = {
  __typename?: 'LinkContactResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  /** Language for error messages (en | nl). Defaults to en. */
  lang?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type MarkAllReadResult = {
  __typename?: 'MarkAllReadResult';
  count: Scalars['Int']['output'];
};

export type MonthlyCloseResult = {
  __typename?: 'MonthlyCloseResult';
  autoAccepted: Scalars['Float']['output'];
  locked: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addAdjustmentTask: AdjustmentTask;
  addProjectVoluntary: VoluntariesOnProjects;
  addRoleToUser: UserModel;
  addSubsidyRequestMessage: SubsidyStatusHistory;
  approveAnnualBudget: ApproveBudgetResponse;
  approveSubsidyRequest: SubsidyRequest;
  batchUpdateProjectActivities: Array<ProjectActivity>;
  confirmRefundDone: SubsidyRequest;
  createAdjustment: ProjectAdjustment;
  createAdvanceRequest: SubsidyRequest;
  createAssignmentInviteTemplate: AssignmentInviteTemplate;
  createChurch: Church;
  createCommunication: Communication;
  createContact: Contact;
  createDepartment: Department;
  createDepartmentBudget: AnnualBudget;
  createDirectMessage: DirectMessage;
  createInstitution: Institution;
  createInstitutionBudget: AnnualBudget;
  createInstitutionPosition: InstitutionPosition;
  createNotification: Notification;
  createProject: Project;
  createProjectActivity: ProjectActivity;
  createProjectHistory: ProjectHistory;
  createRegion: RegionModel;
  createRole: RoleModel;
  createSetting: Setting;
  createSubsidyRequest: SubsidyRequest;
  createSubsidyStatus: SubsidyStatus;
  createSubsidyWithoutDocument: SubsidyRequest;
  createUser: UserModel;
  deleteActivityDocument: ActivityDocuments;
  deleteAnnualBudget: DeleteBudgetResponse;
  deleteAssignmentInviteTemplate: Scalars['Boolean']['output'];
  deleteAvailabilityRecurrenceRule: Scalars['Boolean']['output'];
  deleteChurch: Church;
  deleteCommunication: Communication;
  deleteContact: Contact;
  deleteDepartment: Department;
  deleteDirectMessage: DirectMessage;
  deleteInstitution: Institution;
  deleteInstitutionPosition: InstitutionPosition;
  deleteNotification: Notification;
  deleteProject: Project;
  deleteProjectActivity: ProjectActivity;
  deleteProjectHistory: ProjectHistory;
  deleteRegion: RegionModel;
  deleteRole: RoleModel;
  deleteSetting: Setting;
  deleteSubsidyReceipt: SubsidyReceipt;
  deleteSubsidyRequest: SubsidyRequest;
  deleteSubsidyRequestMessage: SubsidyStatusHistory;
  deleteSubsidyStatus: SubsidyStatus;
  deleteUser: UserModel;
  grantPreacherRegionAccess: PreacherRegionAccess;
  inviteToAssignment: AssignmentRequest;
  inviteToAssignmentAny: AssignmentRequest;
  inviteUser: InviteModel;
  linkContact: LinkContactResult;
  login: AuthModel;
  markAllNotificationsRead: MarkAllReadResult;
  markNotificationRead: Notification;
  recalculateInstitutionAllocatedAmounts: RecalculateAllocatedAmountsResponse;
  rejectAnnualBudget: RejectBudgetResponse;
  rejectSubsidyReceipt: SubsidyReceipt;
  rejectSubsidyRefund: SubsidyRequest;
  rejectSubsidyRequest: SubsidyRequest;
  removeAdjustmentTask: AdjustmentTask;
  removeProjectVoluntary: VoluntariesOnProjects;
  removeRoleFromUser: UserModel;
  requestAssignment: AssignmentRequest;
  requestRevisionAnnualBudget: RequestRevisionBudgetResponse;
  requestSubsidyRefund: SubsidyRequest;
  resetPassword: ForgotPasswordResponse;
  respondToAssignmentRequest: AssignmentRequest;
  respondToAssignmentRequestAny: AssignmentRequest;
  revokePreacherRegionAccess: Scalars['Boolean']['output'];
  sendEmailVerificationCode: EmailVerificationResponse;
  sendForgotPasswordCode: ForgotPasswordResponse;
  /** Send an invitation email */
  sendInviteEmail: Scalars['Boolean']['output'];
  setAssignment: Assignment;
  setAssignmentAny: Assignment;
  setAvailability: Availability;
  setAvailabilityBulk: Array<Availability>;
  setAvailabilityRecurrenceRule: AvailabilityRecurrenceRule;
  setChurchServiceCalendar: Array<ChurchServiceCalendar>;
  setChurchServiceCalendarBulk: Array<ChurchServiceCalendar>;
  submitSubsidyRequest: SubsidyRequest;
  toggleAdjustmentTask: AdjustmentTask;
  toggleBudgetLock: ToggleLockBudgetResponse;
  triggerMonthlyClose: MonthlyCloseResult;
  updateAdjustmentStatus: ProjectAdjustment;
  updateAssignmentInviteTemplate: AssignmentInviteTemplate;
  updateChurch: Church;
  updateCommunication: Communication;
  updateContact: Contact;
  updateDepartment: Department;
  updateDepartmentBudget: AnnualBudget;
  updateDirectMessage: DirectMessage;
  updateInstitution: Institution;
  updateInstitutionBudget: AnnualBudget;
  updateInstitutionPosition: InstitutionPosition;
  updateNotification: Notification;
  updateOwnUser: UserModel;
  updateProject: Project;
  updateProjectActivity: ProjectActivity;
  updateProjectCoOwner: Project;
  updateRegion: RegionModel;
  updateRole: RoleModel;
  updateSetting: Setting;
  updateSubsidyRequest: SubsidyRequest;
  updateSubsidyRequestMessage: SubsidyStatusHistory;
  updateSubsidyStatus: SubsidyStatus;
  updateUser: UserModel;
  updateUserDepartment: UserModel;
  uploadActivityDocument: ActivityDocuments;
  uploadSubsidyReceipt: SubsidyReceipt;
  validateActivityDocument: ActivityDocuments;
  validateInviteToken: ValidateOutputModel;
  validateSubsidyReceipt: SubsidyReceipt;
  verifyEmailRegistrationCode: EmailVerificationResponse;
  verifyForgotPasswordCode: ForgotPasswordResponse;
};


export type MutationAddAdjustmentTaskArgs = {
  data: AddAdjustmentTaskDto;
};


export type MutationAddProjectVoluntaryArgs = {
  data: AddProjectVoluntaryDto;
};


export type MutationAddRoleToUserArgs = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationAddSubsidyRequestMessageArgs = {
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
  message: Scalars['String']['input'];
};


export type MutationApproveAnnualBudgetArgs = {
  data: ApproveAnnualBudgetDto;
  id: Scalars['String']['input'];
};


export type MutationApproveSubsidyRequestArgs = {
  approved_amount: Scalars['Float']['input'];
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
};


export type MutationBatchUpdateProjectActivitiesArgs = {
  data: ProjectActivityBatchUpdateDto;
};


export type MutationConfirmRefundDoneArgs = {
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
};


export type MutationCreateAdjustmentArgs = {
  data: CreateAdjustmentDto;
};


export type MutationCreateAdvanceRequestArgs = {
  advanceAmount: Scalars['Float']['input'];
  language?: InputMaybe<LanguagePreference>;
  projectId: Scalars['String']['input'];
};


export type MutationCreateAssignmentInviteTemplateArgs = {
  input: CreateAssignmentInviteTemplateInput;
};


export type MutationCreateChurchArgs = {
  data: ChurchCreateDto;
};


export type MutationCreateCommunicationArgs = {
  data: CommunicationCreateDto;
};


export type MutationCreateContactArgs = {
  data: ContactCreateDto;
  userId: Scalars['String']['input'];
};


export type MutationCreateDepartmentArgs = {
  data: DepartmentCreateDto;
};


export type MutationCreateDepartmentBudgetArgs = {
  data: DepartmentBudgetCreateDto;
};


export type MutationCreateDirectMessageArgs = {
  data: DirectMessageCreateDto;
};


export type MutationCreateInstitutionArgs = {
  data: InstitutionCreateDto;
};


export type MutationCreateInstitutionBudgetArgs = {
  data: InstitutionBudgetCreateDto;
};


export type MutationCreateInstitutionPositionArgs = {
  data: InstitutionPositionCreateDto;
};


export type MutationCreateNotificationArgs = {
  data: NotificationCreateDto;
};


export type MutationCreateProjectArgs = {
  data: ProjectCreateDto;
};


export type MutationCreateProjectActivityArgs = {
  input: ProjectActivityCreateDto;
};


export type MutationCreateProjectHistoryArgs = {
  data: ProjectHistoryCreateDto;
};


export type MutationCreateRegionArgs = {
  data: RegionCreateDto;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateSettingArgs = {
  data: SettingCreateDto;
};


export type MutationCreateSubsidyRequestArgs = {
  data: SubsidyRequestCreateDto;
  language?: InputMaybe<LanguagePreference>;
};


export type MutationCreateSubsidyStatusArgs = {
  input: CreateSubsidyStatusDto;
};


export type MutationCreateSubsidyWithoutDocumentArgs = {
  data: CreateWithoutDocumentSubsidyRequestDto;
  language?: InputMaybe<LanguagePreference>;
};


export type MutationCreateUserArgs = {
  data: UserCreateDto;
};


export type MutationDeleteActivityDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAnnualBudgetArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteAssignmentInviteTemplateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteAvailabilityRecurrenceRuleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteChurchArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCommunicationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteContactArgs = {
  id: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationDeleteDepartmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteDirectMessageArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteInstitutionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteInstitutionPositionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProjectActivityArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectHistoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRegionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSettingArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSubsidyReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubsidyRequestArgs = {
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
};


export type MutationDeleteSubsidyRequestMessageArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSubsidyStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationGrantPreacherRegionAccessArgs = {
  region_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};


export type MutationInviteToAssignmentArgs = {
  church_id: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
  template_id?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};


export type MutationInviteToAssignmentAnyArgs = {
  church_id: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
  template_id?: InputMaybe<Scalars['String']['input']>;
  user_id: Scalars['String']['input'];
};


export type MutationInviteUserArgs = {
  data: InviteUserDto;
};


export type MutationLinkContactArgs = {
  data: LinkContactDto;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationMarkNotificationReadArgs = {
  id: Scalars['String']['input'];
};


export type MutationRejectAnnualBudgetArgs = {
  data: RejectAnnualBudgetDto;
  id: Scalars['String']['input'];
};


export type MutationRejectSubsidyReceiptArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRejectSubsidyRefundArgs = {
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
  reason: Scalars['String']['input'];
};


export type MutationRejectSubsidyRequestArgs = {
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
  rejection_reason: Scalars['String']['input'];
};


export type MutationRemoveAdjustmentTaskArgs = {
  taskId: Scalars['ID']['input'];
};


export type MutationRemoveProjectVoluntaryArgs = {
  data: RemoveProjectVoluntaryDto;
};


export type MutationRemoveRoleFromUserArgs = {
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationRequestAssignmentArgs = {
  church_id: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
};


export type MutationRequestRevisionAnnualBudgetArgs = {
  data: RequestRevisionAnnualBudgetDto;
  id: Scalars['String']['input'];
};


export type MutationRequestSubsidyRefundArgs = {
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
  reason: Scalars['String']['input'];
  refundAmount: Scalars['Float']['input'];
  refundType: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationRespondToAssignmentRequestArgs = {
  accept: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
};


export type MutationRespondToAssignmentRequestAnyArgs = {
  accept: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
};


export type MutationRevokePreacherRegionAccessArgs = {
  id: Scalars['String']['input'];
};


export type MutationSendEmailVerificationCodeArgs = {
  input: SendEmailVerificationCodeInput;
};


export type MutationSendForgotPasswordCodeArgs = {
  input: SendCodeInput;
};


export type MutationSendInviteEmailArgs = {
  data: InviteEmailDto;
};


export type MutationSetAssignmentArgs = {
  input: SetAssignmentInput;
};


export type MutationSetAssignmentAnyArgs = {
  input: SetAssignmentInput;
};


export type MutationSetAvailabilityArgs = {
  input: SetAvailabilityInput;
};


export type MutationSetAvailabilityBulkArgs = {
  input: SetAvailabilityBulkInput;
};


export type MutationSetAvailabilityRecurrenceRuleArgs = {
  input: SetAvailabilityRecurrenceRuleInput;
};


export type MutationSetChurchServiceCalendarArgs = {
  input: SetServiceCalendarInput;
};


export type MutationSetChurchServiceCalendarBulkArgs = {
  input: SetServiceCalendarBulkInput;
};


export type MutationSubmitSubsidyRequestArgs = {
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
};


export type MutationToggleAdjustmentTaskArgs = {
  data: ToggleAdjustmentTaskDto;
};


export type MutationToggleBudgetLockArgs = {
  id: Scalars['String']['input'];
};


export type MutationTriggerMonthlyCloseArgs = {
  month: Scalars['String']['input'];
};


export type MutationUpdateAdjustmentStatusArgs = {
  data: UpdateAdjustmentStatusDto;
};


export type MutationUpdateAssignmentInviteTemplateArgs = {
  id: Scalars['String']['input'];
  input: UpdateAssignmentInviteTemplateInput;
};


export type MutationUpdateChurchArgs = {
  data: ChurchUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateCommunicationArgs = {
  data: CommunicationUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateContactArgs = {
  data: ContactUpdateDto;
};


export type MutationUpdateDepartmentArgs = {
  data: DepartmentUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateDepartmentBudgetArgs = {
  data: DepartmentBudgetUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateDirectMessageArgs = {
  data: DirectMessageUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateInstitutionArgs = {
  data: InstitutionUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateInstitutionBudgetArgs = {
  data: InstitutionBudgetUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateInstitutionPositionArgs = {
  data: InstitutionPositionUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateNotificationArgs = {
  data: NotificationUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateOwnUserArgs = {
  data: UserUpdateDto;
};


export type MutationUpdateProjectArgs = {
  data: ProjectUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateProjectActivityArgs = {
  input: ProjectActivityUpdateDto;
};


export type MutationUpdateProjectCoOwnerArgs = {
  data: ProjectUpdateCoOwnerDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateRegionArgs = {
  data: RegionUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateSettingArgs = {
  data: SettingUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateSubsidyRequestArgs = {
  data: SubsidyRequestUpdateDto;
  id: Scalars['String']['input'];
  language?: InputMaybe<LanguagePreference>;
};


export type MutationUpdateSubsidyRequestMessageArgs = {
  id: Scalars['String']['input'];
  message: Scalars['String']['input'];
};


export type MutationUpdateSubsidyStatusArgs = {
  input: UpdateSubsidyStatusDto;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateUserDepartmentArgs = {
  departmentId?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationUploadActivityDocumentArgs = {
  file: Scalars['Upload']['input'];
  input: UploadActivityDocumentDto;
};


export type MutationUploadSubsidyReceiptArgs = {
  file: Scalars['Upload']['input'];
  input: UploadSubsidyReceiptDto;
};


export type MutationValidateActivityDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationValidateInviteTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationValidateSubsidyReceiptArgs = {
  id: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};


export type MutationVerifyEmailRegistrationCodeArgs = {
  input: VerifyEmailCodeInput;
};


export type MutationVerifyForgotPasswordCodeArgs = {
  input: VerifyCodeInput;
};

export type NestedBoolFilter = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  not?: InputMaybe<NestedBoolFilter>;
};

export type NestedDateTimeFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type NestedDecimalFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type NestedDecimalNullableFilter = {
  equals?: InputMaybe<Scalars['Decimal']['input']>;
  gt?: InputMaybe<Scalars['Decimal']['input']>;
  gte?: InputMaybe<Scalars['Decimal']['input']>;
  in?: InputMaybe<Array<Scalars['Decimal']['input']>>;
  lt?: InputMaybe<Scalars['Decimal']['input']>;
  lte?: InputMaybe<Scalars['Decimal']['input']>;
  not?: InputMaybe<NestedDecimalNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Decimal']['input']>>;
};

export type NestedEnumActivityPriorityFilter = {
  equals?: InputMaybe<ActivityPriority>;
  in?: InputMaybe<Array<ActivityPriority>>;
  not?: InputMaybe<NestedEnumActivityPriorityFilter>;
  notIn?: InputMaybe<Array<ActivityPriority>>;
};

export type NestedEnumActivityStatusFilter = {
  equals?: InputMaybe<ActivityStatus>;
  in?: InputMaybe<Array<ActivityStatus>>;
  not?: InputMaybe<NestedEnumActivityStatusFilter>;
  notIn?: InputMaybe<Array<ActivityStatus>>;
};

export type NestedEnumAdjustmentStatusFilter = {
  equals?: InputMaybe<AdjustmentStatus>;
  in?: InputMaybe<Array<AdjustmentStatus>>;
  not?: InputMaybe<NestedEnumAdjustmentStatusFilter>;
  notIn?: InputMaybe<Array<AdjustmentStatus>>;
};

export type NestedEnumAnnualBudgetCategoryFilter = {
  equals?: InputMaybe<AnnualBudgetCategory>;
  in?: InputMaybe<Array<AnnualBudgetCategory>>;
  not?: InputMaybe<NestedEnumAnnualBudgetCategoryFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetCategory>>;
};

export type NestedEnumAnnualBudgetEntityTypeFilter = {
  equals?: InputMaybe<AnnualBudgetEntityType>;
  in?: InputMaybe<Array<AnnualBudgetEntityType>>;
  not?: InputMaybe<NestedEnumAnnualBudgetEntityTypeFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetEntityType>>;
};

export type NestedEnumAnnualBudgetPriorityFilter = {
  equals?: InputMaybe<AnnualBudgetPriority>;
  in?: InputMaybe<Array<AnnualBudgetPriority>>;
  not?: InputMaybe<NestedEnumAnnualBudgetPriorityFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetPriority>>;
};

export type NestedEnumAnnualBudgetStatusFilter = {
  equals?: InputMaybe<AnnualBudgetStatus>;
  in?: InputMaybe<Array<AnnualBudgetStatus>>;
  not?: InputMaybe<NestedEnumAnnualBudgetStatusFilter>;
  notIn?: InputMaybe<Array<AnnualBudgetStatus>>;
};

export type NestedEnumAssignmentOriginFilter = {
  equals?: InputMaybe<AssignmentOrigin>;
  in?: InputMaybe<Array<AssignmentOrigin>>;
  not?: InputMaybe<NestedEnumAssignmentOriginFilter>;
  notIn?: InputMaybe<Array<AssignmentOrigin>>;
};

export type NestedEnumAssignmentStatusFilter = {
  equals?: InputMaybe<AssignmentStatus>;
  in?: InputMaybe<Array<AssignmentStatus>>;
  not?: InputMaybe<NestedEnumAssignmentStatusFilter>;
  notIn?: InputMaybe<Array<AssignmentStatus>>;
};

export type NestedEnumAvailabilitySourceFilter = {
  equals?: InputMaybe<AvailabilitySource>;
  in?: InputMaybe<Array<AvailabilitySource>>;
  not?: InputMaybe<NestedEnumAvailabilitySourceFilter>;
  notIn?: InputMaybe<Array<AvailabilitySource>>;
};

export type NestedEnumAvailabilityStatusFilter = {
  equals?: InputMaybe<AvailabilityStatus>;
  in?: InputMaybe<Array<AvailabilityStatus>>;
  not?: InputMaybe<NestedEnumAvailabilityStatusFilter>;
  notIn?: InputMaybe<Array<AvailabilityStatus>>;
};

export type NestedEnumBudgetTransactionTypeFilter = {
  equals?: InputMaybe<BudgetTransactionType>;
  in?: InputMaybe<Array<BudgetTransactionType>>;
  not?: InputMaybe<NestedEnumBudgetTransactionTypeFilter>;
  notIn?: InputMaybe<Array<BudgetTransactionType>>;
};

export type NestedEnumChurchTypeFilter = {
  equals?: InputMaybe<ChurchType>;
  in?: InputMaybe<Array<ChurchType>>;
  not?: InputMaybe<NestedEnumChurchTypeFilter>;
  notIn?: InputMaybe<Array<ChurchType>>;
};

export type NestedEnumEntityTypeFilter = {
  equals?: InputMaybe<EntityType>;
  in?: InputMaybe<Array<EntityType>>;
  not?: InputMaybe<NestedEnumEntityTypeFilter>;
  notIn?: InputMaybe<Array<EntityType>>;
};

export type NestedEnumEventRegistrationStatusFilter = {
  equals?: InputMaybe<EventRegistrationStatus>;
  in?: InputMaybe<Array<EventRegistrationStatus>>;
  not?: InputMaybe<NestedEnumEventRegistrationStatusFilter>;
  notIn?: InputMaybe<Array<EventRegistrationStatus>>;
};

export type NestedEnumEventTargetTypeFilter = {
  equals?: InputMaybe<EventTargetType>;
  in?: InputMaybe<Array<EventTargetType>>;
  not?: InputMaybe<NestedEnumEventTargetTypeFilter>;
  notIn?: InputMaybe<Array<EventTargetType>>;
};

export type NestedEnumEventTypeFilter = {
  equals?: InputMaybe<EventType>;
  in?: InputMaybe<Array<EventType>>;
  not?: InputMaybe<NestedEnumEventTypeFilter>;
  notIn?: InputMaybe<Array<EventType>>;
};

export type NestedEnumGenderTypeNullableFilter = {
  equals?: InputMaybe<GenderType>;
  in?: InputMaybe<Array<GenderType>>;
  not?: InputMaybe<NestedEnumGenderTypeNullableFilter>;
  notIn?: InputMaybe<Array<GenderType>>;
};

export type NestedEnumInstitutionPositionTypeFilter = {
  equals?: InputMaybe<InstitutionPositionType>;
  in?: InputMaybe<Array<InstitutionPositionType>>;
  not?: InputMaybe<NestedEnumInstitutionPositionTypeFilter>;
  notIn?: InputMaybe<Array<InstitutionPositionType>>;
};

export type NestedEnumLanguagePreferenceFilter = {
  equals?: InputMaybe<LanguagePreference>;
  in?: InputMaybe<Array<LanguagePreference>>;
  not?: InputMaybe<NestedEnumLanguagePreferenceFilter>;
  notIn?: InputMaybe<Array<LanguagePreference>>;
};

export type NestedEnumPermissionGroupNullableFilter = {
  equals?: InputMaybe<PermissionGroup>;
  in?: InputMaybe<Array<PermissionGroup>>;
  not?: InputMaybe<NestedEnumPermissionGroupNullableFilter>;
  notIn?: InputMaybe<Array<PermissionGroup>>;
};

export type NestedEnumPermissionResolverNameFilter = {
  equals?: InputMaybe<PermissionResolverName>;
  in?: InputMaybe<Array<PermissionResolverName>>;
  not?: InputMaybe<NestedEnumPermissionResolverNameFilter>;
  notIn?: InputMaybe<Array<PermissionResolverName>>;
};

export type NestedEnumProjectActivityLogActionFilter = {
  equals?: InputMaybe<ProjectActivityLogAction>;
  in?: InputMaybe<Array<ProjectActivityLogAction>>;
  not?: InputMaybe<NestedEnumProjectActivityLogActionFilter>;
  notIn?: InputMaybe<Array<ProjectActivityLogAction>>;
};

export type NestedEnumProjectHistoryTypeFilter = {
  equals?: InputMaybe<ProjectHistoryType>;
  in?: InputMaybe<Array<ProjectHistoryType>>;
  not?: InputMaybe<NestedEnumProjectHistoryTypeFilter>;
  notIn?: InputMaybe<Array<ProjectHistoryType>>;
};

export type NestedEnumProjectStatusFilter = {
  equals?: InputMaybe<ProjectStatus>;
  in?: InputMaybe<Array<ProjectStatus>>;
  not?: InputMaybe<NestedEnumProjectStatusFilter>;
  notIn?: InputMaybe<Array<ProjectStatus>>;
};

export type NestedEnumProjectTypeFilter = {
  equals?: InputMaybe<ProjectType>;
  in?: InputMaybe<Array<ProjectType>>;
  not?: InputMaybe<NestedEnumProjectTypeFilter>;
  notIn?: InputMaybe<Array<ProjectType>>;
};

export type NestedEnumRecurrenceTypeFilter = {
  equals?: InputMaybe<RecurrenceType>;
  in?: InputMaybe<Array<RecurrenceType>>;
  not?: InputMaybe<NestedEnumRecurrenceTypeFilter>;
  notIn?: InputMaybe<Array<RecurrenceType>>;
};

export type NestedEnumRefundTypeNullableFilter = {
  equals?: InputMaybe<RefundType>;
  in?: InputMaybe<Array<RefundType>>;
  not?: InputMaybe<NestedEnumRefundTypeNullableFilter>;
  notIn?: InputMaybe<Array<RefundType>>;
};

export type NestedEnumRequestStatusFilter = {
  equals?: InputMaybe<RequestStatus>;
  in?: InputMaybe<Array<RequestStatus>>;
  not?: InputMaybe<NestedEnumRequestStatusFilter>;
  notIn?: InputMaybe<Array<RequestStatus>>;
};

export type NestedEnumRequestTypeFilter = {
  equals?: InputMaybe<RequestType>;
  in?: InputMaybe<Array<RequestType>>;
  not?: InputMaybe<NestedEnumRequestTypeFilter>;
  notIn?: InputMaybe<Array<RequestType>>;
};

export type NestedEnumServiceCalendarSourceFilter = {
  equals?: InputMaybe<ServiceCalendarSource>;
  in?: InputMaybe<Array<ServiceCalendarSource>>;
  not?: InputMaybe<NestedEnumServiceCalendarSourceFilter>;
  notIn?: InputMaybe<Array<ServiceCalendarSource>>;
};

export type NestedEnumSubsidyHistoryTypeFilter = {
  equals?: InputMaybe<SubsidyHistoryType>;
  in?: InputMaybe<Array<SubsidyHistoryType>>;
  not?: InputMaybe<NestedEnumSubsidyHistoryTypeFilter>;
  notIn?: InputMaybe<Array<SubsidyHistoryType>>;
};

export type NestedEnumSubsidyRequestPriorityFilter = {
  equals?: InputMaybe<SubsidyRequestPriority>;
  in?: InputMaybe<Array<SubsidyRequestPriority>>;
  not?: InputMaybe<NestedEnumSubsidyRequestPriorityFilter>;
  notIn?: InputMaybe<Array<SubsidyRequestPriority>>;
};

export type NestedEnumSubsidyRequestTypeFilter = {
  equals?: InputMaybe<SubsidyRequestType>;
  in?: InputMaybe<Array<SubsidyRequestType>>;
  not?: InputMaybe<NestedEnumSubsidyRequestTypeFilter>;
  notIn?: InputMaybe<Array<SubsidyRequestType>>;
};

export type NestedEnumTransferTypeFilter = {
  equals?: InputMaybe<TransferType>;
  in?: InputMaybe<Array<TransferType>>;
  not?: InputMaybe<NestedEnumTransferTypeFilter>;
  notIn?: InputMaybe<Array<TransferType>>;
};

export type NestedFloatFilter = {
  equals?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<Scalars['Float']['input']>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type NestedIntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedIntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type NestedStringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Notification = {
  __typename?: 'Notification';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  project?: Maybe<Project>;
  project_id?: Maybe<Scalars['String']['output']>;
  read_status: Scalars['Boolean']['output'];
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type NotificationCreateDto = {
  institution_id: Scalars['String']['input'];
  message: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  read_status: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type NotificationListRelationFilter = {
  every?: InputMaybe<NotificationWhereInput>;
  none?: InputMaybe<NotificationWhereInput>;
  some?: InputMaybe<NotificationWhereInput>;
};

export type NotificationOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type NotificationUpdateDto = {
  institution_id?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  read_status?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type NotificationWhereInput = {
  AND?: InputMaybe<Array<NotificationWhereInput>>;
  NOT?: InputMaybe<Array<NotificationWhereInput>>;
  OR?: InputMaybe<Array<NotificationWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  message?: InputMaybe<StringFilter>;
  metadata?: InputMaybe<JsonNullableFilter>;
  project?: InputMaybe<ProjectNullableScalarRelationFilter>;
  project_id?: InputMaybe<StringNullableFilter>;
  read_status?: InputMaybe<BoolFilter>;
  title?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export enum NullsOrder {
  First = 'first',
  Last = 'last'
}

export type OpenSlotForPreacher = {
  __typename?: 'OpenSlotForPreacher';
  churchId: Scalars['String']['output'];
  churchName: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
};

export type Permission = {
  __typename?: 'Permission';
  _count: PermissionCount;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  disabled_to_client: Scalars['Boolean']['output'];
  group?: Maybe<PermissionGroup>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  key_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  resolver_name: PermissionResolverName;
  role_permissions?: Maybe<Array<RolePermission>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type PermissionCount = {
  __typename?: 'PermissionCount';
  role_permissions: Scalars['Int']['output'];
};

export enum PermissionGroup {
  Activity = 'ACTIVITY',
  ActivityDocument = 'ACTIVITY_DOCUMENT',
  AnnualBudget = 'ANNUAL_BUDGET',
  Church = 'CHURCH',
  Communication = 'COMMUNICATION',
  Contact = 'CONTACT',
  Department = 'DEPARTMENT',
  DirectMessage = 'DIRECT_MESSAGE',
  EmailSend = 'EMAIL_SEND',
  Institution = 'INSTITUTION',
  InstitutionPosition = 'INSTITUTION_POSITION',
  Invite = 'INVITE',
  Notification = 'NOTIFICATION',
  Permission = 'PERMISSION',
  Project = 'PROJECT',
  ProjectHistory = 'PROJECT_HISTORY',
  Region = 'REGION',
  Role = 'ROLE',
  Schedule = 'SCHEDULE',
  Setting = 'SETTING',
  SubsidyReceipt = 'SUBSIDY_RECEIPT',
  SubsidyRequest = 'SUBSIDY_REQUEST',
  SubsidyStatus = 'SUBSIDY_STATUS',
  User = 'USER'
}

export type PermissionGroupPermissionsModel = {
  __typename?: 'PermissionGroupPermissionsModel';
  data: Array<PermissionModel>;
  group: Scalars['String']['output'];
};

export type PermissionModel = {
  __typename?: 'PermissionModel';
  description: Scalars['String']['output'];
  group?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  is_essential?: Maybe<Scalars['Boolean']['output']>;
  is_selected?: Maybe<Scalars['Boolean']['output']>;
  key_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  resolver_name: Scalars['String']['output'];
};

export enum PermissionResolverName {
  AddAdjustmentTask = 'addAdjustmentTask',
  AddProjectVoluntary = 'addProjectVoluntary',
  AddRoleToUser = 'addRoleToUser',
  AnnualBudget = 'annualBudget',
  AnnualBudgets = 'annualBudgets',
  ApproveAnnualBudget = 'approveAnnualBudget',
  ApproveSubsidyRequest = 'approveSubsidyRequest',
  AssignmentInviteTemplates = 'assignmentInviteTemplates',
  Auth = 'auth',
  BatchUpdateProjectActivities = 'batchUpdateProjectActivities',
  BudgetDistribution = 'budgetDistribution',
  BudgetKpIs = 'budgetKPIs',
  Church = 'church',
  ChurchActivityTimeline = 'churchActivityTimeline',
  ChurchServiceCalendar = 'churchServiceCalendar',
  Churches = 'churches',
  ChurchesActivityData = 'churchesActivityData',
  Communication = 'communication',
  Communications = 'communications',
  ConfirmRefundDone = 'confirmRefundDone',
  CreateAdjustment = 'createAdjustment',
  CreateAdvanceRequest = 'createAdvanceRequest',
  CreateAssignmentInviteTemplate = 'createAssignmentInviteTemplate',
  CreateChurch = 'createChurch',
  CreateCommunication = 'createCommunication',
  CreateDepartment = 'createDepartment',
  CreateDepartmentBudget = 'createDepartmentBudget',
  CreateDirectMessage = 'createDirectMessage',
  CreateInstitution = 'createInstitution',
  CreateInstitutionBudget = 'createInstitutionBudget',
  CreateInstitutionPosition = 'createInstitutionPosition',
  CreateNotification = 'createNotification',
  CreateProject = 'createProject',
  CreateProjectActivity = 'createProjectActivity',
  CreateProjectHistory = 'createProjectHistory',
  CreateRegion = 'createRegion',
  CreateRole = 'createRole',
  CreateSetting = 'createSetting',
  CreateSubsidyRequest = 'createSubsidyRequest',
  CreateSubsidyStatus = 'createSubsidyStatus',
  CreateSubsidyWithoutDocument = 'createSubsidyWithoutDocument',
  CreateUser = 'createUser',
  DeleteActivityDocument = 'deleteActivityDocument',
  DeleteAnnualBudget = 'deleteAnnualBudget',
  DeleteAssignmentInviteTemplate = 'deleteAssignmentInviteTemplate',
  DeleteAvailabilityRecurrenceRule = 'deleteAvailabilityRecurrenceRule',
  DeleteChurch = 'deleteChurch',
  DeleteCommunication = 'deleteCommunication',
  DeleteDepartment = 'deleteDepartment',
  DeleteDirectMessage = 'deleteDirectMessage',
  DeleteInstitution = 'deleteInstitution',
  DeleteInstitutionPosition = 'deleteInstitutionPosition',
  DeleteNotification = 'deleteNotification',
  DeleteProject = 'deleteProject',
  DeleteProjectActivity = 'deleteProjectActivity',
  DeleteProjectHistory = 'deleteProjectHistory',
  DeleteRegion = 'deleteRegion',
  DeleteRole = 'deleteRole',
  DeleteSetting = 'deleteSetting',
  DeleteSubsidyReceipt = 'deleteSubsidyReceipt',
  DeleteSubsidyRequest = 'deleteSubsidyRequest',
  DeleteSubsidyStatus = 'deleteSubsidyStatus',
  DeleteUser = 'deleteUser',
  Department = 'department',
  DepartmentActivityData = 'departmentActivityData',
  DepartmentBudgetTimeline = 'departmentBudgetTimeline',
  DepartmentKpIs = 'departmentKPIs',
  DepartmentSpending = 'departmentSpending',
  Departments = 'departments',
  DirectMessage = 'directMessage',
  DirectMessages = 'directMessages',
  DownloadActivityDocument = 'downloadActivityDocument',
  DownloadSubsidyReceipt = 'downloadSubsidyReceipt',
  EligiblePreachersForSlot = 'eligiblePreachersForSlot',
  EntityDistribution = 'entityDistribution',
  GapReport = 'gapReport',
  GetActivityDocuments = 'getActivityDocuments',
  GetSpecificProjectKpIs = 'getSpecificProjectKPIs',
  GetSubsidiesWaitingRefund = 'getSubsidiesWaitingRefund',
  GetSubsidyReceipts = 'getSubsidyReceipts',
  GetSubsidyStatusHistory = 'getSubsidyStatusHistory',
  GrantPreacherRegionAccess = 'grantPreacherRegionAccess',
  Institution = 'institution',
  InstitutionPosition = 'institutionPosition',
  InstitutionPositions = 'institutionPositions',
  InstitutionalDepartmentsKpIs = 'institutionalDepartmentsKPIs',
  Institutions = 'institutions',
  InviteToAssignment = 'inviteToAssignment',
  InviteToAssignmentAny = 'inviteToAssignmentAny',
  InviteUser = 'inviteUser',
  LedgerHistory = 'ledgerHistory',
  MyAssignmentRequests = 'myAssignmentRequests',
  MyAvailability = 'myAvailability',
  MyAvailabilityRecurrenceRules = 'myAvailabilityRecurrenceRules',
  MyPreacherRegionAccess = 'myPreacherRegionAccess',
  MyProjects = 'myProjects',
  Notification = 'notification',
  Notifications = 'notifications',
  OpenSlotsForPreacher = 'openSlotsForPreacher',
  Permissions = 'permissions',
  Project = 'project',
  ProjectActivities = 'projectActivities',
  ProjectActivity = 'projectActivity',
  ProjectActivityLogs = 'projectActivityLogs',
  ProjectAdjustment = 'projectAdjustment',
  ProjectAdjustments = 'projectAdjustments',
  ProjectHistories = 'projectHistories',
  ProjectKpIs = 'projectKPIs',
  Projects = 'projects',
  ProjectsByDepartment = 'projectsByDepartment',
  ProjectsTimeline = 'projectsTimeline',
  RecalculateInstitutionAllocatedAmounts = 'recalculateInstitutionAllocatedAmounts',
  Region = 'region',
  Regions = 'regions',
  RejectAnnualBudget = 'rejectAnnualBudget',
  RejectSubsidyRequest = 'rejectSubsidyRequest',
  RemoveAdjustmentTask = 'removeAdjustmentTask',
  RemoveProjectVoluntary = 'removeProjectVoluntary',
  RemoveRoleFromUser = 'removeRoleFromUser',
  RequestAssignment = 'requestAssignment',
  RequestRevisionAnnualBudget = 'requestRevisionAnnualBudget',
  RequestSubsidyRefund = 'requestSubsidyRefund',
  RespondToAssignmentRequest = 'respondToAssignmentRequest',
  RespondToAssignmentRequestAny = 'respondToAssignmentRequestAny',
  RevokePreacherRegionAccess = 'revokePreacherRegionAccess',
  Role = 'role',
  Roles = 'roles',
  ScheduleOverview = 'scheduleOverview',
  SendInviteEmail = 'sendInviteEmail',
  SetAssignment = 'setAssignment',
  SetAssignmentAny = 'setAssignmentAny',
  SetAvailability = 'setAvailability',
  SetAvailabilityBulk = 'setAvailabilityBulk',
  SetAvailabilityRecurrenceRule = 'setAvailabilityRecurrenceRule',
  SetChurchServiceCalendar = 'setChurchServiceCalendar',
  SetChurchServiceCalendarBulk = 'setChurchServiceCalendarBulk',
  Setting = 'setting',
  Settings = 'settings',
  SpendingOverTime = 'spendingOverTime',
  SubmitSubsidyRequest = 'submitSubsidyRequest',
  SubsidyByDepartment = 'subsidyByDepartment',
  SubsidyByMonth = 'subsidyByMonth',
  SubsidyByStatus = 'subsidyByStatus',
  SubsidyKpIs = 'subsidyKPIs',
  SubsidyRequest = 'subsidyRequest',
  SubsidyRequests = 'subsidyRequests',
  SubsidyStatus = 'subsidyStatus',
  SubsidyStatusDistribution = 'subsidyStatusDistribution',
  SubsidyStatuses = 'subsidyStatuses',
  ToggleAdjustmentTask = 'toggleAdjustmentTask',
  ToggleBudgetLock = 'toggleBudgetLock',
  TriggerMonthlyClose = 'triggerMonthlyClose',
  UpdateAdjustmentStatus = 'updateAdjustmentStatus',
  UpdateAssignmentInviteTemplate = 'updateAssignmentInviteTemplate',
  UpdateChurch = 'updateChurch',
  UpdateChurchLeader = 'updateChurchLeader',
  UpdateCommunication = 'updateCommunication',
  UpdateDepartment = 'updateDepartment',
  UpdateDepartmentBudget = 'updateDepartmentBudget',
  UpdateDirectMessage = 'updateDirectMessage',
  UpdateInstitution = 'updateInstitution',
  UpdateInstitutionBudget = 'updateInstitutionBudget',
  UpdateInstitutionPosition = 'updateInstitutionPosition',
  UpdateNotification = 'updateNotification',
  UpdateOwnUser = 'updateOwnUser',
  UpdateProject = 'updateProject',
  UpdateProjectActivity = 'updateProjectActivity',
  UpdateProjectCoOwner = 'updateProjectCoOwner',
  UpdateRegion = 'updateRegion',
  UpdateRole = 'updateRole',
  UpdateSetting = 'updateSetting',
  UpdateSubsidyRequest = 'updateSubsidyRequest',
  UpdateSubsidyStatus = 'updateSubsidyStatus',
  UpdateUser = 'updateUser',
  UpdateUserDepartment = 'updateUserDepartment',
  UploadActivityDocument = 'uploadActivityDocument',
  UploadSubsidyReceipt = 'uploadSubsidyReceipt',
  User = 'user',
  Users = 'users',
  ValidateActivityDocument = 'validateActivityDocument',
  ValidateInviteToken = 'validateInviteToken',
  ValidateSubsidyReceipt = 'validateSubsidyReceipt'
}

export type PermissionScalarRelationFilter = {
  is?: InputMaybe<PermissionWhereInput>;
  isNot?: InputMaybe<PermissionWhereInput>;
};

export type PermissionWhereInput = {
  AND?: InputMaybe<Array<PermissionWhereInput>>;
  NOT?: InputMaybe<Array<PermissionWhereInput>>;
  OR?: InputMaybe<Array<PermissionWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringFilter>;
  disabled_to_client?: InputMaybe<BoolFilter>;
  group?: InputMaybe<EnumPermissionGroupNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  key_code?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  resolver_name?: InputMaybe<EnumPermissionResolverNameFilter>;
  role_permissions?: InputMaybe<RolePermissionListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type PreacherGapEntry = {
  __typename?: 'PreacherGapEntry';
  date: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

/**
 * R6 — reach: LOCAL = home Region only (no row needed here), REGIONAL = every Region with a
 * row here, NATIONAL = every Region in the Institution (no row needed here either — see
 * PreacherRegionAccessScope on the resolver layer for how the three levels are told apart).
 */
export type PreacherRegionAccess = {
  __typename?: 'PreacherRegionAccess';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  region: Region;
  region_id: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type PreacherRegionAccessListRelationFilter = {
  every?: InputMaybe<PreacherRegionAccessWhereInput>;
  none?: InputMaybe<PreacherRegionAccessWhereInput>;
  some?: InputMaybe<PreacherRegionAccessWhereInput>;
};

export type PreacherRegionAccessOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type PreacherRegionAccessWhereInput = {
  AND?: InputMaybe<Array<PreacherRegionAccessWhereInput>>;
  NOT?: InputMaybe<Array<PreacherRegionAccessWhereInput>>;
  OR?: InputMaybe<Array<PreacherRegionAccessWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  region?: InputMaybe<RegionScalarRelationFilter>;
  region_id?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type Project = {
  __typename?: 'Project';
  Church?: Maybe<Church>;
  Institution?: Maybe<Institution>;
  _count: ProjectCount;
  activities?: Maybe<Array<ProjectActivity>>;
  balance: Scalars['Decimal']['output'];
  budget: Scalars['Decimal']['output'];
  budget_transactions?: Maybe<Array<BudgetTransaction>>;
  church?: Maybe<Church>;
  churchDepartment?: Maybe<Department>;
  church_department?: Maybe<Department>;
  church_department_id?: Maybe<Scalars['String']['output']>;
  church_id?: Maybe<Scalars['String']['output']>;
  co_owner?: Maybe<User>;
  co_owner_id?: Maybe<Scalars['String']['output']>;
  collaborators: Array<ProjectCollaborator>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deadline?: Maybe<Scalars['DateTime']['output']>;
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department: Department;
  department_id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  end_at: Scalars['DateTime']['output'];
  event?: Maybe<Event>;
  event_id?: Maybe<Scalars['String']['output']>;
  history: Array<ProjectHistory>;
  id: Scalars['ID']['output'];
  institution_id?: Maybe<Scalars['String']['output']>;
  is_deleted: Scalars['Boolean']['output'];
  is_private: Scalars['Boolean']['output'];
  kpis: ProjectKpIsDto;
  language_preference: LanguagePreference;
  notifications?: Maybe<Array<Notification>>;
  owner: User;
  owner_id: Scalars['String']['output'];
  required_volunteers: Scalars['Boolean']['output'];
  special_projects?: Maybe<Array<SpecialProjects>>;
  start_at: Scalars['DateTime']['output'];
  status: ProjectStatus;
  subsidies?: Maybe<Array<SubsidyRequest>>;
  subsidized_budget: Scalars['Decimal']['output'];
  title: Scalars['String']['output'];
  type: ProjectType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  voluntary_users?: Maybe<Array<VoluntariesOnProjects>>;
};

export type ProjectActivity = {
  __typename?: 'ProjectActivity';
  _count: ProjectActivityCount;
  activity_documents?: Maybe<Array<ActivityDocuments>>;
  activity_funding?: Maybe<ActivityFunding>;
  assignees?: Maybe<Array<ProjectActivityAssignee>>;
  budget_amount: Scalars['Decimal']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  custom_tags?: Maybe<Array<Scalars['String']['output']>>;
  deadline: Scalars['DateTime']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_subsidized: Scalars['Boolean']['output'];
  logs?: Maybe<Array<ProjectActivityLog>>;
  name: Scalars['String']['output'];
  priority: ActivityPriority;
  project: Project;
  project_id: Scalars['String']['output'];
  status: ActivityStatus;
  subsidy_receipts?: Maybe<Array<SubsidyReceipt>>;
  subsidy_request_items?: Maybe<Array<SubsidyRequestItem>>;
  tags?: Maybe<Array<ActivityTags>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type ProjectActivityAssignee = {
  __typename?: 'ProjectActivityAssignee';
  activity: ProjectActivity;
  activity_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type ProjectActivityAssigneeListRelationFilter = {
  every?: InputMaybe<ProjectActivityAssigneeWhereInput>;
  none?: InputMaybe<ProjectActivityAssigneeWhereInput>;
  some?: InputMaybe<ProjectActivityAssigneeWhereInput>;
};

export type ProjectActivityAssigneeOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ProjectActivityAssigneeWhereInput = {
  AND?: InputMaybe<Array<ProjectActivityAssigneeWhereInput>>;
  NOT?: InputMaybe<Array<ProjectActivityAssigneeWhereInput>>;
  OR?: InputMaybe<Array<ProjectActivityAssigneeWhereInput>>;
  activity?: InputMaybe<ProjectActivityScalarRelationFilter>;
  activity_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type ProjectActivityBatchUpdateDto = {
  ids: Array<Scalars['String']['input']>;
  is_subsidized?: InputMaybe<Scalars['Boolean']['input']>;
  priority?: InputMaybe<ActivityPriority>;
  status?: InputMaybe<ActivityStatus>;
};

export type ProjectActivityCount = {
  __typename?: 'ProjectActivityCount';
  activity_documents: Scalars['Int']['output'];
  assignees: Scalars['Int']['output'];
  logs: Scalars['Int']['output'];
  subsidy_receipts: Scalars['Int']['output'];
  subsidy_request_items: Scalars['Int']['output'];
};

export type ProjectActivityCreateDto = {
  activity_funding: ActivityFundingCreateDto;
  assignee_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  budget_amount: Scalars['Float']['input'];
  custom_tags?: InputMaybe<Array<Scalars['String']['input']>>;
  deadline: Scalars['String']['input'];
  description: Scalars['String']['input'];
  is_subsidized?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<ActivityPriority>;
  project_id: Scalars['String']['input'];
  status?: InputMaybe<ActivityStatus>;
  tags: Array<ActivityTags>;
};

export type ProjectActivityCreateWithoutProjectDto = {
  activity_funding: ActivityFundingCreateDto;
  assignee_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  budget_amount: Scalars['Float']['input'];
  custom_tags?: InputMaybe<Array<Scalars['String']['input']>>;
  deadline: Scalars['String']['input'];
  description: Scalars['String']['input'];
  is_subsidized?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<ActivityPriority>;
  status?: InputMaybe<ActivityStatus>;
  tags: Array<ActivityTags>;
};

export type ProjectActivityListRelationFilter = {
  every?: InputMaybe<ProjectActivityWhereInput>;
  none?: InputMaybe<ProjectActivityWhereInput>;
  some?: InputMaybe<ProjectActivityWhereInput>;
};

export type ProjectActivityLog = {
  __typename?: 'ProjectActivityLog';
  action: ProjectActivityLogAction;
  activity: ProjectActivity;
  activity_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  field_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  new_value?: Maybe<Scalars['String']['output']>;
  old_value?: Maybe<Scalars['String']['output']>;
  user: User;
  user_id: Scalars['String']['output'];
};

export enum ProjectActivityLogAction {
  Assigned = 'ASSIGNED',
  BudgetUpdated = 'BUDGET_UPDATED',
  Created = 'CREATED',
  DeadlineUpdated = 'DEADLINE_UPDATED',
  Deleted = 'DELETED',
  PriorityChanged = 'PRIORITY_CHANGED',
  StatusChanged = 'STATUS_CHANGED',
  SubsidizedChanged = 'SUBSIDIZED_CHANGED',
  TagAdded = 'TAG_ADDED',
  TagRemoved = 'TAG_REMOVED',
  Unassigned = 'UNASSIGNED',
  Updated = 'UPDATED'
}

export type ProjectActivityLogListRelationFilter = {
  every?: InputMaybe<ProjectActivityLogWhereInput>;
  none?: InputMaybe<ProjectActivityLogWhereInput>;
  some?: InputMaybe<ProjectActivityLogWhereInput>;
};

export type ProjectActivityLogOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ProjectActivityLogWhereInput = {
  AND?: InputMaybe<Array<ProjectActivityLogWhereInput>>;
  NOT?: InputMaybe<Array<ProjectActivityLogWhereInput>>;
  OR?: InputMaybe<Array<ProjectActivityLogWhereInput>>;
  action?: InputMaybe<EnumProjectActivityLogActionFilter>;
  activity?: InputMaybe<ProjectActivityScalarRelationFilter>;
  activity_id?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  field_name?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  metadata?: InputMaybe<JsonNullableFilter>;
  new_value?: InputMaybe<StringNullableFilter>;
  old_value?: InputMaybe<StringNullableFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type ProjectActivityNullableScalarRelationFilter = {
  is?: InputMaybe<ProjectActivityWhereInput>;
  isNot?: InputMaybe<ProjectActivityWhereInput>;
};

export type ProjectActivityScalarRelationFilter = {
  is?: InputMaybe<ProjectActivityWhereInput>;
  isNot?: InputMaybe<ProjectActivityWhereInput>;
};

export type ProjectActivityUpdateDto = {
  activity_funding?: InputMaybe<ActivityFundingUpdateDto>;
  assignee_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  budget_amount?: InputMaybe<Scalars['Float']['input']>;
  custom_tags?: InputMaybe<Array<Scalars['String']['input']>>;
  deadline?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  is_subsidized?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<ActivityPriority>;
  status?: InputMaybe<ActivityStatus>;
  tags?: InputMaybe<Array<ActivityTags>>;
};

export type ProjectActivityWhereInput = {
  AND?: InputMaybe<Array<ProjectActivityWhereInput>>;
  NOT?: InputMaybe<Array<ProjectActivityWhereInput>>;
  OR?: InputMaybe<Array<ProjectActivityWhereInput>>;
  activity_documents?: InputMaybe<ActivityDocumentsListRelationFilter>;
  activity_funding?: InputMaybe<ActivityFundingNullableScalarRelationFilter>;
  assignees?: InputMaybe<ProjectActivityAssigneeListRelationFilter>;
  budget_amount?: InputMaybe<DecimalFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  custom_tags?: InputMaybe<StringNullableListFilter>;
  deadline?: InputMaybe<DateTimeFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_subsidized?: InputMaybe<BoolFilter>;
  logs?: InputMaybe<ProjectActivityLogListRelationFilter>;
  name?: InputMaybe<StringFilter>;
  priority?: InputMaybe<EnumActivityPriorityFilter>;
  project?: InputMaybe<ProjectScalarRelationFilter>;
  project_id?: InputMaybe<StringFilter>;
  status?: InputMaybe<EnumActivityStatusFilter>;
  subsidy_receipts?: InputMaybe<SubsidyReceiptListRelationFilter>;
  subsidy_request_items?: InputMaybe<SubsidyRequestItemListRelationFilter>;
  tags?: InputMaybe<EnumActivityTagsNullableListFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type ProjectAdjustment = {
  __typename?: 'ProjectAdjustment';
  _count: ProjectAdjustmentCount;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  project_history: ProjectHistory;
  project_history_id: Scalars['String']['output'];
  status: AdjustmentStatus;
  tasks?: Maybe<Array<AdjustmentTask>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type ProjectAdjustmentCount = {
  __typename?: 'ProjectAdjustmentCount';
  tasks: Scalars['Int']['output'];
};

export type ProjectAdjustmentNullableScalarRelationFilter = {
  is?: InputMaybe<ProjectAdjustmentWhereInput>;
  isNot?: InputMaybe<ProjectAdjustmentWhereInput>;
};

export type ProjectAdjustmentScalarRelationFilter = {
  is?: InputMaybe<ProjectAdjustmentWhereInput>;
  isNot?: InputMaybe<ProjectAdjustmentWhereInput>;
};

export type ProjectAdjustmentWhereInput = {
  AND?: InputMaybe<Array<ProjectAdjustmentWhereInput>>;
  NOT?: InputMaybe<Array<ProjectAdjustmentWhereInput>>;
  OR?: InputMaybe<Array<ProjectAdjustmentWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  project_history?: InputMaybe<ProjectHistoryScalarRelationFilter>;
  project_history_id?: InputMaybe<StringFilter>;
  status?: InputMaybe<EnumAdjustmentStatusFilter>;
  tasks?: InputMaybe<AdjustmentTaskListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type ProjectCollaborator = {
  __typename?: 'ProjectCollaborator';
  activity_ids?: Maybe<Array<Scalars['String']['output']>>;
  role: CollaboratorRole;
  user: User;
};

export type ProjectCount = {
  __typename?: 'ProjectCount';
  activities: Scalars['Int']['output'];
  budget_transactions: Scalars['Int']['output'];
  history: Scalars['Int']['output'];
  notifications: Scalars['Int']['output'];
  special_projects: Scalars['Int']['output'];
  subsidies: Scalars['Int']['output'];
  voluntary_users: Scalars['Int']['output'];
};

export type ProjectCreateDto = {
  activities?: InputMaybe<Array<ProjectActivityCreateWithoutProjectDto>>;
  balance?: Scalars['Float']['input'];
  budget: Scalars['Float']['input'];
  church_department_id?: InputMaybe<Scalars['String']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  co_owner_id?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['String']['input']>;
  department_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  end_at: Scalars['String']['input'];
  event?: InputMaybe<EventCreateDto>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  is_event?: Scalars['Boolean']['input'];
  is_private?: Scalars['Boolean']['input'];
  is_special_case?: Scalars['Boolean']['input'];
  language_preference: LanguagePreference;
  location_church_plant?: InputMaybe<Scalars['String']['input']>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  required_volunteers?: Scalars['Boolean']['input'];
  special_budget?: InputMaybe<Scalars['Float']['input']>;
  special_case_reason?: InputMaybe<Scalars['String']['input']>;
  start_at: Scalars['String']['input'];
  subsidized_budget?: Scalars['Float']['input'];
  title: Scalars['String']['input'];
  type: ProjectType;
};

export type ProjectHistory = {
  __typename?: 'ProjectHistory';
  adjustment?: Maybe<ProjectAdjustment>;
  comment?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  field_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  new_value?: Maybe<Scalars['String']['output']>;
  old_value?: Maybe<Scalars['String']['output']>;
  project: Project;
  project_id: Scalars['String']['output'];
  type: ProjectHistoryType;
  user: User;
  user_id: Scalars['String']['output'];
};

export type ProjectHistoryCreateDto = {
  comment?: InputMaybe<Scalars['String']['input']>;
  field_name?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  new_value?: InputMaybe<Scalars['String']['input']>;
  old_value?: InputMaybe<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  type: ProjectHistoryType;
};

export type ProjectHistoryListRelationFilter = {
  every?: InputMaybe<ProjectHistoryWhereInput>;
  none?: InputMaybe<ProjectHistoryWhereInput>;
  some?: InputMaybe<ProjectHistoryWhereInput>;
};

export type ProjectHistoryOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ProjectHistoryScalarRelationFilter = {
  is?: InputMaybe<ProjectHistoryWhereInput>;
  isNot?: InputMaybe<ProjectHistoryWhereInput>;
};

export enum ProjectHistoryType {
  ActivityCreated = 'ACTIVITY_CREATED',
  ActivityDeleted = 'ACTIVITY_DELETED',
  ActivityUpdated = 'ACTIVITY_UPDATED',
  AdjustmentNeeded = 'ADJUSTMENT_NEEDED',
  BudgetUpdated = 'BUDGET_UPDATED',
  Comment = 'COMMENT',
  CoOwnerUpdated = 'CO_OWNER_UPDATED',
  Created = 'CREATED',
  DeadlineUpdated = 'DEADLINE_UPDATED',
  Deleted = 'DELETED',
  DepartmentChanged = 'DEPARTMENT_CHANGED',
  OwnerChanged = 'OWNER_CHANGED',
  Restored = 'RESTORED',
  StatusChanged = 'STATUS_CHANGED',
  SubsidyApproved = 'SUBSIDY_APPROVED',
  SubsidyCreated = 'SUBSIDY_CREATED',
  SubsidyDeleted = 'SUBSIDY_DELETED',
  SubsidyDocumentRejected = 'SUBSIDY_DOCUMENT_REJECTED',
  SubsidyDocumentUpdated = 'SUBSIDY_DOCUMENT_UPDATED',
  SubsidyDocumentValidated = 'SUBSIDY_DOCUMENT_VALIDATED',
  SubsidyRejected = 'SUBSIDY_REJECTED',
  SubsidyUpdated = 'SUBSIDY_UPDATED',
  Updated = 'UPDATED'
}

export type ProjectHistoryWhereInput = {
  AND?: InputMaybe<Array<ProjectHistoryWhereInput>>;
  NOT?: InputMaybe<Array<ProjectHistoryWhereInput>>;
  OR?: InputMaybe<Array<ProjectHistoryWhereInput>>;
  adjustment?: InputMaybe<ProjectAdjustmentNullableScalarRelationFilter>;
  comment?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  field_name?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  metadata?: InputMaybe<JsonNullableFilter>;
  new_value?: InputMaybe<StringNullableFilter>;
  old_value?: InputMaybe<StringNullableFilter>;
  project?: InputMaybe<ProjectScalarRelationFilter>;
  project_id?: InputMaybe<StringFilter>;
  type?: InputMaybe<EnumProjectHistoryTypeFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type ProjectKpIs = {
  __typename?: 'ProjectKPIs';
  activeProjects: Scalars['Int']['output'];
  averageBudgetPerProject: Scalars['Float']['output'];
  completedProjects: Scalars['Int']['output'];
  projectsWithVolunteers: Scalars['Int']['output'];
  totalBudget: Scalars['Float']['output'];
  totalProjects: Scalars['Int']['output'];
  totalSubsidizedBudget: Scalars['Float']['output'];
  totalSubsidyAmount: Scalars['Float']['output'];
  totalSubsidyRequests: Scalars['Int']['output'];
  upcomingProjects: Scalars['Int']['output'];
};

export type ProjectKpIsDto = {
  __typename?: 'ProjectKPIsDto';
  allocatedBudget: Scalars['Float']['output'];
  approvedSubsidyRequestsCount: Scalars['Int']['output'];
  balance: Scalars['Float']['output'];
  budgetUtilization: Scalars['Int']['output'];
  completedActivities: Scalars['Int']['output'];
  completionRate: Scalars['Int']['output'];
  daysRemaining: Scalars['Int']['output'];
  endDate: Scalars['DateTime']['output'];
  inProgressActivities: Scalars['Int']['output'];
  projectBudget: Scalars['Float']['output'];
  projectStatus: Scalars['String']['output'];
  subsidizedActivities: Scalars['Int']['output'];
  subsidizedBudget: Scalars['Float']['output'];
  subsidizedBudgetPercentage: Scalars['Int']['output'];
  subsidyRate: Scalars['Int']['output'];
  subsidyRequestsCount: Scalars['Int']['output'];
  totalActivities: Scalars['Int']['output'];
  totalSubsidyAmount: Scalars['Float']['output'];
};

export type ProjectListRelationFilter = {
  every?: InputMaybe<ProjectWhereInput>;
  none?: InputMaybe<ProjectWhereInput>;
  some?: InputMaybe<ProjectWhereInput>;
};

export type ProjectNullableScalarRelationFilter = {
  is?: InputMaybe<ProjectWhereInput>;
  isNot?: InputMaybe<ProjectWhereInput>;
};

export type ProjectOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type ProjectScalarRelationFilter = {
  is?: InputMaybe<ProjectWhereInput>;
  isNot?: InputMaybe<ProjectWhereInput>;
};

export enum ProjectStatus {
  AdjustmentsNeeded = 'ADJUSTMENTS_NEEDED',
  Concluded = 'CONCLUDED',
  Draft = 'DRAFT',
  Expired = 'EXPIRED',
  InProgress = 'IN_PROGRESS',
  InReview = 'IN_REVIEW',
  OnHold = 'ON_HOLD',
  OpenRequest = 'OPEN_REQUEST',
  Overdue = 'OVERDUE',
  PendingReceipt = 'PENDING_RECEIPT',
  WaitingRefund = 'WAITING_REFUND'
}

export enum ProjectType {
  Global = 'Global',
  Local = 'Local'
}

export type ProjectUpdateCoOwnerDto = {
  co_owner_id?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectUpdateDto = {
  activities?: InputMaybe<Array<ProjectActivityUpdateDto>>;
  balance?: InputMaybe<Scalars['Float']['input']>;
  budget?: InputMaybe<Scalars['Float']['input']>;
  church_department_id?: InputMaybe<Scalars['String']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  co_owner_id?: InputMaybe<Scalars['String']['input']>;
  deadline?: InputMaybe<Scalars['String']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  end_at?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  is_private?: InputMaybe<Scalars['Boolean']['input']>;
  language_preference?: InputMaybe<LanguagePreference>;
  owner_id?: InputMaybe<Scalars['String']['input']>;
  required_volunteers?: InputMaybe<Scalars['Boolean']['input']>;
  start_at?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProjectStatus>;
  subsidized_budget?: InputMaybe<Scalars['Float']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ProjectType>;
};

export type ProjectWhereInput = {
  AND?: InputMaybe<Array<ProjectWhereInput>>;
  Institution?: InputMaybe<InstitutionNullableScalarRelationFilter>;
  NOT?: InputMaybe<Array<ProjectWhereInput>>;
  OR?: InputMaybe<Array<ProjectWhereInput>>;
  activities?: InputMaybe<ProjectActivityListRelationFilter>;
  balance?: InputMaybe<DecimalFilter>;
  budget?: InputMaybe<DecimalFilter>;
  budget_transactions?: InputMaybe<BudgetTransactionListRelationFilter>;
  church?: InputMaybe<ChurchNullableScalarRelationFilter>;
  church_department?: InputMaybe<DepartmentNullableScalarRelationFilter>;
  church_department_id?: InputMaybe<StringNullableFilter>;
  church_id?: InputMaybe<StringNullableFilter>;
  co_owner?: InputMaybe<UserNullableScalarRelationFilter>;
  co_owner_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deadline?: InputMaybe<DateTimeNullableFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department?: InputMaybe<DepartmentScalarRelationFilter>;
  department_id?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  end_at?: InputMaybe<DateTimeFilter>;
  event?: InputMaybe<EventNullableScalarRelationFilter>;
  event_id?: InputMaybe<StringNullableFilter>;
  history?: InputMaybe<ProjectHistoryListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  institution_id?: InputMaybe<StringNullableFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_private?: InputMaybe<BoolFilter>;
  language_preference?: InputMaybe<EnumLanguagePreferenceFilter>;
  notifications?: InputMaybe<NotificationListRelationFilter>;
  owner?: InputMaybe<UserScalarRelationFilter>;
  owner_id?: InputMaybe<StringFilter>;
  required_volunteers?: InputMaybe<BoolFilter>;
  special_projects?: InputMaybe<SpecialProjectsListRelationFilter>;
  start_at?: InputMaybe<DateTimeFilter>;
  status?: InputMaybe<EnumProjectStatusFilter>;
  subsidies?: InputMaybe<SubsidyRequestListRelationFilter>;
  subsidized_budget?: InputMaybe<DecimalFilter>;
  title?: InputMaybe<StringFilter>;
  type?: InputMaybe<EnumProjectTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  voluntary_users?: InputMaybe<VoluntariesOnProjectsListRelationFilter>;
};

export type ProjectsByDepartment = {
  __typename?: 'ProjectsByDepartment';
  annual_budget?: Maybe<Scalars['Float']['output']>;
  budget_used: Scalars['Float']['output'];
  department: Scalars['String']['output'];
  projects: Scalars['Int']['output'];
  remaining_budget: Scalars['Float']['output'];
};

export type ProjectsTimeline = {
  __typename?: 'ProjectsTimeline';
  budget: Scalars['Float']['output'];
  completed: Scalars['Int']['output'];
  created: Scalars['Int']['output'];
  month: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  annualBudget?: Maybe<AnnualBudget>;
  annualBudgets: Array<AnnualBudget>;
  assignmentInviteTemplates: Array<AssignmentInviteTemplate>;
  budgetDistribution: BudgetDistribution;
  budgetKPIs: BudgetKpIs;
  checkEmailAvailability: EmailVerificationResponse;
  church?: Maybe<Church>;
  churchActivityTimeline: Array<Scalars['JSON']['output']>;
  churchServiceCalendar: Array<ChurchServiceCalendar>;
  churches: Array<Church>;
  communication?: Maybe<Communication>;
  communications: Array<Communication>;
  contact?: Maybe<Contact>;
  contacts: Array<Contact>;
  department?: Maybe<Department>;
  departmentActivityData: Array<DepartmentActivityData>;
  departmentBudgetTimeline: Array<DepartmentBudgetTimeline>;
  departmentKPIs: DepartmentKpIs;
  departmentSpending: Array<DepartmentSpending>;
  departments: Array<Department>;
  directMessage?: Maybe<DirectMessage>;
  directMessages: Array<DirectMessage>;
  downloadActivityDocument: Scalars['String']['output'];
  downloadSubsidyReceipt: Scalars['String']['output'];
  eligiblePreachersForSlot: Array<User>;
  entityDistribution: Array<EntityDistribution>;
  gapReport: GapReport;
  getActivityDocuments: Array<ActivityDocuments>;
  getSubsidiesWaitingRefund: Array<SubsidyRequest>;
  getSubsidyReceipts: Array<SubsidyReceipt>;
  getSubsidyReceiptsByItemId: Array<SubsidyReceipt>;
  getSubsidyReceiptsByRequestId: Array<SubsidyReceipt>;
  getSubsidyStatusHistory: Array<SubsidyStatusHistory>;
  /** Get city and province information for a Dutch postal code (ZIP code) and house number */
  getZipInfo: ZipInfo;
  institution?: Maybe<Institution>;
  institutionPosition?: Maybe<InstitutionPosition>;
  institutionPositions: Array<InstitutionPosition>;
  institutionalDepartmentsKPIs: InstitutionalDepartmentsKpIs;
  institutions: Array<Institution>;
  ledgerHistory: LedgerHistoryPaginatedResponse;
  myAssignmentRequests: Array<AssignmentRequest>;
  myAvailability: Array<Availability>;
  myAvailabilityRecurrenceRules: Array<AvailabilityRecurrenceRule>;
  myNotifications: Array<Notification>;
  myPreacherRegionAccess: Array<PreacherRegionAccess>;
  myProjects: Array<Project>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  openSlotsForPreacher: Array<OpenSlotForPreacher>;
  permissions: Array<PermissionGroupPermissionsModel>;
  project?: Maybe<Project>;
  projectActivities: Array<ProjectActivity>;
  projectActivity: ProjectActivity;
  projectActivityBudgetSummaries: Array<ActivityBudgetSummary>;
  projectActivityLogs: Array<ProjectActivityLog>;
  projectAdjustment: ProjectAdjustment;
  projectAdjustments: Array<ProjectAdjustment>;
  projectHistories: Array<ProjectHistory>;
  projectKPIs: ProjectKpIs;
  projects: Array<Project>;
  projectsByDepartment: Array<ProjectsByDepartment>;
  projectsTimeline: Array<ProjectsTimeline>;
  region?: Maybe<Region>;
  regions: Array<Region>;
  role?: Maybe<RoleModel>;
  roles: Array<RoleModel>;
  scheduleOverview: Array<Assignment>;
  setting?: Maybe<Setting>;
  settings: Array<Setting>;
  spendingOverTime: Array<SpendingOverTime>;
  subsidyByDepartment: Array<SubsidyByDepartment>;
  subsidyByMonth: Array<SubsidyByMonth>;
  subsidyByStatus: Array<SubsidyByStatus>;
  subsidyKPIs: SubsidyKpIs;
  subsidyRequest?: Maybe<SubsidyRequest>;
  subsidyRequests: Array<SubsidyRequest>;
  subsidyStatus?: Maybe<SubsidyStatus>;
  subsidyStatusDistribution: Array<SubsidyStatusDistribution>;
  subsidyStatuses: Array<SubsidyStatus>;
  user?: Maybe<UserModel>;
  userWithRoles?: Maybe<UserWithRoles>;
  users: Array<UserModel>;
};


export type QueryAnnualBudgetArgs = {
  id: Scalars['String']['input'];
};


export type QueryAnnualBudgetsArgs = {
  cursor?: InputMaybe<AnnualBudgetWhereUniqueInput>;
  distinct?: InputMaybe<Array<AnnualBudgetScalarFieldEnum>>;
  orderBy?: InputMaybe<Array<AnnualBudgetOrderByWithRelationInput>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AnnualBudgetWhereInput>;
};


export type QueryBudgetDistributionArgs = {
  institutionId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QueryBudgetKpIsArgs = {
  institutionId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QueryCheckEmailAvailabilityArgs = {
  email: Scalars['String']['input'];
};


export type QueryChurchArgs = {
  id: Scalars['String']['input'];
};


export type QueryChurchActivityTimelineArgs = {
  institution_id?: InputMaybe<Scalars['String']['input']>;
  selectedYear?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryChurchServiceCalendarArgs = {
  church_id: Scalars['String']['input'];
  month: Scalars['String']['input'];
};


export type QueryChurchesArgs = {
  institution_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCommunicationArgs = {
  id: Scalars['String']['input'];
};


export type QueryContactArgs = {
  id: Scalars['String']['input'];
};


export type QueryDepartmentArgs = {
  id: Scalars['String']['input'];
};


export type QueryDepartmentActivityDataArgs = {
  church_id?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  selectedYear?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryDepartmentBudgetTimelineArgs = {
  church_id?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  selectedYear?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryDepartmentKpIsArgs = {
  church_id?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  selectedYear?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryDepartmentSpendingArgs = {
  institutionId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QueryDepartmentsArgs = {
  institution_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDirectMessageArgs = {
  id: Scalars['String']['input'];
};


export type QueryDownloadActivityDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDownloadSubsidyReceiptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEligiblePreachersForSlotArgs = {
  church_id: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
};


export type QueryEntityDistributionArgs = {
  year: Scalars['Int']['input'];
};


export type QueryGapReportArgs = {
  month: Scalars['String']['input'];
};


export type QueryGetActivityDocumentsArgs = {
  activityId: Scalars['ID']['input'];
};


export type QueryGetSubsidiesWaitingRefundArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetSubsidyReceiptsArgs = {
  input: GetSubsidyReceiptsDto;
};


export type QueryGetSubsidyReceiptsByItemIdArgs = {
  subsidyRequestItemId: Scalars['ID']['input'];
};


export type QueryGetSubsidyReceiptsByRequestIdArgs = {
  subsidyRequestId: Scalars['ID']['input'];
};


export type QueryGetSubsidyStatusHistoryArgs = {
  subsidyRequestId: Scalars['String']['input'];
};


export type QueryGetZipInfoArgs = {
  houseNumber: Scalars['Int']['input'];
  zip: Scalars['String']['input'];
};


export type QueryInstitutionArgs = {
  id: Scalars['String']['input'];
};


export type QueryInstitutionPositionArgs = {
  id: Scalars['String']['input'];
};


export type QueryInstitutionPositionsArgs = {
  institution_id: Scalars['String']['input'];
};


export type QueryInstitutionalDepartmentsKpIsArgs = {
  institutionId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QueryLedgerHistoryArgs = {
  filters: LedgerHistoryFilterInput;
};


export type QueryMyAvailabilityArgs = {
  month: Scalars['String']['input'];
};


export type QueryNotificationArgs = {
  id: Scalars['String']['input'];
};


export type QueryOpenSlotsForPreacherArgs = {
  month: Scalars['String']['input'];
};


export type QueryProjectArgs = {
  id: Scalars['String']['input'];
};


export type QueryProjectActivitiesArgs = {
  filters?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProjectActivityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectActivityBudgetSummariesArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProjectActivityLogsArgs = {
  activityId: Scalars['ID']['input'];
};


export type QueryProjectAdjustmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProjectAdjustmentsArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProjectHistoriesArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryProjectKpIsArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProjectsArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProjectsByDepartmentArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProjectsTimelineArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryRegionArgs = {
  id: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  id: Scalars['String']['input'];
};


export type QueryScheduleOverviewArgs = {
  month: Scalars['String']['input'];
};


export type QuerySettingArgs = {
  id: Scalars['String']['input'];
};


export type QuerySpendingOverTimeArgs = {
  institutionId: Scalars['String']['input'];
  year: Scalars['Int']['input'];
};


export type QuerySubsidyByDepartmentArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubsidyByMonthArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubsidyByStatusArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubsidyKpIsArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubsidyRequestArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubsidyRequestsArgs = {
  project_id?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubsidyStatusArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubsidyStatusDistributionArgs = {
  institutionId?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySubsidyStatusesArgs = {
  filters?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserWithRolesArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  institution_id?: InputMaybe<Scalars['String']['input']>;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type RecalculateAllocatedAmountsResponse = {
  __typename?: 'RecalculateAllocatedAmountsResponse';
  message: Scalars['String']['output'];
  updated: Scalars['Int']['output'];
};

/**
 * WEEKLY covers "every Saturday available" / "never on Mondays".
 * DATE_RANGE covers everything from a single day off to a full month or year of vacation —
 * one flexible range instead of separate MONTHLY/YEARLY branches (simpler, same coverage).
 */
export enum RecurrenceType {
  DateRange = 'DATE_RANGE',
  Weekly = 'WEEKLY'
}

export enum RefundType {
  Partial = 'PARTIAL',
  Total = 'TOTAL'
}

export type Region = {
  __typename?: 'Region';
  _count: RegionCount;
  churches?: Maybe<Array<Church>>;
  color?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  kpiData: RegionKpiData;
  name: Scalars['String']['output'];
  preacher_region_access?: Maybe<Array<PreacherRegionAccess>>;
  territory?: Maybe<Scalars['JSON']['output']>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type RegionCount = {
  __typename?: 'RegionCount';
  churches: Scalars['Int']['output'];
  preacher_region_access: Scalars['Int']['output'];
};

export type RegionCreateDto = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  territory?: InputMaybe<Scalars['JSON']['input']>;
};

export type RegionKpiData = {
  __typename?: 'RegionKPIData';
  totalChurches: Scalars['Float']['output'];
  totalCities: Scalars['Float']['output'];
  totalProvinces: Scalars['Float']['output'];
  totalRegions: Scalars['Float']['output'];
};

export type RegionModel = {
  __typename?: 'RegionModel';
  color?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  territory?: Maybe<Scalars['JSON']['output']>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type RegionNullableScalarRelationFilter = {
  is?: InputMaybe<RegionWhereInput>;
  isNot?: InputMaybe<RegionWhereInput>;
};

export type RegionOrderByWithRelationInput = {
  churches?: InputMaybe<ChurchOrderByRelationAggregateInput>;
  color?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  created_by?: InputMaybe<SortOrder>;
  deleted_at?: InputMaybe<SortOrderInput>;
  deleted_by?: InputMaybe<SortOrderInput>;
  description?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  is_deleted?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  preacher_region_access?: InputMaybe<PreacherRegionAccessOrderByRelationAggregateInput>;
  territory?: InputMaybe<SortOrderInput>;
  updated_at?: InputMaybe<SortOrder>;
  updated_by?: InputMaybe<SortOrder>;
};

export type RegionScalarRelationFilter = {
  is?: InputMaybe<RegionWhereInput>;
  isNot?: InputMaybe<RegionWhereInput>;
};

export type RegionUpdateDto = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  territory?: InputMaybe<Scalars['JSON']['input']>;
};

export type RegionWhereInput = {
  AND?: InputMaybe<Array<RegionWhereInput>>;
  NOT?: InputMaybe<Array<RegionWhereInput>>;
  OR?: InputMaybe<Array<RegionWhereInput>>;
  churches?: InputMaybe<ChurchListRelationFilter>;
  color?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  name?: InputMaybe<StringFilter>;
  preacher_region_access?: InputMaybe<PreacherRegionAccessListRelationFilter>;
  territory?: InputMaybe<JsonNullableFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type RejectAnnualBudgetDto = {
  reason: Scalars['String']['input'];
};

export type RejectBudgetResponse = {
  __typename?: 'RejectBudgetResponse';
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  review_date: Scalars['DateTime']['output'];
  reviewed_by: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type RemoveProjectVoluntaryDto = {
  project_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type RequestRevisionAnnualBudgetDto = {
  revision_notes: Scalars['String']['input'];
};

export type RequestRevisionBudgetResponse = {
  __typename?: 'RequestRevisionBudgetResponse';
  id: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  review_date: Scalars['DateTime']['output'];
  reviewed_by: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export enum RequestStatus {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  Pending = 'PENDING',
  Superseded = 'SUPERSEDED',
  Withdrawn = 'WITHDRAWN'
}

export enum RequestType {
  ChurchInvited = 'CHURCH_INVITED',
  PreacherRequested = 'PREACHER_REQUESTED'
}

export type ResetPasswordInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  resetToken: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  _count: RoleCount;
  color?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  direct_message_recipients?: Maybe<Array<DirectMessageRecipient>>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_fixed: Scalars['Boolean']['output'];
  key_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role_permissions?: Maybe<Array<RolePermission>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user_roles?: Maybe<Array<UserRole>>;
};

export type RoleAssignmentModel = {
  __typename?: 'RoleAssignmentModel';
  is_deleted: Scalars['Boolean']['output'];
  user_id: Scalars['String']['output'];
};

export type RoleCount = {
  __typename?: 'RoleCount';
  direct_message_recipients: Scalars['Int']['output'];
  role_permissions: Scalars['Int']['output'];
  user_roles: Scalars['Int']['output'];
};

export type RoleModel = {
  __typename?: 'RoleModel';
  color?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  is_fixed: Scalars['Boolean']['output'];
  key_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  permissions: Array<PermissionGroupPermissionsModel>;
  users?: Maybe<Array<Maybe<RoleAssignmentModel>>>;
};

export type RolePermission = {
  __typename?: 'RolePermission';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_essential: Scalars['Boolean']['output'];
  permission: Permission;
  permission_id: Scalars['String']['output'];
  role: Role;
  role_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type RolePermissionListRelationFilter = {
  every?: InputMaybe<RolePermissionWhereInput>;
  none?: InputMaybe<RolePermissionWhereInput>;
  some?: InputMaybe<RolePermissionWhereInput>;
};

export type RolePermissionWhereInput = {
  AND?: InputMaybe<Array<RolePermissionWhereInput>>;
  NOT?: InputMaybe<Array<RolePermissionWhereInput>>;
  OR?: InputMaybe<Array<RolePermissionWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_essential?: InputMaybe<BoolFilter>;
  permission?: InputMaybe<PermissionScalarRelationFilter>;
  permission_id?: InputMaybe<StringFilter>;
  role?: InputMaybe<RoleScalarRelationFilter>;
  role_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type RoleScalarRelationFilter = {
  is?: InputMaybe<RoleWhereInput>;
  isNot?: InputMaybe<RoleWhereInput>;
};

export type RoleWhereInput = {
  AND?: InputMaybe<Array<RoleWhereInput>>;
  NOT?: InputMaybe<Array<RoleWhereInput>>;
  OR?: InputMaybe<Array<RoleWhereInput>>;
  color?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringFilter>;
  direct_message_recipients?: InputMaybe<DirectMessageRecipientListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_fixed?: InputMaybe<BoolFilter>;
  key_code?: InputMaybe<StringFilter>;
  name?: InputMaybe<StringFilter>;
  role_permissions?: InputMaybe<RolePermissionListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user_roles?: InputMaybe<UserRoleListRelationFilter>;
};

export type SendCodeInput = {
  email: Scalars['String']['input'];
};

export type SendEmailVerificationCodeInput = {
  email: Scalars['String']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

/**
 * BULK_DEFAULT = generated by an admin/department-leader bulk pattern (R8.1), shown to the
 * church leader as a suggestion pending confirmation. CHURCH_CONFIRMED = the leader explicitly
 * set or accepted it for their own church — a bulk re-apply must never silently overwrite this.
 */
export enum ServiceCalendarSource {
  BulkDefault = 'BULK_DEFAULT',
  ChurchConfirmed = 'CHURCH_CONFIRMED'
}

export type SetAssignmentInput = {
  church_id: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
  status?: InputMaybe<AssignmentStatus>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type SetAvailabilityBulkInput = {
  end_date: Scalars['DateTime']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  start_date: Scalars['DateTime']['input'];
  status: AvailabilityStatus;
};

export type SetAvailabilityInput = {
  date: Scalars['DateTime']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  status: AvailabilityStatus;
};

export type SetAvailabilityRecurrenceRuleInput = {
  day_of_week?: InputMaybe<Scalars['Int']['input']>;
  effective_from?: InputMaybe<Scalars['DateTime']['input']>;
  effective_until?: InputMaybe<Scalars['DateTime']['input']>;
  end_date?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  start_date?: InputMaybe<Scalars['DateTime']['input']>;
  status: AvailabilityStatus;
  type: RecurrenceType;
};

export type SetServiceCalendarBulkInput = {
  church_ids: Array<Scalars['String']['input']>;
  day_of_week: Scalars['Int']['input'];
  effective_from: Scalars['DateTime']['input'];
  effective_until?: InputMaybe<Scalars['DateTime']['input']>;
  has_service: Scalars['Boolean']['input'];
};

export type SetServiceCalendarInput = {
  church_id: Scalars['String']['input'];
  date?: InputMaybe<Scalars['DateTime']['input']>;
  day_of_week?: InputMaybe<Scalars['Int']['input']>;
  effective_from?: InputMaybe<Scalars['DateTime']['input']>;
  effective_until?: InputMaybe<Scalars['DateTime']['input']>;
  has_service: Scalars['Boolean']['input'];
};

export type Setting = {
  __typename?: 'Setting';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type SettingCreateDto = {
  description: Scalars['String']['input'];
  institution_id: Scalars['String']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type SettingListRelationFilter = {
  every?: InputMaybe<SettingWhereInput>;
  none?: InputMaybe<SettingWhereInput>;
  some?: InputMaybe<SettingWhereInput>;
};

export type SettingOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type SettingUpdateDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type SettingWhereInput = {
  AND?: InputMaybe<Array<SettingWhereInput>>;
  NOT?: InputMaybe<Array<SettingWhereInput>>;
  OR?: InputMaybe<Array<SettingWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  key?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  value?: InputMaybe<StringFilter>;
};

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type SortOrderInput = {
  nulls?: InputMaybe<NullsOrder>;
  sort: SortOrder;
};

export type SpecialProjects = {
  __typename?: 'SpecialProjects';
  budget?: Maybe<Scalars['Decimal']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department_id: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institution_id?: Maybe<Scalars['String']['output']>;
  is_deleted: Scalars['Boolean']['output'];
  justification_note?: Maybe<Scalars['String']['output']>;
  location_church_plant?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Project>;
  project_id?: Maybe<Scalars['String']['output']>;
  subsidy_status?: Maybe<SubsidyStatus>;
  subsidy_status_id: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type SpecialProjectsListRelationFilter = {
  every?: InputMaybe<SpecialProjectsWhereInput>;
  none?: InputMaybe<SpecialProjectsWhereInput>;
  some?: InputMaybe<SpecialProjectsWhereInput>;
};

export type SpecialProjectsWhereInput = {
  AND?: InputMaybe<Array<SpecialProjectsWhereInput>>;
  NOT?: InputMaybe<Array<SpecialProjectsWhereInput>>;
  OR?: InputMaybe<Array<SpecialProjectsWhereInput>>;
  budget?: InputMaybe<DecimalNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department_id?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  institution_id?: InputMaybe<StringNullableFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  justification_note?: InputMaybe<StringNullableFilter>;
  location_church_plant?: InputMaybe<StringNullableFilter>;
  project?: InputMaybe<ProjectNullableScalarRelationFilter>;
  project_id?: InputMaybe<StringNullableFilter>;
  subsidy_status?: InputMaybe<SubsidyStatusNullableScalarRelationFilter>;
  subsidy_status_id?: InputMaybe<StringFilter>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type SpendingOverTime = {
  __typename?: 'SpendingOverTime';
  date: Scalars['String']['output'];
  departments: Array<DepartmentMonthlySpending>;
  month: Scalars['String']['output'];
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableListFilter = {
  equals?: InputMaybe<Array<Scalars['String']['input']>>;
  has?: InputMaybe<Scalars['String']['input']>;
  hasEvery?: InputMaybe<Array<Scalars['String']['input']>>;
  hasSome?: InputMaybe<Array<Scalars['String']['input']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  projectHistoryAdded: ProjectHistory;
  userProjectHistoryAdded: ProjectHistory;
};


export type SubscriptionProjectHistoryAddedArgs = {
  projectId: Scalars['ID']['input'];
};


export type SubscriptionUserProjectHistoryAddedArgs = {
  userId: Scalars['ID']['input'];
};

export type SubsidyByDepartment = {
  __typename?: 'SubsidyByDepartment';
  amount: Scalars['Float']['output'];
  department: Scalars['String']['output'];
  month: Scalars['String']['output'];
};

export type SubsidyByMonth = {
  __typename?: 'SubsidyByMonth';
  approved: Scalars['Int']['output'];
  month: Scalars['String']['output'];
  pending: Scalars['Int']['output'];
  quarter: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
};

export type SubsidyByStatus = {
  __typename?: 'SubsidyByStatus';
  count: Scalars['Int']['output'];
  fill: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export enum SubsidyHistoryType {
  Comment = 'COMMENT',
  DocumentAction = 'DOCUMENT_ACTION',
  PriorityChange = 'PRIORITY_CHANGE',
  StatusChange = 'STATUS_CHANGE'
}

export type SubsidyKpIs = {
  __typename?: 'SubsidyKPIs';
  approvalRate: Scalars['Int']['output'];
  approvedRequests: Scalars['Int']['output'];
  closedRequests: Scalars['Int']['output'];
  inReviewRequests: Scalars['Int']['output'];
  pendingRequests: Scalars['Int']['output'];
  rejectedRequests: Scalars['Int']['output'];
  totalApproved: Scalars['Float']['output'];
  totalRequested: Scalars['Float']['output'];
  totalRequests: Scalars['Int']['output'];
};

export type SubsidyReceipt = {
  __typename?: 'SubsidyReceipt';
  amount?: Maybe<Scalars['Decimal']['output']>;
  approved: Scalars['Boolean']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  drive_file_id?: Maybe<Scalars['String']['output']>;
  file_url: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_refund_receipt: Scalars['Boolean']['output'];
  is_validated: Scalars['Boolean']['output'];
  note?: Maybe<Scalars['String']['output']>;
  project_activities_id?: Maybe<Scalars['String']['output']>;
  project_activity?: Maybe<ProjectActivity>;
  rejection_reason?: Maybe<Scalars['String']['output']>;
  subsidy_request?: Maybe<SubsidyRequest>;
  subsidy_request_id?: Maybe<Scalars['String']['output']>;
  subsidy_request_item?: Maybe<SubsidyRequestItem>;
  subsidy_request_item_id?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  uploaded_by: Scalars['String']['output'];
  validated_at?: Maybe<Scalars['DateTime']['output']>;
  validated_by?: Maybe<Scalars['String']['output']>;
};

export type SubsidyReceiptListRelationFilter = {
  every?: InputMaybe<SubsidyReceiptWhereInput>;
  none?: InputMaybe<SubsidyReceiptWhereInput>;
  some?: InputMaybe<SubsidyReceiptWhereInput>;
};

export type SubsidyReceiptWhereInput = {
  AND?: InputMaybe<Array<SubsidyReceiptWhereInput>>;
  NOT?: InputMaybe<Array<SubsidyReceiptWhereInput>>;
  OR?: InputMaybe<Array<SubsidyReceiptWhereInput>>;
  amount?: InputMaybe<DecimalNullableFilter>;
  approved?: InputMaybe<BoolFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  drive_file_id?: InputMaybe<StringNullableFilter>;
  file_url?: InputMaybe<StringFilter>;
  filename?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_refund_receipt?: InputMaybe<BoolFilter>;
  is_validated?: InputMaybe<BoolFilter>;
  note?: InputMaybe<StringNullableFilter>;
  project_activities_id?: InputMaybe<StringNullableFilter>;
  project_activity?: InputMaybe<ProjectActivityNullableScalarRelationFilter>;
  rejection_reason?: InputMaybe<StringNullableFilter>;
  subsidy_request?: InputMaybe<SubsidyRequestNullableScalarRelationFilter>;
  subsidy_request_id?: InputMaybe<StringNullableFilter>;
  subsidy_request_item?: InputMaybe<SubsidyRequestItemNullableScalarRelationFilter>;
  subsidy_request_item_id?: InputMaybe<StringNullableFilter>;
  type?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  uploaded_by?: InputMaybe<StringFilter>;
  validated_at?: InputMaybe<DateTimeNullableFilter>;
  validated_by?: InputMaybe<StringNullableFilter>;
};

export type SubsidyRequest = {
  __typename?: 'SubsidyRequest';
  _count: SubsidyRequestCount;
  advance_amount?: Maybe<Scalars['Decimal']['output']>;
  approved_amount: Scalars['Decimal']['output'];
  approved_at?: Maybe<Scalars['DateTime']['output']>;
  approved_by?: Maybe<Scalars['String']['output']>;
  budget_transactions?: Maybe<Array<BudgetTransaction>>;
  church?: Maybe<Church>;
  church_id?: Maybe<Scalars['String']['output']>;
  collaborators: Array<ProjectCollaborator>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department: Department;
  department_id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  have_refund: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  is_for_advance: Scalars['Boolean']['output'];
  items?: Maybe<Array<SubsidyRequestItem>>;
  priority: SubsidyRequestPriority;
  project: Project;
  project_id: Scalars['String']['output'];
  refund_amount: Scalars['Decimal']['output'];
  refund_done: Scalars['Boolean']['output'];
  refund_rejected: Scalars['Boolean']['output'];
  refund_type?: Maybe<RefundType>;
  rejection_reason?: Maybe<Scalars['String']['output']>;
  request_type: SubsidyRequestType;
  requester: User;
  requester_id: Scalars['String']['output'];
  status_history?: Maybe<Array<SubsidyStatusHistory>>;
  subsidy_receipts?: Maybe<Array<SubsidyReceipt>>;
  subsidy_status: SubsidyStatus;
  subsidy_statuses_id: Scalars['String']['output'];
  total_budget: Scalars['Decimal']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type SubsidyRequestCount = {
  __typename?: 'SubsidyRequestCount';
  budget_transactions: Scalars['Int']['output'];
  items: Scalars['Int']['output'];
  status_history: Scalars['Int']['output'];
  subsidy_receipts: Scalars['Int']['output'];
};

export type SubsidyRequestCreateDto = {
  advance_amount?: InputMaybe<Scalars['Float']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  department_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  institution_id?: InputMaybe<Scalars['String']['input']>;
  is_for_advance?: InputMaybe<Scalars['Boolean']['input']>;
  items?: InputMaybe<Array<SubsidyRequestItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  request_type?: InputMaybe<SubsidyRequestType>;
  requester_id: Scalars['String']['input'];
  start_as_draft?: InputMaybe<Scalars['Boolean']['input']>;
  subsidy_status_id?: InputMaybe<Scalars['String']['input']>;
  total_budget: Scalars['Float']['input'];
};

export type SubsidyRequestItem = {
  __typename?: 'SubsidyRequestItem';
  _count: SubsidyRequestItemCount;
  approved_amount: Scalars['Decimal']['output'];
  created_at: Scalars['DateTime']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  project_activity: ProjectActivity;
  project_activity_id: Scalars['String']['output'];
  requested_amount: Scalars['Decimal']['output'];
  subsidy_receipts?: Maybe<Array<SubsidyReceipt>>;
  subsidy_request: SubsidyRequest;
  subsidy_request_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type SubsidyRequestItemCount = {
  __typename?: 'SubsidyRequestItemCount';
  subsidy_receipts: Scalars['Int']['output'];
};

export type SubsidyRequestItemInput = {
  linked_activity_document_ids?: InputMaybe<Array<Scalars['String']['input']>>;
  linked_document_amounts?: InputMaybe<Array<Scalars['Float']['input']>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  project_activity_id: Scalars['String']['input'];
  requested_amount: Scalars['Float']['input'];
};

export type SubsidyRequestItemListRelationFilter = {
  every?: InputMaybe<SubsidyRequestItemWhereInput>;
  none?: InputMaybe<SubsidyRequestItemWhereInput>;
  some?: InputMaybe<SubsidyRequestItemWhereInput>;
};

export type SubsidyRequestItemNullableScalarRelationFilter = {
  is?: InputMaybe<SubsidyRequestItemWhereInput>;
  isNot?: InputMaybe<SubsidyRequestItemWhereInput>;
};

export type SubsidyRequestItemWhereInput = {
  AND?: InputMaybe<Array<SubsidyRequestItemWhereInput>>;
  NOT?: InputMaybe<Array<SubsidyRequestItemWhereInput>>;
  OR?: InputMaybe<Array<SubsidyRequestItemWhereInput>>;
  approved_amount?: InputMaybe<DecimalFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  notes?: InputMaybe<StringNullableFilter>;
  project_activity?: InputMaybe<ProjectActivityScalarRelationFilter>;
  project_activity_id?: InputMaybe<StringFilter>;
  requested_amount?: InputMaybe<DecimalFilter>;
  subsidy_receipts?: InputMaybe<SubsidyReceiptListRelationFilter>;
  subsidy_request?: InputMaybe<SubsidyRequestScalarRelationFilter>;
  subsidy_request_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
};

export type SubsidyRequestListRelationFilter = {
  every?: InputMaybe<SubsidyRequestWhereInput>;
  none?: InputMaybe<SubsidyRequestWhereInput>;
  some?: InputMaybe<SubsidyRequestWhereInput>;
};

export type SubsidyRequestNullableScalarRelationFilter = {
  is?: InputMaybe<SubsidyRequestWhereInput>;
  isNot?: InputMaybe<SubsidyRequestWhereInput>;
};

export type SubsidyRequestOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export enum SubsidyRequestPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type SubsidyRequestScalarRelationFilter = {
  is?: InputMaybe<SubsidyRequestWhereInput>;
  isNot?: InputMaybe<SubsidyRequestWhereInput>;
};

export enum SubsidyRequestType {
  Advance = 'ADVANCE',
  WithoutDocument = 'WITHOUT_DOCUMENT',
  WithDocument = 'WITH_DOCUMENT'
}

export type SubsidyRequestUpdateDto = {
  advance_amount?: InputMaybe<Scalars['Float']['input']>;
  approved_amount?: InputMaybe<Scalars['Float']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<SubsidyRequestItemInput>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<SubsidyRequestPriority>;
  rejection_reason?: InputMaybe<Scalars['String']['input']>;
  requester_id?: InputMaybe<Scalars['String']['input']>;
  subsidy_status_id?: InputMaybe<Scalars['String']['input']>;
  total_budget?: InputMaybe<Scalars['Float']['input']>;
};

export type SubsidyRequestWhereInput = {
  AND?: InputMaybe<Array<SubsidyRequestWhereInput>>;
  NOT?: InputMaybe<Array<SubsidyRequestWhereInput>>;
  OR?: InputMaybe<Array<SubsidyRequestWhereInput>>;
  advance_amount?: InputMaybe<DecimalNullableFilter>;
  approved_amount?: InputMaybe<DecimalFilter>;
  approved_at?: InputMaybe<DateTimeNullableFilter>;
  approved_by?: InputMaybe<StringNullableFilter>;
  budget_transactions?: InputMaybe<BudgetTransactionListRelationFilter>;
  church?: InputMaybe<ChurchNullableScalarRelationFilter>;
  church_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department?: InputMaybe<DepartmentScalarRelationFilter>;
  department_id?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  have_refund?: InputMaybe<BoolFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  is_for_advance?: InputMaybe<BoolFilter>;
  items?: InputMaybe<SubsidyRequestItemListRelationFilter>;
  priority?: InputMaybe<EnumSubsidyRequestPriorityFilter>;
  project?: InputMaybe<ProjectScalarRelationFilter>;
  project_id?: InputMaybe<StringFilter>;
  refund_amount?: InputMaybe<DecimalFilter>;
  refund_done?: InputMaybe<BoolFilter>;
  refund_rejected?: InputMaybe<BoolFilter>;
  refund_type?: InputMaybe<EnumRefundTypeNullableFilter>;
  rejection_reason?: InputMaybe<StringNullableFilter>;
  request_type?: InputMaybe<EnumSubsidyRequestTypeFilter>;
  requester?: InputMaybe<UserScalarRelationFilter>;
  requester_id?: InputMaybe<StringFilter>;
  status_history?: InputMaybe<SubsidyStatusHistoryListRelationFilter>;
  subsidy_receipts?: InputMaybe<SubsidyReceiptListRelationFilter>;
  subsidy_status?: InputMaybe<SubsidyStatusScalarRelationFilter>;
  subsidy_statuses_id?: InputMaybe<StringFilter>;
  total_budget?: InputMaybe<DecimalFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type SubsidyStatus = {
  __typename?: 'SubsidyStatus';
  _count: SubsidyStatusCount;
  assigned_to: Scalars['String']['output'];
  assigned_user: User;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department: Department;
  department_id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  history_as_current?: Maybe<Array<SubsidyStatusHistory>>;
  history_as_previous?: Maybe<Array<SubsidyStatusHistory>>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  special_projects?: Maybe<Array<SpecialProjects>>;
  subsidy_requests?: Maybe<Array<SubsidyRequest>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type SubsidyStatusCount = {
  __typename?: 'SubsidyStatusCount';
  history_as_current: Scalars['Int']['output'];
  history_as_previous: Scalars['Int']['output'];
  special_projects: Scalars['Int']['output'];
  subsidy_requests: Scalars['Int']['output'];
};

export type SubsidyStatusDistribution = {
  __typename?: 'SubsidyStatusDistribution';
  color: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
};

export type SubsidyStatusHistory = {
  __typename?: 'SubsidyStatusHistory';
  changed_at: Scalars['DateTime']['output'];
  changed_by: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  previous_status?: Maybe<SubsidyStatus>;
  previous_status_id?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  status: SubsidyStatus;
  status_id: Scalars['String']['output'];
  subsidy_request: SubsidyRequest;
  subsidy_request_id: Scalars['String']['output'];
  type: SubsidyHistoryType;
  updated_at: Scalars['DateTime']['output'];
  user: User;
};

export type SubsidyStatusHistoryListRelationFilter = {
  every?: InputMaybe<SubsidyStatusHistoryWhereInput>;
  none?: InputMaybe<SubsidyStatusHistoryWhereInput>;
  some?: InputMaybe<SubsidyStatusHistoryWhereInput>;
};

export type SubsidyStatusHistoryOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type SubsidyStatusHistoryWhereInput = {
  AND?: InputMaybe<Array<SubsidyStatusHistoryWhereInput>>;
  NOT?: InputMaybe<Array<SubsidyStatusHistoryWhereInput>>;
  OR?: InputMaybe<Array<SubsidyStatusHistoryWhereInput>>;
  changed_at?: InputMaybe<DateTimeFilter>;
  changed_by?: InputMaybe<StringFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  previous_status?: InputMaybe<SubsidyStatusNullableScalarRelationFilter>;
  previous_status_id?: InputMaybe<StringNullableFilter>;
  reason?: InputMaybe<StringNullableFilter>;
  status?: InputMaybe<SubsidyStatusScalarRelationFilter>;
  status_id?: InputMaybe<StringFilter>;
  subsidy_request?: InputMaybe<SubsidyRequestScalarRelationFilter>;
  subsidy_request_id?: InputMaybe<StringFilter>;
  type?: InputMaybe<EnumSubsidyHistoryTypeFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
};

export type SubsidyStatusListRelationFilter = {
  every?: InputMaybe<SubsidyStatusWhereInput>;
  none?: InputMaybe<SubsidyStatusWhereInput>;
  some?: InputMaybe<SubsidyStatusWhereInput>;
};

export type SubsidyStatusNullableScalarRelationFilter = {
  is?: InputMaybe<SubsidyStatusWhereInput>;
  isNot?: InputMaybe<SubsidyStatusWhereInput>;
};

export type SubsidyStatusOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type SubsidyStatusScalarRelationFilter = {
  is?: InputMaybe<SubsidyStatusWhereInput>;
  isNot?: InputMaybe<SubsidyStatusWhereInput>;
};

export type SubsidyStatusWhereInput = {
  AND?: InputMaybe<Array<SubsidyStatusWhereInput>>;
  NOT?: InputMaybe<Array<SubsidyStatusWhereInput>>;
  OR?: InputMaybe<Array<SubsidyStatusWhereInput>>;
  assigned_to?: InputMaybe<StringFilter>;
  assigned_user?: InputMaybe<UserScalarRelationFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department?: InputMaybe<DepartmentScalarRelationFilter>;
  department_id?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringFilter>;
  history_as_current?: InputMaybe<SubsidyStatusHistoryListRelationFilter>;
  history_as_previous?: InputMaybe<SubsidyStatusHistoryListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  name?: InputMaybe<StringFilter>;
  order?: InputMaybe<IntFilter>;
  special_projects?: InputMaybe<SpecialProjectsListRelationFilter>;
  subsidy_requests?: InputMaybe<SubsidyRequestListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
};

export type ToggleAdjustmentTaskDto = {
  completed: Scalars['Boolean']['input'];
  task_id: Scalars['String']['input'];
};

export type ToggleLockBudgetResponse = {
  __typename?: 'ToggleLockBudgetResponse';
  id: Scalars['String']['output'];
  is_locked: Scalars['Boolean']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export enum TransferType {
  Distribution = 'DISTRIBUTION',
  InitialFunding = 'INITIAL_FUNDING',
  Reallocation = 'REALLOCATION',
  Reduction = 'REDUCTION'
}

export type UpdateAdjustmentStatusDto = {
  id: Scalars['String']['input'];
  status: AdjustmentStatus;
};

export type UpdateAssignmentInviteTemplateInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  addPermissionIds?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  key_code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  removePermissionIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateSubsidyStatusDto = {
  assigned_to?: InputMaybe<Scalars['String']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type UploadActivityDocumentDto = {
  activity_id: Scalars['String']['input'];
  project_activity_id: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type UploadSubsidyReceiptDto = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  is_refund_receipt?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  project_activity_id?: InputMaybe<Scalars['String']['input']>;
  subsidy_request_id: Scalars['String']['input'];
  subsidy_request_item_id?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  Project?: Maybe<Array<Project>>;
  SubsidyRequest?: Maybe<Array<SubsidyRequest>>;
  SubsidyStatus?: Maybe<Array<SubsidyStatus>>;
  _count: UserCount;
  activity_assignments?: Maybe<Array<ProjectActivityAssignee>>;
  approved_annual_budgets?: Maybe<Array<AnnualBudget>>;
  assignment_requests?: Maybe<Array<AssignmentRequest>>;
  assignments?: Maybe<Array<Assignment>>;
  availabilities?: Maybe<Array<Availability>>;
  availability_recurrence_rules?: Maybe<Array<AvailabilityRecurrenceRule>>;
  church?: Maybe<Church>;
  church_id?: Maybe<Scalars['String']['output']>;
  co_owned_projects?: Maybe<Array<Project>>;
  communications?: Maybe<Array<Communication>>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department?: Maybe<Department>;
  department_id?: Maybe<Scalars['String']['output']>;
  direct_message_recipients?: Maybe<Array<DirectMessageRecipient>>;
  direct_messages?: Maybe<Array<DirectMessage>>;
  email: Scalars['String']['output'];
  event_recipients?: Maybe<Array<EventRecipient>>;
  event_registrations?: Maybe<Array<EventRegistration>>;
  gender?: Maybe<GenderType>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  institution_positions?: Maybe<Array<InstitutionPosition>>;
  is_deleted: Scalars['Boolean']['output'];
  language_preference: LanguagePreference;
  led_church?: Maybe<Church>;
  led_departments?: Maybe<Array<Department>>;
  name: Scalars['String']['output'];
  notifications?: Maybe<Array<Notification>>;
  password: Scalars['String']['output'];
  preacher_region_access?: Maybe<Array<PreacherRegionAccess>>;
  project_activity_logs?: Maybe<Array<ProjectActivityLog>>;
  project_history?: Maybe<Array<ProjectHistory>>;
  recieve_emails: Scalars['Boolean']['output'];
  subsidy_status_history?: Maybe<Array<SubsidyStatusHistory>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user_roles?: Maybe<Array<UserRole>>;
  voluntary_projects?: Maybe<Array<VoluntariesOnProjects>>;
};

export type UserCount = {
  __typename?: 'UserCount';
  Project: Scalars['Int']['output'];
  SubsidyRequest: Scalars['Int']['output'];
  SubsidyStatus: Scalars['Int']['output'];
  activity_assignments: Scalars['Int']['output'];
  approved_annual_budgets: Scalars['Int']['output'];
  assignment_requests: Scalars['Int']['output'];
  assignments: Scalars['Int']['output'];
  availabilities: Scalars['Int']['output'];
  availability_recurrence_rules: Scalars['Int']['output'];
  co_owned_projects: Scalars['Int']['output'];
  communications: Scalars['Int']['output'];
  direct_message_recipients: Scalars['Int']['output'];
  direct_messages: Scalars['Int']['output'];
  event_recipients: Scalars['Int']['output'];
  event_registrations: Scalars['Int']['output'];
  institution_positions: Scalars['Int']['output'];
  led_departments: Scalars['Int']['output'];
  notifications: Scalars['Int']['output'];
  preacher_region_access: Scalars['Int']['output'];
  project_activity_logs: Scalars['Int']['output'];
  project_history: Scalars['Int']['output'];
  subsidy_status_history: Scalars['Int']['output'];
  user_roles: Scalars['Int']['output'];
  voluntary_projects: Scalars['Int']['output'];
};

export type UserCreateDto = {
  church_department_id?: InputMaybe<Scalars['String']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<ContactCreateDto>;
  email: Scalars['String']['input'];
  gender: GenderType;
  institution_department_id?: InputMaybe<Scalars['String']['input']>;
  institution_id: Scalars['String']['input'];
  invite_token: Scalars['String']['input'];
  language_preference: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  roles: Array<Scalars['String']['input']>;
};

export type UserListRelationFilter = {
  every?: InputMaybe<UserWhereInput>;
  none?: InputMaybe<UserWhereInput>;
  some?: InputMaybe<UserWhereInput>;
};

export type UserModel = {
  __typename?: 'UserModel';
  church?: Maybe<Church>;
  church_id?: Maybe<Scalars['String']['output']>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department_id?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  institution?: Maybe<Institution>;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  language_preference: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  recieve_emails: Scalars['Boolean']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type UserNullableScalarRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserOrderByWithRelationInput = {
  Project?: InputMaybe<ProjectOrderByRelationAggregateInput>;
  SubsidyRequest?: InputMaybe<SubsidyRequestOrderByRelationAggregateInput>;
  SubsidyStatus?: InputMaybe<SubsidyStatusOrderByRelationAggregateInput>;
  activity_assignments?: InputMaybe<ProjectActivityAssigneeOrderByRelationAggregateInput>;
  approved_annual_budgets?: InputMaybe<AnnualBudgetOrderByRelationAggregateInput>;
  assignment_requests?: InputMaybe<AssignmentRequestOrderByRelationAggregateInput>;
  assignments?: InputMaybe<AssignmentOrderByRelationAggregateInput>;
  availabilities?: InputMaybe<AvailabilityOrderByRelationAggregateInput>;
  availability_recurrence_rules?: InputMaybe<AvailabilityRecurrenceRuleOrderByRelationAggregateInput>;
  church?: InputMaybe<ChurchOrderByWithRelationInput>;
  church_id?: InputMaybe<SortOrderInput>;
  co_owned_projects?: InputMaybe<ProjectOrderByRelationAggregateInput>;
  communications?: InputMaybe<CommunicationOrderByRelationAggregateInput>;
  contact?: InputMaybe<ContactOrderByWithRelationInput>;
  contact_id?: InputMaybe<SortOrderInput>;
  created_at?: InputMaybe<SortOrder>;
  created_by?: InputMaybe<SortOrder>;
  deleted_at?: InputMaybe<SortOrderInput>;
  deleted_by?: InputMaybe<SortOrderInput>;
  department?: InputMaybe<DepartmentOrderByWithRelationInput>;
  department_id?: InputMaybe<SortOrderInput>;
  direct_message_recipients?: InputMaybe<DirectMessageRecipientOrderByRelationAggregateInput>;
  direct_messages?: InputMaybe<DirectMessageOrderByRelationAggregateInput>;
  email?: InputMaybe<SortOrder>;
  event_recipients?: InputMaybe<EventRecipientOrderByRelationAggregateInput>;
  event_registrations?: InputMaybe<EventRegistrationOrderByRelationAggregateInput>;
  gender?: InputMaybe<SortOrderInput>;
  id?: InputMaybe<SortOrder>;
  institution?: InputMaybe<InstitutionOrderByWithRelationInput>;
  institution_id?: InputMaybe<SortOrder>;
  institution_positions?: InputMaybe<InstitutionPositionOrderByRelationAggregateInput>;
  is_deleted?: InputMaybe<SortOrder>;
  language_preference?: InputMaybe<SortOrder>;
  led_church?: InputMaybe<ChurchOrderByWithRelationInput>;
  led_departments?: InputMaybe<DepartmentOrderByRelationAggregateInput>;
  name?: InputMaybe<SortOrder>;
  notifications?: InputMaybe<NotificationOrderByRelationAggregateInput>;
  password?: InputMaybe<SortOrder>;
  preacher_region_access?: InputMaybe<PreacherRegionAccessOrderByRelationAggregateInput>;
  project_activity_logs?: InputMaybe<ProjectActivityLogOrderByRelationAggregateInput>;
  project_history?: InputMaybe<ProjectHistoryOrderByRelationAggregateInput>;
  recieve_emails?: InputMaybe<SortOrder>;
  subsidy_status_history?: InputMaybe<SubsidyStatusHistoryOrderByRelationAggregateInput>;
  updated_at?: InputMaybe<SortOrder>;
  updated_by?: InputMaybe<SortOrder>;
  user_roles?: InputMaybe<UserRoleOrderByRelationAggregateInput>;
  voluntary_projects?: InputMaybe<VoluntariesOnProjectsOrderByRelationAggregateInput>;
};

export type UserRole = {
  __typename?: 'UserRole';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  role: Role;
  role_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type UserRoleListRelationFilter = {
  every?: InputMaybe<UserRoleWhereInput>;
  none?: InputMaybe<UserRoleWhereInput>;
  some?: InputMaybe<UserRoleWhereInput>;
};

export type UserRoleOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type UserRoleWhereInput = {
  AND?: InputMaybe<Array<UserRoleWhereInput>>;
  NOT?: InputMaybe<Array<UserRoleWhereInput>>;
  OR?: InputMaybe<Array<UserRoleWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  role?: InputMaybe<RoleScalarRelationFilter>;
  role_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type UserScalarRelationFilter = {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
};

export type UserUpdateDto = {
  address?: InputMaybe<Scalars['String']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<ContactUpdateDto>;
  contact_id?: InputMaybe<Scalars['String']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<GenderType>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  is_deleted?: InputMaybe<Scalars['Boolean']['input']>;
  language_preference?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  recieve_emails?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  Project?: InputMaybe<ProjectListRelationFilter>;
  SubsidyRequest?: InputMaybe<SubsidyRequestListRelationFilter>;
  SubsidyStatus?: InputMaybe<SubsidyStatusListRelationFilter>;
  activity_assignments?: InputMaybe<ProjectActivityAssigneeListRelationFilter>;
  approved_annual_budgets?: InputMaybe<AnnualBudgetListRelationFilter>;
  assignment_requests?: InputMaybe<AssignmentRequestListRelationFilter>;
  assignments?: InputMaybe<AssignmentListRelationFilter>;
  availabilities?: InputMaybe<AvailabilityListRelationFilter>;
  availability_recurrence_rules?: InputMaybe<AvailabilityRecurrenceRuleListRelationFilter>;
  church?: InputMaybe<ChurchNullableScalarRelationFilter>;
  church_id?: InputMaybe<StringNullableFilter>;
  co_owned_projects?: InputMaybe<ProjectListRelationFilter>;
  communications?: InputMaybe<CommunicationListRelationFilter>;
  contact?: InputMaybe<ContactNullableScalarRelationFilter>;
  contact_id?: InputMaybe<StringNullableFilter>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  department?: InputMaybe<DepartmentNullableScalarRelationFilter>;
  department_id?: InputMaybe<StringNullableFilter>;
  direct_message_recipients?: InputMaybe<DirectMessageRecipientListRelationFilter>;
  direct_messages?: InputMaybe<DirectMessageListRelationFilter>;
  email?: InputMaybe<StringFilter>;
  event_recipients?: InputMaybe<EventRecipientListRelationFilter>;
  event_registrations?: InputMaybe<EventRegistrationListRelationFilter>;
  gender?: InputMaybe<EnumGenderTypeNullableFilter>;
  id?: InputMaybe<StringFilter>;
  institution?: InputMaybe<InstitutionScalarRelationFilter>;
  institution_id?: InputMaybe<StringFilter>;
  institution_positions?: InputMaybe<InstitutionPositionListRelationFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  language_preference?: InputMaybe<EnumLanguagePreferenceFilter>;
  led_church?: InputMaybe<ChurchNullableScalarRelationFilter>;
  led_departments?: InputMaybe<DepartmentListRelationFilter>;
  name?: InputMaybe<StringFilter>;
  notifications?: InputMaybe<NotificationListRelationFilter>;
  password?: InputMaybe<StringFilter>;
  preacher_region_access?: InputMaybe<PreacherRegionAccessListRelationFilter>;
  project_activity_logs?: InputMaybe<ProjectActivityLogListRelationFilter>;
  project_history?: InputMaybe<ProjectHistoryListRelationFilter>;
  recieve_emails?: InputMaybe<BoolFilter>;
  subsidy_status_history?: InputMaybe<SubsidyStatusHistoryListRelationFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user_roles?: InputMaybe<UserRoleListRelationFilter>;
  voluntary_projects?: InputMaybe<VoluntariesOnProjectsListRelationFilter>;
};

export type UserWithRoles = {
  __typename?: 'UserWithRoles';
  church?: Maybe<Church>;
  church_id?: Maybe<Scalars['String']['output']>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department_id?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  institution?: Maybe<Institution>;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  language_preference: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password?: Maybe<Scalars['String']['output']>;
  recieve_emails: Scalars['Boolean']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user_roles: Array<RoleModel>;
};

export type UsersByRoleData = {
  __typename?: 'UsersByRoleData';
  count: Scalars['Float']['output'];
  fill: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type ValidateOutputModel = {
  __typename?: 'ValidateOutputModel';
  church_department_id?: Maybe<Scalars['String']['output']>;
  church_id?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  exp: Scalars['Float']['output'];
  institution_department_id?: Maybe<Scalars['String']['output']>;
  institution_id: Scalars['String']['output'];
  inviter_id: Scalars['String']['output'];
  language_preference?: Maybe<LanguagePreference>;
  role_ids: Array<Scalars['String']['output']>;
};

export type VerifyCodeInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type VerifyEmailCodeInput = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type VoluntariesOnProjects = {
  __typename?: 'VoluntariesOnProjects';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  is_deleted: Scalars['Boolean']['output'];
  project: Project;
  project_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type VoluntariesOnProjectsListRelationFilter = {
  every?: InputMaybe<VoluntariesOnProjectsWhereInput>;
  none?: InputMaybe<VoluntariesOnProjectsWhereInput>;
  some?: InputMaybe<VoluntariesOnProjectsWhereInput>;
};

export type VoluntariesOnProjectsOrderByRelationAggregateInput = {
  _count?: InputMaybe<SortOrder>;
};

export type VoluntariesOnProjectsWhereInput = {
  AND?: InputMaybe<Array<VoluntariesOnProjectsWhereInput>>;
  NOT?: InputMaybe<Array<VoluntariesOnProjectsWhereInput>>;
  OR?: InputMaybe<Array<VoluntariesOnProjectsWhereInput>>;
  created_at?: InputMaybe<DateTimeFilter>;
  created_by?: InputMaybe<StringFilter>;
  deleted_at?: InputMaybe<DateTimeNullableFilter>;
  deleted_by?: InputMaybe<StringNullableFilter>;
  is_deleted?: InputMaybe<BoolFilter>;
  project?: InputMaybe<ProjectScalarRelationFilter>;
  project_id?: InputMaybe<StringFilter>;
  updated_at?: InputMaybe<DateTimeFilter>;
  updated_by?: InputMaybe<StringFilter>;
  user?: InputMaybe<UserScalarRelationFilter>;
  user_id?: InputMaybe<StringFilter>;
};

export type ZipInfo = {
  __typename?: 'ZipInfo';
  city?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
};
