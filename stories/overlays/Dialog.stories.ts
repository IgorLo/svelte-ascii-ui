import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from './DialogExample.svelte';

const meta = {
  title: 'Overlays/Dialog',
  component: Component,
  tags: ['autodocs'],
  args: { title: 'Session settings', size: 'm', closeOnEscape: true, closeOnBackdrop: true, mobilePlacement: 'center' },
  argTypes: { size: { control: 'inline-radio', options: ['s', 'm', 'l', 'xl', 'fit'] }, long: { control: 'boolean' }, mobilePlacement: { control: 'inline-radio', options: ['center', 'bottom'] } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Small: Story = { args: { size: 's' } };
export const Large: Story = { args: { size: 'l' } };
export const ExtraLarge: Story = { args: { size: 'xl' } };
export const Fit: Story = { args: { size: 'fit' } };
export const LongContent: Story = { args: { long: true } };
export const ExplicitDismissal: Story = { args: { closeOnEscape: false, closeOnBackdrop: false } };

export const ResponsiveDetails: Story = { args: { mobilePlacement: 'bottom' } };
export const ResponsiveLongContent: Story = { args: { mobilePlacement: 'bottom', long: true } };
