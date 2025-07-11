
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = 'md', className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

interface PageLoadingProps {
  text?: string;
}

export const PageLoading = ({ text = 'Loading...' }: PageLoadingProps) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  </div>
);

export const CardLoading = ({ text }: { text?: string }) => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center space-y-2">
      <LoadingSpinner />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  </div>
);
