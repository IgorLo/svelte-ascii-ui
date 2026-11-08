import type { Meta, StoryObj } from '@storybook/svelte-vite';
import FormSubmissionStory from './FormSubmissionStory.svelte';

const meta = { title: 'Forms/Form submission', component: FormSubmissionStory } satisfies Meta<typeof FormSubmissionStory>;
export default meta;
export const NativeForm: StoryObj<typeof meta> = {};
