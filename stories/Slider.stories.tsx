import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Slider, type SliderProps } from '../components/ui/Slider';

const meta = {
  title: 'DS/Slider',
  component: Slider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Range slider with tokenized focus states, helper/error messaging, and optional value formatter.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Confidence threshold',
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 40,
  },
} satisfies Meta<SliderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    helperText: 'Adjust the minimum confidence for automated actions.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider') as HTMLInputElement;
    slider.focus();
    slider.value = `${Number(slider.value) + 10}`;
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    expect(Number(slider.value)).toBeGreaterThan(40);
  },
};

export const WithFormatter: Story = {
  args: {
    formatValue: (value) => `${value}%`,
    defaultValue: 70,
  },
};

export const ErrorState: Story = {
  args: {
    error: 'Set a threshold to continue',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
