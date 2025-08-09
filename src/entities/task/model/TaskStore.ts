import { makeAutoObservable, runInAction } from 'mobx';
import { Task, TaskFormData, TaskPriority, TaskCompletionStatus } from './Task.types';
import { generateId } from '@/shared/lib/generateId';
import { loadFromLocalStorage, saveToLocalStorage } from '@/shared/lib/localStorage';

export class TaskStore {
  tasks: Task[] = [];
  selectedTaskId: string | null = null;
  expandedTaskIds: Set<string> = new Set(); // Track expanded tasks
  isLoading: boolean = false;
  error: string | null = null;

  // UI State
  isSidebarCollapsed: boolean = false;
  sidebarWidth: number = 400;
  
  // Modal State
  editingTaskId: string | null = null;
  isEditModalOpen: boolean = false;
  addingChildToTaskId: string | null = null;
  isAddChildModalOpen: boolean = false;
  
  // Form State
  taskFormData: TaskFormData = {
    title: '',
    description: '',
    priority: TaskPriority.MEDIUM,
    completionStatus: TaskCompletionStatus.TODO,
  };
  isSubmitting: boolean = false;

  constructor() {
    makeAutoObservable(this);
    // Only load data on client side
    if (typeof window !== 'undefined') {
      this.loadTasks();
      this.loadUIPreferences();
    }
  }

  // Load UI preferences from localStorage
  loadUIPreferences = () => {
    try {
      const preferences = loadFromLocalStorage<{
        isSidebarCollapsed: boolean;
        sidebarWidth: number;
      }>('uiPreferences');
      
      if (preferences) {
        this.isSidebarCollapsed = preferences.isSidebarCollapsed ?? false;
        this.sidebarWidth = preferences.sidebarWidth ?? 400;
      }
    } catch {
      // no-op
    }
  };

  // Save UI preferences to localStorage
  saveUIPreferences = () => {
    try {
      saveToLocalStorage('uiPreferences', {
        isSidebarCollapsed: this.isSidebarCollapsed,
        sidebarWidth: this.sidebarWidth,
      });
    } catch {
      // no-op
    }
  };

