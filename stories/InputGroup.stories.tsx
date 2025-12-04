import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { InputGroup, type InputGroupProps } from '../components/ui/InputGroup';
import { Search } from '../components/icons/Icons';

const meta = {
  title: 'DS/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Input wrapper with leading/trailing slots for prefixes, buttons, or status indicators. Handles loading, error, and helper states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Search catalogs',
    placeholder: 'Search by keyword or owner',
    leading: <Search size={14} className="text-slate-400" />,
    trailing: <span className="text-xs font-medium text-slate-500">⌘K</span>,
  },
} satisfies Meta<InputGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Search catalogs') as HTMLInputElement;
    await userEvent.type(input, 'RAC audit');
    expect(input.value).toContain('RAC');
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    trailing: <span className="text-xs font-medium text-slate-500">Fetching…</span>,
  },
};

export const ErrorState: Story = {
  args: {
    error: 'Enter at least 3 characters',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Locked state',
  },
};
