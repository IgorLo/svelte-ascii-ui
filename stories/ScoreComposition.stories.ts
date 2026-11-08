import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ScoreCompositionExample from './ScoreCompositionExample.svelte';

const meta = {
  title: 'Examples/Score composition',
  component: ScoreCompositionExample,
  args: { palette: 'phosphor', size: 'm' },
  argTypes: {
    palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] },
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof ScoreCompositionExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Large: Story = { args: { size: 'l' } };
export const Paper: Story = { args: { palette: 'paper' } };
export const Plum: Story = { args: { palette: 'plum' } };
