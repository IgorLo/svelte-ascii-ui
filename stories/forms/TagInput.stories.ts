import type { Meta, StoryObj } from '@storybook/svelte-vite';
import TagInput from '../../src/lib/forms/TagInput.svelte';

const meta = {
  title: 'Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Article tags', value: ['design','ASCII'], placeholder: 'Enter a tag' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    value: { control: 'object' }, placeholder: { control: 'text' }, addLabel: { control: 'text' },
  },
} satisfies Meta<typeof TagInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Empty: Story = { args: {value:[]} };
export const Disabled: Story = { args: {disabled:true} };
export const ReadOnly: Story = { args: {readonly:true} };

export const Large: Story = { args: { size: 'l' } };
