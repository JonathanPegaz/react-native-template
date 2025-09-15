import * as React from 'react';
import type { ViewProps } from 'react-native';
import { ActivityIndicator, Modal, Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Text } from '../base/text';

const overlayVariants = tv({
  base: 'absolute inset-0 items-center justify-center',
  variants: {
    variant: {
      default: 'bg-black/50',
      light: 'bg-white/80 dark:bg-black/60',
      dark: 'bg-black/70',
      blur: 'bg-white/20 dark:bg-black/40',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const contentVariants = tv({
  base: 'max-w-xs items-center justify-center rounded-lg p-6',
  variants: {
    variant: {
      default: 'bg-white shadow-lg dark:bg-neutral-800',
      transparent: 'bg-transparent',
      card: 'border border-neutral-200 bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface LoadingOverlayProps extends Omit<ViewProps, 'children'> {
  /**
   * Whether the overlay is visible
   */
  visible: boolean;
  /**
   * Loading message to display
   */
  message?: string;
  /**
   * Subtitle message
   */
  subtitle?: string;
  /**
   * Overlay variant
   */
  variant?: 'default' | 'light' | 'dark' | 'blur';
  /**
   * Content container variant
   */
  contentVariant?: 'default' | 'transparent' | 'card';
  /**
   * Custom loading indicator
   */
  indicator?: React.ReactNode;
  /**
   * Indicator size
   */
  size?: 'small' | 'large';
  /**
   * Indicator color
   */
  color?: string;
  /**
   * Whether overlay can be dismissed by tapping
   */
  dismissible?: boolean;
  /**
   * Callback when overlay is dismissed
   */
  onDismiss?: () => void;
  /**
   * Whether to show as modal (fullscreen) or inline
   */
  modal?: boolean;
  /**
   * Animation duration in ms
   */
  animationDuration?: number;
  /**
   * Custom class name
   */
  className?: string;
}

// Hook pour gérer l'animation du LoadingOverlay
const useLoadingAnimation = (visible: boolean, animationDuration: number) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: animationDuration });
      scale.value = withTiming(1, { duration: animationDuration });
    } else {
      opacity.value = withTiming(0, { duration: animationDuration });
      scale.value = withTiming(0.8, { duration: animationDuration });
    }
  }, [visible, animationDuration, opacity, scale]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedOverlayStyle, animatedContentStyle };
};

// Composant pour l'indicateur de chargement
const LoadingIndicator: React.FC<{
  indicator?: React.ReactNode;
  size: 'small' | 'large';
  color?: string;
  contentVariant: string;
}> = ({ indicator, size, color, contentVariant }) => {
  if (indicator) {
    return <>{indicator}</>;
  }

  return (
    <ActivityIndicator
      size={size}
      color={
        color || (contentVariant === 'transparent' ? '#ffffff' : undefined)
      }
    />
  );
};

// Composant pour le contenu du LoadingOverlay
const LoadingContent: React.FC<{
  message?: string;
  subtitle?: string;
  indicator?: React.ReactNode;
  size: 'small' | 'large';
  color?: string;
  contentVariant: string;
  contentStyles: string;
  className?: string;
  animatedContentStyle: any;
}> = ({
  message,
  subtitle,
  indicator,
  size,
  color,
  contentVariant,
  contentStyles,
  className,
  animatedContentStyle,
}) => (
  <View className="flex-1 items-center justify-center p-4">
    <Animated.View
      style={animatedContentStyle}
      className={cn(contentStyles, className)}
    >
      <View className="items-center space-y-4">
        <LoadingIndicator
          indicator={indicator}
          size={size}
          color={color}
          contentVariant={contentVariant}
        />

        {message && (
          <View className="items-center space-y-1">
            <Text className="text-center text-base font-medium text-neutral-900 dark:text-white">
              {message}
            </Text>
            {subtitle && (
              <Text className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                {subtitle}
              </Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  </View>
);

export const LoadingOverlay = React.forwardRef<View, LoadingOverlayProps>(
  /* eslint-disable-next-line max-lines-per-function */
  (
    {
      visible,
      message,
      subtitle,
      variant = 'default',
      contentVariant = 'default',
      indicator,
      size = 'large',
      color,
      dismissible = false,
      onDismiss,
      modal = true,
      animationDuration = 200,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const overlayStyles = React.useMemo(
      () => overlayVariants({ variant }),
      [variant]
    );

    const contentStyles = React.useMemo(
      () => contentVariants({ variant: contentVariant }),
      [contentVariant]
    );

    const { animatedOverlayStyle, animatedContentStyle } = useLoadingAnimation(
      visible,
      animationDuration
    );

    const handleDismiss = React.useCallback(() => {
      if (dismissible && onDismiss) {
        onDismiss();
      }
    }, [dismissible, onDismiss]);

    if (!visible) {
      return null;
    }

    const contentProps = {
      message,
      subtitle,
      indicator,
      size,
      color,
      contentVariant,
      contentStyles,
      className,
      animatedContentStyle,
    };

    if (modal) {
      return (
        <Modal
          transparent
          visible={visible}
          animationType="none"
          statusBarTranslucent
        >
          <Animated.View
            style={[animatedOverlayStyle, style]}
            className={overlayStyles}
          >
            <Pressable
              className="absolute inset-0"
              onPress={handleDismiss}
              disabled={!dismissible}
            />
            <LoadingContent {...contentProps} />
          </Animated.View>
        </Modal>
      );
    }

    return (
      <Animated.View
        ref={ref}
        style={[animatedOverlayStyle, style]}
        className={cn(overlayStyles, className)}
        {...props}
      >
        <Pressable
          className="absolute inset-0"
          onPress={handleDismiss}
          disabled={!dismissible}
        />
        <LoadingContent {...contentProps} />
      </Animated.View>
    );
  }
);

LoadingOverlay.displayName = 'LoadingOverlay';

// Hook for managing loading overlay state
export const useLoadingOverlay = () => {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string>();
  const [subtitle, setSubtitle] = React.useState<string>();

  const show = React.useCallback(
    (newMessage?: string, newSubtitle?: string) => {
      setMessage(newMessage);
      setSubtitle(newSubtitle);
      setLoading(true);
    },
    []
  );

  const hide = React.useCallback(() => {
    setLoading(false);
    setMessage(undefined);
    setSubtitle(undefined);
  }, []);

  const update = React.useCallback(
    (newMessage?: string, newSubtitle?: string) => {
      setMessage(newMessage);
      setSubtitle(newSubtitle);
    },
    []
  );

  return {
    loading,
    message,
    subtitle,
    show,
    hide,
    update,
  };
};

// Context for global loading overlay
interface LoadingOverlayContextType {
  show: (message?: string, subtitle?: string) => void;
  hide: () => void;
  update: (message?: string, subtitle?: string) => void;
  isLoading: boolean;
}

const LoadingOverlayContext =
  React.createContext<LoadingOverlayContextType | null>(null);

export const useGlobalLoadingOverlay = () => {
  const context = React.useContext(LoadingOverlayContext);
  if (!context) {
    throw new Error(
      'useGlobalLoadingOverlay must be used within a LoadingOverlayProvider'
    );
  }
  return context;
};

export interface LoadingOverlayProviderProps {
  children: React.ReactNode;
  defaultProps?: Partial<LoadingOverlayProps>;
}

export const LoadingOverlayProvider: React.FC<LoadingOverlayProviderProps> = ({
  children,
  defaultProps = {},
}) => {
  const { loading, message, subtitle, show, hide, update } =
    useLoadingOverlay();

  const contextValue = React.useMemo(
    () => ({
      show,
      hide,
      update,
      isLoading: loading,
    }),
    [show, hide, update, loading]
  );

  return (
    <LoadingOverlayContext.Provider value={contextValue}>
      {children}
      <LoadingOverlay
        visible={loading}
        message={message}
        subtitle={subtitle}
        {...defaultProps}
      />
    </LoadingOverlayContext.Provider>
  );
};
