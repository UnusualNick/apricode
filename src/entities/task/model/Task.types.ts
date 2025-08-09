export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  children: Task[];
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: TaskPriority;
}

export interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
}
