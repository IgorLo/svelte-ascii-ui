import type { Meta, StoryObj } from '@storybook/svelte-vite';
import SearchInput from '../../src/lib/forms/SearchInput.svelte';

const meta = {
  title: 'Forms/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Search articles', placeholder: 'Find articles' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' }, value: { control: 'text' },
  },
} satisfies Meta<typeof SearchInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const WithValue: Story = { args: {value:'ASCII'} };
export const Disabled: Story = { args: {disabled:true} };
export const ReadOnly: Story = { args: {readonly:true,value:'ASCII'} };

export const Large: Story = { args: { size: 'l' } };
