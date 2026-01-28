import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';
import React from "react";

import { EcoFeed } from '@/components/EcoFeed';
import { Header } from '@/components/EcoFeed';



const meta = {
  title: 'Example/EcoFeed',
  component: EcoFeed,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, maxWidth: 500 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof EcoFeed>;

export default meta;

type Story = StoryObj<typeof meta>;


export const Feed: Story = {
  args: {
    title: '',
    date: '',
    location: '',
  },
  render: () => (
    <View style={{ gap: 16, maxWidth: 500 }}>
      <Header />

      <EcoFeed
        type="Eco-Action"
        title="SC Mountains Trail Stewardship: Hike & Help at Arana Gulch"
        date="Nov 3 | 4–5pm"
        location="Frederick Street Entrance, 440 Frederick St."
        spotsLeft={2}
        onLearnMore={fn()}
        onSignUp={fn()}
      />

      <EcoFeed
        type="Event"
        title="Community Beach Cleanup"
        date="Nov 10 | 9–11am"
        location="Main Beach, Santa Cruz"
        onLearnMore={fn()}
        onSignUp={fn()}
      />

      <EcoFeed
        type="Eco-Action"
        title="Tree Planting Day"
        date="Nov 18 | 1–3pm"
        location="DeLaveaga Park"
        spotsLeft={5}
        onLearnMore={fn()}
        onSignUp={fn()}
      />
    </View>
  ),
};

/*
export const EcoAction: Story = {
  args: {
    type: 'Eco-Action',
    title: 'SC Mountains Trail Stewardship: Hike & Help at Arana Gulch',
    date: 'Nov 3 | 4–5pm',
    location: 'Frederick Street Entrance, 440 Frederick St.',
    spotsLeft: 2,
    onLearnMore: fn(),
    onSignUp: fn(),
  },
};

export const Event: Story = {
  args: {
    type: 'Event',
    title: 'Community Beach Cleanup',
    date: 'Nov 10 | 9–11am',
    location: 'Main Beach, Santa Cruz',
    onLearnMore: fn(),
    onSignUp: fn(),
  },
};
*/
