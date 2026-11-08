import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Checkbox from '../../src/lib/forms/Checkbox.svelte';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { size: 'm', label: 'Include this article', checked: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' }, checked: { control: 'boolean' }, indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Checked: Story = { args: {checked:true} };
export const Indeterminate: Story = { args: {indeterminate:true} };
export const Disabled: Story = { args: {disabled:true} };
