import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { EventCard } from '@/components/ui/EventCard';

const meta = {
  title: 'Example/EventCard',
  component: EventCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: { onPress: fn() },
} satisfies Meta<typeof EventCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Study Party',
    date: 'Dec 3, 2025',
    location: 'Terry Freitas Cafe',
  },
};

export const Alt1: Story = {
  args: {
    title: 'Job Fair',
    date: 'Dec 4, 2025',
    location: 'Stevenson Event Center',
  },
};
