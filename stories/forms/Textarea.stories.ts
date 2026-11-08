import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Textarea from '../../src/lib/forms/Textarea.svelte';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Article notes', placeholder: 'Add a note', rows: 4 },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' }, rows: { control: 'number' },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const ReadOnly: Story = { args: {readonly:true,value:'A saved note'} };
export const Invalid: Story = { args: {'aria-invalid':true,value:'Incomplete'} };
