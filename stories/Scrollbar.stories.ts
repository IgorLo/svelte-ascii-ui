import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ScrollbarExample from './ScrollbarExample.svelte';
const meta = {
  title: 'Foundation/Native scrollbar', component: ScrollbarExample, tags: ['autodocs'],
  args: { palette: 'phosphor', horizontal: false },
  argTypes: { palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] }, horizontal: { control: 'boolean' } },
  parameters: { docs: { description: { component: 'Add the public aui-scrollbar class to each native scroll container within Theme. Chromium/WebKit use a 6px gutter, square full-width thumb, translucent dark track and one small pixel arrow at each end. Firefox uses themed colors with native shape and width. Wheel, keyboard, drag and touch remain native; forced-colors restores the system treatment. The application owns dimensions, overflow and an accessible keyboard focus target.' } } },
} satisfies Meta<typeof ScrollbarExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Paper: Story = { args: { palette: 'paper' } };
export const Plum: Story = { args: { palette: 'plum' } };
export const BothAxes: Story = { args: { horizontal: true } };
