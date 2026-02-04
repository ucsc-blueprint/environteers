import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import React from 'react';
import {NewsUpdate} from '../components/NewsUpdate';

const meta = {
  title: 'UI/NewsUpdate',
  component: NewsUpdate,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NewsUpdate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Title',
    date: '01/12/2026',
    editionNumber: 5,
    previewImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    onPress: () => { console.log('NewsUpdate pressed'); },
    },

};
