import type { Todo } from "@/model/model";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:3000/";

export const fetchAllTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}tasks`);
    const tasks = await response.json();
    // Transform MongoDB _id to id for frontend compatibility
    return tasks.map((task: any) => ({
      id: task._id,
      taskName: task.taskName,
      completed: task.completed,
      order: task.order || 0,
    }));
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
    const newTask = await response.json();
    // Transform MongoDB _id to id for frontend compatibility
    return {
      id: newTask._id,
      taskName: newTask.taskName,
      completed: newTask.completed,
      order: newTask.order || 0,
    };
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

export const reorderTasks = async (
  tasks: Array<{ id: string; order: number; completed: boolean }>,
) => {
  try {
    console.log("API reorderTasks called with:", tasks);
    const response = await fetch(`${API_BASE_URL}tasks/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });

    console.log("Reorder response status:", response.status);
    const reorderedTasks = await response.json();
    console.log("Reorder response data:", reorderedTasks);

    // Transform MongoDB _id to id for frontend compatibility
    return reorderedTasks.map((task: any) => ({
      id: task._id,
      taskName: task.taskName,
      completed: task.completed,
      order: task.order || 0,
    }));
  } catch (error) {
    console.error("Error reordering tasks:", error);
    throw error;
  }
};
