import { makeAutoObservable, runInAction } from 'mobx';
import { Task, TaskFormData } from './Task.types';
import { generateId } from '@/shared/lib/generateId';
import { loadFromLocalStorage, saveToLocalStorage } from '@/shared/lib/localStorage';

export class TaskStore {
  tasks: Task[] = [];
  selectedTaskId: string | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadTasks();
  }

  // Load tasks from localStorage
  loadTasks = () => {
    this.isLoading = true;
    try {
      const savedTasks = loadFromLocalStorage<Task[]>('tasks');
      runInAction(() => {
        this.tasks = savedTasks || [];
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to load tasks';
        this.isLoading = false;
      });
    }
  };

  // Save tasks to localStorage
  saveTasks = () => {
    try {
      saveToLocalStorage('tasks', this.tasks);
    } catch (error) {
      this.error = 'Failed to save tasks';
    }
  };

  // Add a new task
  addTask = (taskData: TaskFormData, parentId?: string) => {
    const newTask: Task = {
      id: generateId(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      parentId,
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      // Add as child task
      const parentTask = this.findTaskById(parentId);
      if (parentTask) {
        if (!parentTask.children) {
          parentTask.children = [];
        }
        parentTask.children.push(newTask);
      }
    } else {
      // Add as root task
      this.tasks.push(newTask);
    }

    this.saveTasks();
  };

  // Update task
  updateTask = (taskId: string, updates: Partial<Task>) => {
    const task = this.findTaskById(taskId);
    if (task) {
      Object.assign(task, { ...updates, updatedAt: new Date() });
      this.saveTasks();
    }
  };

  // Toggle task completion
  toggleTask = (taskId: string) => {
    const task = this.findTaskById(taskId);
    if (task) {
      task.completed = !task.completed;
      task.updatedAt = new Date();
      this.saveTasks();
    }
  };

  // Delete task
  deleteTask = (taskId: string) => {
    const deleteFromArray = (tasks: Task[]): Task[] => {
      return tasks.filter(task => {
        if (task.id === taskId) {
          return false;
        }
        if (task.children) {
          task.children = deleteFromArray(task.children);
        }
        return true;
      });
    };

    this.tasks = deleteFromArray(this.tasks);
    if (this.selectedTaskId === taskId) {
      this.selectedTaskId = null;
    }
    this.saveTasks();
  };

  // Find task by ID (recursive)
  findTaskById = (taskId: string): Task | undefined => {
    const findInTasks = (tasks: Task[]): Task | undefined => {
      for (const task of tasks) {
        if (task.id === taskId) {
          return task;
        }
        if (task.children) {
          const found = findInTasks(task.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    return findInTasks(this.tasks);
  };

  // Select task
  selectTask = (taskId: string | null) => {
    this.selectedTaskId = taskId;
  };

  // Get selected task
  get selectedTask(): Task | undefined {
    return this.selectedTaskId ? this.findTaskById(this.selectedTaskId) : undefined;
  }

  // Get root tasks (tasks without parent)
  get rootTasks(): Task[] {
    return this.tasks;
  }

  // Clear error
  clearError = () => {
    this.error = null;
  };
}

// Create singleton instance
export const taskStore = new TaskStore();
