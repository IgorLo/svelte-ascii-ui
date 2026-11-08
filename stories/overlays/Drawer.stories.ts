import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './DrawerExample.svelte';

const meta = {
  title: 'Overlays/Drawer',
  component: Component,
  tags: ['autodocs'],
  args: { title: 'Session details', side: 'right', size: 'm' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm', 'l', 'xl'] }, side: { control: 'inline-radio', options: ['left','right'] } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Left: Story = { args: { side: 'left' } };
export const Small: Story = { args: { size: 's' } };
export const Large: Story = { args: { size: 'l' } };
export const ExtraLarge: Story = { args: { size: 'xl' } };
