import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from '../../src/lib/overlays/Tooltip.svelte';

const meta = {
  title: 'Overlays/Tooltip',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'Session token', text: 'A session token identifies the current workspace.', size: 's' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm'] }, trigger: { control: false } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const LongText: Story = { args: { text: 'The session token identifies the workspace and reconnects to your current terminal session when you return.' } };
export const Medium: Story = { args: { size: 'm' } };
