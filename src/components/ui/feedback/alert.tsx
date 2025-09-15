import * as React from 'react';
import type { ViewProps } from 'react-native';
import { Pressable, View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Text } from '../base/text';

const alertVariants = tv({
  base: ['flex-row items-start rounded-lg border p-4', 'space-x-3'],
  variants: {
    variant: {
      default:
        'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800',
      info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50',
      success:
        'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50',
      warning:
        'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50',
      error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50',
    },
    size: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const iconVariants = tv({
  base: 'mt-0.5 flex-shrink-0 text-lg',
  variants: {
    variant: {
      default: 'text-neutral-500 dark:text-neutral-400',
      info: 'text-blue-500 dark:text-blue-400',
      success: 'text-green-500 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-500',
      error: 'text-red-500 dark:text-red-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const titleVariants = tv({
  base: 'text-sm font-medium',
  variants: {
    variant: {
      default: 'text-neutral-800 dark:text-neutral-200',
      info: 'text-blue-800 dark:text-blue-200',
      success: 'text-green-800 dark:text-green-200',
      warning: 'text-yellow-800 dark:text-yellow-200',
      error: 'text-red-800 dark:text-red-200',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const descriptionVariants = tv({
  base: 'mt-1 text-sm',
  variants: {
    variant: {
      default: 'text-neutral-600 dark:text-neutral-400',
      info: 'text-blue-700 dark:text-blue-300',
      success: 'text-green-700 dark:text-green-300',
      warning: 'text-yellow-700 dark:text-yellow-300',
      error: 'text-red-700 dark:text-red-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const closeButtonVariants = tv({
  base: 'flex-shrink-0 rounded-md p-1 hover:bg-black/5 dark:hover:bg-white/5',
  variants: {
    variant: {
      default: 'text-neutral-400 dark:text-neutral-500',
      info: 'text-blue-400 dark:text-blue-500',
      success: 'text-green-400 dark:text-green-500',
      warning: 'text-yellow-500 dark:text-yellow-600',
      error: 'text-red-400 dark:text-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const defaultIcons = {
  default: 'ℹ️',
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
} as const;

export interface AlertAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export interface AlertProps extends Omit<ViewProps, 'children'> {
  /**
   * Alert variant
   */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  /**
   * Alert size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Alert title
   */
  title?: string;
  /**
   * Alert description/message
   */
  description: string;
  /**
   * Custom icon (overrides default variant icon)
   */
  icon?: string | React.ReactNode;
  /**
   * Whether to show default icon
   */
  showIcon?: boolean;
  /**
   * Whether alert can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;
  /**
   * Action buttons
   */
  actions?: AlertAction[];
  /**
   * Custom class name
   */
  className?: string;
}

// Composants internes pour une meilleure organisation
const AlertIcon: React.FC<{
  showIcon: boolean;
  icon?: string | React.ReactNode;
  variant: string;
  iconStyles: string;
}> = ({ showIcon, icon, variant, iconStyles }) => {
  if (!showIcon) return null;

  const iconElement =
    icon || defaultIcons[variant as keyof typeof defaultIcons];

  return (
    <View className="shrink-0">
      {typeof iconElement === 'string' ? (
        <Text className={iconStyles}>{iconElement}</Text>
      ) : (
        iconElement
      )}
    </View>
  );
};

const AlertActions: React.FC<{
  actions: AlertAction[];
  variant: string;
}> = ({ actions, variant }) => {
  if (actions.length === 0) return null;

  const getTextColor = () => {
    switch (variant) {
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'error':
        return 'text-red-700 dark:text-red-300';
      default:
        return 'text-neutral-700 dark:text-neutral-300';
    }
  };

  return (
    <View className="mt-3 flex-row space-x-2">
      {actions.map((action, index) => (
        <Pressable
          key={index}
          onPress={action.onPress}
          className={cn(
            'px-3 py-2 rounded-md',
            action.variant === 'primary'
              ? 'bg-black/10 dark:bg-white/10'
              : 'bg-transparent border border-current'
          )}
        >
          <Text className={cn('text-xs font-medium', getTextColor())}>
            {action.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export const Alert = React.forwardRef<View, AlertProps>(
  /* eslint-disable-next-line max-lines-per-function */
  (
    {
      variant = 'default',
      size = 'md',
      title,
      description,
      icon,
      showIcon = true,
      dismissible = false,
      onDismiss,
      actions = [],
      className,
      ...props
    },
    ref
  ) => {
    const alertStyles = React.useMemo(
      () => alertVariants({ variant, size }),
      [variant, size]
    );

    const iconStyles = React.useMemo(
      () => iconVariants({ variant }),
      [variant]
    );

    const titleStyles = React.useMemo(
      () => titleVariants({ variant }),
      [variant]
    );

    const descriptionStyles = React.useMemo(
      () => descriptionVariants({ variant }),
      [variant]
    );

    const closeButtonStyles = React.useMemo(
      () => closeButtonVariants({ variant }),
      [variant]
    );

    return (
      <View ref={ref} className={cn(alertStyles, className)} {...props}>
        <AlertIcon
          showIcon={showIcon}
          icon={icon}
          variant={variant}
          iconStyles={iconStyles}
        />

        <View className="min-w-0 flex-1">
          {title && <Text className={titleStyles}>{title}</Text>}

          <Text className={cn(descriptionStyles, !title && 'mt-0')}>
            {description}
          </Text>

          <AlertActions actions={actions} variant={variant} />
        </View>

        {dismissible && onDismiss && (
          <Pressable
            onPress={onDismiss}
            className={closeButtonStyles}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-lg leading-none">×</Text>
          </Pressable>
        )}
      </View>
    );
  }
);

Alert.displayName = 'Alert';

// Preset components for common use cases
export const AlertInfo = React.forwardRef<View, Omit<AlertProps, 'variant'>>(
  (props, ref) => <Alert ref={ref} variant="info" {...props} />
);

export const AlertSuccess = React.forwardRef<View, Omit<AlertProps, 'variant'>>(
  (props, ref) => <Alert ref={ref} variant="success" {...props} />
);

export const AlertWarning = React.forwardRef<View, Omit<AlertProps, 'variant'>>(
  (props, ref) => <Alert ref={ref} variant="warning" {...props} />
);

export const AlertError = React.forwardRef<View, Omit<AlertProps, 'variant'>>(
  (props, ref) => <Alert ref={ref} variant="error" {...props} />
);

// Set display names
AlertInfo.displayName = 'AlertInfo';
AlertSuccess.displayName = 'AlertSuccess';
AlertWarning.displayName = 'AlertWarning';
AlertError.displayName = 'AlertError';
