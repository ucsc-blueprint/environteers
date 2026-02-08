import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { LogHours } from "@/components/LogHours";

const meta = {
  title: 'Example/LogHours',
  component: LogHours,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  args: { onSubmit: fn() },
} satisfies Meta<typeof LogHours>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};