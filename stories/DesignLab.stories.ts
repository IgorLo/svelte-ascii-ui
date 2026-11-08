import type { Meta, StoryObj } from '@storybook/svelte-vite';
import DesignLabExample from './DesignLabExample.svelte';

const meta = {
  title: 'Examples/Design Lab',
  component: DesignLabExample,
  args: { palette: 'phosphor', concern: 'density', size: 's' },
  argTypes: {
    palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] },
    concern: { control: 'select', options: ['density', 'surfaces', 'composition'] },
    size: { control: 'select', options: ['s', 'm'], description: 'Surface and composition examples. Density always compares both public sizes.' },
  },
  parameters: { docs: { description: { component: 'Public composition recipe and isolated, explicitly experimental density/surface comparisons. Experimental CSS is story-only and is not a supported customization API.' } } },
} satisfies Meta<typeof DesignLabExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Density: Story = {};
export const Surfaces: Story = { args: { concern: 'surfaces' } };
export const ScoreComposition: Story = { args: { concern: 'composition' } };
export const PaperSurfaces: Story = { args: { concern: 'surfaces', palette: 'paper' } };
export const PlumSurfaces: Story = { args: { concern: 'surfaces', palette: 'plum' } };
export const ScoreCompositionMedium: Story = { args: { concern: 'composition', size: 'm' } };
