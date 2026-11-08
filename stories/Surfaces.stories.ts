import type { Meta, StoryObj } from '@storybook/svelte-vite';
import SurfacesExample from './SurfacesExample.svelte';

const meta = {
  title: 'Foundation/Surfaces',
  component: SurfacesExample,
  args: { palette: 'phosphor', size: 'm' },
  argTypes: {
    palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] },
    size: { control: 'select', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof SurfacesExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Paper: Story = { args: { palette: 'paper' } };
export const Plum: Story = { args: { palette: 'plum' } };
