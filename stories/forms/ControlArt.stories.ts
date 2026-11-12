import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ControlArtExample from './ControlArtExample.svelte';

const meta = {
  title: 'Forms/Control artwork',
  component: ControlArtExample,
  args: { palette: 'phosphor', width: 280 },
  argTypes: {
    palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] },
    width: { control: 'number' },
  },
  parameters: { docs: { description: { component: 'Square checkbox frames and joined dashed scales in S, M and L. Resize the example and use the keyboard to inspect focus and endpoint positions.' } } },
} satisfies Meta<typeof ControlArtExample>;
export default meta;
type Story = StoryObj<typeof meta>;

export const AllSizes: Story = {};
export const Narrow: Story = { args: { width: 144 } };
export const Wide: Story = { args: { width: 640 } };
export const Paper: Story = { args: { palette: 'paper' } };
export const Plum: Story = { args: { palette: 'plum' } };
