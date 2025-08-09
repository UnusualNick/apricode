'use client';

import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TaskSidebar } from '@/shared/ui/TaskSidebar';
import { TaskDetails } from '@/entities/task/ui/TaskDetails';
import { EditTaskModal } from '@/features/taskActions/ui/EditTaskModal';
import { Task } from '@/entities/task/model/Task.types';
import { taskStore } from '@/entities/task/model/TaskStore';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

const Home = observer(() => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addingChildToTaskId, setAddingChildToTaskId] = useState<string | null>(null);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditTaskById = (taskId: string) => {
    const task = taskStore.findTaskById(taskId);
    if (task) {
      handleEditTask(task);
    }
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
    setIsEditModalOpen(false);
  };

  const handleAddChild = (parentId: string) => {
    setAddingChildToTaskId(parentId);
    setIsAddChildModalOpen(true);
  };

  const handleCloseAddChildModal = () => {
    setAddingChildToTaskId(null);
    setIsAddChildModalOpen(false);
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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
                <p className="text-muted-foreground text-sm">
                  Organize your tasks in a hierarchical structure
                </p>
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
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        task={editingTask || undefined}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      />

      {/* Add Child Task Modal */}
      <EditTaskModal
        isOpen={isAddChildModalOpen}
        onClose={handleCloseAddChildModal}
        parentId={addingChildToTaskId || undefined}
        title="Add Subtask"
      />
    </div>
  );
});

export default Home;
