import type { Todo } from "@/model/model";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchAllTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}tasks`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const addNewTask = async (task: Pick<Todo, "taskName">) => {
  try {
    const response = await fetch(`${API_BASE_URL}tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName: task.taskName, completed: false }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete");
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const updateTodoName = async ({
  id,
  taskName,
}: Pick<Todo, "id" | "taskName">) => {
  try {
    const response = await fetch(`${API_BASE_URL}tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const toggleTodoStatus = async ({
  id,
  completed,
}: Pick<Todo, "id" | "completed">) => {
  try {
    const response = await fetch(`${API_BASE_URL}tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error toggling task:", error);
    throw error;
  }
};
