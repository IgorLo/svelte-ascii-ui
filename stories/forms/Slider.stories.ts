import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Slider from '../../src/lib/forms/Slider.svelte';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Volume', value: 60, min: 0, max: 100, step: 5, marks: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    value: { control: 'number' }, step: { control: 'number' }, marks: { control: 'object' },
  },
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const WithoutMarks: Story = { args: {marks:false} };
export const CustomMarks: Story = { args: {marks:[{value:0,label:'Off'},{value:100,label:'Max'}]} };

export const Large: Story = { args: { size: 'l' } };
