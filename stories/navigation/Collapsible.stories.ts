import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './CollapsibleExample.svelte';

const meta = {
  title: 'Navigation/Collapsible',
  component: Component,
  tags: ['autodocs'],
  args: { title: 'Advanced settings', disabled: false, initialOpen: false, size: 's' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm', 'l'] }, disabled: { control: 'boolean' }, initialOpen: { control: 'boolean' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Open: Story = { args: { initialOpen: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Large: Story = { args: { size: 'l' } };
