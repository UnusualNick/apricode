'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { Task } from '../model/Task.types';
import { taskStore } from '../model/TaskStore';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  level?: number;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddChild?: (parentId: string) => void;
}

export const TaskItem = observer(({
  task,
  level = 0,
  onEdit,
  onDelete,
  onAddChild,
}: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = task.children && task.children.length > 0;
  const isSelected = taskStore.selectedTaskId === task.id;

  const handleToggle = () => {
    taskStore.toggleTask(task.id);
  };

  const handleSelect = () => {
    taskStore.selectTask(task.id);
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddChild = () => {
    onAddChild?.(task.id);
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    onDelete?.(task.id);
  };

  return (
    <div className="w-full">
      <div
        className={`
          flex items-center gap-2 p-2 rounded-md border transition-colors
          ${isSelected ? 'bg-accent border-accent-foreground/20' : 'hover:bg-muted/50 border-transparent'}
          ${task.completed ? 'opacity-60' : ''}
        `}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            handleExpand();
          }}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>

        {/* Checkbox */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => {
            if (checked !== task.completed) {
              handleToggle();
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Task Title */}
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.title}
          </span>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {task.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleAddChild();
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Children Tasks */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {task.children?.map((child) => (
            <TaskItem
              key={child.id}
              task={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
});
