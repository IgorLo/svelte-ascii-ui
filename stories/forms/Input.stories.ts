import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Input from '../../src/lib/forms/Input.svelte';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Article title', placeholder: 'Enter a title' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' }, value: { control: 'text' },
  },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true,value:'Unavailable'} };
export const ReadOnly: Story = { args: {readonly:true,value:'/notes/first-post'} };
export const Invalid: Story = { args: {'aria-invalid':true,value:'Incomplete'} };
