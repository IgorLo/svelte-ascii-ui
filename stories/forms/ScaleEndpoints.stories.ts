import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ScaleEndpointsExample from './ScaleEndpointsExample.svelte';

const meta = {
  title: 'Forms/Scale endpoints',
  component: ScaleEndpointsExample,
  args: { size: 's', width: 280, palette: 'paper' },
  argTypes: {
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
    palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] },
    width: { control: 'number' },
    marks: { control: 'object' },
  },
  parameters: { docs: { description: { component: 'Numeric ticks stay whole and centered under a host that wraps text anywhere. Custom text labels wrap within bounded space, align inward near the endpoints and reserve their height. Selected rails include an endpoint only when their interval reaches it.' } } },
} satisfies Meta<typeof ScaleEndpointsExample>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NumericTicks: Story = {};
export const Narrow: Story = { args: { width: 144 } };
export const Wide: Story = { args: { width: 640 } };
export const Medium: Story = { args: { size: 'm' } };
export const Large: Story = { args: { size: 'l' } };
export const CustomLabels: Story = { args: { marks: [{ value: 0, label: 'Low cost' }, { value: 100, label: 'High cost' }] } };

export const LongCustomLabels: Story = { args: { marks: [{ value: 0, label: 'Minimum' }, { value: 100, label: 'Maximum safe temperature' }] } };
