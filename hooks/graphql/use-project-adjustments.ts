"use client"

import { useMutation, useQuery, useApolloClient } from "@apollo/client"
import { useCallback } from "react"
import {
  ProjectAdjustment,
  AdjustmentStatus,
  AdjustmentTask,
} from "@/types/project-adjustment"
import {
  GET_PROJECT_ADJUSTMENTS,
} from "@/graphql/queries/PROJECT_ADJUSTMENTS_QUERY"
import {
  CREATE_ADJUSTMENT,
  UPDATE_ADJUSTMENT_STATUS,
  ADD_ADJUSTMENT_TASK,
  TOGGLE_ADJUSTMENT_TASK,
  REMOVE_ADJUSTMENT_TASK,
} from "@/graphql/mutations/PROJECT_ADJUSTMENT_MUTATIONS"

// ─── Debug flag ───────────────────────────────────────────────────────────────
const DEBUG = true
const log = (...args: unknown[]) =>
  DEBUG && console.log("[ProjectAdjustments]", ...args)

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProjectAdjustments(projectId: string | undefined | null) {
  const client = useApolloClient()

  const { data, loading, error, refetch } = useQuery(GET_PROJECT_ADJUSTMENTS, {
    variables: { projectId },
    skip: !projectId,
    fetchPolicy: "cache-and-network",
  })

  // ── Cache helpers ───────────────────────────────────────────────────────────

  const readCache = useCallback(
    () =>
      client.readQuery<{ projectAdjustments: ProjectAdjustment[] }>({
        query: GET_PROJECT_ADJUSTMENTS,
        variables: { projectId },
      }),
    [client, projectId]
  )

  const writeCache = useCallback(
    (adjustments: ProjectAdjustment[]) => {
      client.writeQuery({
        query: GET_PROJECT_ADJUSTMENTS,
        variables: { projectId },
        data: { projectAdjustments: adjustments },
      })
    },
    [client, projectId]
  )

  // ── Create adjustment ───────────────────────────────────────────────────────

  const [createAdjustmentMutation, { loading: creating }] = useMutation(
    CREATE_ADJUSTMENT,
    {
      onError: (err) => {
        console.error("[ProjectAdjustments] createAdjustment error:", err)
      },
      update(_, { data: result }) {
        const newItem: ProjectAdjustment = result?.createAdjustment
        if (!newItem) return
        log("createAdjustment → cache updated", newItem.id, "status:", newItem.status)
        const cached = readCache()
        writeCache([newItem, ...(cached?.projectAdjustments ?? [])])
      },
    }
  )

  const createAdjustment = useCallback(
    (input: {
      comment?: string
      tasks?: { title: string; position?: number }[]
    }) => {
      if (!projectId) {
        console.warn("[ProjectAdjustments] createAdjustment called without projectId")
        return Promise.resolve()
      }
      log("createAdjustment →", { projectId, ...input })
      return createAdjustmentMutation({
        variables: {
          data: { project_id: projectId, ...input },
        },
      })
    },
    [projectId, createAdjustmentMutation]
  )

  // ── Update status ───────────────────────────────────────────────────────────

  const [updateStatusMutation, { loading: updatingStatus }] = useMutation(
    UPDATE_ADJUSTMENT_STATUS,
    {
      onError: (err) => {
        console.error("[ProjectAdjustments] updateStatus error:", err)
      },
      update(cache, { data: result }) {
        const updated = result?.updateAdjustmentStatus
        if (!updated) return
        log("updateStatus → cache patched", updated.id, "→", updated.status)
        cache.modify({
          id: cache.identify({ __typename: "ProjectAdjustment", id: updated.id }),
          fields: {
            status: () => updated.status,
            updated_at: () => updated.updated_at,
          },
        })
      },
    }
  )

  const updateStatus = useCallback(
    (id: string, status: AdjustmentStatus) => {
      log("updateStatus →", id, status)
      return updateStatusMutation({ variables: { data: { id, status } } })
    },
    [updateStatusMutation]
  )

  // ── Add task ────────────────────────────────────────────────────────────────

  const [addTaskMutation, { loading: addingTask }] = useMutation(
    ADD_ADJUSTMENT_TASK,
    {
      onError: (err) => {
        console.error("[ProjectAdjustments] addTask error:", err)
      },
      update(cache, { data: result }, { variables }) {
        const adjustmentId = variables?.data?.adjustment_id
        const newTask: AdjustmentTask = result?.addAdjustmentTask
        if (!newTask || !adjustmentId) return
        log("addTask → cache patched", adjustmentId, "task:", newTask.id)
        cache.modify({
          id: cache.identify({ __typename: "ProjectAdjustment", id: adjustmentId }),
          fields: {
            tasks(existing = []) {
              return [...existing, newTask]
            },
          },
        })
      },
    }
  )

  const addTask = useCallback(
    (adjustment_id: string, title: string, position?: number) => {
      log("addTask →", adjustment_id, title)
      return addTaskMutation({
        variables: { data: { adjustment_id, title, position } },
      })
    },
    [addTaskMutation]
  )

  // ── Toggle task ─────────────────────────────────────────────────────────────

  const [toggleTaskMutation] = useMutation(TOGGLE_ADJUSTMENT_TASK, {
    onError: (err) => {
      console.error("[ProjectAdjustments] toggleTask error:", err)
    },
    update(cache, { data: result }) {
      const updated = result?.toggleAdjustmentTask
      if (!updated) return
      log("toggleTask → cache patched", updated.id, "completed:", updated.completed)
      cache.modify({
        id: cache.identify({ __typename: "AdjustmentTask", id: updated.id }),
        fields: { completed: () => updated.completed },
      })
    },
  })

  const toggleTask = useCallback(
    (task_id: string, completed: boolean) => {
      log("toggleTask →", task_id, completed)
      return toggleTaskMutation({ variables: { data: { task_id, completed } } })
    },
    [toggleTaskMutation]
  )

  // ── Remove task ─────────────────────────────────────────────────────────────

  const [removeTaskMutation] = useMutation(REMOVE_ADJUSTMENT_TASK, {
    onError: (err) => {
      console.error("[ProjectAdjustments] removeTask error:", err)
    },
    update(cache, { data: result }) {
      const removed = result?.removeAdjustmentTask
      if (!removed) return
      log("removeTask → evicted", removed.id)
      cache.evict({
        id: cache.identify({ __typename: "AdjustmentTask", id: removed.id }),
      })
      cache.gc()
    },
  })

  const removeTask = useCallback(
    (taskId: string) => {
      log("removeTask →", taskId)
      return removeTaskMutation({ variables: { taskId } })
    },
    [removeTaskMutation]
  )

  return {
    adjustments: (data?.projectAdjustments ?? []) as ProjectAdjustment[],
    loading,
    error,
    creating,
    updatingStatus,
    addingTask,
    refetch,
    createAdjustment,
    updateStatus,
    addTask,
    toggleTask,
    removeTask,
  }
}
