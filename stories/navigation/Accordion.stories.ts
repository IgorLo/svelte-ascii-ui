import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from '../../src/lib/navigation/Accordion.svelte';

const meta = {
  title: 'Navigation/Accordion',
  component: Component,
  tags: ['autodocs'],
  args: { items: [{ id: 'details', title: 'Session details', content: 'View the current workspace and terminal profile.' }, { id: 'logs', title: 'Logs', content: 'Review commands run in this session.' }, { id: 'archive', title: 'Archive', disabled: true }], size: 's' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm'] }, items: { control: 'object' }, value: { control: 'object' }, multiple: { control: 'boolean' }, header: { control: false }, children: { control: false } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Multiple: Story = { args: { multiple: true, value: ['details', 'logs'] } };
export const Open: Story = { args: { value: 'details' } };
