import { Badge } from '@/shared/ui/badge';
import { CheckCircle, Circle, Clock, Pause } from 'lucide-react';
import { TaskCompletionStatus } from '@/entities/task/model/Task.types';

interface StatusBadgeProps {
  status: TaskCompletionStatus;
  className?: string;
}

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  switch (status) {
    case TaskCompletionStatus.TODO:
      return (
        <Badge 
          variant="secondary" 
          className={`border-gray-200/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-200 bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors duration-200 ${className}`}
        >
          <Circle className="h-3 w-3 mr-1" />
          To&nbsp;Do
        </Badge>
      );
    case TaskCompletionStatus.IN_PROGRESS:
      return (
        <Badge 
          variant="default" 
          className={`border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-200 bg-blue-50/80 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors duration-200 ${className}`}
        >
          <Clock className="h-3 w-3 mr-1" />
          In&nbsp;Progress
        </Badge>
      );
    case TaskCompletionStatus.COMPLETED:
      return (
        <Badge 
          variant="secondary" 
          className={`border-green-200/50 dark:border-green-700/50 text-green-700 dark:text-green-200 bg-green-50/80 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors duration-200 ${className}`}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case TaskCompletionStatus.PAUSED:
      return (
        <Badge 
          variant="outline" 
          className={`border-orange-200/50 dark:border-orange-700/50 text-orange-700 dark:text-orange-200 bg-orange-50/80 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-800/50 transition-colors duration-200 ${className}`}
        >
          <Pause className="h-3 w-3 mr-1" />
          Paused
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          Unknown Status
        </Badge>
      );
  }
};

export default StatusBadge;
