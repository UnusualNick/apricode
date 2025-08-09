'use client';

import React, { useState } from 'react';
import { taskStore } from '@/entities/task/model/TaskStore';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';
import { Trash2 } from 'lucide-react';

interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({
  taskId,
  taskTitle,
  variant = 'ghost',
  size = 'sm',
  className,
  showIcon = true,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      taskStore.deleteTask(taskId);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleOpenConfirm}
      >
        {showIcon && <Trash2 className="h-4 w-4" />}
        {size !== 'sm' && !showIcon && 'Delete'}
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={handleCloseConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{taskTitle}&quot;? This action cannot be undone.
              {taskStore.findTaskById(taskId)?.children?.length && (
                <span className="block mt-2 font-medium">
                  This will also delete all subtasks.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseConfirm}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
