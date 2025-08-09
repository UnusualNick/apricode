import { TaskPriority, TaskCompletionStatus } from '@/entities/task/model/Task.types';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';

interface TypedBadgeProps {
  parameter: TaskPriority | TaskCompletionStatus | boolean;
  className?: string;
  type?: 'priority' | 'status' | 'completion';
}

const TypedBadge = ({ parameter, className = "", type }: TypedBadgeProps) => {
  // Smart type detection using enum values
  if (!type) {
    if (typeof parameter === 'boolean') {
      type = 'completion';
    } else if (Object.values(TaskPriority).includes(parameter as TaskPriority)) {
      type = 'priority';
    } else if (Object.values(TaskCompletionStatus).includes(parameter as TaskCompletionStatus)) {
      type = 'status';
    }
  }

  // Type-safe downcasting and component selection
  switch (type) {
    case 'priority':
      return <PriorityBadge priority={parameter as TaskPriority} className={className} />;
    
    case 'status':
      return <StatusBadge status={parameter as TaskCompletionStatus} className={className} />;
    
    case 'completion':
      const completionStatus = parameter as boolean ? TaskCompletionStatus.COMPLETED : TaskCompletionStatus.IN_PROGRESS;
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
