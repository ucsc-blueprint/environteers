import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { fn } from 'storybook/test';

import { EcoFeed } from '@/components/EcoFeed';
import { Header } from '@/components/EcoFeed'

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

const baseEcoFeedProps = {
  liked: false,
  cover_photo: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  description:
    'Join local volunteers to make a tangible impact in your community. No experience required — just show up and help out!',
};

export const Feed: Story = {
  args: {
    ...baseEcoFeedProps,
    liked: true,
    type: 'Eco-Action',
    title: 'River Restoration Day',
  },
  render: () => (
    <View style={{ gap: 16, maxWidth: 500 }}>
      <Header resultsCount={25} />
      <EcoFeed
        {...baseEcoFeedProps}
        type="Eco-Action"
        title="SC Mountains Trail Stewardship: Hike & Help at Arana Gulch"
        date="Nov 3 | 4–5pm"
        location="Frederick Street Entrance, 440 Frederick St."
        spotsLeft={2}
        onLearnMore={fn()}
        onSignUp={fn()}
      />

      <EcoFeed
        {...baseEcoFeedProps}
        type="Event"
        title="Community Beach Cleanup"
        date="Nov 10 | 9–11am"
        location="Main Beach, Santa Cruz"
        onLearnMore={fn()}
        onSignUp={fn()}
      />

      <EcoFeed
        {...baseEcoFeedProps}
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
