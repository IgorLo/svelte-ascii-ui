import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/content/Callout.svelte';
const meta={title:'Content/Callout',component:Component,tags:['autodocs'],args:{"title": "Важно", "message": "Цвет дополняет смысл, а подпись сохраняет его.", "tone": "default"},argTypes:{"tone": {"control": "select", "options": ["default", "success", "warning", "danger"]}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Warning:Story={args:{"tone": "warning"}};
export const Danger:Story={args:{"tone": "danger"}};
