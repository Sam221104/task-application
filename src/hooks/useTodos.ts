import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllTasks,
  addNewTask,
  deleteTodo,
  updateTodoName,
  toggleTodoStatus,
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
    console.log("Filtering active tasks");
    return allTasks.filter((t: Todo) => !t.completed);
  }, [allTasks]);

  const completedTasks = useMemo(() => {
    console.log("Filtering completed tasks");
    return allTasks.filter((t: Todo) => t.completed);
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

  return {
    activeTasks,
    completedTasks,
    addTask: addMutation.mutate,
    deleteTask: deleteMutation.mutate,
    updateTask: updateMutation.mutate,
    toggleTask: toggleMutation.mutate,
  };
};
