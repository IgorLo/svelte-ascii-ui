import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Icon from '../src/lib/Icon.svelte';

const meta = {
  title: 'Foundation/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'info', label: 'Information' },
  argTypes: {
    name: { control: 'select', options: ['plus', 'minus', 'chevron-down', 'close', 'refresh', 'info'] },
    label: { control: 'text' },
  },
  parameters: { docs: { description: { component: 'Six MIT-licensed Pixelarticons with a fixed square SVG viewBox. Omit label when the surrounding control already supplies its accessible name. Button icon/iconEnd and IconButton icon accept these names; snippets still support custom artwork.' } } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Decorative: Story = { args: { label: undefined } };
