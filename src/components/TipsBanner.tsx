
import React from 'react';
import { cn } from '@/lib/utils';

interface TipsBannerProps {
  message: string;
  className?: string;
}

const TipsBanner: React.FC<TipsBannerProps> = ({ message, className }) => {
  return (
    <div className={cn(
      'bg-amber-50 border border-amber-200 rounded-md p-4',
      'flex items-start space-x-3',
      className
    )}>
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-amber-800">{message}</p>
      </div>
    </div>
  );
};

export default TipsBanner;
