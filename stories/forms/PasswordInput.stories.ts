import type { Meta, StoryObj } from '@storybook/svelte-vite';
import PasswordInput from '../../src/lib/forms/PasswordInput.svelte';

const meta = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Password', value: 'terminal-001', autocomplete: 'new-password' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    value: { control: 'text' }, showLabel: { control: 'text' }, hideLabel: { control: 'text' },
  },
} satisfies Meta<typeof PasswordInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const ReadOnly: Story = { args: {readonly:true} };
export const Empty: Story = { args: {value:''} };

export const Large: Story = { args: { size: 'l' } };
