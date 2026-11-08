import type { Meta, StoryObj } from '@storybook/svelte-vite';
import SurfaceComparison from './SurfaceComparison.svelte';
const meta = {title:'Experiments/Surface comparison',component:SurfaceComparison,parameters:{layout:'fullscreen'}} satisfies Meta<typeof SurfaceComparison>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Comparison: Story = {};
