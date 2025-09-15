import * as React from 'react';
import type { ViewProps } from 'react-native';
import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import { cn } from '@/lib/cn';

const cardVariants = tv({
  slots: {
    root: 'overflow-hidden rounded-lg bg-white dark:bg-neutral-900',
    header: 'border-b border-neutral-200 px-4 py-3 dark:border-neutral-700',
    body: 'px-4 py-3',
    footer: 'border-t border-neutral-200 px-4 py-3 dark:border-neutral-700',
  },
  variants: {
    variant: {
      default: {
        root: 'border border-neutral-200 dark:border-neutral-700',
      },
      elevated: {
        root: 'elevation-4 shadow-md',
      },
      outline: {
        root: 'border-2 border-neutral-300 dark:border-neutral-600',
      },
      ghost: {
        root: 'border-0',
      },
    },
    padding: {
      none: {
        header: 'p-0',
        body: 'p-0',
        footer: 'p-0',
      },
      sm: {
        header: 'px-3 py-2',
        body: 'px-3 py-2',
        footer: 'px-3 py-2',
      },
      md: {
        header: 'px-4 py-3',
        body: 'px-4 py-3',
        footer: 'px-4 py-3',
      },
      lg: {
        header: 'px-6 py-4',
        body: 'px-6 py-4',
        footer: 'px-6 py-4',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
});

export interface CardProps extends ViewProps {
  /**
   * Card visual variant
   */
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  /**
   * Card padding size
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

export interface CardHeaderProps extends ViewProps {
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

export interface CardBodyProps extends ViewProps {
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

export interface CardFooterProps extends ViewProps {
  /**
   * Custom class name for additional styling
   */
  className?: string;
}

// Main Card component
const CardRoot = React.forwardRef<View, CardProps>(
  (
    { variant = 'default', padding = 'md', className, children, ...props },
    ref
  ) => {
    const styles = React.useMemo(
      () => cardVariants({ variant, padding }),
      [variant, padding]
    );

    // Provide context to child components
    const contextValue = React.useMemo(() => ({ styles }), [styles]);

    return (
      <CardContext.Provider value={contextValue}>
        <View ref={ref} className={cn(styles.root(), className)} {...props}>
          {children}
        </View>
      </CardContext.Provider>
    );
  }
);

// Context for sharing styles with child components
const CardContext = React.createContext<{
  styles: ReturnType<typeof cardVariants>;
} | null>(null);

const useCardContext = () => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error('Card components must be used within a Card');
  }
  return context;
};

// Card Header component
export const CardHeader = React.forwardRef<View, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { styles } = useCardContext();

    return (
      <View ref={ref} className={cn(styles.header(), className)} {...props}>
        {children}
      </View>
    );
  }
);

// Card Body component
export const CardBody = React.forwardRef<View, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    const { styles } = useCardContext();

    return (
      <View ref={ref} className={cn(styles.body(), className)} {...props}>
        {children}
      </View>
    );
  }
);

// Card Footer component
export const CardFooter = React.forwardRef<View, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { styles } = useCardContext();

    return (
      <View ref={ref} className={cn(styles.footer(), className)} {...props}>
        {children}
      </View>
    );
  }
);

// Set display names
CardRoot.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

// Compound component pattern
type CardComponent = typeof CardRoot & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

export const Card = CardRoot as CardComponent;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
