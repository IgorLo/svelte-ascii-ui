import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/Skeleton.svelte';
const meta={title:'Feedback/Skeleton',component:Component,tags:['autodocs'],args:{"width": "100%", "height": "1.2em", "size": "m", "animated": true, "paused": false},argTypes:{"size": {"control": "select", "options": ['s', 'm', 'l']}}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Block:Story={args:{"height": "100px"}};
export const Paused:Story={args:{"paused": true}};
export const Static:Story={args:{"animated": false}};
export const Small:Story={args:{"size": "s"}};

export const Large: Story = { args: { size: 'l' } };
