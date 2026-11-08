import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Range from '../../src/lib/forms/Range.svelte';

const meta = {
  title: 'Forms/Range',
  component: Range,
  tags: ['autodocs'],
  args: { size: 'm', label: 'Price range', lower: 20, upper: 80, min: 0, max: 100, step: 5, marks: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    lower: { control: 'number' }, upper: { control: 'number' }, step: { control: 'number' }, marks: { control: 'object' },
  },
} satisfies Meta<typeof Range>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const Coincident: Story = { args: {lower:50,upper:50} };
export const WithoutMarks: Story = { args: {marks:false} };

export const Large: Story = { args: { size: 'l' } };
