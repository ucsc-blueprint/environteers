import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Dimensions } from 'react-native';
import ProfileSettings from '@/components/ProfileSettings';

const { height: screenHeight } = Dimensions.get('window');

const meta = {
  title: 'Example/ProfileSettings',
  component: ProfileSettings,
  decorators: [
    (Story) => (
      <View style={{ height: screenHeight, width: '100%' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ProfileSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
