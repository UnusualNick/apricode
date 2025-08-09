import { TaskPriority } from '@/entities/task/model/Task.types';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'paused';

// Define the enums for type checking similar to your example
const TaskPriorityValues = {
  low: 'low',
  medium: 'medium', 
  high: 'high',
  urgent: 'urgent'
} as const;

const TaskStatusValues = {
  todo: 'todo',
  'in-progress': 'in-progress',
  completed: 'completed',
  paused: 'paused'
} as const;

interface TypedBadgeProps {
  parameter: TaskPriority | TaskStatus | boolean;
  className?: string;
  type?: 'priority' | 'status' | 'completion';
}

const TypedBadge = ({ parameter, className = "", type }: TypedBadgeProps) => {
  // Smart type detection similar to your implementation
  if (!type) {
    if (typeof parameter === 'boolean') {
      type = 'completion';
    } else if (Object.values(TaskPriorityValues).includes(parameter as TaskPriority)) {
      type = 'priority';
    } else if (Object.values(TaskStatusValues).includes(parameter as TaskStatus)) {
      type = 'status';
    }
  }

  // Type-safe downcasting and component selection
  switch (type) {
    case 'priority':
      return <PriorityBadge priority={parameter as TaskPriority} className={className} />;
    
    case 'status':
      return <StatusBadge status={parameter as TaskStatus} className={className} />;
    
    case 'completion':
      const completionStatus = parameter as boolean ? 'completed' : 'in-progress';
      return <StatusBadge status={completionStatus} className={className} />;
    
    default:
      return (
        <div className={`px-2 py-1 text-xs text-muted-foreground border rounded ${className}`}>
          Unknown Badge: {String(parameter)}
        </div>
      );
  }
};

export default TypedBadge;
