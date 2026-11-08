import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './DropdownMenuExample.svelte';

const meta = {
  title: 'Overlays/DropdownMenu',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'File actions', size: 's', empty: false },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm', 'l'] }, empty: { control: 'boolean' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Empty: Story = { args: { empty: true } };
export const Medium: Story = { args: { size: 'm' } };

export const Large: Story = { args: { size: 'l' } };
