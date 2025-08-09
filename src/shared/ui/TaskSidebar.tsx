'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Trash2, Home } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { TaskTree } from '@/entities/task/ui/TaskTree';
import { AddTaskButton } from '@/features/taskActions/ui/AddTaskButton';
import { Task } from '@/entities/task/model/Task.types';
import { taskStore } from '@/entities/task/model/TaskStore';

interface TaskSidebarProps {
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddChild?: (parentId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export const TaskSidebar: React.FC<TaskSidebarProps> = observer(({
  onEdit,
  onDelete,
  onAddChild,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentWidthRef = useRef(taskStore.sidebarWidth);

  const minWidth = 280;
  const maxWidth = 800;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    currentWidthRef.current = taskStore.sidebarWidth;
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    // Cancel previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Throttle updates using requestAnimationFrame
    animationFrameRef.current = requestAnimationFrame(() => {
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        currentWidthRef.current = newWidth;
        
        // Directly update DOM instead of React state during drag
        if (sidebarRef.current) {
          sidebarRef.current.style.width = `${newWidth}px`;
        }
      }
    });
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Update React state at the end of resize
    taskStore.setSidebarWidth(currentWidthRef.current);
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
      
      // Cleanup animation frame on unmount or when resizing stops
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const clearAllTasks = useCallback(() => {
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
      taskStore.clearAllTasks();
    }
  }, []);

  const populateWithMockData = useCallback(() => {
    taskStore.populateWithMockData();
  }, []);

  // Memoize the content to prevent re-renders during resize
  const sidebarContent = useMemo(() => (
    !isCollapsed && (
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
    )
  ), [isCollapsed, onEdit, onDelete, onAddChild, populateWithMockData, clearAllTasks]);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`relative transition-all duration-300 ${
          isCollapsed ? 'w-0' : 'w-auto'
        } border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden ${
          isResizing ? 'transition-none' : ''
        }`}
        style={!isCollapsed ? { width: `${taskStore.sidebarWidth}px` } : {}}
      >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b h-[73px]">
          {!isCollapsed && (
            <div className="flex items-center gap-2 flex-1">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <AddTaskButton variant="ghost" size="sm" />
            </div>
          )}
        </div>

        {/* Task List */}
        {sidebarContent}
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
});
