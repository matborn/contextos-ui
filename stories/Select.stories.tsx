import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select, type SelectProps } from '../components/ui/Select';

const options = [
  { value: 'eng', label: 'Engineering', description: 'Product, Platform, Data' },
  { value: 'design', label: 'Design', description: 'Product & Brand' },
  { value: 'rev', label: 'Revenue', description: 'Sales, CS, RevOps' },
  { value: 'ops', label: 'Operations', description: 'IT, Workplace, Finance' },
];

const meta = {
  title: 'DS/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Form select built for DS-first flows. Supports helper/description, error, disabled, loading, and keyboard selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Department',
    placeholder: 'Choose a team',
    options,
  },
} satisfies Meta<SelectProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    helperText: 'Used to route approvals and notifications.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText('Department') as HTMLSelectElement;
    await userEvent.selectOptions(select, 'eng');
    expect(select.value).toBe('eng');
  },
};

export const WithDescription: Story = {
  args: {
    description: 'Restricts access to respective workspace folders.',
    defaultValue: 'ops',
  },
};

export const ErrorState: Story = {
  args: {
    error: 'Pick at least one department',
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 'design',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    placeholder: 'Loading teams...',
    options: [],
  },
};
