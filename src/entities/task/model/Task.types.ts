export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  children?: Task[];
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
}

export interface TaskStore {
  tasks: Task[];
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
}
