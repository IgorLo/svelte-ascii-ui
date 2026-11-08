import type { Meta, StoryObj } from '@storybook/svelte-vite';
import CompactScaleExample from './CompactScaleExample.svelte';

const meta = {
  title: 'Examples/Compact Scale',
  component: CompactScaleExample,
  args: { palette: 'phosphor' },
  argTypes: { palette: { control: 'select', options: ['phosphor', 'paper', 'plum'] } },
  parameters: { docs: { description: { component: 'Эксперимент: текущий S, пропорционально уменьшенный вариант и текущий M. Настройки библиотеки не меняются; локальные CSS-правила служат только для сравнения.' } } },
} satisfies Meta<typeof CompactScaleExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Comparison: Story = {};
export const Paper: Story = { args: { palette: 'paper' } };
export const Plum: Story = { args: { palette: 'plum' } };
