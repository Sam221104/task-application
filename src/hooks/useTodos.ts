import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllTasks,
  addNewTask,
  deleteTodo,
  updateTodoName,
  toggleTodoStatus,
  reorderTasks,
} from "../api/api";
import type { Todo } from "../model/model";
import { useMemo } from "react";

export const useTodos = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  // Fetch all tasks
  const { data: allTasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchAllTasks,
  });

  // Separate into active and completed
  // const activeTasks: Todo[] = allTasks
  //   .filter((t: Todo) => !t.completed)
  //   .map((t: Todo) => ({
  //     id: String(t.id),
  //     taskName: t.taskName,
  //     completed: false,
  //   }));

  // const completedTasks: Todo[] = allTasks
  //   .filter((t: Todo) => t.completed)
  //   .map((t: Todo) => ({
  //     id: String(t.id),
  //     taskName: t.taskName,
  //     completed: true,
  //   }));
  const activeTasks = useMemo(() => {
    return allTasks
      .filter((t: Todo) => !t.completed)
      .sort((a: Todo, b: Todo) => (a.order || 0) - (b.order || 0));
  }, [allTasks]);

  const completedTasks = useMemo(() => {
    return allTasks
      .filter((t: Todo) => t.completed)
      .sort((a: Todo, b: Todo) => (a.order || 0) - (b.order || 0));
  }, [allTasks]);

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

  const toggleMutation = useMutation({
    mutationFn: toggleTodoStatus,
    onSuccess: invalidateAll,
  });

  const reorderMutation = useMutation({
    mutationFn: reorderTasks,
    onSuccess: () => {
      console.log("Reorder mutation success, invalidating queries");
      invalidateAll();
    },
    onError: (error) => {
      console.error("Reorder mutation error:", error);
    },
  });

  return {
    activeTasks,
    completedTasks,
    addTask: addMutation.mutate,
    deleteTask: deleteMutation.mutate,
    updateTask: updateMutation.mutate,
    toggleTask: toggleMutation.mutate,
    reorderTasks: reorderMutation.mutate,
  };
};
