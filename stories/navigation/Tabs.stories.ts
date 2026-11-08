import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './TabsExample.svelte';

const meta = {
  title: 'Navigation/Tabs',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'Session information', orientation: 'horizontal', size: 's' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm', 'l'] }, orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] }, items: { control: 'object' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Empty: Story = { args: { items: [] } };

export const Large: Story = { args: { size: 'l' } };
