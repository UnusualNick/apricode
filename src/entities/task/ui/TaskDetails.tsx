'use client';

import React from 'react';
import { observer } from 'mobx-react-lite';
import { taskStore } from '@/entities/task/model/TaskStore';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import TypedBadge from '@/shared/ui/badges/TypedBadge';
import { Calendar, Clock, CheckCircle, Circle, Plus, Edit, Trash2 } from 'lucide-react';
import { AddTaskButton } from '@/features/taskActions/ui/AddTaskButton';
import { DeleteTaskButton } from '@/features/taskActions/ui/DeleteTaskButton';

interface TaskDetailsProps {
  onEdit?: (taskId: string) => void;
  onAddChild?: (parentId: string) => void;
}

export const TaskDetails = observer(({ onEdit, onAddChild }: TaskDetailsProps) => {
  const selectedTask = taskStore.selectedTask;

  if (!selectedTask) {
    return (
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        <div className="text-center py-8">
          <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Select a task to view details
          </p>
        </div>
      </div>
    );
  }

  const childrenCount = selectedTask.children?.length || 0;
  const completedChildren = selectedTask.children?.filter(child => child.completed).length || 0;
  const hasChildren = childrenCount > 0;

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Task Details</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(selectedTask.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <DeleteTaskButton
            taskId={selectedTask.id}
            taskTitle={selectedTask.title}
            variant="ghost"
            size="sm"
          />
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <TypedBadge 
          parameter={selectedTask.completed}
          type="completion"
        />
        
        <TypedBadge 
          parameter={selectedTask.priority}
          type="priority"
        />
      </div>

      {/* Task Title */}
      <div>
        <h3 className="font-semibold text-lg mb-2 break-words leading-tight">
          {selectedTask.title}
        </h3>
        {selectedTask.description && (
          <p className="text-muted-foreground text-sm break-words leading-relaxed">
            {selectedTask.description}
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created: {new Date(selectedTask.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Updated: {new Date(selectedTask.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Children Summary */}
      {hasChildren && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Subtasks</h4>
            <Badge variant="outline">
              {completedChildren}/{childrenCount}
            </Badge>
          </div>
          
          <div className="space-y-1">
            {selectedTask.children?.slice(0, 3).map((child) => (
              <div 
                key={child.id}
                className="flex items-center gap-2 p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted"
                onClick={() => taskStore.navigateToTask(child.id)}
              >
                <div className={`w-2 h-2 rounded-full ${child.completed ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className={`text-sm flex-1 ${child.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {child.title.length > 30 ? `${child.title.substring(0, 30)}...` : child.title}
                </span>
              </div>
            ))}
            
            {childrenCount > 3 && (
              <p className="text-xs text-muted-foreground text-center py-1">
                and {childrenCount - 3} more subtasks...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 border-t space-y-2">
        <AddTaskButton
          parentId={selectedTask.id}
          variant="outline"
          size="sm"
          className="w-full justify-start"
        />
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onEdit?.(selectedTask.id)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Task
        </Button>
      </div>
    </div>
  );
});
