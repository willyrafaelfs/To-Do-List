export type TaskStatus = "todo" | "progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface User {
  id: string;
  name?: string | null;
  email: string;
}

export interface Course {
  id: string;
  userId: string;
  name: string;
  lecturer?: string | null;
  semester?: number | null;
}

export interface Task {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  deadline?: Date | null;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Reminder {
  id: string;
  taskId: string;
  remindAt: Date;
  isSent: Boolean;
}
