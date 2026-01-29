import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import {AdminVolunteersView} from '@/components/AdminVolunteersView';

const meta: Meta<typeof AdminVolunteersView> = {
  title: 'Admin/View Volunteers',
  component: AdminVolunteersView,
};

export default meta;

type Story = StoryObj<typeof AdminVolunteersView>;

export const Default: Story = {
  render: () => <AdminVolunteersView />,
};
