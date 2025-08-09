'use client';

import React, { useState, useEffect } from 'react';
import { taskStore } from '@/entities/task/model/TaskStore';
import { Task, TaskFormData, TaskPriority } from '@/entities/task/model/Task.types';
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

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  parentId,
  title = 'Edit Task',
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || '',
          priority: task.priority,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
        });
      }
    }
  }, [isOpen, task]);

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (task) {
        // Update existing task
        taskStore.updateTask(task.id, {
          title: formData.title.trim(),
          description: formData.description?.trim() || undefined,
        });
      } else {
        // Create new task
        taskStore.addTask(
          {
            title: formData.title.trim(),
            description: formData.description?.trim() || undefined,
            priority: formData.priority,
          },
          parentId
        );
      }

      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSubmitting(false);
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
                value={formData.title}
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
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter task description (optional)..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: TaskPriority) => handleInputChange('priority', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center">
                      <TypedBadge 
                        parameter={formData.priority}
                        type="priority"
                        className="scale-90"
                      />
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center">
                        <TypedBadge 
                          parameter={priority}
                          type="priority"
                          className="scale-90"
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : task ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
