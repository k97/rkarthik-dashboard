'use client';

import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WidgetProps {
  children: ReactNode;
  className?: string;
  /** For drag handle functionality */
  isDragging?: boolean;
}

export const Widget = forwardRef<HTMLDivElement, WidgetProps>(
  ({ children, className, isDragging }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-card rounded-[2.5rem] shadow-[var(--widget-shadow)]',
          'border border-gray-200',
          'transition-shadow duration-200',
          'h-full w-full px-6 py-4',
          'relative',
          isDragging && 'shadow-lg opacity-90',
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Widget.displayName = 'Widget';

interface WidgetHeaderProps {
  children: ReactNode;
  className?: string;
}

export function WidgetHeader({ children, className }: WidgetHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      {children}
    </div>
  );
}

interface WidgetTitleProps {
  children: ReactNode;
  className?: string;
}

export function WidgetTitle({ children, className }: WidgetTitleProps) {
  return (
    <h3 className={cn('text-card-foreground text-sm font-medium', className)}>
      {children}
    </h3>
  );
}

interface WidgetContentProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function WidgetContent({ children, className, onClick }: WidgetContentProps) {
  return <div className={cn('', className)} onClick={onClick}>{children}</div>;
}
