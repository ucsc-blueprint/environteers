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
    organization: 'Environteers',
    organizationType: 'Non-Profit',
    likeCount: 5,
    commentCount: 4,
    description: 'example long description salkja;sdkjf;alsdjf;alsdjf;alksjdf;laksdjf;laksdjf;laksdjf;alsdjfa;dkdjfkdlsieow'
  },

};
