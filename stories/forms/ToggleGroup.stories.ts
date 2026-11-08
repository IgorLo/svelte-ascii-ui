import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ToggleGroup from '../../src/lib/forms/ToggleGroup.svelte';

const formats = [{ value: 'bold', label: 'Bold' }, { value: 'italic', label: 'Italic' }, { value: 'strike', label: 'Strike', disabled: true }];
const meta = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: { size: 'm', label: 'Text formatting', options: formats, value: 'bold' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' }, multiple: { control: 'boolean' }, options: { control: 'object' },
  },
} satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Multiple: Story = { args: {multiple:true,value:['bold','italic']} };
export const Disabled: Story = { args: {disabled:true} };
