import type { Meta, StoryObj } from '@storybook/svelte-vite';
import MultiSelect from '../../src/lib/forms/MultiSelect.svelte';

const topics = [{ value: 'design', label: 'Design' }, { value: 'type', label: 'Typography' }, { value: 'dev', label: 'Development' }];
const meta = {
  title: 'Forms/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  args: { size: 'm', 'aria-label': 'Topics', options: topics, value: ['design'] },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm'] },
    disabled: { control: 'boolean' },
    options: { control: 'object' }, loading: { control: 'boolean' }, value: { control: 'object' },
  },
} satisfies Meta<typeof MultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Disabled: Story = { args: {disabled:true} };
export const ReadOnly: Story = { args: {readonly:true} };
export const Loading: Story = { args: {loading:true} };
export const Error: Story = { args: {error:'Could not load topics.'} };
export const Empty: Story = { args: {options:[],value:[]} };
