/* eslint-disable max-lines-per-function */
import React from 'react';

import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  CustomSwitch,
  Divider,
  EmptyState,
  HStack,
  IconButton,
  LoadingOverlay,
  ScrollView,
  Skeleton,
  Tabs,
  Text,
  ToastProvider,
  useToast,
  View,
  VStack,
} from '@/components/ui';
import colors from '@/components/ui/colors';
import { Home } from '@/components/ui/icons';
import { cn } from '@/lib/cn';
import { tw } from '@/lib/design-tokens';

function PlaygroundContent() {
  const [switchValue, setSwitchValue] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const toast = useToast();

  const showToast = () => {
    toast.show({
      title: 'Success!',
      message: 'This is a toast notification',
      variant: 'success',
    });
  };

  const showLoadingOverlay = () => {
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 3000);
  };

  return (
    <Container className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <Text className="mb-6 text-center text-2xl font-bold">
          UI Playground
        </Text>

        {/* Section: Buttons */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Buttons</Text>
          <View className={cn('flex-col', tw.gap.md)}>
            <Button label="Primary Button" />
            <Button label="Secondary Button" variant="secondary" />
            <Button label="Outline Button" variant="outline" />
            <Button label="Ghost Button" variant="ghost" />
            <Button label="Danger Button" variant="danger" />
            <Button label="Loading Button" loading />
            <Button label="Disabled Button" disabled />
            <Button label="With Left Icon" leftIcon={<Home />} />
            <Button label="With Right Icon" rightIcon={<Home />} />
            <Button leftIcon={<Home />} />
          </View>
        </View>

        {/* Section: Badges */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Badges</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            <Badge label="Default" />
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Danger" variant="danger" />
            <Badge label="Info" variant="info" />
            <Badge label="Outline" variant="outline" />
            <Badge label="Secondary" variant="secondary" />
          </View>
          <View className="flex-row flex-wrap gap-2">
            <Badge label="Small" size="sm" />
            <Badge label="Medium" size="md" />
            <Badge label="Large" size="lg" />
          </View>
        </View>

        {/* Section: Avatars */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Avatars</Text>
          <View className="mb-4 flex-row flex-wrap gap-4">
            <Avatar fallback="JD" size="xs" />
            <Avatar fallback="JD" size="sm" />
            <Avatar fallback="JD" size="md" />
            <Avatar fallback="JD" size="lg" />
            <Avatar fallback="JD" size="xl" />
            <Avatar fallback="JD" size="2xl" />
          </View>
          <View className="flex-row flex-wrap gap-4">
            <Avatar fallback="John Doe" status="online" />
            <Avatar fallback="John Doe" status="offline" />
            <Avatar fallback="John Doe" status="busy" />
            <Avatar fallback="John Doe" status="away" />
          </View>
        </View>

        {/* Section: Icon Buttons */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Icon Buttons</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            <IconButton icon={<Home />} />
            <IconButton icon={<Home />} variant="secondary" />
            <IconButton icon={<Home />} variant="outline" />
            <IconButton icon={<Home />} variant="ghost" />
            <IconButton icon={<Home />} variant="danger" />
          </View>
          <View className="flex-row flex-wrap gap-2">
            <IconButton icon={<Home />} size="sm" />
            <IconButton icon={<Home />} size="md" />
            <IconButton icon={<Home />} size="lg" />
            <IconButton icon={<Home />} size="xl" />
          </View>
        </View>

        {/* Section: Cards */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Cards</Text>
          <View className="gap-4">
            <Card>
              <Card.Header>
                <Text className="text-lg font-semibold">Default Card</Text>
              </Card.Header>
              <Card.Body>
                <Text>This is the card body content.</Text>
              </Card.Body>
              <Card.Footer>
                <Button label="Action" size="sm" />
              </Card.Footer>
            </Card>

            <Card variant="elevated">
              <Card.Body>
                <Text className="mb-2 text-lg font-semibold">
                  Elevated Card
                </Text>
                <Text>This card has a shadow elevation.</Text>
              </Card.Body>
            </Card>

            <Card variant="outline">
              <Card.Body>
                <Text className="mb-2 text-lg font-semibold">Outline Card</Text>
                <Text>This card has a thicker border.</Text>
              </Card.Body>
            </Card>
          </View>
        </View>

        {/* Section: Switch */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Switch</Text>
          <View className="gap-4">
            <CustomSwitch
              checked={switchValue}
              onCheckedChange={setSwitchValue}
              label="Enable notifications"
            />
            <CustomSwitch
              checked={true}
              onCheckedChange={() => {}}
              label="Left label"
              labelPosition="left"
            />
            <CustomSwitch
              checked={false}
              onCheckedChange={() => {}}
              size="sm"
              label="Small switch"
            />
            <CustomSwitch
              checked={true}
              onCheckedChange={() => {}}
              size="lg"
              label="Large switch"
            />
            <CustomSwitch
              checked={false}
              onCheckedChange={() => {}}
              disabled
              label="Disabled switch"
            />
          </View>
        </View>

        {/* Section: Design Tokens */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Design Tokens</Text>

          {/* Spacing */}
          <Text className="mb-2 text-sm font-medium">Spacing</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {Object.entries(tw.spacing).map(([key, value]) => (
              <View
                key={key}
                className={cn(
                  'bg-primary-500',
                  value,
                  'items-center justify-center'
                )}
              >
                <Text className="text-xs text-white">{key}</Text>
              </View>
            ))}
          </View>

          {/* Border Radius */}
          <Text className="mb-2 text-sm font-medium">Border Radius</Text>
          <View className="mb-4 flex-row flex-wrap gap-2">
            {Object.entries(tw.radius).map(([key, value]) => (
              <View key={key} className={cn('bg-primary-500 p-4', value)}>
                <Text className="text-xs text-white">{key}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section: Colors */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Colors</Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.entries(colors).map(([colorName, shades]) => {
              if (typeof shades === 'object' && !Array.isArray(shades)) {
                return Object.entries(shades).map(([shade, value]) => (
                  <View
                    key={`${colorName}-${shade}`}
                    className="mb-2 items-center"
                  >
                    <View
                      className={cn('w-16 h-16 rounded-lg')}
                      style={{ backgroundColor: value as string }}
                    />
                    <Text className="mt-1 text-xs">
                      {colorName}-{shade}
                    </Text>
                  </View>
                ));
              }
              return null;
            })}
          </View>
        </View>

        {/* Section: Typography */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Typography</Text>
          <Text className="text-xs">Extra Small Text (xs)</Text>
          <Text className="text-sm">Small Text (sm)</Text>
          <Text className="text-base">Base Text (base)</Text>
          <Text className="text-lg">Large Text (lg)</Text>
          <Text className="text-xl">Extra Large Text (xl)</Text>
          <Text className="text-2xl">2XL Text</Text>
          <Text className="text-3xl">3XL Text</Text>
        </View>

        {/* Section: Font Weights */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Font Weights</Text>
          <Text className="font-thin">Thin (100)</Text>
          <Text className="font-light">Light (300)</Text>
          <Text className="font-normal">Normal (400)</Text>
          <Text className="font-medium">Medium (500)</Text>
          <Text className="font-semibold">Semibold (600)</Text>
          <Text className="font-bold">Bold (700)</Text>
          <Text className="font-extrabold">Extrabold (800)</Text>
          <Text className="font-black">Black (900)</Text>
        </View>

        {/* Section: Layout Components */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">Layout Components</Text>

          <Text className="mb-2 text-sm font-medium">Stack (Vertical)</Text>
          <VStack
            gap="sm"
            className="mb-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800"
          >
            <View className="h-8 rounded bg-blue-500" />
            <View className="h-8 rounded bg-green-500" />
            <View className="h-8 rounded bg-red-500" />
          </VStack>

          <Text className="mb-2 text-sm font-medium">Stack (Horizontal)</Text>
          <HStack
            gap="sm"
            className="mb-4 rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800"
          >
            <View className="size-8 rounded bg-blue-500" />
            <View className="size-8 rounded bg-green-500" />
            <View className="size-8 rounded bg-red-500" />
          </HStack>

          <Text className="mb-2 text-sm font-medium">Dividers</Text>
          <VStack
            gap="md"
            className="rounded-lg bg-neutral-100 p-4 dark:bg-neutral-800"
          >
            <Text>Content above divider</Text>
            <Divider />
            <Text>Content below divider</Text>
            <Divider label="OR" />
            <Text>Content below labeled divider</Text>
            <Divider variant="dashed" />
            <Text>Content below dashed divider</Text>
          </VStack>

          <Text className="mb-2 mt-4 text-sm font-medium">Accordion</Text>
          <Accordion
            items={[
              {
                id: '1',
                title: 'What is React Native?',
                content: (
                  <Text className="text-neutral-600 dark:text-neutral-400">
                    React Native is a framework for building mobile applications
                    using React and JavaScript.
                  </Text>
                ),
                icon: <Text>📱</Text>,
              },
              {
                id: '2',
                title: 'How does it work?',
                content: (
                  <VStack gap="sm">
                    <Text className="text-neutral-600 dark:text-neutral-400">
                      React Native uses native components instead of web
                      components as building blocks.
                    </Text>
                    <Button label="Learn More" size="sm" />
                  </VStack>
                ),
                icon: <Text>⚙️</Text>,
              },
              {
                id: '3',
                title: 'Disabled Item',
                content: <Text>This content should not be visible</Text>,
                disabled: true,
                icon: <Text>🚫</Text>,
              },
            ]}
            defaultOpen={['1']}
            className="mb-4"
          />

          <Text className="mb-2 text-sm font-medium">Tabs</Text>
          <Tabs
            tabs={[
              {
                id: 'overview',
                label: 'Overview',
                content: (
                  <VStack gap="md">
                    <Text className="text-lg font-semibold">
                      Project Overview
                    </Text>
                    <Text className="text-neutral-600 dark:text-neutral-400">
                      This is the overview tab content with some information
                      about the project.
                    </Text>
                    <Button label="Get Started" />
                  </VStack>
                ),
                icon: <Text>📊</Text>,
              },
              {
                id: 'components',
                label: 'Components',
                content: (
                  <VStack gap="sm">
                    <Text className="text-lg font-semibold">UI Components</Text>
                    <Text className="text-neutral-600 dark:text-neutral-400">
                      Browse through our collection of reusable UI components.
                    </Text>
                    <HStack gap="sm">
                      <Badge label="Button" variant="outline" />
                      <Badge label="Input" variant="outline" />
                      <Badge label="Modal" variant="outline" />
                    </HStack>
                  </VStack>
                ),
                icon: <Text>🧩</Text>,
                badge: '12',
              },
              {
                id: 'api',
                label: 'API',
                content: (
                  <VStack gap="md">
                    <Text className="text-lg font-semibold">API Reference</Text>
                    <Text className="text-neutral-600 dark:text-neutral-400">
                      Documentation for all available props and methods.
                    </Text>
                    <Alert
                      description="API documentation is still being updated"
                      variant="warning"
                    />
                  </VStack>
                ),
                icon: <Text>📚</Text>,
              },
              {
                id: 'settings',
                label: 'Settings',
                content: (
                  <Text className="text-neutral-600 dark:text-neutral-400">
                    Settings content here...
                  </Text>
                ),
                disabled: true,
              },
            ]}
            defaultValue="overview"
            swipeable
          />
        </View>

        {/* Section: Feedback Components */}
        <View className="mb-8">
          <Text className="mb-4 text-lg font-semibold">
            Feedback Components
          </Text>

          <VStack gap="md">
            <Button label="Show Toast" onPress={showToast} />
            <Button label="Show Loading Overlay" onPress={showLoadingOverlay} />
          </VStack>

          <Divider className="my-4" />

          <Text className="mb-2 text-sm font-medium">Alerts</Text>
          <VStack gap="sm" className="mb-4">
            <Alert description="This is an info alert" variant="info" />
            <Alert description="This is a success alert" variant="success" />
            <Alert description="This is a warning alert" variant="warning" />
            <Alert
              title="Error Alert"
              description="This is an error alert with a title"
              variant="error"
              dismissible
              onDismiss={() => {}}
            />
          </VStack>

          <Text className="mb-2 text-sm font-medium">Skeletons</Text>
          <VStack gap="sm" className="mb-4">
            <Skeleton variant="text" />
            <Skeleton variant="heading" />
            <HStack gap="sm" align="center">
              <Skeleton variant="avatar" size="md" />
              <VStack gap="xs" flex="1">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </VStack>
            </HStack>
            <Skeleton variant="card" />
          </VStack>

          <Text className="mb-2 text-sm font-medium">Empty State</Text>
          <EmptyState
            icon="📭"
            title="No items found"
            description="There are no items to display at the moment"
            action={{
              label: 'Add Item',
              onPress: () => {},
            }}
            variant="card"
          />
        </View>

        {/* Add some padding at the bottom */}
        <View className="h-20" />
      </ScrollView>

      <LoadingOverlay
        visible={showLoading}
        message="Loading..."
        subtitle="Please wait while we process your request"
      />
    </Container>
  );
}

export default function PlaygroundScreen() {
  return (
    <ToastProvider>
      <PlaygroundContent />
    </ToastProvider>
  );
}
