import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from '../../src/lib/navigation/Pagination.svelte';

const meta = {
  title: 'Navigation/Pagination',
  component: Component,
  tags: ['autodocs'],
  args: { page: 1, totalPages: 5, size: 's' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm', 'l'] }, page: { control: 'number' }, totalPages: { control: 'number' }, onchange: { action: 'page changed' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const LargeRange: Story = { args: { page: 5000, totalPages: 10000 } };
export const LastPage: Story = { args: { page: 5 } };
export const Disabled: Story = { args: { disabled: true } };
export const Empty: Story = { args: { totalPages: 0 } };

export const Large: Story = { args: { size: 'l' } };
