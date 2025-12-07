import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { LoginForm } from '@/components/LoginForm';

const meta = {
  title: 'Example/LoginForm',
  component: LoginForm,
  decorators: [
    (Story) => (
        <Story />

    ),
  ],
} satisfies Meta<typeof LoginForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        onSubmit: fn(),
    },
}