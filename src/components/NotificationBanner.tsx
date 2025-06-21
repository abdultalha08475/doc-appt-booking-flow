
import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBannerProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onDismiss?: () => void;
  className?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  type = 'info',
  onDismiss,
  className,
}) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className={cn(
      'border rounded-md p-4 flex items-center justify-between',
      typeStyles[type],
      className
    )}>
      <p className="text-sm font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
