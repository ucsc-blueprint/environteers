import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SignupForm } from '@/components/SignupForm';
import { fn } from 'storybook/test';

const meta = {
  title: 'Example/SignupForm',
  component: SignupForm,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof SignupForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onSubmit: fn(),
  },
};
