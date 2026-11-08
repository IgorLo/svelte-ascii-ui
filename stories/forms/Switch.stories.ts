import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Switch from '../../src/lib/forms/Switch.svelte';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { size: 'm', label: 'Enable notifications', checked: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' }, checked: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const On: Story = { args: {checked:true} };
export const Disabled: Story = { args: {disabled:true} };
