import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';

interface ExampleRow {
  name: string;
  owner: string;
  status: 'Active' | 'Pending' | 'Archived';
  items: number;
}

const rows: ExampleRow[] = [
  { name: 'Atlas Knowledge', owner: 'Sarah Chen', status: 'Active', items: 184 },
  { name: 'Risk Register', owner: 'Dylan Tran', status: 'Pending', items: 62 },
  { name: 'Vendor Controls', owner: 'Priya Desai', status: 'Archived', items: 28 },
];

const statusToBadge = (status: ExampleRow['status']) => {
  if (status === 'Active') return <Badge status="success">Active</Badge>;
  if (status === 'Pending') return <Badge status="warning">Pending</Badge>;
  return <Badge status="neutral">Archived</Badge>;
};

const meta = {
  title: 'DS/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Tokenized table shell with header/body/footer building blocks, empty/loading states, and interactive row affordances.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Datasets currently synced into Atlas.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Records</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody colSpan={4}>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="font-semibold text-slate-900">{row.name}</TableCell>
            <TableCell>{row.owner}</TableCell>
            <TableCell>{statusToBadge(row.status)}</TableCell>
            <TableCell className="text-right font-mono text-sm">{row.items}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="text-right font-semibold">
            Total
          </TableCell>
          <TableCell className="text-right font-mono text-sm">{rows.reduce((sum, row) => sum + row.items, 0)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Loading: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Records</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody isLoading colSpan={4} />
    </Table>
  ),
};

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Records</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody isLoading={false} colSpan={4} emptyMessage="No datasets synced yet." />
    </Table>
  ),
};

export const InteractiveRows: Story = {
  render: () => {
    const handleSelect = fn();
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Records</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody colSpan={4}>
          {rows.map((row) => (
            <TableRow key={row.name} interactive onClick={() => handleSelect(row.name)}>
              <TableCell className="font-semibold text-slate-900">{row.name}</TableCell>
              <TableCell>{row.owner}</TableCell>
              <TableCell>{statusToBadge(row.status)}</TableCell>
              <TableCell className="text-right font-mono text-sm">{row.items}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstRow = canvas.getByText('Atlas Knowledge').closest('tr') as HTMLTableRowElement;
    await userEvent.tab();
    expect(firstRow).toHaveFocus();
    await userEvent.keyboard('{Enter}');
  },
};