  // Load tasks from localStorage
  loadTasks = () => {
    this.isLoading = true;
    try {
      const savedTasks = loadFromLocalStorage<Task[]>('tasks');
      runInAction(() => {
        this.tasks = savedTasks || [];
        this.isLoading = false;
      });
    } catch {
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
    } catch {
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
      priority: taskData.priority,
      completionStatus: taskData.completionStatus || TaskCompletionStatus.TODO,
      parentId,
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      // Add as child task
      const parentTask = this.findTaskById(parentId);
      if (parentTask) {
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

  // Toggle task completion with parent-child logic
  toggleTask = (taskId: string) => {
    const task = this.findTaskById(taskId);
    if (task) {
      const newCompletedState = !task.completed;
      task.completed = newCompletedState;
      
      // Update completionStatus based on completion state
      task.completionStatus = newCompletedState ? TaskCompletionStatus.COMPLETED : TaskCompletionStatus.IN_PROGRESS;
      task.updatedAt = new Date();
      
      // If marking as completed, mark all children as completed
      if (newCompletedState && task.children) {
        this.markChildrenCompleted(task.children, true);
      }
      
      // If marking as incomplete, mark all children as incomplete
      if (!newCompletedState && task.children) {
        this.markChildrenCompleted(task.children, false);
      }
      
      // Update parent completion status
      this.updateParentCompletionStatus(task);
      
      this.saveTasks();
    }
  };

  // Helper method to mark all children as completed/incomplete
  private markChildrenCompleted = (children: Task[], completed: boolean) => {
    children.forEach(child => {
      child.completed = completed;
      child.completionStatus = completed ? TaskCompletionStatus.COMPLETED : TaskCompletionStatus.IN_PROGRESS;
      child.updatedAt = new Date();
      if (child.children) {
        this.markChildrenCompleted(child.children, completed);
      }
    });
  };

  // Helper method to update parent completion status based on children
  private updateParentCompletionStatus = (task: Task) => {
    if (task.parentId) {
      const parent = this.findTaskById(task.parentId);
      if (parent && parent.children) {
        const allChildrenCompleted = parent.children.every(child => child.completed);
        
        // Parent should be completed if and only if ALL children are completed
        const shouldBeCompleted = allChildrenCompleted && parent.children.length > 0;
        
        if (parent.completed !== shouldBeCompleted) {
          parent.completed = shouldBeCompleted;
          parent.completionStatus = shouldBeCompleted ? TaskCompletionStatus.COMPLETED : TaskCompletionStatus.IN_PROGRESS;
          parent.updatedAt = new Date();
        }
        
        // Recursively update grandparent
        this.updateParentCompletionStatus(parent);
      }
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

  // Cycle task priority
  cyclePriority = (taskId: string) => {
    const task = this.findTaskById(taskId);
    if (task) {
      const priorities: TaskPriority[] = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT];
      const currentIndex = priorities.indexOf(task.priority);
      const nextIndex = (currentIndex + 1) % priorities.length;
      task.priority = priorities[nextIndex];
      task.updatedAt = new Date();
      this.saveTasks();
    }
  };

  // Cycle task status
  cycleCompletionStatus = (taskId: string) => {
    const task = this.findTaskById(taskId);
    if (task) {
      const statuses: TaskCompletionStatus[] = [TaskCompletionStatus.TODO, TaskCompletionStatus.IN_PROGRESS, TaskCompletionStatus.PAUSED, TaskCompletionStatus.COMPLETED];
      const currentIndex = statuses.indexOf(task.completionStatus);
      const nextIndex = (currentIndex + 1) % statuses.length;
      const oldCompletedState = task.completed;
      
      task.completionStatus = statuses[nextIndex];
      
      // Update completed state based on completionStatus
      const newCompletedState = task.completionStatus === TaskCompletionStatus.COMPLETED;
      task.completed = newCompletedState;
      task.updatedAt = new Date();
      
      // Handle parent-child completion logic only if completion state actually changed
      if (oldCompletedState !== newCompletedState) {
        // If marking as completed, mark all children as completed
        if (newCompletedState && task.children) {
          this.markChildrenCompleted(task.children, true);
        }
        
        // If marking as incomplete, mark all children as incomplete
        if (!newCompletedState && task.children) {
          this.markChildrenCompleted(task.children, false);
        }
        
        // Update parent completion status
        this.updateParentCompletionStatus(task);
      }
      
      this.saveTasks();
    }
  };

  // Expansion state management
  toggleTaskExpansion = (taskId: string) => {
    if (this.expandedTaskIds.has(taskId)) {
      this.expandedTaskIds.delete(taskId);
    } else {
      this.expandedTaskIds.add(taskId);
    }
  };

  isTaskExpanded = (taskId: string): boolean => {
    return this.expandedTaskIds.has(taskId);
  };

  // Find path to a task (all parent IDs)
  findTaskPath = (targetTaskId: string, tasks: Task[] = this.tasks, path: string[] = []): string[] | null => {
    for (const task of tasks) {
      const currentPath = [...path, task.id];
      
      if (task.id === targetTaskId) {
        return currentPath;
      }
      
      if (task.children && task.children.length > 0) {
        const foundPath = this.findTaskPath(targetTaskId, task.children, currentPath);
        if (foundPath) {
          return foundPath;
        }
      }
    }
    return null;
  };

  // Navigate to task and expand parents
  navigateToTask = (taskId: string) => {
    runInAction(() => {
      this.selectedTaskId = taskId;
      
      // Find path to the task
      const path = this.findTaskPath(taskId);
      if (path) {
        // Expand all parent tasks (exclude the target task itself)
        const parentIds = path.slice(0, -1);
        parentIds.forEach(parentId => {
          this.expandedTaskIds.add(parentId);
        });
      }
    });
  };

  // Auto-expand tasks based on level (for initial load)
  initializeExpansion = () => {
    const expandTasksAtLevel = (tasks: Task[], level: number = 0) => {
      tasks.forEach(task => {
        if (level < 2 && task.children && task.children.length > 0) {
          this.expandedTaskIds.add(task.id);
          expandTasksAtLevel(task.children, level + 1);
        }
      });
    };
    
    expandTasksAtLevel(this.tasks);
  };

  // Fix parentId references in nested structure
  fixParentReferences = (tasks: Task[] = this.tasks, parentId?: string) => {
    tasks.forEach(task => {
      if (parentId) {
        task.parentId = parentId;
      }
      if (task.children && task.children.length > 0) {
        this.fixParentReferences(task.children, task.id);
      }
    });
  };

  // Recalculate all parent completion states
  recalculateCompletionStates = (tasks: Task[] = this.tasks) => {
    tasks.forEach(task => {
      if (task.children && task.children.length > 0) {
        // First, recursively fix children
        this.recalculateCompletionStates(task.children);
        
        // Then update this task's completion based on its children
        const allChildrenCompleted = task.children.every(child => child.completed);
        if (task.completed !== allChildrenCompleted) {
          task.completed = allChildrenCompleted;
          task.completionStatus = allChildrenCompleted ? TaskCompletionStatus.COMPLETED : TaskCompletionStatus.IN_PROGRESS;
          task.updatedAt = new Date();
        }
      }
    });
  };

  // Clear all tasks
  clearAllTasks = () => {
    runInAction(() => {
      this.tasks = [];
      this.selectedTaskId = null;
      this.saveTasks();
    });
  };

  // Populate with mock data inspired by "The House That Jack Built"
  populateWithMockData = () => {
    runInAction(() => {
      const now = new Date();
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'The House That Jack Built',
          description: 'A grand project of interconnected tasks',
          completed: false,
          priority: TaskPriority.HIGH,
          completionStatus: TaskCompletionStatus.IN_PROGRESS,
          createdAt: now,
          updatedAt: now,
          children: [
            {
              id: '1.1',
              title: 'Lay the foundation',
              description: 'The foundation that supports the house',
              completed: true,
              priority: TaskPriority.URGENT,
              completionStatus: TaskCompletionStatus.COMPLETED,
              parentId: '1',
              createdAt: now,
              updatedAt: now,
              children: []
            },
            {
              id: '1.2',
              title: 'Build the walls',
              description: 'The walls that stand on the foundation',
              completed: false, // Set to false initially so the logic can work
              priority: TaskPriority.HIGH,
              completionStatus: TaskCompletionStatus.IN_PROGRESS,
              parentId: '1',
              createdAt: now,
              updatedAt: now,
              children: [
                {
                  id: '1.2.1',
                  title: 'Mix the mortar',
                  description: 'The mortar that holds the bricks',
                  completed: true,
                  priority: TaskPriority.MEDIUM,
                  completionStatus: TaskCompletionStatus.COMPLETED,
                  parentId: '1.2',
                  createdAt: now,
                  updatedAt: now,
                  children: []
                },
                {
                  id: '1.2.2',
                  title: 'Lay the bricks',
                  description: 'The bricks that make the walls',
                  completed: true,
                  priority: TaskPriority.MEDIUM,
                  completionStatus: TaskCompletionStatus.COMPLETED,
                  parentId: '1.2',
                  createdAt: now,
                  updatedAt: now,
                  children: []
                }
              ]
            },
            {
              id: '1.3',
              title: 'Install the roof',
              description: 'The roof that covers the house',
              completed: false,
              priority: TaskPriority.HIGH,
              completionStatus: TaskCompletionStatus.TODO,
              parentId: '1',
              createdAt: now,
              updatedAt: now,
              children: [
                {
                  id: '1.3.1',
                  title: 'Cut the rafters',
                  description: 'The rafters that support the roof',
                  completed: false,
                  priority: TaskPriority.MEDIUM,
                  completionStatus: TaskCompletionStatus.TODO,
                  parentId: '1.3',
                  createdAt: now,
                  updatedAt: now,
                  children: []
                },
                {
                  id: '1.3.2',
                  title: 'Install shingles',
                  description: 'The shingles that cover the rafters',
                  completed: false,
                  priority: TaskPriority.LOW,
                  completionStatus: TaskCompletionStatus.TODO,
                  parentId: '1.3',
                  createdAt: now,
                  updatedAt: now,
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: '2',
          title: 'Stock the house',
          description: 'Fill the house with provisions',
          completed: false,
          priority: TaskPriority.MEDIUM,
          completionStatus: TaskCompletionStatus.TODO,
          createdAt: now,
          updatedAt: now,
          children: [
            {
              id: '2.1',
              title: 'Store the malt',
              description: 'The malt that lay in the house',
              completed: false,
              priority: TaskPriority.LOW,
              completionStatus: TaskCompletionStatus.TODO,
              parentId: '2',
              createdAt: now,
              updatedAt: now,
              children: []
            },
            {
              id: '2.2',
              title: 'Keep the cat',
              description: 'The cat that killed the rat that ate the malt',
              completed: false,
              priority: TaskPriority.MEDIUM,
              completionStatus: TaskCompletionStatus.PAUSED,
              parentId: '2',
              createdAt: now,
              updatedAt: now,
              children: [
                {
                  id: '2.2.1',
                  title: 'Feed the cat',
                  description: 'Daily feeding schedule',
                  completed: false,
                  priority: TaskPriority.MEDIUM,
                  completionStatus: TaskCompletionStatus.IN_PROGRESS,
                  parentId: '2.2',
                  createdAt: now,
                  updatedAt: now,
                  children: []
                },
                {
                  id: '2.2.2',
                  title: 'Train the cat',
                  description: 'Teach hunting skills',
                  completed: false,
                  priority: TaskPriority.LOW,
                  completionStatus: TaskCompletionStatus.TODO,
                  parentId: '2.2',
                  createdAt: now,
                  updatedAt: now,
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: '3',
          title: 'Hire the staff',
          description: 'Assemble the household team',
          completed: false,
          priority: TaskPriority.LOW,
          completionStatus: TaskCompletionStatus.TODO,
          createdAt: now,
          updatedAt: now,
          children: [
            {
              id: '3.1',
              title: 'Find the maiden',
              description: 'The maiden all forlorn that milked the cow',
              completed: false,
              priority: TaskPriority.LOW,
              completionStatus: TaskCompletionStatus.TODO,
              parentId: '3',
              createdAt: now,
              updatedAt: now,
              children: []
            },
            {
              id: '3.2',
              title: 'Recruit the man',
              description: 'The man all tattered and torn that kissed the maiden',
              completed: false,
              priority: TaskPriority.LOW,
              completionStatus: TaskCompletionStatus.TODO,
              parentId: '3',
              createdAt: now,
              updatedAt: now,
              children: []
            }
          ]
        }
      ];

      this.tasks = mockTasks;
      this.selectedTaskId = null;
      this.fixParentReferences(); // Ensure parent references are correct
      this.recalculateCompletionStates(); // Fix completion states
      this.initializeExpansion(); // Initialize expansion state
      this.saveTasks();
    });
  };

  // === UI State Management ===
  
  // Sidebar State
  toggleSidebar = () => {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.saveUIPreferences();
  };
  
  setSidebarCollapsed = (collapsed: boolean) => {
    this.isSidebarCollapsed = collapsed;
    this.saveUIPreferences();
  };
  
  setSidebarWidth = (width: number) => {
    this.sidebarWidth = Math.max(280, Math.min(800, width));
    this.saveUIPreferences();
  };
  
  // Modal State Management
  openEditModal = (taskId?: string) => {
    if (taskId) {
      const task = this.findTaskById(taskId);
      if (task) {
        this.editingTaskId = taskId;
        this.taskFormData = {
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          completionStatus: task.completionStatus,
        };
      }
    } else {
      this.editingTaskId = null;
      this.resetFormData();
    }
    this.isEditModalOpen = true;
  };
  
  closeEditModal = () => {
    this.editingTaskId = null;
    this.isEditModalOpen = false;
    this.resetFormData();
  };
  
  openAddChildModal = (parentId: string) => {
    this.addingChildToTaskId = parentId;
    this.isAddChildModalOpen = true;
    this.resetFormData();
  };
  
  closeAddChildModal = () => {
    this.addingChildToTaskId = null;
    this.isAddChildModalOpen = false;
    this.resetFormData();
  };
  
  // Form State Management
  resetFormData = () => {
    this.taskFormData = {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      completionStatus: TaskCompletionStatus.TODO,
    };
  };
  
  updateFormData = (field: keyof TaskFormData, value: string | TaskPriority | TaskCompletionStatus) => {
    this.taskFormData = { ...this.taskFormData, [field]: value };
  };
  
  setIsSubmitting = (submitting: boolean) => {
    this.isSubmitting = submitting;
  };
  
  // Get the task being edited
  get editingTask(): Task | undefined {
    return this.editingTaskId ? this.findTaskById(this.editingTaskId) : undefined;
  }
}

// Create singleton instance
export const taskStore = new TaskStore();
