import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { MyLogin } from '@/components/MyLogin';

const meta = {
  title: 'Example/MyLogin',
  component: MyLogin,
  decorators: [
    (Story) => (
        <Story />

    ),
  ],
} satisfies Meta<typeof MyLogin>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
    },
}
