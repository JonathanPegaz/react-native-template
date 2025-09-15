/* eslint-disable max-lines-per-function */
import React from 'react';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CustomSwitch,
  IconButton,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import colors from '@/components/ui/colors';
import { Home } from '@/components/ui/icons';
import { cn } from '@/lib/cn';
import { tw } from '@/lib/design-tokens';

export default function PlaygroundScreen() {
  const [switchValue, setSwitchValue] = React.useState(false);

  return (
    <View className="flex-1 bg-white dark:bg-black">
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

        {/* Add some padding at the bottom */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
