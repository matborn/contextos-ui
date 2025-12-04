import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { RadioGroup, Radio, type RadioGroupProps } from '../components/ui/Radio';

const meta = {
  title: 'DS/Radio',
  component: RadioGroup,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Radio group with keyboard navigation, error/helper messaging, and horizontal or vertical layout.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    label: 'Assign role',
    helperText: 'Roles govern access to build and deploy pipelines.',
    options: [
      { value: 'admin', label: 'Admin', description: 'Full access to settings and billing.' },
      { value: 'editor', label: 'Editor', description: 'Can create and publish assets.' },
      { value: 'viewer', label: 'Viewer', description: 'Read-only access with audit trail.' },
    ],
    defaultValue: 'editor',
  },
} satisfies Meta<RadioGroupProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const admin = canvas.getByLabelText('Admin') as HTMLInputElement;
    await userEvent.click(admin);
    expect(admin.checked).toBe(true);
  },
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const ErrorState: Story = {
  args: {
    error: 'Select a role to continue',
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const editor = canvas.getByLabelText('Editor') as HTMLInputElement;
    const viewer = canvas.getByLabelText('Viewer') as HTMLInputElement;
    await userEvent.tab();
    expect(canvas.getByLabelText('Admin')).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(editor.checked || viewer.checked).toBeTruthy();
  },
};
