import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './ToolbarExample.svelte';

const meta = {
  title: 'Navigation/Toolbar',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'Session actions' },
  argTypes: { label: { control: 'text' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
