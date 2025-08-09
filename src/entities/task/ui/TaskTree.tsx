'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { taskStore } from '../model/TaskStore';
import { TaskItem } from './TaskItem';
import { Task } from '../model/Task.types';

interface TaskTreeProps {
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddChild?: (parentId: string) => void;
}

export const TaskTree = observer(({
  onEdit,
  onDelete,
  onAddChild,
}: TaskTreeProps) => {
  if (taskStore.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    );
  }

  if (taskStore.error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Error: {taskStore.error}</div>
      </div>
    );
  }

  if (taskStore.rootTasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">No tasks yet. Create your first task!</div>
      </div>
    );
  }

  return (
    <div className="space-y-1 group">
      {taskStore.rootTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
});
