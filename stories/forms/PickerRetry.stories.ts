import type { Meta, StoryObj } from '@storybook/svelte-vite';
import RetryPickerStory from './RetryPickerStory.svelte';

const meta = { title: 'Forms/Combobox retry', component: RetryPickerStory } satisfies Meta<typeof RetryPickerStory>;
export default meta;
export const Retry: StoryObj<typeof meta> = {};
