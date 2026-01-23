import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Dimensions } from 'react-native';
import { fn } from 'storybook/test';
import { LandingPage } from '@/components/LandingPage';

const { height: screenHeight } = Dimensions.get('window');

const meta = {
  title: 'Example/LandingPage',
  component: LandingPage,
  decorators: [
  (Story) => (
    <View style={{ height: screenHeight, width: "100%" }}>
      <Story />
    </View>
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