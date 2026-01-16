import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import { LandingPage } from '@/components/LandingPage';

const meta = {
  title: 'Example/LandingPage',
  component: LandingPage,
  decorators: [
    (Story) => (
        <Story />

    ),
  ],
} satisfies Meta<typeof LandingPage>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    onLoginClick: fn(),
    onRegisterClick: fn(),
  }
}