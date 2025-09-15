import * as React from 'react';
import type { PressableProps } from 'react-native';
import { Pressable, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Text } from '../base/text';

const toastVariants = tv({
  base: [
    'flex-row items-center rounded-lg px-4 py-3 shadow-lg',
    'border border-opacity-20',
  ],
  variants: {
    variant: {
      success: 'border-green-600 bg-green-500',
      error: 'border-red-600 bg-red-500',
      warning: 'border-yellow-600 bg-yellow-500',
      info: 'border-blue-600 bg-blue-500',
      default:
        'border-neutral-700 bg-neutral-800 dark:border-neutral-200 dark:bg-neutral-100',
    },
    position: {
      top: 'mb-2',
      bottom: 'mt-2',
      center: 'my-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    position: 'top',
  },
});

const textVariants = tv({
  base: 'flex-1 font-medium',
  variants: {
    variant: {
      success: 'text-white',
      error: 'text-white',
      warning: 'text-black',
      info: 'text-white',
      default: 'text-white dark:text-black',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ToastData {
  id: string;
  title?: string;
  message: string;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface ToastProps extends Omit<PressableProps, 'children'> {
  toast: ToastData;
  position?: 'top' | 'bottom' | 'center';
  onDismiss: (id: string) => void;
  className?: string;
}

// Hook pour la logique d'animation du Toast
const useToastAnimation = (config: {
  position: 'top' | 'bottom' | 'center';
  duration: number;
  onDismiss: (id: string) => void;
  toastId: string;
}) => {
  const { position, duration, onDismiss, toastId } = config;
  const translateY = useSharedValue(position === 'top' ? -100 : 100);
  const opacity = useSharedValue(0);

  const handleDismiss = React.useCallback(() => {
    const targetY = position === 'top' ? -100 : 100;

    translateY.value = withSpring(targetY, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onDismiss)(toastId);
      }
    });
  }, [position, onDismiss, toastId, translateY, opacity]);

  React.useEffect(() => {
    // Animate in
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 200,
    });
    opacity.value = withTiming(1, { duration: 300 });

    // Auto dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleDismiss, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, handleDismiss };
};

export const Toast = React.forwardRef<View, ToastProps>(
  ({ toast, position = 'top', onDismiss, className, ...props }, ref) => {
    const {
      title,
      message,
      variant = 'default',
      duration = 4000,
      action,
    } = toast;

    const { animatedStyle, handleDismiss } = useToastAnimation({
      position,
      duration,
      onDismiss,
      toastId: toast.id,
    });

    const styles = React.useMemo(
      () => toastVariants({ variant, position }),
      [variant, position]
    );

    const textStyles = React.useMemo(
      () => textVariants({ variant }),
      [variant]
    );

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          ref={ref}
          className={cn(styles, className)}
          onPress={handleDismiss}
          {...props}
        >
          <View className="flex-1">
            {title && (
              <Text className={cn(textStyles, 'text-sm font-bold mb-0.5')}>
                {title}
              </Text>
            )}
            <Text className={cn(textStyles, 'text-sm')}>{message}</Text>
          </View>

          {action && (
            <Pressable
              className="ml-3 rounded bg-white/20 px-3 py-1"
              onPress={action.onPress}
            >
              <Text className={cn(textStyles, 'text-sm font-semibold')}>
                {action.label}
              </Text>
            </Pressable>
          )}

          {/* Close button */}
          <Pressable
            className="ml-2 p-1"
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className={cn(textStyles, 'text-lg leading-none')}>×</Text>
          </Pressable>
        </Pressable>
      </Animated.View>
    );
  }
);

Toast.displayName = 'Toast';

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastData[];
  position?: 'top' | 'bottom' | 'center';
  offset?: number;
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = 'top',
  offset = 0,
  onDismiss,
}) => {
  const insets = useSafeAreaInsets();

  const containerStyle = React.useMemo(() => {
    const baseStyle = {
      position: 'absolute' as const,
      left: 16,
      right: 16,
      zIndex: 9999,
    };

    switch (position) {
      case 'top':
        return {
          ...baseStyle,
          top: insets.top + offset,
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: insets.bottom + offset,
        };
      case 'center':
        return {
          ...baseStyle,
          top: '50%' as any,
          transform: [{ translateY: -50 }],
        };
      default:
        return baseStyle;
    }
  }, [position, insets, offset]);

  if (toasts.length === 0) return null;

  return (
    <View style={containerStyle} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          position={position}
          onDismiss={onDismiss}
        />
      ))}
    </View>
  );
};

// Toast Context and Provider
interface ToastContextType {
  show: (toast: Omit<ToastData, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'center';
  offset?: number;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top',
  offset = 0,
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const show = React.useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastData = { ...toast, id };

      setToasts((prev) => {
        const newToasts = [newToast, ...prev];
        return newToasts.slice(0, maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({ show, dismiss, dismissAll }),
    [show, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        toasts={toasts}
        position={position}
        offset={offset}
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  );
};

// Convenience functions - these will be implemented when used with useToast hook
const showOutOfContextWarning = (variant: string) => {
  console.warn(`toast.${variant} called outside of ToastProvider context`);
};

export const toast = {
  success: () => showOutOfContextWarning('success'),
  error: () => showOutOfContextWarning('error'),
  warning: () => showOutOfContextWarning('warning'),
  info: () => showOutOfContextWarning('info'),
};
