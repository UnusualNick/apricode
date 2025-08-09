'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import { EditTaskModal } from './EditTaskModal';

interface AddTaskButtonProps {
  parentId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({
  parentId,
  variant = 'default',
  size = 'default',
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleOpenModal}
      >
        <Plus className="h-4 w-4 mr-2" />
        {parentId ? 'Add Subtask' : 'Add Task'}
      </Button>

      <EditTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        parentId={parentId}
        title={parentId ? 'Add New Subtask' : 'Add New Task'}
      />
    </>
  );
};
