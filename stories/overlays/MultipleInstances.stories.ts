import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './MultipleInstancesExample.svelte';
const meta = {
  title: 'Overlays/MultipleInstances',
  component: Component,
  tags: ['autodocs']
} satisfies Meta<typeof Component>;
export default meta;
export const Playground: StoryObj<typeof meta> = {};
