import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/Badge.svelte';
const meta={title:'Feedback/Badge',component:Component,tags:['autodocs'],args:{"label": "Черновик", "tone": "default", "size": "m"},argTypes:{"tone": {"control": "select", "options": ["default", "success", "warning", "danger"]}, "size": {"control": "select", "options": ['s', 'm', 'l', 'inherit']}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Success:Story={args:{"tone": "success"}};
export const Warning:Story={args:{"tone": "warning"}};
export const Danger:Story={args:{"tone": "danger"}};
export const Small:Story={args:{"size": "s"}};

export const Large: Story = { args: { size: 'l' } };

export const Inherit: Story = { args: { size: 'inherit' } };
