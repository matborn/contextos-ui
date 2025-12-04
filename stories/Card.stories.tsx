import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';

const meta = {
  title: 'DS/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Revenue is pacing 8.2% above plan. Spend is flat vs last quarter.
          </p>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-slate-500">Updated 2 hours ago</span>
        </CardFooter>
      </Card>
    </div>
  ),
};
