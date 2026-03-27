"use client"

import { useQuery, useMutation } from "@apollo/client"
import { useEffect } from "react"
import { GET_SUBSIDIES_WAITING_REFUND } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import {
  REQUEST_SUBSIDY_REFUND,
  CONFIRM_REFUND_DONE,
} from "@/graphql/mutations/REFUND_MUTATIONS"
import { useInstitution } from "@/contexts/institution-context"

// ---------------------------------------------------------------------------
// useSubsidiesWaitingRefund
// ---------------------------------------------------------------------------

/**
 * Fetches all SubsidyRequest records flagged as `have_refund = true`
 * for the current institution, and logs them to the dev console.
 */
export function useSubsidiesWaitingRefund(skip?: boolean) {
  const { currentInstitutionData } = useInstitution()
  const institutionId = currentInstitutionData?.id

  const result = useQuery(GET_SUBSIDIES_WAITING_REFUND, {
    variables: { institutionId },
    skip: skip || !institutionId,
    fetchPolicy: "cache-and-network",
  })

  // Debug: log all results whenever the data changes
  useEffect(() => {
    if (!result.data) return
    const list: any[] = result.data.getSubsidiesWaitingRefund ?? []
    console.groupCollapsed(
      `[DB] Subsidy requests waiting refund — ${list.length} record(s) — institution: ${institutionId}`
    )
    if (list.length === 0) {
      console.log(
        "No subsidy requests with have_refund = true found for this institution."
      )
    } else {
      list.forEach((item: any, idx: number) => {
        console.groupCollapsed(
          `  [${idx + 1}] ${item.project?.title ?? "(no project)"} — ${item.description ?? "(no description)"}`
        )
        console.log("ID:", item.id)
        console.log("Status:", item.subsidy_status?.name ?? item.subsidy_status?.id)
        console.log("Total budget:", item.total_budget)
        console.log("Approved:", item.approved_amount)
        console.log("Refund amount:", item.refund_amount)
        console.log("have_refund:", item.have_refund)
        console.log("refund_done:", item.refund_done)
        console.log("Requester:", item.requester?.name ?? item.requester?.email)
        console.log("Institution:", item.institution?.name)
        console.log("Department:", item.department?.name)
        console.log("Church:", item.church?.name)
        console.log("Created at:", item.created_at)
        console.groupEnd()
      })
    }
    console.groupEnd()
  }, [result.data, institutionId])

  return {
    subsidies: (result.data?.getSubsidiesWaitingRefund ?? []) as any[],
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  }
}

// ---------------------------------------------------------------------------
// useRequestRefund
// ---------------------------------------------------------------------------

/**
 * Wrapper for the `requestSubsidyRefund` mutation.
 *
 * Usage:
 * ```tsx
 * const [requestRefund, { loading }] = useRequestRefund()
 * requestRefund({ variables: { id, refundAmount, reason, language } })
 * ```
 */
export function useRequestRefund(options?: any) {
  return useMutation(REQUEST_SUBSIDY_REFUND, options)
}

// ---------------------------------------------------------------------------
// useConfirmRefund
// ---------------------------------------------------------------------------

/**
 * Wrapper for the `confirmRefundDone` mutation.
 *
 * Usage:
 * ```tsx
 * const [confirmRefund, { loading }] = useConfirmRefund()
 * confirmRefund({ variables: { id, language } })
 * ```
 */
export function useConfirmRefund(options?: any) {
  return useMutation(CONFIRM_REFUND_DONE, options)
}
