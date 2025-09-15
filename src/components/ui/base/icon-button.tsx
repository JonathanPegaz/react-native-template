import * as React from 'react';
import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

const iconButtonVariants = tv({
  base: [
    'flex items-center justify-center rounded-full',
    'disabled:pointer-events-none disabled:opacity-50',
    'transition-all duration-200',
  ],
  variants: {
    variant: {
      default: 'bg-primary-500 active:bg-primary-600',
      secondary:
        'bg-neutral-100 active:bg-neutral-200 dark:bg-neutral-800 dark:active:bg-neutral-700',
      outline:
        'border border-neutral-300 bg-transparent active:bg-neutral-50 dark:border-neutral-600 dark:active:bg-neutral-800',
      ghost: 'bg-transparent active:bg-neutral-100 dark:active:bg-neutral-800',
      danger: 'bg-red-500 active:bg-red-600',
    },
    size: {
      sm: 'size-8',
      md: 'size-10',
      lg: 'size-12',
      xl: 'size-14',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  /**
   * Icon component to render inside the button
   */
  icon: React.ReactNode;
  /**
   * Button visual variant
   */
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /**
   * Button size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Custom class name for additional styling
   */
  className?: string;
  /**
   * Accessibility label for screen readers
   */
  accessibilityLabel?: string;
}

export const IconButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  IconButtonProps
>(
  (
    {
      icon,
      variant = 'default',
      size = 'md',
      disabled = false,
      className,
      accessibilityLabel,
      ...props
    },
    ref
  ) => {
    const buttonStyle = React.useMemo(
      () => iconButtonVariants({ variant, size }),
      [variant, size]
    );

    return (
      <Pressable
        ref={ref}
        className={cn(buttonStyle, className)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        {...props}
      >
        {icon}
      </Pressable>
    );
  }
);

IconButton.displayName = 'IconButton';
