import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './CommandPaletteExample.svelte';

const meta = {
  title: 'Overlays/CommandPalette',
  component: Component,
  tags: ['autodocs'],
  args: { title: 'Command palette' },
  argTypes: { title: { control: 'text' } }
} satisfies Meta<typeof Component>;
export default meta;
export const Playground: StoryObj<typeof meta> = {};
