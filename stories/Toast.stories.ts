import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/Toast.svelte';
const meta={title:'Feedback/Toast',component:Component,tags:['autodocs'],args:{"open": true, "message": "Черновик сохранён", "tone": "default", "size": "s"},argTypes:{"tone": {"control": "select", "options": ["default", "success", "warning", "danger"]}, "size": {"control": "select", "options": ['s', 'm', 'l']}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Error:Story={args:{"tone": "danger"}};
export const Closed:Story={args:{"open": false}};

export const Large: Story = { args: { size: 'l' } };
