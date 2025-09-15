import * as React from 'react';
import type { PressableProps, ViewProps } from 'react-native';
import { Pressable, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Text } from '../base/text';

const accordionVariants = tv({
  base: 'overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700',
  variants: {
    variant: {
      default: 'bg-white dark:bg-neutral-900',
      ghost: 'border-transparent bg-transparent',
      outline: 'bg-transparent',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const accordionItemVariants = tv({
  base: 'border-b border-neutral-200 last:border-b-0 dark:border-neutral-700',
  variants: {
    variant: {
      default: '',
      ghost: 'border-transparent',
      outline: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const accordionHeaderVariants = tv({
  base: 'min-h-12 flex-row items-center justify-between px-4 py-3',
  variants: {
    size: {
      sm: 'min-h-10 px-3 py-2',
      md: 'min-h-12 px-4 py-3',
      lg: 'min-h-14 px-6 py-4',
    },
    disabled: {
      true: 'opacity-50',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
});

const accordionContentVariants = tv({
  base: 'overflow-hidden',
  variants: {
    size: {
      sm: 'px-3 pb-2',
      md: 'px-4 pb-3',
      lg: 'px-6 pb-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// Types
export interface AccordionItemData {
  id: string;
  title: string | React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface AccordionProps extends Omit<ViewProps, 'children'> {
  /**
   * Accordion items
   */
  items: AccordionItemData[];
  /**
   * Accordion variant
   */
  variant?: 'default' | 'ghost' | 'outline';
  /**
   * Accordion size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Allow multiple items to be open
   */
  multiple?: boolean;
  /**
   * Default open items (by id)
   */
  defaultOpen?: string[];
  /**
   * Controlled open items (by id)
   */
  open?: string[];
  /**
   * Callback when items open/close
   */
  onOpenChange?: (openItems: string[]) => void;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Animation duration in ms
   */
  animationDuration?: number;
}

export interface AccordionItemProps extends Omit<PressableProps, 'children'> {
  /**
   * Item data
   */
  item: AccordionItemData;
  /**
   * Whether item is open
   */
  isOpen: boolean;
  /**
   * Toggle function
   */
  onToggle: () => void;
  /**
   * Accordion variant
   */
  variant?: 'default' | 'ghost' | 'outline';
  /**
   * Accordion size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Animation duration
   */
  animationDuration?: number;
}

// Hook for managing accordion state
const useAccordionState = (config: {
  multiple: boolean;
  defaultOpen?: string[];
  open?: string[];
  onOpenChange?: (openItems: string[]) => void;
}) => {
  const { multiple, defaultOpen, open, onOpenChange } = config;
  const [internalOpen, setInternalOpen] = React.useState<string[]>(
    defaultOpen || []
  );

  const openItems = open !== undefined ? open : internalOpen;

  const toggleItem = React.useCallback(
    (itemId: string) => {
      const newOpenItems = openItems.includes(itemId)
        ? openItems.filter((id) => id !== itemId)
        : multiple
          ? [...openItems, itemId]
          : [itemId];

      if (open === undefined) {
        setInternalOpen(newOpenItems);
      }
      onOpenChange?.(newOpenItems);
    },
    [openItems, multiple, open, onOpenChange]
  );

  return { openItems, toggleItem };
};

// Individual accordion item component
// eslint-disable-next-line max-lines-per-function
const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
  variant = 'default',
  size = 'md',
  animationDuration = 300,
  ...props
}) => {
  const height = useSharedValue(0);
  const contentRef = React.useRef<View>(null);

  const handleLayout = React.useCallback(() => {
    if (contentRef.current) {
      const newHeight = isOpen ? 'auto' : 0;
      if (typeof newHeight === 'number') {
        height.value = withTiming(newHeight, { duration: animationDuration });
      } else {
        // Measure content height when opening
        runOnJS(() => {
          // eslint-disable-next-line max-params
          contentRef.current?.measure((x, y, width, contentHeight) => {
            height.value = withTiming(contentHeight, {
              duration: animationDuration,
            });
          });
        })();
      }
    }
  }, [isOpen, height, animationDuration]);

  React.useEffect(() => {
    handleLayout();
  }, [isOpen, handleLayout]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const itemStyles = React.useMemo(
    () => accordionItemVariants({ variant }),
    [variant]
  );

  const headerStyles = React.useMemo(
    () => accordionHeaderVariants({ size, disabled: item.disabled }),
    [size, item.disabled]
  );

  const contentStyles = React.useMemo(
    () => accordionContentVariants({ size }),
    [size]
  );

  return (
    <View className={itemStyles}>
      <Pressable
        className={headerStyles}
        onPress={onToggle}
        disabled={item.disabled}
        {...props}
      >
        <View className="flex-1 flex-row items-center space-x-3">
          {item.icon && <View className="shrink-0">{item.icon}</View>}
          <View className="flex-1">
            {typeof item.title === 'string' ? (
              <Text className="text-base font-medium text-neutral-900 dark:text-white">
                {item.title}
              </Text>
            ) : (
              item.title
            )}
          </View>
        </View>

        <View className="ml-2 shrink-0">
          <Text
            className={cn(
              'text-lg transition-transform duration-200',
              'text-neutral-500 dark:text-neutral-400',
              isOpen && 'rotate-180'
            )}
          >
            ↓
          </Text>
        </View>
      </Pressable>

      <Animated.View style={animatedStyle} className="overflow-hidden">
        <View
          ref={contentRef}
          className={contentStyles}
          onLayout={() => {
            if (isOpen && contentRef.current) {
              // eslint-disable-next-line max-params
              contentRef.current.measure((x, y, width, contentHeight) => {
                height.value = withTiming(contentHeight, {
                  duration: animationDuration,
                });
              });
            }
          }}
        >
          {item.content}
        </View>
      </Animated.View>
    </View>
  );
};

export const Accordion = React.forwardRef<View, AccordionProps>(
  (
    {
      items,
      variant = 'default',
      size = 'md',
      multiple = false,
      defaultOpen,
      open,
      onOpenChange,
      animationDuration = 300,
      className,
      ...props
    },
    ref
  ) => {
    const { openItems, toggleItem } = useAccordionState({
      multiple,
      defaultOpen,
      open,
      onOpenChange,
    });

    const accordionStyles = React.useMemo(
      () => accordionVariants({ variant, size }),
      [variant, size]
    );

    return (
      <View ref={ref} className={cn(accordionStyles, className)} {...props}>
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openItems.includes(item.id)}
            onToggle={() => toggleItem(item.id)}
            variant={variant}
            size={size}
            animationDuration={animationDuration}
          />
        ))}
      </View>
    );
  }
);

Accordion.displayName = 'Accordion';

// Preset components for common use cases
export const AccordionSingle = React.forwardRef<
  View,
  Omit<AccordionProps, 'multiple'>
>((props, ref) => <Accordion ref={ref} multiple={false} {...props} />);

export const AccordionMultiple = React.forwardRef<
  View,
  Omit<AccordionProps, 'multiple'>
>((props, ref) => <Accordion ref={ref} multiple {...props} />);

export const AccordionGhost = React.forwardRef<
  View,
  Omit<AccordionProps, 'variant'>
>((props, ref) => <Accordion ref={ref} variant="ghost" {...props} />);

export const AccordionOutline = React.forwardRef<
  View,
  Omit<AccordionProps, 'variant'>
>((props, ref) => <Accordion ref={ref} variant="outline" {...props} />);

// Set display names
AccordionSingle.displayName = 'AccordionSingle';
AccordionMultiple.displayName = 'AccordionMultiple';
AccordionGhost.displayName = 'AccordionGhost';
AccordionOutline.displayName = 'AccordionOutline';
