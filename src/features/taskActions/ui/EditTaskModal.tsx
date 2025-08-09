'use client';

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { taskStore } from '@/entities/task/model/TaskStore';
import { Task, TaskFormData, TaskPriority, TaskCompletionStatus } from '@/entities/task/model/Task.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import TypedBadge from '@/shared/ui/badges/TypedBadge';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  parentId?: string;
  title?: string;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = observer(({
  isOpen,
  onClose,
  task,
  parentId,
  title = 'Edit Task',
}) => {
  // Initialize form data when modal opens or task changes
  useEffect(() => {
    if (isOpen && task) {
      // Form data is already set by taskStore.openEditModal
    }
  }, [isOpen, task]);

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    taskStore.updateFormData(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskStore.taskFormData.title.trim()) {
      return;
    }

    taskStore.setIsSubmitting(true);

    try {
      if (task) {
        // Update existing task
        taskStore.updateTask(task.id, {
          title: taskStore.taskFormData.title.trim(),
          description: taskStore.taskFormData.description?.trim() || undefined,
          priority: taskStore.taskFormData.priority,
          completionStatus: taskStore.taskFormData.completionStatus,
        });
      } else {
        // Create new task
        taskStore.addTask(
          {
            title: taskStore.taskFormData.title.trim(),
            description: taskStore.taskFormData.description?.trim() || undefined,
            priority: taskStore.taskFormData.priority,
            completionStatus: taskStore.taskFormData.completionStatus,
          },
          parentId
        );
      }

      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      taskStore.setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={taskStore.taskFormData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter task title..."
                required
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={taskStore.taskFormData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter task description (optional)..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={taskStore.taskFormData.priority} onValueChange={(value: TaskPriority) => handleInputChange('priority', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center">
                      <TypedBadge 
                        parameter={taskStore.taskFormData.priority}
                        type="priority"
                        className="scale-90 transform-none"
                      />
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskPriority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center">
                        <TypedBadge 
                          parameter={priority}
                          type="priority"
                          className="scale-90 transform-none"
                        />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="completionStatus">Completion Status</Label>
              <Select value={taskStore.taskFormData.completionStatus} onValueChange={(value: TaskCompletionStatus) => handleInputChange('completionStatus', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center">
                      <TypedBadge 
                        parameter={taskStore.taskFormData.completionStatus}
                        type="status"
                        className="scale-90 transform-none"
                      />
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskCompletionStatus).map((completionStatus) => (
                    <SelectItem key={completionStatus} value={completionStatus}>
                      <div className="flex items-center">
                        <TypedBadge 
                          parameter={completionStatus}
                          type="status"
                          className="scale-90 transform-none"
                        />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={taskStore.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!taskStore.taskFormData.title.trim() || taskStore.isSubmitting}
            >
              {taskStore.isSubmitting ? 'Saving...' : task ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});
