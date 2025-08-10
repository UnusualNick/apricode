'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
        {size !== 'sm' && !showIcon && t('delete')}
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={handleCloseConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('deleteTask')}</DialogTitle>
            <DialogDescription>
              {t('deleteTaskConfirm', { title: taskTitle })}
              {(taskStore.findTaskById(taskId)?.children?.length || 0) > 0 && (
                <span className="block mt-2 font-medium">
                  {t('deleteTaskWithSubtasks')}
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
              {t('cancel')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('deleting') : t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
