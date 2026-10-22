import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_MY_ASSIGNMENT_REQUESTS_QUERY,
  GET_OPEN_SLOTS_FOR_PREACHER_QUERY,
  GET_ELIGIBLE_PREACHERS_FOR_SLOT_QUERY,
  GET_ASSIGNMENT_INVITE_TEMPLATES_QUERY,
} from "@/graphql/queries/ASSIGNMENT_REQUEST_QUERY";
import {
  REQUEST_ASSIGNMENT_MUTATION,
  INVITE_TO_ASSIGNMENT_MUTATION,
  INVITE_TO_ASSIGNMENT_ANY_MUTATION,
  RESPOND_TO_ASSIGNMENT_REQUEST_MUTATION,
  RESPOND_TO_ASSIGNMENT_REQUEST_ANY_MUTATION,
  CREATE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION,
  UPDATE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION,
  DELETE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION,
} from "@/graphql/mutations/ASSIGNMENT_REQUEST_MUTATIONS";
import { MyAssignmentRequests } from "@/types/MyAssignmentRequests";
import { OpenSlotsForPreacher, OpenSlotsForPreacherVariables } from "@/types/OpenSlotsForPreacher";
import { EligiblePreachersForSlot, EligiblePreachersForSlotVariables } from "@/types/EligiblePreachersForSlot";
import { AssignmentInviteTemplates } from "@/types/AssignmentInviteTemplates";
import { RequestAssignment, RequestAssignmentVariables } from "@/types/RequestAssignment";
import { InviteToAssignment, InviteToAssignmentVariables } from "@/types/InviteToAssignment";
import { InviteToAssignmentAny, InviteToAssignmentAnyVariables } from "@/types/InviteToAssignmentAny";
import { RespondToAssignmentRequest, RespondToAssignmentRequestVariables } from "@/types/RespondToAssignmentRequest";
import { RespondToAssignmentRequestAny, RespondToAssignmentRequestAnyVariables } from "@/types/RespondToAssignmentRequestAny";
import { CreateAssignmentInviteTemplate, CreateAssignmentInviteTemplateVariables } from "@/types/CreateAssignmentInviteTemplate";
import { UpdateAssignmentInviteTemplate, UpdateAssignmentInviteTemplateVariables } from "@/types/UpdateAssignmentInviteTemplate";
import { DeleteAssignmentInviteTemplate, DeleteAssignmentInviteTemplateVariables } from "@/types/DeleteAssignmentInviteTemplate";

export function useMyAssignmentRequestsQuery(options?: useQuery.Options<MyAssignmentRequests>): useQuery.Result<MyAssignmentRequests> {
  return useQuery<MyAssignmentRequests>(GET_MY_ASSIGNMENT_REQUESTS_QUERY, options);
}

export function useOpenSlotsForPreacherQuery(
  options?: useQuery.Options<OpenSlotsForPreacher, OpenSlotsForPreacherVariables>,
): useQuery.Result<OpenSlotsForPreacher, OpenSlotsForPreacherVariables> {
  return useQuery<OpenSlotsForPreacher, OpenSlotsForPreacherVariables>(GET_OPEN_SLOTS_FOR_PREACHER_QUERY, options);
}

export function useEligiblePreachersForSlotQuery(
  options?: useQuery.Options<EligiblePreachersForSlot, EligiblePreachersForSlotVariables>,
): useQuery.Result<EligiblePreachersForSlot, EligiblePreachersForSlotVariables> {
  return useQuery<EligiblePreachersForSlot, EligiblePreachersForSlotVariables>(GET_ELIGIBLE_PREACHERS_FOR_SLOT_QUERY, options);
}

export function useAssignmentInviteTemplatesQuery(options?: useQuery.Options<AssignmentInviteTemplates>): useQuery.Result<AssignmentInviteTemplates> {
  return useQuery<AssignmentInviteTemplates>(GET_ASSIGNMENT_INVITE_TEMPLATES_QUERY, options);
}

export function useRequestAssignmentMutation(
  options?: useMutation.Options<RequestAssignment, RequestAssignmentVariables>,
): useMutation.ResultTuple<RequestAssignment, RequestAssignmentVariables> {
  return useMutation<RequestAssignment, RequestAssignmentVariables>(REQUEST_ASSIGNMENT_MUTATION, options);
}

export function useInviteToAssignmentMutation(
  options?: useMutation.Options<InviteToAssignment, InviteToAssignmentVariables>,
): useMutation.ResultTuple<InviteToAssignment, InviteToAssignmentVariables> {
  return useMutation<InviteToAssignment, InviteToAssignmentVariables>(INVITE_TO_ASSIGNMENT_MUTATION, options);
}

export function useInviteToAssignmentAnyMutation(
  options?: useMutation.Options<InviteToAssignmentAny, InviteToAssignmentAnyVariables>,
): useMutation.ResultTuple<InviteToAssignmentAny, InviteToAssignmentAnyVariables> {
  return useMutation<InviteToAssignmentAny, InviteToAssignmentAnyVariables>(INVITE_TO_ASSIGNMENT_ANY_MUTATION, options);
}

export function useRespondToAssignmentRequestMutation(
  options?: useMutation.Options<RespondToAssignmentRequest, RespondToAssignmentRequestVariables>,
): useMutation.ResultTuple<RespondToAssignmentRequest, RespondToAssignmentRequestVariables> {
  return useMutation<RespondToAssignmentRequest, RespondToAssignmentRequestVariables>(RESPOND_TO_ASSIGNMENT_REQUEST_MUTATION, options);
}

export function useRespondToAssignmentRequestAnyMutation(
  options?: useMutation.Options<RespondToAssignmentRequestAny, RespondToAssignmentRequestAnyVariables>,
): useMutation.ResultTuple<RespondToAssignmentRequestAny, RespondToAssignmentRequestAnyVariables> {
  return useMutation<RespondToAssignmentRequestAny, RespondToAssignmentRequestAnyVariables>(RESPOND_TO_ASSIGNMENT_REQUEST_ANY_MUTATION, options);
}

export function useCreateAssignmentInviteTemplateMutation(
  options?: useMutation.Options<CreateAssignmentInviteTemplate, CreateAssignmentInviteTemplateVariables>,
): useMutation.ResultTuple<CreateAssignmentInviteTemplate, CreateAssignmentInviteTemplateVariables> {
  return useMutation<CreateAssignmentInviteTemplate, CreateAssignmentInviteTemplateVariables>(CREATE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION, options);
}

export function useUpdateAssignmentInviteTemplateMutation(
  options?: useMutation.Options<UpdateAssignmentInviteTemplate, UpdateAssignmentInviteTemplateVariables>,
): useMutation.ResultTuple<UpdateAssignmentInviteTemplate, UpdateAssignmentInviteTemplateVariables> {
  return useMutation<UpdateAssignmentInviteTemplate, UpdateAssignmentInviteTemplateVariables>(UPDATE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION, options);
}

export function useDeleteAssignmentInviteTemplateMutation(
  options?: useMutation.Options<DeleteAssignmentInviteTemplate, DeleteAssignmentInviteTemplateVariables>,
): useMutation.ResultTuple<DeleteAssignmentInviteTemplate, DeleteAssignmentInviteTemplateVariables> {
  return useMutation<DeleteAssignmentInviteTemplate, DeleteAssignmentInviteTemplateVariables>(DELETE_ASSIGNMENT_INVITE_TEMPLATE_MUTATION, options);
}
