import type { Meta, StoryObj } from '@storybook/svelte-vite';
import ReadingExample from '../src/examples/ReadingExample.svelte';
const meta = {
  title: 'Foundation/Reading typography', component: ReadingExample, tags: ['autodocs'],
  args: { palette: 'paper', readable: true },
  argTypes: { palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] }, readable: { control: 'boolean' } },
  parameters: { docs: { description: { component: 'Body and Article text tokens configure reading independently of control geometry. Inline Link and Badge opt into surrounding text with size="inherit". The example compares a dense form, list, native table, summary and long reading text. Defaults retain the compact library scale.' } } },
} satisfies Meta<typeof ReadingExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Reading: Story = {};
export const CompactDefaults: Story = { args: { readable: false } };
export const Dark: Story = { args: { palette: 'phosphor' } };
