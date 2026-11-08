import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/Loader.svelte';
const meta={title:'Feedback/Loader',component:Component,tags:['autodocs'],args:{"size": "m"},argTypes:{"size": {"control": "select", "options": ['s', 'm', 'l']}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Small:Story={args:{"size": "s"}};

export const Large: Story = { args: { size: 'l' } };
