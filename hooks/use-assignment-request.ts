import { useCallback, useMemo } from "react";
import {
  useMyAssignmentRequestsQuery,
  useOpenSlotsForPreacherQuery,
  useEligiblePreachersForSlotQuery,
  useAssignmentInviteTemplatesQuery,
  useRequestAssignmentMutation,
  useInviteToAssignmentMutation,
  useInviteToAssignmentAnyMutation,
  useRespondToAssignmentRequestMutation,
  useRespondToAssignmentRequestAnyMutation,
  useCreateAssignmentInviteTemplateMutation,
  useUpdateAssignmentInviteTemplateMutation,
  useDeleteAssignmentInviteTemplateMutation,
} from "@/hooks/graphql/use-assignment-request";
import { GET_MY_ASSIGNMENT_REQUESTS_QUERY, GET_ASSIGNMENT_INVITE_TEMPLATES_QUERY } from "@/graphql/queries/ASSIGNMENT_REQUEST_QUERY";
import { MyAssignmentRequests_myAssignmentRequests } from "@/types/MyAssignmentRequests";
import { AssignmentInviteTemplates_assignmentInviteTemplates } from "@/types/AssignmentInviteTemplates";
import { ErrorLike } from "@apollo/client";

/** R5 — requests directed at or initiated by the caller (both candidatures and invites received). */
export function useMyAssignmentRequests() {
  const { data, loading, error, refetch } = useMyAssignmentRequestsQuery();

  const [respondOwnMutation, { loading: respondingOwn }] = useRespondToAssignmentRequestMutation({
    refetchQueries: [{ query: GET_MY_ASSIGNMENT_REQUESTS_QUERY }],
  });
  const [respondAnyMutation, { loading: respondingAny }] = useRespondToAssignmentRequestAnyMutation({
    refetchQueries: [{ query: GET_MY_ASSIGNMENT_REQUESTS_QUERY }],
  });

  const requests = useMemo<MyAssignmentRequests_myAssignmentRequests[]>(() => data?.myAssignmentRequests ?? [], [data]);

  const respond = useCallback((id: string, accept: boolean) => respondOwnMutation({ variables: { id, accept } }), [respondOwnMutation]);
  const respondAny = useCallback((id: string, accept: boolean) => respondAnyMutation({ variables: { id, accept } }), [respondAnyMutation]);

  return {
    requests,
    loading,
    responding: respondingOwn || respondingAny,
    error: error as ErrorLike | undefined,
    refetch,
    respond,
    respondAny,
  };
}

/** R5 — churches with an open slot within the caller's own reach (R6). */
export function useOpenSlotsForPreacher(month: string) {
  const { data, loading, error } = useOpenSlotsForPreacherQuery({ variables: { month } });
  const [requestMutation, { loading: requesting }] = useRequestAssignmentMutation();

  const request = useCallback(
    (churchId: string, date: string) => requestMutation({ variables: { church_id: churchId, date } }),
    [requestMutation],
  );

  return {
    openSlots: data?.openSlotsForPreacher ?? [],
    loading,
    requesting,
    error: error as ErrorLike | undefined,
    request,
  };
}

/** R6 — preachers eligible for a specific church+date, already filtered server-side by reach. */
export function useEligiblePreachersForSlot(churchId: string, date: string, skip?: boolean) {
  const { data, loading, error } = useEligiblePreachersForSlotQuery({ variables: { church_id: churchId, date }, skip });
  return { preachers: data?.eligiblePreachersForSlot ?? [], loading, error: error as ErrorLike | undefined };
}

export function useInviteToAssignment() {
  const [inviteMutation, { loading: invitingOwn }] = useInviteToAssignmentMutation();
  const [inviteAnyMutation, { loading: invitingAny }] = useInviteToAssignmentAnyMutation();

  const invite = useCallback(
    (churchId: string, date: string, userId: string, templateId?: string) =>
      inviteMutation({ variables: { church_id: churchId, date, user_id: userId, template_id: templateId } }),
    [inviteMutation],
  );
  const inviteAny = useCallback(
    (churchId: string, date: string, userId: string, templateId?: string) =>
      inviteAnyMutation({ variables: { church_id: churchId, date, user_id: userId, template_id: templateId } }),
    [inviteAnyMutation],
  );

  return { invite, inviteAny, inviting: invitingOwn || invitingAny };
}

export function useAssignmentInviteTemplates() {
  const { data, loading, error } = useAssignmentInviteTemplatesQuery();

  const [createMutation, { loading: creating }] = useCreateAssignmentInviteTemplateMutation({
    refetchQueries: [{ query: GET_ASSIGNMENT_INVITE_TEMPLATES_QUERY }],
  });
  const [updateMutation, { loading: updating }] = useUpdateAssignmentInviteTemplateMutation({
    refetchQueries: [{ query: GET_ASSIGNMENT_INVITE_TEMPLATES_QUERY }],
  });
  const [deleteMutation, { loading: deleting }] = useDeleteAssignmentInviteTemplateMutation({
    refetchQueries: [{ query: GET_ASSIGNMENT_INVITE_TEMPLATES_QUERY }],
  });

  const templates = useMemo<AssignmentInviteTemplates_assignmentInviteTemplates[]>(() => data?.assignmentInviteTemplates ?? [], [data]);

  const create = useCallback(
    (name: string, subject: string, body: string) => createMutation({ variables: { name, subject, body } }),
    [createMutation],
  );
  const update = useCallback(
    (id: string, name: string, subject: string, body: string) => updateMutation({ variables: { id, name, subject, body } }),
    [updateMutation],
  );
  const remove = useCallback((id: string) => deleteMutation({ variables: { id } }), [deleteMutation]);

  return {
    templates,
    loading,
    saving: creating || updating || deleting,
    error: error as ErrorLike | undefined,
    create,
    update,
    remove,
  };
}
