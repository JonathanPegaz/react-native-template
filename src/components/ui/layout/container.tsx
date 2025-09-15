import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

const containerVariants = tv({
  base: 'flex-1',
  variants: {
    padding: {
      none: '',
      xs: 'px-2',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
      xl: 'px-12',
    },
    maxWidth: {
      none: '',
      xs: 'mx-auto max-w-xs',
      sm: 'mx-auto max-w-sm',
      md: 'mx-auto max-w-md',
      lg: 'mx-auto max-w-lg',
      xl: 'mx-auto max-w-xl',
      '2xl': 'mx-auto max-w-2xl',
      '3xl': 'mx-auto max-w-3xl',
      '4xl': 'mx-auto max-w-4xl',
      '5xl': 'mx-auto max-w-5xl',
      '6xl': 'mx-auto max-w-6xl',
      '7xl': 'mx-auto max-w-7xl',
      full: 'w-full',
    },
    center: {
      true: 'items-center justify-center',
      false: '',
    },
    safe: {
      true: '',
      false: '',
      top: '',
      bottom: '',
      horizontal: '',
    },
  },
  compoundVariants: [
    {
      safe: true,
      class: 'pt-safe-top pb-safe-bottom px-safe-left pr-safe-right',
    },
    {
      safe: 'top',
      class: 'pt-safe-top',
    },
    {
      safe: 'bottom',
      class: 'pb-safe-bottom',
    },
    {
      safe: 'horizontal',
      class: 'px-safe-left pr-safe-right',
    },
  ],
  defaultVariants: {
    padding: 'md',
    maxWidth: 'none',
    center: false,
    safe: false,
  },
});

export interface ContainerProps extends Omit<ViewProps, 'children'> {
  /**
   * Container padding
   */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Maximum width constraint
   */
  maxWidth?:
    | 'none'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';
  /**
   * Center content vertically and horizontally
   */
  center?: boolean;
  /**
   * Apply safe area insets
   */
  safe?: boolean | 'top' | 'bottom' | 'horizontal';
  /**
   * Children elements
   */
  children?: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
}

export const Container = React.forwardRef<View, ContainerProps>(
  (
    {
      padding = 'md',
      maxWidth = 'none',
      center = false,
      safe = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const containerStyles = React.useMemo(
      () => containerVariants({ padding, maxWidth, center, safe }),
      [padding, maxWidth, center, safe]
    );

    return (
      <View ref={ref} className={cn(containerStyles, className)} {...props}>
        {children}
      </View>
    );
  }
);

Container.displayName = 'Container';

// Preset components for common use cases
export const ContainerCenter = React.forwardRef<
  View,
  Omit<ContainerProps, 'center'>
>((props, ref) => <Container ref={ref} center {...props} />);

export const ContainerSafe = React.forwardRef<
  View,
  Omit<ContainerProps, 'safe'>
>((props, ref) => <Container ref={ref} safe {...props} />);

export const ContainerFullWidth = React.forwardRef<
  View,
  Omit<ContainerProps, 'maxWidth'>
>((props, ref) => <Container ref={ref} maxWidth="full" {...props} />);

export const ContainerConstrained = React.forwardRef<
  View,
  Omit<ContainerProps, 'maxWidth'>
>((props, ref) => <Container ref={ref} maxWidth="2xl" {...props} />);

export const ContainerNoPadding = React.forwardRef<
  View,
  Omit<ContainerProps, 'padding'>
>((props, ref) => <Container ref={ref} padding="none" {...props} />);

// Set display names
ContainerCenter.displayName = 'ContainerCenter';
ContainerSafe.displayName = 'ContainerSafe';
ContainerFullWidth.displayName = 'ContainerFullWidth';
ContainerConstrained.displayName = 'ContainerConstrained';
ContainerNoPadding.displayName = 'ContainerNoPadding';
