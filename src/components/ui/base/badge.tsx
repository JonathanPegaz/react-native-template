import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Text } from './text';

const badgeVariants = tv({
  slots: {
    root: 'flex-row items-center justify-center rounded-full px-2.5 py-0.5',
    text: 'text-xs font-medium leading-none',
  },
  variants: {
    variant: {
      default: {
        root: 'bg-primary-500',
        text: 'text-white',
      },
      success: {
        root: 'bg-green-500',
        text: 'text-white',
      },
      warning: {
        root: 'bg-yellow-500',
        text: 'text-black',
      },
      danger: {
        root: 'bg-red-500',
        text: 'text-white',
      },
      info: {
        root: 'bg-blue-500',
        text: 'text-white',
      },
      outline: {
        root: 'border border-neutral-300 bg-transparent dark:border-neutral-600',
        text: 'text-neutral-900 dark:text-neutral-100',
      },
      secondary: {
        root: 'bg-neutral-100 dark:bg-neutral-800',
        text: 'text-neutral-900 dark:text-neutral-100',
      },
    },
    size: {
      sm: {
        root: 'px-1.5 py-0.5',
        text: 'text-xs',
      },
      md: {
        root: 'px-2.5 py-0.5',
        text: 'text-xs',
      },
      lg: {
        root: 'px-3 py-1',
        text: 'text-sm',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface BadgeProps extends Omit<ViewProps, 'children'> {
  /**
   * Badge text content
   */
  label: string;
  /**
   * Badge visual variant
   */
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'outline'
    | 'secondary';
  /**
   * Badge size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom class name for additional styling
   */
  className?: string;
  /**
   * Custom text class name
   */
  textClassName?: string;
}

export const Badge = React.forwardRef<View, BadgeProps>(
  (
    {
      label,
      variant = 'default',
      size = 'md',
      className,
      textClassName,
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => badgeVariants({ variant, size }),
      [variant, size]
    );

    return (
      <View ref={ref} className={cn(styles.root(), className)} {...props}>
        <Text className={cn(styles.text(), textClassName)}>{label}</Text>
      </View>
    );
  }
);

Badge.displayName = 'Badge';
