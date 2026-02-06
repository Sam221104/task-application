export type Todo = {
  id: string;
  taskName: string;
  status: "active" | "in_progress" | "completed";
  order: number;
};

export type TaskStatus = "active" | "in_progress" | "completed";
