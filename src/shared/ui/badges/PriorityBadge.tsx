import { TaskPriority } from '@/entities/task/model/Task.types';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, Flag, Info, Zap } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

const PriorityBadge = ({ priority, className = "" }: PriorityBadgeProps) => {
  switch (priority) {
    case 'low':
      return (
        <Badge 
          variant="secondary" 
          className={`border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors duration-200 ${className}`}
        >
          <Info className="h-3 w-3 mr-1" />
          Low
        </Badge>
      );
    case 'medium':
      return (
        <Badge 
          variant="default" 
          className={`border-yellow-200/50 dark:border-yellow-700/50 text-yellow-700 dark:text-yellow-200 bg-yellow-50/80 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition-colors duration-200 ${className}`}
        >
          <Flag className="h-3 w-3 mr-1" />
          Medium
        </Badge>
      );
    case 'high':
      return (
        <Badge 
          variant="secondary" 
          className={`border-orange-200/50 dark:border-orange-700/50 text-orange-700 dark:text-orange-200 bg-orange-50/80 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-800/50 transition-colors duration-200 ${className}`}
        >
          <Zap className="h-3 w-3 mr-1" />
          High
        </Badge>
      );
    case 'urgent':
      return (
        <Badge 
          variant="secondary" 
          className={`border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-200 bg-red-50/80 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-800/50 transition-colors duration-200 ${className}`}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Urgent
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          Unknown Priority
        </Badge>
      );
  }
};

export default PriorityBadge;
