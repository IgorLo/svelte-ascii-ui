import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/DataState.svelte';
const meta={title:'Feedback/DataState',component:Component,tags:['autodocs'],args:{"state": "loading", "title": "Пока нет заметок", "message": "Попробуйте снова."},argTypes:{"state": {"control": "select", "options": ["ready", "loading", "updating", "empty", "error"]}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Empty:Story={args:{"state": "empty"}};
export const Error:Story={args:{"state": "error"}};
