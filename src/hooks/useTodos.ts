import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllTasks,
  addNewTask,
  deleteTodo,
  updateTodoName,
  updateTodoStatus,
  reorderTasks,
} from "../api/api";
import type { Todo } from "../model/model";
import { useMemo, useCallback } from "react";
export const useTodos = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  // Fetch all tasks
  const { data: fetchedTasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchAllTasks,
  });

  // Use only fetched tasks from backend
  const allTasks = useMemo(() => {
    return fetchedTasks;
  }, [fetchedTasks]);

  const activeTasks = useMemo(() => {
    return allTasks
      .filter((t: Todo) => t.status === "active")
      .sort((a: Todo, b: Todo) => (a.order || 0) - (b.order || 0));
  }, [allTasks]);

  const inProgressTasks = useMemo(() => {
    return allTasks
      .filter((t: Todo) => t.status === "in_progress")
      .sort((a: Todo, b: Todo) => (a.order || 0) - (b.order || 0));
  }, [allTasks]);

  const completedTasks = useMemo(() => {
    return allTasks
      .filter((t: Todo) => t.status === "completed")
      .sort((a: Todo, b: Todo) => (a.order || 0) - (b.order || 0));
  }, [allTasks]);

  // Directly set the tasks cache for instant local updates (no server call)
  const setTasksCache = useCallback(
    (updater: (old: Todo[]) => Todo[]) => {
      queryClient.setQueryData<Todo[]>(["tasks"], (old = []) => updater(old));
    },
    [queryClient],
  );

  // Mutations
  const addMutation = useMutation({
    mutationFn: addNewTask,
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: updateTodoName,
    onSuccess: invalidateAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateTodoStatus,
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<Todo[]>(["tasks"]);
      // Optimistically update the cache
      queryClient.setQueryData<Todo[]>(["tasks"], (old = []) =>
        old.map((t) => (t.id === id ? { ...t, status } : t)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["tasks"], context.previous);
      }
    },
    // Remove onSettled to prevent refetch that would reset the local order
  });

  const reorderMutation = useMutation({
    mutationFn: reorderTasks,
    onError: (err, tasksToUpdate, context) => {
      // If the mutation fails, invalidate to refetch the correct data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    activeTasks,
    inProgressTasks,
    completedTasks,
    isLoading,
    setTasksCache,
    addTask: addMutation.mutate,
    deleteTask: deleteMutation.mutate,
    updateTask: updateMutation.mutate,
    updateTaskStatus: updateStatusMutation.mutate,
    reorderTasks: reorderMutation.mutate,
  };
};
