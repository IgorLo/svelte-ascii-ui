import type { Meta, StoryObj } from '@storybook/svelte-vite';
import RadioGroup from '../../src/lib/forms/RadioGroup.svelte';

const options = [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'scheduled', label: 'Scheduled', disabled: true }];
const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { size: 'm', label: 'Publication state', options, value: 'draft' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' }, options: { control: 'object' },
  },
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const Unselected: Story = { args: {value:''} };

export const Large: Story = { args: { size: 'l' } };
