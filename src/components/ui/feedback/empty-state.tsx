import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Button } from '../base/button';
import { Text } from '../base/text';

const emptyStateVariants = tv({
  base: 'items-center justify-center px-6 py-12',
  variants: {
    variant: {
      default: '',
      card: 'rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
      minimal: 'py-8',
    },
    size: {
      sm: 'px-4 py-8',
      md: 'px-6 py-12',
      lg: 'px-8 py-16',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const iconContainerVariants = tv({
  base: 'mb-4 rounded-full p-4',
  variants: {
    variant: {
      default: 'bg-neutral-100 dark:bg-neutral-800',
      primary: 'bg-blue-100 dark:bg-blue-900/30',
      success: 'bg-green-100 dark:bg-green-900/30',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30',
      danger: 'bg-red-100 dark:bg-red-900/30',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const iconVariants = tv({
  base: 'text-2xl',
  variants: {
    variant: {
      default: 'text-neutral-400 dark:text-neutral-500',
      primary: 'text-blue-500 dark:text-blue-400',
      success: 'text-green-500 dark:text-green-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
      danger: 'text-red-500 dark:text-red-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'ghost'
    | 'danger';
  loading?: boolean;
}

export interface EmptyStateProps extends Omit<ViewProps, 'children'> {
  /**
   * Icon to display (can be text emoji or icon component)
   */
  icon?: string | React.ReactNode;
  /**
   * Icon variant for styling
   */
  iconVariant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /**
   * Main title text
   */
  title: string;
  /**
   * Description text (optional)
   */
  description?: string;
  /**
   * Primary action button
   */
  action?: EmptyStateAction;
  /**
   * Secondary action button
   */
  secondaryAction?: EmptyStateAction;
  /**
   * Container variant
   */
  variant?: 'default' | 'card' | 'minimal';
  /**
   * Container size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom class name
   */
  className?: string;
}

export const EmptyState = React.forwardRef<View, EmptyStateProps>(
  /* eslint-disable-next-line max-lines-per-function */
  (
    {
      icon,
      iconVariant = 'default',
      title,
      description,
      action,
      secondaryAction,
      variant = 'default',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const containerStyles = React.useMemo(
      () => emptyStateVariants({ variant, size }),
      [variant, size]
    );

    const iconContainerStyles = React.useMemo(
      () => iconContainerVariants({ variant: iconVariant }),
      [iconVariant]
    );

    const iconStyles = React.useMemo(
      () => iconVariants({ variant: iconVariant }),
      [iconVariant]
    );

    const renderIcon = () => {
      if (!icon) return null;

      const iconElement =
        typeof icon === 'string' ? (
          <Text className={cn(iconStyles, 'text-4xl')}>{icon}</Text>
        ) : (
          icon
        );

      return <View className={iconContainerStyles}>{iconElement}</View>;
    };

    return (
      <View ref={ref} className={cn(containerStyles, className)} {...props}>
        {renderIcon()}

        <View className="mb-6 items-center space-y-2">
          <Text className="text-center text-lg font-semibold text-neutral-900 dark:text-white">
            {title}
          </Text>

          {description && (
            <Text className="max-w-sm text-center text-sm text-neutral-600 dark:text-neutral-400">
              {description}
            </Text>
          )}
        </View>

        {(action || secondaryAction) && (
          <View className="w-full max-w-xs items-center space-y-3">
            {action && (
              <Button
                variant={action.variant || 'default'}
                onPress={action.onPress}
                loading={action.loading}
                className="w-full"
              >
                {action.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'ghost'}
                onPress={secondaryAction.onPress}
                loading={secondaryAction.loading}
                className="w-full"
              >
                {secondaryAction.label}
              </Button>
            )}
          </View>
        )}
      </View>
    );
  }
);

EmptyState.displayName = 'EmptyState';

// Preset components for common use cases
export const EmptyStateNoData = React.forwardRef<
  View,
  Omit<EmptyStateProps, 'icon' | 'title'>
>((props, ref) => (
  <EmptyState
    ref={ref}
    icon="📭"
    title="No data found"
    iconVariant="default"
    {...props}
  />
));

export const EmptyStateNoResults = React.forwardRef<
  View,
  Omit<EmptyStateProps, 'icon' | 'title'>
>((props, ref) => (
  <EmptyState
    ref={ref}
    icon="🔍"
    title="No results found"
    description="Try adjusting your search or filter criteria"
    iconVariant="default"
    {...props}
  />
));

export const EmptyStateNoConnection = React.forwardRef<
  View,
  Omit<EmptyStateProps, 'icon' | 'title'>
>((props, ref) => (
  <EmptyState
    ref={ref}
    icon="📶"
    title="No internet connection"
    description="Please check your connection and try again"
    iconVariant="warning"
    {...props}
  />
));

export const EmptyStateError = React.forwardRef<
  View,
  Omit<EmptyStateProps, 'icon' | 'title'>
>((props, ref) => (
  <EmptyState
    ref={ref}
    icon="⚠️"
    title="Something went wrong"
    description="An error occurred while loading this content"
    iconVariant="danger"
    {...props}
  />
));

export const EmptyStatePermission = React.forwardRef<
  View,
  Omit<EmptyStateProps, 'icon' | 'title'>
>((props, ref) => (
  <EmptyState
    ref={ref}
    icon="🔒"
    title="Access denied"
    description="You don't have permission to view this content"
    iconVariant="warning"
    {...props}
  />
));

export const EmptyStateComingSoon = React.forwardRef<
  View,
  Omit<EmptyStateProps, 'icon' | 'title'>
>((props, ref) => (
  <EmptyState
    ref={ref}
    icon="🚧"
    title="Coming soon"
    description="This feature is currently under development"
    iconVariant="primary"
    {...props}
  />
));

// Set display names for preset components
EmptyStateNoData.displayName = 'EmptyStateNoData';
EmptyStateNoResults.displayName = 'EmptyStateNoResults';
EmptyStateNoConnection.displayName = 'EmptyStateNoConnection';
EmptyStateError.displayName = 'EmptyStateError';
EmptyStatePermission.displayName = 'EmptyStatePermission';
EmptyStateComingSoon.displayName = 'EmptyStateComingSoon';
