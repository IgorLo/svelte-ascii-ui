import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ScrollbarExample from './ScrollbarExample.svelte';
const meta = {
  title: 'Foundation/Native scrollbar', component: ScrollbarExample, tags: ['autodocs'],
  args: { palette: 'phosphor' },
  argTypes: { palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] } },
  parameters: { docs: { description: { component: 'Add the public aui-scrollbar class to a native scroll container within Theme. The application owns dimensions, overflow and an accessible keyboard focus target. System width and platform scrollbar behavior are retained; forced-colors uses system colors.' } } },
} satisfies Meta<typeof ScrollbarExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Paper: Story = { args: { palette: 'paper' } };
export const Plum: Story = { args: { palette: 'plum' } };
