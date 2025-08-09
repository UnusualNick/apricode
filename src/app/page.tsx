'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { TaskSidebar } from '@/shared/ui/TaskSidebar';
import { TaskDetails } from '@/entities/task/ui/TaskDetails';
import { EditTaskModal } from '@/features/taskActions/ui/EditTaskModal';
import { Task } from '@/entities/task/model/Task.types';
import { taskStore } from '@/entities/task/model/TaskStore';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = observer(() => {
  const handleEditTask = (task: Task) => {
    taskStore.openEditModal(task.id);
  };

  const handleEditTaskById = (taskId: string) => {
    taskStore.openEditModal(taskId);
  };

  const handleAddChild = (parentId: string) => {
    taskStore.openAddChildModal(parentId);
  };

  const handleDeleteTask = (taskId: string) => {
    // The delete functionality is handled by the DeleteTaskButton component
    console.log('Delete task:', taskId);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Collapsible Sidebar */}
      <TaskSidebar
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onAddChild={handleAddChild}
        isCollapsed={taskStore.isSidebarCollapsed}
        onToggleCollapse={taskStore.setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 py-4 h-[73px] flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={taskStore.toggleSidebar}
                  className="shrink-0"
                >
                  {taskStore.isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
                  <p className="text-muted-foreground text-sm">
                    Organize your tasks in a hierarchical structure
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Main Task View */}
        <div className="flex-1 p-6">
          <TaskDetails
            onEdit={handleEditTaskById}
            onAddChild={handleAddChild}
          />
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={taskStore.isEditModalOpen}
        onClose={taskStore.closeEditModal}
        task={taskStore.editingTask}
        title={taskStore.editingTask ? 'Edit Task' : 'Create Task'}
      />

      {/* Add Child Task Modal */}
      <EditTaskModal
        isOpen={taskStore.isAddChildModalOpen}
        onClose={taskStore.closeAddChildModal}
        parentId={taskStore.addingChildToTaskId || undefined}
        title="Add Subtask"
      />
    </div>
  );
});

export default Home;
