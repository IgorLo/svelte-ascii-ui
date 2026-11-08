import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './PopoverExample.svelte';

const meta = {
  title: 'Overlays/Popover',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'Display options', size: 's' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm'] }, title: { control: 'text' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Medium: Story = { args: { size: 'm' } };
