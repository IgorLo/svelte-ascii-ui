import type { Meta, StoryObj } from '@storybook/svelte-vite';
import NumberInput from '../../src/lib/forms/NumberInput.svelte';

const meta = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Quantity', min: 1, max: 12, step: 1, value: 3 },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    min: { control: 'number' }, max: { control: 'number' }, step: { control: 'number' },
  },
} satisfies Meta<typeof NumberInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const ReadOnly: Story = { args: {readonly:true} };
export const AtMinimum: Story = { args: {value:1} };
export const AtMaximum: Story = { args: {value:12} };
export const Empty: Story = { args: {value:undefined} };
