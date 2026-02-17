import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Dimensions } from 'react-native';
import AccountMade from '@/components/AccountMade';

const { height: screenHeight } = Dimensions.get('window');

const meta = {
  title: 'Example/AccountMade',
  component: AccountMade,
  decorators: [
  (Story) => (
    <View style={{ height: screenHeight, width: "100%" }}>
      <Story />
    </View>
  ),
],
} satisfies Meta<typeof AccountMade>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
