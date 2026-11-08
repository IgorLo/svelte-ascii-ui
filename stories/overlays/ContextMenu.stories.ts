import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './ContextMenuExample.svelte';

const meta = {
  title: 'Overlays/ContextMenu',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'File context actions', size: 's', empty: false },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm'] }, empty: { control: 'boolean' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Empty: Story = { args: { empty: true } };
export const Medium: Story = { args: { size: 'm' } };
