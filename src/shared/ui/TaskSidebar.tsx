'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight, Trash2, Home } from 'lucide-react';
import { TaskTree } from '@/entities/task/ui/TaskTree';
import { AddTaskButton } from '@/features/taskActions/ui/AddTaskButton';
import { Task } from '@/entities/task/model/Task.types';
import { taskStore } from '@/entities/task/model/TaskStore';

interface TaskSidebarProps {
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddChild?: (parentId: string) => void;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = ({
  onEdit,
  onDelete,
  onAddChild,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const minWidth = 280;
  const maxWidth = 800;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const clearAllTasks = () => {
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      taskStore.clearAllTasks();
    }
  };

  const populateWithMockData = () => {
    taskStore.populateWithMockData();
  };

  return (
    <>
      {/* External Toggle Button - Shows when sidebar is collapsed */}
      {isCollapsed && (
        <div className="fixed top-[5.5rem] left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0 bg-background shadow-md border border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        ref={sidebarRef}
        className={`relative transition-all duration-300 ${
          isCollapsed ? 'w-0' : 'w-auto'
        } border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden`}
        style={!isCollapsed ? { width: `${sidebarWidth}px` } : {}}
      >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2 flex-1">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <AddTaskButton variant="ghost" size="sm" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="shrink-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Task List */}
        {!isCollapsed && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <AddTaskButton variant="outline" size="sm" className="w-full" />
              </div>
              
              {/* Control Buttons */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={populateWithMockData}
                  className="flex-1 text-xs"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Mock Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllTasks}
                  className="flex-1 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              </div>
              
              <TaskTree
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
              />
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-border transition-colors"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
    </>
  );
};
