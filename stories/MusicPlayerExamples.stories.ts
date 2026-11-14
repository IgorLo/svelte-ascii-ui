import type { Meta, StoryObj } from '@storybook/svelte-vite';
import MusicPlayerExample from './MusicPlayerExample.svelte';
const meta = { title: 'Media/MusicPlayer examples', component: MusicPlayerExample } satisfies Meta<typeof MusicPlayerExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const LocalFiles: Story = { args: { mode: 'files' } };
export const MultiplePlayers: Story = { args: { mode: 'multiple' } };
