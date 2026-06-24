"use client"

import { useMemo } from "react"
import { useQuery } from "@apollo/client"
import { GET_SUBSIDY_REQUESTS_BY_PROJECT } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActivityAllocationRef {
  subsidyId: string
  subsidyTitle: string
  requestedAmount: number
  status: string
}

export interface ActivityBudgetSummary {
  activityId: string
  budget: number
  allocated: number
  available: number
  subsidyCount: number
  subsidyRefs: ActivityAllocationRef[]
}

interface SubsidyItemShape {
  project_activity_id?: string
  activity_id?: string
  requested_amount?: number | string
}

interface SubsidyRequestShape {
  id: string
  description?: string
  items?: SubsidyItemShape[]
  subsidy_status?: { name?: string }
}

interface UseActivityAllocationParams {
  projectId?: string
  existingRequests?: SubsidyRequestShape[]
  currentSubsidyId?: string
  activityBudgets: Record<string, number>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isRejected(status: string | undefined): boolean {
  return !!(status && status.toLowerCase().includes("rejected"))
}

function computeSummaries(
  requests: SubsidyRequestShape[],
  currentSubsidyId: string | undefined,
  activityBudgets: Record<string, number>,
): Map<string, ActivityBudgetSummary> {
  const summaries = new Map<string, ActivityBudgetSummary>()

  for (const request of requests) {
    if (request.id === currentSubsidyId) continue
    if (isRejected(request.subsidy_status?.name)) continue

    for (const item of request.items ?? []) {
      const actId = item.project_activity_id || item.activity_id
      if (!actId) continue

      const amount = Number(item.requested_amount ?? 0)
      const budget = Number(activityBudgets[actId] ?? 0)
      const ref: ActivityAllocationRef = {
        subsidyId: request.id,
        subsidyTitle: request.description ?? request.id,
        requestedAmount: amount,
        status: request.subsidy_status?.name?.toLowerCase() ?? "pending",
      }

      const existing = summaries.get(actId)
      if (existing) {
        existing.allocated += amount
        existing.available = Math.max(0, budget - existing.allocated)
        existing.subsidyCount += 1
        existing.subsidyRefs.push(ref)
      } else {
        summaries.set(actId, {
          activityId: actId,
          budget,
          allocated: amount,
          available: Math.max(0, budget - amount),
          subsidyCount: 1,
          subsidyRefs: [ref],
        })
      }
    }
  }

  return summaries
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useActivityAllocation({
  projectId,
  existingRequests,
  currentSubsidyId,
  activityBudgets,
}: UseActivityAllocationParams) {
  // Fetch from API only when projectId is supplied and existingRequests is NOT
  const shouldFetch = !existingRequests && !!projectId

  const { data, loading, error } = useQuery(GET_SUBSIDY_REQUESTS_BY_PROJECT, {
    variables: { project_id: projectId ?? "" },
    skip: !shouldFetch,
    fetchPolicy: "cache-and-network",
  })

  const summaries = useMemo(() => {
    const requests: SubsidyRequestShape[] = existingRequests
      ? (existingRequests as SubsidyRequestShape[])
      : ((data?.subsidyRequests ?? []) as SubsidyRequestShape[])

    if (process.env.NODE_ENV === "development") {
      console.debug("[useActivityAllocation] computing from", requests.length, "requests")
    }

    return computeSummaries(requests, currentSubsidyId, activityBudgets)
  }, [existingRequests, data, currentSubsidyId, activityBudgets])

  return {
    summaries,
    loading: shouldFetch ? loading : false,
    error: shouldFetch ? error : undefined,
  }
}
