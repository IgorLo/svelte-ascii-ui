import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/EmptyState.svelte';
const meta={title:'Feedback/EmptyState',component:Component,tags:['autodocs'],args:{"title": "Пока нет заметок", "description": "Создайте первую заметку."},argTypes:{}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const LongText:Story={args:{"description": "Длинное описание пустого состояния, которое переносится на узком экране и помогает понять, что делать дальше."}};
