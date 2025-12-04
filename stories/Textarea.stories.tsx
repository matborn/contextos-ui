import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea, type TextareaProps } from '../components/ui/Textarea';

const meta = {
  title: 'DS/Textarea',
  component: Textarea,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Multi-line input with helper/error text, optional character count, and tokenized focus states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Summary',
    placeholder: 'Capture the key context...',
    helperText: 'Share clear, scannable notes for reviewers.',
  },
} satisfies Meta<TextareaProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCount: Story = {
  args: {
    showCount: true,
    maxLength: 120,
    defaultValue: 'Current scope: stabilize DS inputs and wire interaction tests.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Summary') as HTMLTextAreaElement;
    await userEvent.type(input, ' Adding a short note.');
    expect(input.value.includes('short note')).toBeTruthy();
  },
};

export const ErrorState: Story = {
  args: {
    error: 'A summary is required',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Readonly state shown for review.',
  },
};
