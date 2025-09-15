import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

const skeletonVariants = tv({
  base: 'overflow-hidden bg-neutral-200 dark:bg-neutral-700',
  variants: {
    variant: {
      text: 'h-4 rounded',
      heading: 'h-6 rounded',
      box: 'rounded',
      circle: 'rounded-full',
      avatar: 'rounded-full',
      button: 'h-10 rounded-md',
      card: 'h-32 rounded-lg',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
      xl: '',
    },
  },
  compoundVariants: [
    // Text sizes
    {
      variant: 'text',
      size: 'sm',
      class: 'h-3',
    },
    {
      variant: 'text',
      size: 'md',
      class: 'h-4',
    },
    {
      variant: 'text',
      size: 'lg',
      class: 'h-5',
    },
    {
      variant: 'text',
      size: 'xl',
      class: 'h-6',
    },
    // Heading sizes
    {
      variant: 'heading',
      size: 'sm',
      class: 'h-5',
    },
    {
      variant: 'heading',
      size: 'md',
      class: 'h-6',
    },
    {
      variant: 'heading',
      size: 'lg',
      class: 'h-8',
    },
    {
      variant: 'heading',
      size: 'xl',
      class: 'h-10',
    },
    // Avatar/Circle sizes
    {
      variant: ['avatar', 'circle'],
      size: 'sm',
      class: 'size-8',
    },
    {
      variant: ['avatar', 'circle'],
      size: 'md',
      class: 'size-12',
    },
    {
      variant: ['avatar', 'circle'],
      size: 'lg',
      class: 'size-16',
    },
    {
      variant: ['avatar', 'circle'],
      size: 'xl',
      class: 'size-20',
    },
    // Box sizes
    {
      variant: 'box',
      size: 'sm',
      class: 'size-16',
    },
    {
      variant: 'box',
      size: 'md',
      class: 'size-24',
    },
    {
      variant: 'box',
      size: 'lg',
      class: 'size-32',
    },
    {
      variant: 'box',
      size: 'xl',
      class: 'size-40',
    },
  ],
  defaultVariants: {
    variant: 'text',
    size: 'md',
  },
});

export interface SkeletonProps extends Omit<ViewProps, 'children'> {
  /**
   * Skeleton variant
   */
  variant?:
    | 'text'
    | 'heading'
    | 'box'
    | 'circle'
    | 'avatar'
    | 'button'
    | 'card';
  /**
   * Skeleton size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Custom width (overrides size-based width)
   */
  width?: number | string;
  /**
   * Custom height (overrides size-based height)
   */
  height?: number | string;
  /**
   * Whether to show shimmer animation
   */
  animated?: boolean;
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

export const Skeleton = React.forwardRef<View, SkeletonProps>(
  (
    {
      variant = 'text',
      size = 'md',
      width,
      height,
      animated = true,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const shimmerValue = useSharedValue(0);

    React.useEffect(() => {
      if (animated) {
        shimmerValue.value = withRepeat(
          withTiming(1, { duration: 1500 }),
          -1,
          false
        );
      }
    }, [animated, shimmerValue]);

    const animatedStyle = useAnimatedStyle(() => {
      if (!animated) return {};

      const translateX = interpolate(shimmerValue.value, [0, 1], [-100, 100]);

      return {
        transform: [{ translateX }],
      };
    });

    const baseStyles = React.useMemo(
      () => skeletonVariants({ variant, size }),
      [variant, size]
    );

    const customStyle = React.useMemo(() => {
      const styleObj: any = {};
      if (width !== undefined) styleObj.width = width;
      if (height !== undefined) styleObj.height = height;
      return styleObj;
    }, [width, height]);

    return (
      <View
        ref={ref}
        className={cn(baseStyles, className)}
        style={[customStyle, style]}
        {...props}
      >
        {animated && (
          <Animated.View
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10"
            style={[
              {
                width: '100%',
                height: '100%',
              },
              animatedStyle,
            ]}
          />
        )}
      </View>
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Convenience components for common patterns
export const SkeletonText = React.forwardRef<
  View,
  Omit<SkeletonProps, 'variant'>
>((props, ref) => <Skeleton ref={ref} variant="text" {...props} />);

export const SkeletonHeading = React.forwardRef<
  View,
  Omit<SkeletonProps, 'variant'>
>((props, ref) => <Skeleton ref={ref} variant="heading" {...props} />);

export const SkeletonAvatar = React.forwardRef<
  View,
  Omit<SkeletonProps, 'variant'>
>((props, ref) => <Skeleton ref={ref} variant="avatar" {...props} />);

export const SkeletonBox = React.forwardRef<
  View,
  Omit<SkeletonProps, 'variant'>
>((props, ref) => <Skeleton ref={ref} variant="box" {...props} />);

export const SkeletonButton = React.forwardRef<
  View,
  Omit<SkeletonProps, 'variant'>
>((props, ref) => <Skeleton ref={ref} variant="button" {...props} />);

export const SkeletonCard = React.forwardRef<
  View,
  Omit<SkeletonProps, 'variant'>
>((props, ref) => <Skeleton ref={ref} variant="card" {...props} />);

// Set display names
SkeletonText.displayName = 'SkeletonText';
SkeletonHeading.displayName = 'SkeletonHeading';
SkeletonAvatar.displayName = 'SkeletonAvatar';
SkeletonBox.displayName = 'SkeletonBox';
SkeletonButton.displayName = 'SkeletonButton';
SkeletonCard.displayName = 'SkeletonCard';
