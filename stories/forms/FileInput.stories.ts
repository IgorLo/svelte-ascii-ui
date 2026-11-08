import type { Meta, StoryObj } from '@storybook/svelte-vite';
import FileInput from '../../src/lib/forms/FileInput.svelte';

const meta = {
  title: 'Forms/FileInput',
  component: FileInput,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Attach files', accept: '.md,.txt', multiple: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' }, accept: { control: 'text' }, loading: { control: 'boolean' }, error: { control: 'text' },
  },
} satisfies Meta<typeof FileInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const Loading: Story = { args: {loading:true} };
export const Error: Story = { args: {error:'Choose a Markdown or text file.'} };
export const Single: Story = { args: {multiple:false} };
