import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Combobox from '../../src/lib/forms/Combobox.svelte';

const options = [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'scheduled', label: 'Scheduled', disabled: true }];
const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Publication state', options, placeholder: 'Search publication states' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    options: { control: 'object' }, loading: { control: 'boolean' }, error: { control: 'text' },
  },
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Selected: Story = { args: {value:'draft'} };
export const Disabled: Story = { args: {disabled:true} };
export const ReadOnly: Story = { args: {readonly:true,value:'draft'} };
export const Loading: Story = { args: {loading:true} };
export const Error: Story = { args: {error:'Could not load publication states.'} };
export const Empty: Story = { args: {options:[]} };

export const Large: Story = { args: { size: 'l' } };
