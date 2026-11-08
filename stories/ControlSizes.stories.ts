import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ControlSizesExample from './ControlSizesExample.svelte';

const meta = {
  title: 'Foundation/Control sizes',
  component: ControlSizesExample,
  args: { palette: 'phosphor' },
  argTypes: { palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] } },
  parameters: { docs: { description: { component: 'S, M and L built from public components. This composition adds page layout only; it does not override component styles.' } } },
} satisfies Meta<typeof ControlSizesExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllSizes: Story = {};
export const Paper: Story = { args: { palette: 'paper' } };
export const Plum: Story = { args: { palette: 'plum' } };
