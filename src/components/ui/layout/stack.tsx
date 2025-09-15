import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

const stackVariants = tv({
  base: 'flex',
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
    gap: {
      none: '',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-10',
      '3xl': 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
    flex: {
      none: '',
      '1': 'flex-1',
      auto: 'flex-auto',
      initial: 'flex-initial',
    },
  },
  defaultVariants: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
    flex: 'none',
  },
});

export interface StackProps extends Omit<ViewProps, 'children'> {
  /**
   * Stack direction
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Gap between items
   */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /**
   * Cross-axis alignment
   */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /**
   * Main-axis alignment
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /**
   * Whether items should wrap
   */
  wrap?: boolean;
  /**
   * Flex behavior
   */
  flex?: 'none' | '1' | 'auto' | 'initial';
  /**
   * Children elements
   */
  children?: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
}

export const Stack = React.forwardRef<View, StackProps>(
  (
    {
      direction = 'column',
      gap = 'md',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      flex = 'none',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const stackStyles = React.useMemo(
      () => stackVariants({ direction, gap, align, justify, wrap, flex }),
      [direction, gap, align, justify, wrap, flex]
    );

    return (
      <View ref={ref} className={cn(stackStyles, className)} {...props}>
        {children}
      </View>
    );
  }
);

Stack.displayName = 'Stack';

// Preset components for common use cases
export const HStack = React.forwardRef<View, Omit<StackProps, 'direction'>>(
  (props, ref) => <Stack ref={ref} direction="row" {...props} />
);

export const VStack = React.forwardRef<View, Omit<StackProps, 'direction'>>(
  (props, ref) => <Stack ref={ref} direction="column" {...props} />
);

export const StackCenter = React.forwardRef<
  View,
  Omit<StackProps, 'align' | 'justify'>
>((props, ref) => (
  <Stack ref={ref} align="center" justify="center" {...props} />
));

export const StackSpaceBetween = React.forwardRef<
  View,
  Omit<StackProps, 'justify'>
>((props, ref) => <Stack ref={ref} justify="between" {...props} />);

export const StackWrap = React.forwardRef<View, Omit<StackProps, 'wrap'>>(
  (props, ref) => <Stack ref={ref} wrap {...props} />
);

export const StackFlex = React.forwardRef<View, Omit<StackProps, 'flex'>>(
  (props, ref) => <Stack ref={ref} flex="1" {...props} />
);

// Set display names
HStack.displayName = 'HStack';
VStack.displayName = 'VStack';
StackCenter.displayName = 'StackCenter';
StackSpaceBetween.displayName = 'StackSpaceBetween';
StackWrap.displayName = 'StackWrap';
StackFlex.displayName = 'StackFlex';
