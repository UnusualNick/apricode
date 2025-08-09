'use client';

import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Task } from '../model/Task.types';
import { taskStore } from '../model/TaskStore';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import TypedBadge from '@/shared/ui/badges/TypedBadge';
import { DeleteTaskButton } from '@/features/taskActions/ui/DeleteTaskButton';

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
  const taskRef = useRef<HTMLDivElement>(null);
  const hasChildren = task.children && task.children.length > 0;
  const isSelected = taskStore.selectedTaskId === task.id;
  const isExpanded = taskStore.isTaskExpanded(task.id);
  
  // Auto-scroll to task when it becomes selected
  useEffect(() => {
    if (isSelected && taskRef.current) {
      taskRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isSelected]);
  
  // Limit nesting indentation to prevent UI breaking
  const maxIndentLevel = 5;
  const actualLevel = Math.min(level, maxIndentLevel);
  const indentationPx = actualLevel * 20; // Reduced from 24px

  const handleToggleExpansion = () => {
    taskStore.toggleTaskExpansion(task.id);
  };

  const handleToggle = () => {
    taskStore.toggleTask(task.id);
  };

  const handleSelect = () => {
    taskStore.navigateToTask(task.id);
  };

  const handleAddChild = () => {
    onAddChild?.(task.id);
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  return (
    <div className="w-full group">
      <div
        ref={taskRef}
        className={`
          flex items-center gap-2 p-2 rounded-md border transition-all duration-200 cursor-pointer
          ${isSelected ? 'bg-primary/10 border-primary/30 shadow-sm' : 'hover:bg-muted/50 border-transparent hover:border-border/50'}
          ${task.completed ? 'opacity-70' : ''}
          ${level > maxIndentLevel ? 'bg-muted/30' : ''}
        `}
        style={{ marginLeft: `${indentationPx}px` }}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpansion();
          }}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )
          ) : (
            <div className="h-3 w-3" />
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
          className="shrink-0"
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0 mr-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm leading-tight break-words ${
                  task.completed ? 'line-through text-muted-foreground' : ''
                }`}
                title={task.title} // Tooltip for full title
              >
                {task.title}
              </p>
              
              {/* Priority Badge */}
              <div className="flex items-center gap-2 mt-1">
                <TypedBadge 
                  parameter={task.priority}
                  type="priority"
                  className="text-xs px-1.5 py-0.5"
                />
              </div>
              
              {task.description && (
                <p 
                  className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words"
                  title={task.description} // Tooltip for full description
                >
                  {task.description}
                </p>
              )}
            </div>
            
            {/* Task metadata - vertically centered */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              {hasChildren && (
                <span className="bg-muted px-1.5 py-0.5 rounded-full">
                  {task.children!.length}
                </span>
              )}
              {level > maxIndentLevel && (
                <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-xs">
                  L{level}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              handleAddChild();
            }}
            title="Add subtask"
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
            title="Edit task"
          >
            <Edit className="h-3 w-3" />
          </Button>
          
          <DeleteTaskButton
            taskId={task.id}
            taskTitle={task.title}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            showIcon={true}
          />
        </div>
      </div>

      {/* Children Tasks */}
      {hasChildren && isExpanded && (
        <div className="ml-1">
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
