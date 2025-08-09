'use client';

import React, { useState } from 'react';
import { TaskTree } from '@/entities/task/ui/TaskTree';
import { AddTaskButton } from '@/features/taskActions/ui/AddTaskButton';
import { EditTaskModal } from '@/features/taskActions/ui/EditTaskModal';
import { DeleteTaskButton } from '@/features/taskActions/ui/DeleteTaskButton';
import { Task } from '@/entities/task/model/Task.types';

export default function Home() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addingChildToTaskId, setAddingChildToTaskId] = useState<string | null>(null);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
              <p className="text-muted-foreground">
                Organize your tasks in a hierarchical structure
              </p>
            </div>
            <AddTaskButton />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task List */}
            <div className="lg:col-span-2">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Tasks</h2>
                  <AddTaskButton variant="outline" size="sm" />
                </div>
                <TaskTree
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onAddChild={handleAddChild}
                />
              </div>
            </div>

            {/* Task Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Task Details</h2>
                <p className="text-muted-foreground text-sm">
                  Select a task to view details
                </p>
                {/* This will be implemented later for the detailed view */}
              </div>
            </div>
          </div>
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
}
