import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './PopoverExample.svelte';
import CompactExample from './PopoverCompactExample.svelte';

const meta = {
  title: 'Overlays/Popover',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'Display options', size: 's', triggerVariant: 'button' },
  argTypes: { triggerVariant: { control: 'inline-radio', options: ['button', 'compact'] }, size: { control: 'inline-radio', options: ['s', 'm'] }, title: { control: 'text' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Medium: Story = { args: { size: 'm' } };

export const CompactHelp: Story = { args: { label: 'About display options', triggerVariant: 'compact' } };
export const CompactComposition: Story = { render: (args) => ({ Component: CompactExample, props: { size: args.size } }) };
