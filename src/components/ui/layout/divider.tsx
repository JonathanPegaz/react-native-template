import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Text } from '../base/text';

const dividerVariants = tv({
  base: 'bg-neutral-200 dark:bg-neutral-700',
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
    variant: {
      solid: '',
      dashed: 'border-0 border-dashed',
      dotted: 'border-0 border-dotted',
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  compoundVariants: [
    // Horizontal sizes
    {
      orientation: 'horizontal',
      size: 'xs',
      class: 'h-px',
    },
    {
      orientation: 'horizontal',
      size: 'sm',
      class: 'h-0.5',
    },
    {
      orientation: 'horizontal',
      size: 'md',
      class: 'h-px',
    },
    {
      orientation: 'horizontal',
      size: 'lg',
      class: 'h-1',
    },
    {
      orientation: 'horizontal',
      size: 'xl',
      class: 'h-1.5',
    },
    // Vertical sizes
    {
      orientation: 'vertical',
      size: 'xs',
      class: 'w-px',
    },
    {
      orientation: 'vertical',
      size: 'sm',
      class: 'w-0.5',
    },
    {
      orientation: 'vertical',
      size: 'md',
      class: 'w-px',
    },
    {
      orientation: 'vertical',
      size: 'lg',
      class: 'w-1',
    },
    {
      orientation: 'vertical',
      size: 'xl',
      class: 'w-1.5',
    },
    // Dashed styles
    {
      variant: 'dashed',
      orientation: 'horizontal',
      class: 'border-t border-dashed bg-transparent',
    },
    {
      variant: 'dashed',
      orientation: 'vertical',
      class: 'border-l border-dashed bg-transparent',
    },
    // Dotted styles
    {
      variant: 'dotted',
      orientation: 'horizontal',
      class: 'border-t border-dotted bg-transparent',
    },
    {
      variant: 'dotted',
      orientation: 'vertical',
      class: 'border-l border-dotted bg-transparent',
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    size: 'md',
  },
});

const containerVariants = tv({
  base: 'flex items-center',
  variants: {
    orientation: {
      horizontal: 'w-full flex-row',
      vertical: 'h-full flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

const labelVariants = tv({
  base: 'bg-white text-sm font-medium text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400',
  variants: {
    orientation: {
      horizontal: 'px-3',
      vertical: 'py-2',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export interface DividerProps extends Omit<ViewProps, 'children'> {
  /**
   * Divider orientation
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Divider style variant
   */
  variant?: 'solid' | 'dashed' | 'dotted';
  /**
   * Divider thickness
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Label text to display in the middle
   */
  label?: string;
  /**
   * Label position
   */
  labelPosition?: 'start' | 'center' | 'end';
  /**
   * Custom class name
   */
  className?: string;
}

export const Divider = React.forwardRef<View, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'solid',
      size = 'md',
      label,
      labelPosition = 'center',
      className,
      ...props
    },
    ref
  ) => {
    const dividerStyles = React.useMemo(
      () => dividerVariants({ orientation, variant, size }),
      [orientation, variant, size]
    );

    const containerStyles = React.useMemo(
      () => containerVariants({ orientation }),
      [orientation]
    );

    const labelStyles = React.useMemo(
      () => labelVariants({ orientation }),
      [orientation]
    );

    // Simple divider without label
    if (!label) {
      return (
        <View ref={ref} className={cn(dividerStyles, className)} {...props} />
      );
    }

    // Divider with label
    const renderDividerLine = (flex?: boolean) => (
      <View
        className={cn(
          dividerStyles,
          flex && (orientation === 'horizontal' ? 'flex-1' : 'flex-1')
        )}
      />
    );

    return (
      <View ref={ref} className={cn(containerStyles, className)} {...props}>
        {labelPosition === 'start' ? (
          <>
            <Text className={labelStyles}>{label}</Text>
            {renderDividerLine(true)}
          </>
        ) : labelPosition === 'end' ? (
          <>
            {renderDividerLine(true)}
            <Text className={labelStyles}>{label}</Text>
          </>
        ) : (
          <>
            {renderDividerLine(true)}
            <Text className={labelStyles}>{label}</Text>
            {renderDividerLine(true)}
          </>
        )}
      </View>
    );
  }
);

Divider.displayName = 'Divider';

// Preset components for common use cases
export const HorizontalDivider = React.forwardRef<
  View,
  Omit<DividerProps, 'orientation'>
>((props, ref) => <Divider ref={ref} orientation="horizontal" {...props} />);

export const VerticalDivider = React.forwardRef<
  View,
  Omit<DividerProps, 'orientation'>
>((props, ref) => <Divider ref={ref} orientation="vertical" {...props} />);

export const DashedDivider = React.forwardRef<
  View,
  Omit<DividerProps, 'variant'>
>((props, ref) => <Divider ref={ref} variant="dashed" {...props} />);

export const DottedDivider = React.forwardRef<
  View,
  Omit<DividerProps, 'variant'>
>((props, ref) => <Divider ref={ref} variant="dotted" {...props} />);

export const DividerWithLabel = React.forwardRef<
  View,
  Omit<DividerProps, 'label'> & { label: string }
>(({ label, ...props }, ref) => <Divider ref={ref} label={label} {...props} />);

// Set display names
HorizontalDivider.displayName = 'HorizontalDivider';
VerticalDivider.displayName = 'VerticalDivider';
DashedDivider.displayName = 'DashedDivider';
DottedDivider.displayName = 'DottedDivider';
DividerWithLabel.displayName = 'DividerWithLabel';
