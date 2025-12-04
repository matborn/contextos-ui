import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox, type CheckboxProps } from '../components/ui/Checkbox';

const meta = {
  title: 'DS/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Checkbox with indeterminate support, helper/error text, and keyboard-friendly focus states.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Enable workspace notifications',
    description: 'Send alerts to channel subscribers.',
  },
} satisfies Meta<CheckboxProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByLabelText('Enable workspace notifications') as HTMLInputElement;
    await userEvent.click(box);
    expect(box.checked).toBe(true);
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    helperText: 'Partial selection from nested items.',
  },
};

export const ErrorState: Story = {
  args: {
    error: 'You must enable alerts for compliance',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    helperText: 'Locked by admin policy.',
  },
};
