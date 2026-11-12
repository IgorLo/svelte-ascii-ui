import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Select from '../../src/lib/forms/Select.svelte';

const options = [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'scheduled', label: 'Scheduled', disabled: true }];
const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Publication state', options, value: 'draft' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    showPlaceholder: { control: 'boolean', table: { defaultValue: { summary: 'true' } } },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    options: { control: 'object' }, loading: { control: 'boolean' }, error: { control: 'text' },
  },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const Loading: Story = { args: {loading:true} };
export const Error: Story = { args: {error:'Could not load publication states.'} };
export const Empty: Story = { args: {options:[],value:''} };

export const Large: Story = { args: { size: 'l' } };
export const OptionsOnly: Story = {
  args: { showPlaceholder: false, options: options.slice(0, 2), value: 'draft' },
};
export const Optional: Story = {
  args: { value: '', placeholder: 'All publication states' },
};
export const Required: Story = {
  args: { value: '', required: true },
};
