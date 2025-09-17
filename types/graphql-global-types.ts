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
};

export type AddProjectVoluntaryDto = {
  project_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
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

export type AuthModel = {
  __typename?: 'AuthModel';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Float']['output'];
  user: UserWithRoles;
};

export type Church = {
  __typename?: 'Church';
  _count: ChurchCount;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  departments?: Maybe<Array<Department>>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  region: Region;
  region_id: Scalars['String']['output'];
  subsidy_requests?: Maybe<Array<SubsidyRequest>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
};

export type ChurchCount = {
  __typename?: 'ChurchCount';
  departments: Scalars['Int']['output'];
  subsidy_requests: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type ChurchCreateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  institution_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  region_id: Scalars['String']['input'];
};

export type ChurchModel = {
  __typename?: 'ChurchModel';
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  region_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type ChurchUpdateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  contact_id?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  institution_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  region_id?: InputMaybe<Scalars['String']['input']>;
};

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

export type Contact = {
  __typename?: 'Contact';
  Church?: Maybe<Array<Church>>;
  Department?: Maybe<Array<Department>>;
  Event?: Maybe<Array<Event>>;
  Institution?: Maybe<Institution>;
  Region?: Maybe<Array<Region>>;
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
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  website?: Maybe<Scalars['String']['output']>;
};

export type ContactCount = {
  __typename?: 'ContactCount';
  Church: Scalars['Int']['output'];
  Department: Scalars['Int']['output'];
  Event: Scalars['Int']['output'];
  Region: Scalars['Int']['output'];
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
  website?: InputMaybe<Scalars['String']['input']>;
};

export type ContactUpdateDto = {
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  full_address?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  mobile?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProjectActivityInput = {
  budget_amount: Scalars['Float']['input'];
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  project_id: Scalars['String']['input'];
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

export type Department = {
  __typename?: 'Department';
  _count: DepartmentCount;
  annual_budget: Scalars['Decimal']['output'];
  annual_reports?: Maybe<Array<AnnualReport>>;
  church: Church;
  church_id: Scalars['String']['output'];
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
  name: Scalars['String']['output'];
  projects?: Maybe<Array<Project>>;
  subsidy_requests?: Maybe<Array<SubsidyRequest>>;
  subsidy_statuses?: Maybe<Array<SubsidyStatus>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
};

export type DepartmentCount = {
  __typename?: 'DepartmentCount';
  annual_reports: Scalars['Int']['output'];
  projects: Scalars['Int']['output'];
  subsidy_requests: Scalars['Int']['output'];
  subsidy_statuses: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type DepartmentCreateDto = {
  annual_budget: Scalars['Float']['input'];
  church: Scalars['String']['input'];
  description: Scalars['String']['input'];
  institution: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type DepartmentUpdateDto = {
  annual_budget?: InputMaybe<Scalars['Float']['input']>;
  church_id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  institution_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type DirectMessageUpdateDto = {
  content?: InputMaybe<Scalars['String']['input']>;
  recipient_id?: InputMaybe<Scalars['String']['input']>;
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

export enum EventRegistrationStatus {
  Approved = 'approved',
  Canceled = 'canceled',
  Paid = 'paid',
  Pendent = 'pendent',
  Reserved = 'reserved'
}

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

export type Institution = {
  __typename?: 'Institution';
  _count: InstitutionCount;
  churches?: Maybe<Array<Church>>;
  communications?: Maybe<Array<Communication>>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  denomination: Scalars['String']['output'];
  departments?: Maybe<Array<Department>>;
  direct_messages: Array<DirectMessage>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  language_preference: LanguagePreference;
  name: Scalars['String']['output'];
  notifications?: Maybe<Array<Notification>>;
  projects?: Maybe<Array<Project>>;
  regions?: Maybe<Array<Region>>;
  settings?: Maybe<Array<Setting>>;
  subsidy_requests: Array<SubsidyRequest>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  users?: Maybe<Array<User>>;
};

export type InstitutionCount = {
  __typename?: 'InstitutionCount';
  churches: Scalars['Int']['output'];
  communications: Scalars['Int']['output'];
  departments: Scalars['Int']['output'];
  direct_messages: Scalars['Int']['output'];
  notifications: Scalars['Int']['output'];
  projects: Scalars['Int']['output'];
  regions: Scalars['Int']['output'];
  settings: Scalars['Int']['output'];
  subsidy_requests: Scalars['Int']['output'];
  users: Scalars['Int']['output'];
};

export type InstitutionCreateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  denomination: Scalars['String']['input'];
  language_preference?: InputMaybe<LanguagePreference>;
  name: Scalars['String']['input'];
};

export type InstitutionUpdateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  denomination?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  language_preference?: InputMaybe<LanguagePreference>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Idioma preferencial do usuário */
export enum LanguagePreference {
  En = 'en',
  Nl = 'nl'
}

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
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addProjectVoluntary: VoluntariesOnProjects;
  createChurch: ChurchModel;
  createCommunication: Communication;
  createContact: Contact;
  createDepartment: Department;
  createDirectMessage: DirectMessage;
  createInstitution: Institution;
  createNotification: Notification;
  createProject: Project;
  createProjectActivity: ProjectActivity;
  createRegion: RegionModel;
  createRole: RoleModel;
  createSetting: Setting;
  createSubsidyRequest: SubsidyRequest;
  createSubsidyStatus: SubsidyStatus;
  createUser: UserModel;
  deleteChurch: ChurchModel;
  deleteCommunication: Communication;
  deleteContact: Contact;
  deleteDepartment: Department;
  deleteDirectMessage: DirectMessage;
  deleteInstitution: Institution;
  deleteNotification: Notification;
  deleteProject: Project;
  deleteProjectActivity: ProjectActivity;
  deleteRegion: RegionModel;
  deleteRole: RoleModel;
  deleteSetting: Setting;
  deleteSubsidyRequest: SubsidyRequest;
  deleteSubsidyStatus: SubsidyStatus;
  deleteUser: UserModel;
  linkContact: LinkContactResult;
  login: AuthModel;
  removeProjectVoluntary: VoluntariesOnProjects;
  updateChurch: ChurchModel;
  updateCommunication: Communication;
  updateContact: Contact;
  updateDepartment: Department;
  updateDirectMessage: DirectMessage;
  updateInstitution: Institution;
  updateNotification: Notification;
  updateProject: Project;
  updateProjectActivity: ProjectActivity;
  updateRegion: RegionModel;
  updateRole: RoleModel;
  updateSetting: Setting;
  updateSubsidyRequest: SubsidyRequest;
  updateSubsidyStatus: SubsidyStatus;
  updateUser: UserModel;
};


export type MutationAddProjectVoluntaryArgs = {
  data: AddProjectVoluntaryDto;
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


export type MutationCreateDirectMessageArgs = {
  data: DirectMessageCreateDto;
};


export type MutationCreateInstitutionArgs = {
  data: InstitutionCreateDto;
};


export type MutationCreateNotificationArgs = {
  data: NotificationCreateDto;
};


export type MutationCreateProjectArgs = {
  data: ProjectCreateDto;
};


export type MutationCreateProjectActivityArgs = {
  input: CreateProjectActivityInput;
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
};


export type MutationCreateSubsidyStatusArgs = {
  input: CreateSubsidyStatusDto;
};


export type MutationCreateUserArgs = {
  data: UserCreateDto;
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


export type MutationDeleteNotificationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProjectArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProjectActivityArgs = {
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


export type MutationDeleteSubsidyRequestArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteSubsidyStatusArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationLinkContactArgs = {
  data: LinkContactDto;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRemoveProjectVoluntaryArgs = {
  data: RemoveProjectVoluntaryDto;
};


export type MutationUpdateChurchArgs = {
  data: ChurchUpdateDto;
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
  department_id: Scalars['String']['input'];
};


export type MutationUpdateDirectMessageArgs = {
  data: DirectMessageUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateInstitutionArgs = {
  data: InstitutionUpdateDto;
};


export type MutationUpdateNotificationArgs = {
  data: NotificationUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateProjectArgs = {
  data: ProjectUpdateDto;
  id: Scalars['String']['input'];
};


export type MutationUpdateProjectActivityArgs = {
  input: UpdateProjectActivityInput;
};


export type MutationUpdateRegionArgs = {
  data: RegionUpdateDto;
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
};


export type MutationUpdateSubsidyStatusArgs = {
  input: UpdateSubsidyStatusDto;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateDto;
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
  read_status: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};

export type NotificationCreateDto = {
  institution_id: Scalars['String']['input'];
  message: Scalars['String']['input'];
  read_status: Scalars['Boolean']['input'];
  type: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type NotificationUpdateDto = {
  institution_id?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  read_status?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type Permission = {
  __typename?: 'Permission';
  _count: PermissionCount;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
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
  Church = 'CHURCH',
  Communication = 'COMMUNICATION',
  Contact = 'CONTACT',
  Department = 'DEPARTMENT',
  DirectMessage = 'DIRECT_MESSAGE',
  Institution = 'INSTITUTION',
  Notification = 'NOTIFICATION',
  Permission = 'PERMISSION',
  Project = 'PROJECT',
  Region = 'REGION',
  Role = 'ROLE',
  Setting = 'SETTING',
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
  key_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum PermissionResolverName {
  AddProjectVoluntary = 'addProjectVoluntary',
  Auth = 'auth',
  Church = 'church',
  Churches = 'churches',
  Communication = 'communication',
  Communications = 'communications',
  CreateChurch = 'createChurch',
  CreateCommunication = 'createCommunication',
  CreateDepartment = 'createDepartment',
  CreateDirectMessage = 'createDirectMessage',
  CreateInstitution = 'createInstitution',
  CreateNotification = 'createNotification',
  CreateProject = 'createProject',
  CreateProjectActivity = 'createProjectActivity',
  CreateRegion = 'createRegion',
  CreateRole = 'createRole',
  CreateSetting = 'createSetting',
  CreateSubsidyRequest = 'createSubsidyRequest',
  CreateSubsidyStatus = 'createSubsidyStatus',
  CreateUser = 'createUser',
  DeleteChurch = 'deleteChurch',
  DeleteCommunication = 'deleteCommunication',
  DeleteDepartment = 'deleteDepartment',
  DeleteDirectMessage = 'deleteDirectMessage',
  DeleteInstitution = 'deleteInstitution',
  DeleteNotification = 'deleteNotification',
  DeleteProject = 'deleteProject',
  DeleteProjectActivity = 'deleteProjectActivity',
  DeleteRegion = 'deleteRegion',
  DeleteRole = 'deleteRole',
  DeleteSetting = 'deleteSetting',
  DeleteSubsidyRequest = 'deleteSubsidyRequest',
  DeleteSubsidyStatus = 'deleteSubsidyStatus',
  DeleteUser = 'deleteUser',
  Department = 'department',
  Departments = 'departments',
  DirectMessage = 'directMessage',
  DirectMessages = 'directMessages',
  Institution = 'institution',
  Institutions = 'institutions',
  Notification = 'notification',
  Notifications = 'notifications',
  Permissions = 'permissions',
  Project = 'project',
  ProjectActivities = 'projectActivities',
  ProjectActivity = 'projectActivity',
  Projects = 'projects',
  Region = 'region',
  Regions = 'regions',
  RemoveProjectVoluntary = 'removeProjectVoluntary',
  Role = 'role',
  Roles = 'roles',
  Setting = 'setting',
  Settings = 'settings',
  SubsidyRequest = 'subsidyRequest',
  SubsidyRequests = 'subsidyRequests',
  SubsidyStatus = 'subsidyStatus',
  SubsidyStatuses = 'subsidyStatuses',
  UpdateChurch = 'updateChurch',
  UpdateCommunication = 'updateCommunication',
  UpdateDepartment = 'updateDepartment',
  UpdateDirectMessage = 'updateDirectMessage',
  UpdateInstitution = 'updateInstitution',
  UpdateNotification = 'updateNotification',
  UpdateProject = 'updateProject',
  UpdateProjectActivity = 'updateProjectActivity',
  UpdateRegion = 'updateRegion',
  UpdateRole = 'updateRole',
  UpdateSetting = 'updateSetting',
  UpdateSubsidyRequest = 'updateSubsidyRequest',
  UpdateSubsidyStatus = 'updateSubsidyStatus',
  UpdateUser = 'updateUser',
  User = 'user',
  Users = 'users'
}

export type Project = {
  __typename?: 'Project';
  Institution?: Maybe<Institution>;
  _count: ProjectCount;
  activities?: Maybe<Array<ProjectActivity>>;
  budget: Scalars['Decimal']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department: Department;
  department_id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  event?: Maybe<Event>;
  event_id?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution_id?: Maybe<Scalars['String']['output']>;
  is_deleted: Scalars['Boolean']['output'];
  language_preference: LanguagePreference;
  media_link: Scalars['String']['output'];
  subsidies?: Maybe<Array<SubsidyRequest>>;
  title: Scalars['String']['output'];
  type: ProjectType;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  voluntary_users?: Maybe<Array<VoluntariesOnProjects>>;
};

export type ProjectActivity = {
  __typename?: 'ProjectActivity';
  _count: ProjectActivityCount;
  budget_amount: Scalars['Decimal']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  project: Project;
  project_id: Scalars['String']['output'];
  subsidy_receipts?: Maybe<Array<SubsidyReceipt>>;
  subsidy_request?: Maybe<Array<SubsidyRequest>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type ProjectActivityCount = {
  __typename?: 'ProjectActivityCount';
  subsidy_receipts: Scalars['Int']['output'];
  subsidy_request: Scalars['Int']['output'];
};

export type ProjectCount = {
  __typename?: 'ProjectCount';
  activities: Scalars['Int']['output'];
  subsidies: Scalars['Int']['output'];
  voluntary_users: Scalars['Int']['output'];
};

export type ProjectCreateDto = {
  budget: Scalars['Float']['input'];
  department_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  institution_id: Scalars['String']['input'];
  language_preference: LanguagePreference;
  media_link: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type: ProjectType;
};

export enum ProjectType {
  Evangelism = 'EVANGELISM',
  Mission = 'MISSION',
  Other = 'OTHER',
  Social = 'SOCIAL'
}

export type ProjectUpdateDto = {
  budget?: InputMaybe<Scalars['Float']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  language_preference?: InputMaybe<LanguagePreference>;
  media_link?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ProjectType>;
};

export type Query = {
  __typename?: 'Query';
  church?: Maybe<ChurchModel>;
  churches: Array<ChurchModel>;
  communication?: Maybe<Communication>;
  communications: Array<Communication>;
  contact?: Maybe<Contact>;
  contacts: Array<Contact>;
  department?: Maybe<Department>;
  departments: Array<Department>;
  directMessage?: Maybe<DirectMessage>;
  directMessages: Array<DirectMessage>;
  institution?: Maybe<Institution>;
  institutions: Array<Institution>;
  notification?: Maybe<Notification>;
  notifications: Array<Notification>;
  permissions: Array<PermissionGroupPermissionsModel>;
  project?: Maybe<Project>;
  projectActivities: Array<ProjectActivity>;
  projectActivity: ProjectActivity;
  projects: Array<Project>;
  region?: Maybe<Region>;
  regions: Array<Region>;
  role?: Maybe<RoleModel>;
  roles: Array<RoleModel>;
  setting?: Maybe<Setting>;
  settings: Array<Setting>;
  subsidyRequest?: Maybe<SubsidyRequest>;
  subsidyRequests: Array<SubsidyRequest>;
  subsidyStatus?: Maybe<SubsidyStatus>;
  subsidyStatuses: Array<SubsidyStatus>;
  user?: Maybe<UserModel>;
  users: Array<UserModel>;
};


export type QueryChurchArgs = {
  id: Scalars['String']['input'];
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


export type QueryDirectMessageArgs = {
  id: Scalars['String']['input'];
};


export type QueryInstitutionArgs = {
  id: Scalars['String']['input'];
};


export type QueryNotificationArgs = {
  id: Scalars['String']['input'];
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


export type QueryRegionArgs = {
  id: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  id: Scalars['String']['input'];
};


export type QuerySettingArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubsidyRequestArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubsidyStatusArgs = {
  id: Scalars['String']['input'];
};


export type QuerySubsidyStatusesArgs = {
  filters?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type Region = {
  __typename?: 'Region';
  _count: RegionCount;
  children: Array<Region>;
  churches?: Maybe<Array<Church>>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parent_region?: Maybe<Region>;
  parent_region_id?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type RegionCount = {
  __typename?: 'RegionCount';
  children: Scalars['Int']['output'];
  churches: Scalars['Int']['output'];
};

export type RegionCreateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  institution_id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  parent_region_id?: InputMaybe<Scalars['String']['input']>;
};

export type RegionModel = {
  __typename?: 'RegionModel';
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parent_region_id?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type RegionUpdateDto = {
  contact?: InputMaybe<ContactCreateDto>;
  contact_id?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  institution_id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent_region_id?: InputMaybe<Scalars['String']['input']>;
};

export type RemoveProjectVoluntaryDto = {
  project_id: Scalars['String']['input'];
  user_id: Scalars['String']['input'];
};

export type Role = {
  __typename?: 'Role';
  _count: RoleCount;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  direct_message_recipients?: Maybe<Array<DirectMessageRecipient>>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  key_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role_permissions?: Maybe<Array<RolePermission>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user_roles?: Maybe<Array<UserRole>>;
};

export type RoleCount = {
  __typename?: 'RoleCount';
  direct_message_recipients: Scalars['Int']['output'];
  role_permissions: Scalars['Int']['output'];
  user_roles: Scalars['Int']['output'];
};

export type RoleModel = {
  __typename?: 'RoleModel';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  key_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  permissions: Array<PermissionGroupPermissionsModel>;
};

export type RolePermission = {
  __typename?: 'RolePermission';
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  permission: Permission;
  permission_id: Scalars['String']['output'];
  role: Role;
  role_id: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
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

export type SettingUpdateDto = {
  description?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  key?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type SubsidyReceipt = {
  __typename?: 'SubsidyReceipt';
  amount: Scalars['Decimal']['output'];
  approved: Scalars['Boolean']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  file_path: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  project_activities_id: Scalars['String']['output'];
  project_activity: ProjectActivity;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type SubsidyRequest = {
  __typename?: 'SubsidyRequest';
  _count: SubsidyRequestCount;
  church: Church;
  church_id: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department: Department;
  department_id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  project: Project;
  project_activities?: Maybe<Array<ProjectActivity>>;
  project_id: Scalars['String']['output'];
  requester: User;
  requester_id: Scalars['String']['output'];
  subsidy_status: SubsidyStatus;
  subsidy_statuses_id: Scalars['String']['output'];
  total_budget: Scalars['Decimal']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type SubsidyRequestCount = {
  __typename?: 'SubsidyRequestCount';
  project_activities: Scalars['Int']['output'];
};

export type SubsidyRequestCreateDto = {
  church_id: Scalars['String']['input'];
  department_id: Scalars['String']['input'];
  description: Scalars['String']['input'];
  institution_id?: InputMaybe<Scalars['String']['input']>;
  project_activities: Array<Scalars['String']['input']>;
  project_id: Scalars['String']['input'];
  requester_id: Scalars['String']['input'];
  subsidy_status_id: Scalars['String']['input'];
  total_budget: Scalars['Float']['input'];
};

export type SubsidyRequestUpdateDto = {
  church_id?: InputMaybe<Scalars['String']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  institution_id?: InputMaybe<Scalars['String']['input']>;
  requester_id?: InputMaybe<Scalars['String']['input']>;
  subsidy_status_id?: InputMaybe<Scalars['String']['input']>;
  total_budget?: InputMaybe<Scalars['Float']['input']>;
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
  id: Scalars['ID']['output'];
  is_deleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  subsidy_requests?: Maybe<Array<SubsidyRequest>>;
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
};

export type SubsidyStatusCount = {
  __typename?: 'SubsidyStatusCount';
  subsidy_requests: Scalars['Int']['output'];
};

export type UpdateProjectActivityInput = {
  budget_amount?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  key_code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissionIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateSubsidyStatusDto = {
  assigned_to?: InputMaybe<Scalars['String']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

export type User = {
  __typename?: 'User';
  SubsidyRequest?: Maybe<Array<SubsidyRequest>>;
  SubsidyStatus?: Maybe<Array<SubsidyStatus>>;
  _count: UserCount;
  church: Church;
  church_id: Scalars['String']['output'];
  communications?: Maybe<Array<Communication>>;
  contact?: Maybe<Contact>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  department: Department;
  department_id: Scalars['String']['output'];
  direct_message_recipients?: Maybe<Array<DirectMessageRecipient>>;
  direct_messages?: Maybe<Array<DirectMessage>>;
  email: Scalars['String']['output'];
  event_recipients?: Maybe<Array<EventRecipient>>;
  event_registrations?: Maybe<Array<EventRegistration>>;
  id: Scalars['ID']['output'];
  institution: Institution;
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  language_preference: LanguagePreference;
  name: Scalars['String']['output'];
  notifications?: Maybe<Array<Notification>>;
  password: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user_roles?: Maybe<Array<UserRole>>;
  voluntary_projects?: Maybe<Array<VoluntariesOnProjects>>;
};

export type UserCount = {
  __typename?: 'UserCount';
  SubsidyRequest: Scalars['Int']['output'];
  SubsidyStatus: Scalars['Int']['output'];
  communications: Scalars['Int']['output'];
  direct_message_recipients: Scalars['Int']['output'];
  direct_messages: Scalars['Int']['output'];
  event_recipients: Scalars['Int']['output'];
  event_registrations: Scalars['Int']['output'];
  notifications: Scalars['Int']['output'];
  user_roles: Scalars['Int']['output'];
  voluntary_projects: Scalars['Int']['output'];
};

export type UserCreateDto = {
  church_id: Scalars['String']['input'];
  contact?: InputMaybe<ContactCreateDto>;
  department_id: Scalars['String']['input'];
  email: Scalars['String']['input'];
  institution_id: Scalars['String']['input'];
  language_preference: LanguagePreference;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserModel = {
  __typename?: 'UserModel';
  church_id?: Maybe<Scalars['String']['output']>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  language_preference: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
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

export type UserUpdateDto = {
  church_id?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<ContactCreateDto>;
  contact_id?: InputMaybe<Scalars['String']['input']>;
  department_id?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  institution_id?: InputMaybe<Scalars['String']['input']>;
  language_preference?: InputMaybe<LanguagePreference>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserWithRoles = {
  __typename?: 'UserWithRoles';
  church_id?: Maybe<Scalars['String']['output']>;
  contact_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['DateTime']['output'];
  created_by: Scalars['String']['output'];
  deleted_at?: Maybe<Scalars['DateTime']['output']>;
  deleted_by?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  institution_id: Scalars['String']['output'];
  is_deleted: Scalars['Boolean']['output'];
  language_preference: Scalars['String']['output'];
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  updated_by: Scalars['String']['output'];
  user_roles: Array<RoleModel>;
};

export type VoluntariesOnProjects = {
  __typename?: 'VoluntariesOnProjects';
  project: Project;
  project_id: Scalars['String']['output'];
  user: User;
  user_id: Scalars['String']['output'];
};
