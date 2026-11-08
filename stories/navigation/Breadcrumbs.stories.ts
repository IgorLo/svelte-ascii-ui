import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Component from '../../src/lib/navigation/Breadcrumbs.svelte';

const meta = {
  title: 'Navigation/Breadcrumbs',
  component: Component,
  tags: ['autodocs'],
  args: { label: 'Breadcrumbs', items: [{ label: 'Home', href: '#home' }, { label: 'Workspace', href: '#workspace' }, { label: 'Session', current: true }] },
  argTypes: { items: { control: 'object' }, label: { control: 'text' } }
} satisfies Meta<typeof Component>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Wrapping: Story = { args: { items: [{ label: 'All workspaces', href: '#workspaces' }, { label: 'Shared tools and references', href: '#tools' }, { label: 'Terminal archive', href: '#archive' }, { label: 'Weekly session report' }] } };
