import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/feedback/Separator.svelte';
const meta={title:'Foundation/Separator',component:Component,tags:['autodocs'],args:{"vertical": false},argTypes:{}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const Vertical:Story={args:{"vertical": true}};
