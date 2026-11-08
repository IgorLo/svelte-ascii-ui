import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/content/Quote.svelte';
const meta={title:'Content/Quote',component:Component,tags:['autodocs'],args:{"text": "Хороший интерфейс оставляет место для содержания.", "author": "Заметка из лаборатории"},argTypes:{}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
