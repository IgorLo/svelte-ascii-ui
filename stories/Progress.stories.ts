import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/Progress.svelte';
const meta={title:'Feedback/Progress',component:Component,tags:['autodocs'],args:{"value": 0.64, "label": "Подготовка файлов", "size": "m"},argTypes:{"size": {"control": "select", "options": ["s", "m"]}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Small:Story={args:{"size": "s"}};
export const Empty:Story={args:{"value": 0}};
export const Fractional:Story={args:{"value": 0.05}};
export const Complete:Story={args:{"value": 1}};
