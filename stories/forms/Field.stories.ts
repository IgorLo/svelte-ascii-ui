import type { Meta, StoryObj } from '@storybook/svelte-vite';
import FieldStory from './FieldStory.svelte';

const meta = {
  title: 'Forms/Field',
  component: FieldStory,
  tags: ['autodocs'],
  args: { size: 'm', label: 'Article title', hint: 'Shown in the list of articles.' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm', 'l'] }, label: { control: 'text' }, hint: { control: 'text' }, error: { control: 'text' }, required: { control: 'boolean' } },
} satisfies Meta<typeof FieldStory>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Required: Story = { args: { required: true } };
export const Error: Story = { args: { error: 'Enter a title.', required: true } };
export const Disabled: Story = { args: { disabled: true } };

export const Large: Story = { args: { size: 'l' } };
