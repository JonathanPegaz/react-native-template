import * as React from 'react';
import type { PressableProps, ViewProps } from 'react-native';
import { Pressable, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import colors from '../colors';
import { Text } from './text';

const switchVariants = tv({
  slots: {
    container: 'flex-row items-center',
    track: 'relative justify-center rounded-full',
    thumb: 'absolute rounded-full bg-white shadow-sm',
    label: 'text-base text-neutral-900 dark:text-neutral-100',
  },
  variants: {
    size: {
      sm: {
        track: 'h-5 w-9',
        thumb: 'size-4',
        label: 'text-sm',
      },
      md: {
        track: 'h-6 w-11',
        thumb: 'size-5',
        label: 'text-base',
      },
      lg: {
        track: 'h-7 w-12',
        thumb: 'size-6',
        label: 'text-lg',
      },
    },
    disabled: {
      true: {
        container: 'opacity-50',
        track: 'bg-neutral-200 dark:bg-neutral-700',
      },
      false: {},
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
});

export interface SwitchProps extends Omit<PressableProps, 'children'> {
  /**
   * Whether the switch is checked
   */
  checked: boolean;
  /**
   * Callback when switch state changes
   */
  onCheckedChange: (checked: boolean) => void;
  /**
   * Optional label text
   */
  label?: string;
  /**
   * Label position relative to switch
   */
  labelPosition?: 'left' | 'right';
  /**
   * Switch size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Custom class name for additional styling
   */
  className?: string;
  /**
   * Custom label props
   */
  labelProps?: ViewProps;
}

/* eslint-disable max-lines-per-function */
export const CustomSwitch = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  SwitchProps
>(
  (
    {
      checked,
      onCheckedChange,
      label,
      labelPosition = 'right',
      size = 'md',
      disabled = false,
      className,
      labelProps,
      ...props
    },
    ref
  ) => {
    const styles = React.useMemo(
      () => switchVariants({ size, disabled }),
      [size, disabled]
    );

    // Animation values
    const translateX = useSharedValue(checked ? 1 : 0);
    const colorProgress = useSharedValue(checked ? 1 : 0);

    // Update animation when checked prop changes
    React.useEffect(() => {
      translateX.value = withSpring(checked ? 1 : 0, {
        damping: 15,
        stiffness: 150,
      });
      colorProgress.value = withSpring(checked ? 1 : 0, {
        damping: 15,
        stiffness: 150,
      });
    }, [checked, translateX, colorProgress]);

    // Calculate dimensions based on size
    const dimensions = React.useMemo(() => {
      switch (size) {
        case 'sm':
          return { trackWidth: 36, trackHeight: 20, thumbSize: 16 };
        case 'lg':
          return { trackWidth: 48, trackHeight: 28, thumbSize: 24 };
        default:
          return { trackWidth: 44, trackHeight: 24, thumbSize: 20 };
      }
    }, [size]);

    // Animated styles for track
    const animatedTrackStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        colorProgress.value,
        [0, 1],
        [colors.neutral[300], colors.primary[500]]
      );

      return {
        backgroundColor,
      };
    });

    // Animated styles for thumb
    const animatedThumbStyle = useAnimatedStyle(() => {
      const translateValue =
        translateX.value * (dimensions.trackWidth - dimensions.thumbSize - 4);

      return {
        transform: [{ translateX: translateValue + 2 }],
      };
    });

    const handlePress = React.useCallback(() => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    }, [checked, disabled, onCheckedChange]);

    const switchElement = (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked }}
        {...props}
      >
        <Animated.View
          className={styles.track()}
          style={[
            animatedTrackStyle,
            {
              width: dimensions.trackWidth,
              height: dimensions.trackHeight,
            },
          ]}
        >
          <Animated.View
            className={styles.thumb()}
            style={[
              animatedThumbStyle,
              {
                width: dimensions.thumbSize,
                height: dimensions.thumbSize,
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    );

    if (!label) {
      return switchElement;
    }

    return (
      <View className={cn(styles.container(), className)}>
        {labelPosition === 'left' && (
          <Pressable onPress={handlePress} disabled={disabled} {...labelProps}>
            <Text className={cn(styles.label(), 'mr-3')}>{label}</Text>
          </Pressable>
        )}

        {switchElement}

        {labelPosition === 'right' && (
          <Pressable onPress={handlePress} disabled={disabled} {...labelProps}>
            <Text className={cn(styles.label(), 'ml-3')}>{label}</Text>
          </Pressable>
        )}
      </View>
    );
  }
);

CustomSwitch.displayName = 'CustomSwitch';
