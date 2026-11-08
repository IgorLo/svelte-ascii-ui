import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/Alert.svelte';
const meta={title:'Feedback/Alert',component:Component,tags:['autodocs'],args:{"title": "Изменения сохранены", "message": "Можно продолжать работу.", "tone": "success", "size": "m", "live": false},argTypes:{"tone": {"control": "select", "options": ["default", "success", "warning", "danger"]}, "size": {"control": "select", "options": ["s", "m"]}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Error:Story={args:{"tone": "danger", "title": "Не удалось сохранить", "message": "Попробуйте ещё раз."}};
export const Warning:Story={args:{"tone": "warning"}};
export const Small:Story={args:{"size": "s"}};
