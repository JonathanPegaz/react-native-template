import type { ImageProps } from 'expo-image';
import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Image } from './image';
import { Text } from './text';

const avatarVariants = tv({
  slots: {
    root: 'relative flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800',
    image: 'rounded-full',
    fallback: 'flex items-center justify-center rounded-full bg-primary-500',
    fallbackText: 'font-medium text-white',
    status:
      'absolute rounded-full border-2 border-white dark:border-neutral-900',
  },
  variants: {
    size: {
      xs: {
        root: 'size-6',
        image: 'size-6',
        fallback: 'size-6',
        fallbackText: 'text-xs',
        status: '-bottom-0 -right-0 size-2',
      },
      sm: {
        root: 'size-8',
        image: 'size-8',
        fallback: 'size-8',
        fallbackText: 'text-sm',
        status: '-bottom-0 -right-0 size-2.5',
      },
      md: {
        root: 'size-10',
        image: 'size-10',
        fallback: 'size-10',
        fallbackText: 'text-base',
        status: '-bottom-0.5 -right-0.5 size-3',
      },
      lg: {
        root: 'size-12',
        image: 'size-12',
        fallback: 'size-12',
        fallbackText: 'text-lg',
        status: '-bottom-0.5 -right-0.5 size-3.5',
      },
      xl: {
        root: 'size-16',
        image: 'size-16',
        fallback: 'size-16',
        fallbackText: 'text-xl',
        status: '-bottom-1 -right-1 size-4',
      },
      '2xl': {
        root: 'size-20',
        image: 'size-20',
        fallback: 'size-20',
        fallbackText: 'text-2xl',
        status: '-bottom-1 -right-1 size-5',
      },
    },
    status: {
      online: {
        status: 'bg-green-500',
      },
      offline: {
        status: 'bg-neutral-400',
      },
      busy: {
        status: 'bg-red-500',
      },
      away: {
        status: 'bg-yellow-500',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface AvatarProps extends Omit<ViewProps, 'children'> {
  /**
   * Avatar image source
   */
  source?: ImageProps['source'];
  /**
   * Fallback text when no image is provided (usually initials)
   */
  fallback?: string;
  /**
   * Avatar size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /**
   * Status indicator
   */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /**
   * Custom class name for additional styling
   */
  className?: string;
  /**
   * Custom image props
   */
  imageProps?: Partial<ImageProps>;
}

export const Avatar = React.forwardRef<View, AvatarProps>(
  (
    { source, fallback, size = 'md', status, className, imageProps, ...props },
    ref
  ) => {
    const styles = React.useMemo(
      () => avatarVariants({ size, status }),
      [size, status]
    );

    const displayFallback = React.useMemo(() => {
      if (!fallback) return '';
      // Extract initials from fallback text
      return fallback
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }, [fallback]);

    return (
      <View ref={ref} className={cn(styles.root(), className)} {...props}>
        {source ? (
          <Image source={source} className={styles.image()} {...imageProps} />
        ) : (
          <View className={styles.fallback()}>
            <Text className={styles.fallbackText()}>{displayFallback}</Text>
          </View>
        )}

        {status && <View className={styles.status()} />}
      </View>
    );
  }
);

Avatar.displayName = 'Avatar';
