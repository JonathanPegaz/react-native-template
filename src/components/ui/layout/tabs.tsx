import * as React from 'react';
import type { PressableProps, ViewProps } from 'react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

import { Text } from '../base/text';

const tabsVariants = tv({
  base: 'flex-1',
  variants: {
    variant: {
      default: '',
      card: 'rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
      ghost: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const tabListVariants = tv({
  base: 'flex-row border-b border-neutral-200 dark:border-neutral-700',
  variants: {
    variant: {
      default: 'bg-neutral-50 dark:bg-neutral-800',
      card: 'bg-transparent',
      ghost: 'border-transparent bg-transparent',
    },
    scrollable: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    scrollable: false,
  },
});

const tabTriggerVariants = tv({
  base: [
    'relative items-center justify-center px-4 py-3',
    'transition-colors duration-200',
  ],
  variants: {
    active: {
      true: 'text-blue-600 dark:text-blue-400',
      false: 'text-neutral-600 dark:text-neutral-400',
    },
    disabled: {
      true: 'opacity-50',
      false: 'hover:text-neutral-900 dark:hover:text-neutral-100',
    },
    size: {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg',
    },
  },
  compoundVariants: [
    {
      active: true,
      disabled: false,
      class: 'text-blue-600 dark:text-blue-400',
    },
  ],
  defaultVariants: {
    active: false,
    disabled: false,
    size: 'md',
  },
});

const tabContentVariants = tv({
  base: 'flex-1',
  variants: {
    variant: {
      default: 'p-4',
      card: 'p-4',
      ghost: 'p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Types
export interface TabData {
  id: string;
  label: string | React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps extends Omit<ViewProps, 'children'> {
  /**
   * Tab items
   */
  tabs: TabData[];
  /**
   * Default active tab
   */
  defaultValue?: string;
  /**
   * Controlled active tab
   */
  value?: string;
  /**
   * Callback when tab changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Tabs variant
   */
  variant?: 'default' | 'card' | 'ghost';
  /**
   * Tab size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Enable swipe gestures
   */
  swipeable?: boolean;
  /**
   * Make tab list scrollable
   */
  scrollable?: boolean;
  /**
   * Animation duration in ms
   */
  animationDuration?: number;
  /**
   * Custom class name
   */
  className?: string;
}

export interface TabTriggerProps extends Omit<PressableProps, 'children'> {
  /**
   * Tab data
   */
  tab: TabData;
  /**
   * Whether tab is active
   */
  isActive: boolean;
  /**
   * Tab size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * onPress callback
   */
  onPress: () => void;
}

// Hook for managing tabs state
const useTabsState = (config: {
  tabs: TabData[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const { tabs, defaultValue, value, onValueChange } = config;
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue || tabs[0]?.id || ''
  );

  const activeTab = value !== undefined ? value : internalValue;
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const changeTab = React.useCallback(
    (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [value, onValueChange]
  );

  const goToNext = React.useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    const nextTab = tabs[nextIndex];
    if (nextTab && !nextTab.disabled) {
      changeTab(nextTab.id);
    }
  }, [tabs, activeTab, changeTab]);

  const goToPrevious = React.useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    const prevTab = tabs[prevIndex];
    if (prevTab && !prevTab.disabled) {
      changeTab(prevTab.id);
    }
  }, [tabs, activeTab, changeTab]);

  return {
    activeTab,
    activeIndex,
    changeTab,
    goToNext,
    goToPrevious,
  };
};

// Individual tab trigger component
const TabTrigger: React.FC<TabTriggerProps> = ({
  tab,
  isActive,
  size = 'md',
  onPress,
  ...props
}) => {
  const triggerStyles = React.useMemo(
    () =>
      tabTriggerVariants({ active: isActive, disabled: tab.disabled, size }),
    [isActive, tab.disabled, size]
  );

  return (
    <Pressable
      className={triggerStyles}
      onPress={onPress}
      disabled={tab.disabled}
      {...props}
    >
      <View className="flex-row items-center space-x-2">
        {tab.icon && <View className="shrink-0">{tab.icon}</View>}

        <View className="shrink-0">
          {typeof tab.label === 'string' ? (
            <Text className="font-medium">{tab.label}</Text>
          ) : (
            tab.label
          )}
        </View>

        {tab.badge && (
          <View className="ml-1 min-w-5 items-center rounded-full bg-blue-500 px-1.5 py-0.5">
            <Text className="text-xs font-medium text-white">{tab.badge}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

// Tab indicator component
const TabIndicator: React.FC<{
  activeIndex: number;
  tabCount: number;
  animationDuration: number;
}> = ({ activeIndex, tabCount, animationDuration }) => {
  const translateX = useSharedValue(0);
  const width = useSharedValue(0);

  React.useEffect(() => {
    const indicatorWidth = 100 / tabCount;
    const indicatorTranslateX = activeIndex * indicatorWidth;

    translateX.value = withTiming(indicatorTranslateX, {
      duration: animationDuration,
    });
    width.value = withTiming(indicatorWidth, { duration: animationDuration });
  }, [activeIndex, tabCount, animationDuration, translateX, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
    width: `${width.value}%`,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-blue-400"
    />
  );
};

export const Tabs = React.forwardRef<View, TabsProps>(
  // eslint-disable-next-line max-lines-per-function
  (
    {
      tabs,
      defaultValue,
      value,
      onValueChange,
      variant = 'default',
      size = 'md',
      swipeable = false,
      scrollable = false,
      animationDuration = 200,
      className,
      ...props
    },
    ref
  ) => {
    const { activeTab, activeIndex, changeTab, goToNext, goToPrevious } =
      useTabsState({ tabs, defaultValue, value, onValueChange });

    const contentRef = React.useRef<View>(null);

    // Swipe gesture
    const panGesture = Gesture.Pan()
      .enabled(swipeable)
      .onEnd((event) => {
        const { velocityX, translationX } = event;

        if (Math.abs(velocityX) > 500 || Math.abs(translationX) > 100) {
          if (translationX > 0) {
            runOnJS(goToPrevious)();
          } else {
            runOnJS(goToNext)();
          }
        }
      });

    const tabsStyles = React.useMemo(
      () => tabsVariants({ variant }),
      [variant]
    );

    const tabListStyles = React.useMemo(
      () => tabListVariants({ variant, scrollable }),
      [variant, scrollable]
    );

    const tabContentStyles = React.useMemo(
      () => tabContentVariants({ variant }),
      [variant]
    );

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

    const renderTabList = () => {
      const tabElements = tabs.map((tab) => (
        <TabTrigger
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTab}
          size={size}
          onPress={() => changeTab(tab.id)}
        />
      ));

      if (scrollable) {
        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className={tabListStyles}
          >
            {tabElements}
            <TabIndicator
              activeIndex={activeIndex}
              tabCount={tabs.length}
              animationDuration={animationDuration}
            />
          </ScrollView>
        );
      }

      return (
        <View className={cn(tabListStyles, 'relative')}>
          {tabElements}
          <TabIndicator
            activeIndex={activeIndex}
            tabCount={tabs.length}
            animationDuration={animationDuration}
          />
        </View>
      );
    };

    return (
      <View ref={ref} className={cn(tabsStyles, className)} {...props}>
        {renderTabList()}

        <GestureDetector gesture={panGesture}>
          <View ref={contentRef} className={tabContentStyles}>
            {activeTabContent}
          </View>
        </GestureDetector>
      </View>
    );
  }
);

Tabs.displayName = 'Tabs';

// Preset components for common use cases
export const TabsCard = React.forwardRef<View, Omit<TabsProps, 'variant'>>(
  (props, ref) => <Tabs ref={ref} variant="card" {...props} />
);

export const TabsGhost = React.forwardRef<View, Omit<TabsProps, 'variant'>>(
  (props, ref) => <Tabs ref={ref} variant="ghost" {...props} />
);

export const TabsSwipeable = React.forwardRef<
  View,
  Omit<TabsProps, 'swipeable'>
>((props, ref) => <Tabs ref={ref} swipeable {...props} />);

export const TabsScrollable = React.forwardRef<
  View,
  Omit<TabsProps, 'scrollable'>
>((props, ref) => <Tabs ref={ref} scrollable {...props} />);

// Set display names
TabsCard.displayName = 'TabsCard';
TabsGhost.displayName = 'TabsGhost';
TabsSwipeable.displayName = 'TabsSwipeable';
TabsScrollable.displayName = 'TabsScrollable';
