import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AlertBanner } from '../components/ui/AlertBanner';

const meta = {
  title: 'Components/AlertBanner',
  component: AlertBanner,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Workspace data failed to load',
    description: 'Retry to fetch the latest workspaces and aggregates.',
    layout: 'card',
    tone: 'info',
  },
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfoCard: Story = {};

export const SuccessCard: Story = {
  args: {
    tone: 'success',
    title: 'Workspace created',
    description: 'Your new workspace is ready and syncing data.',
  },
};

export const WarningCard: Story = {
  args: {
    tone: 'warning',
    title: 'Health data delayed',
    description: 'Metrics may be stale while we resample the dataset.',
  },
};

export const ErrorBarWithAction: Story = {
  args: {
    tone: 'error',
    layout: 'bar',
    actionLabel: 'Retry',
    isActionLoading: false,
  },
  render: (args) => (
    <div className="w-full">
      <AlertBanner {...args} />
    </div>
  ),
};
