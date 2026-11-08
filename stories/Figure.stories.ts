import type {Meta,StoryObj} from '@storybook/svelte-vite';
import Component from '../src/lib/content/Figure.svelte';
const meta={title:'Content/Figure',component:Component,tags:['autodocs'],args:{"src": "/terminal-landscape.svg", "alt": "Пиксельные горы под восходящим солнцем", "caption": "Утро в терминале", "expandable": true},argTypes:{}} satisfies Meta<typeof Component>;
export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};
export const WithoutExpansion:Story={args:{"expandable": false}};
export const BrokenImage:Story={args:{"src": "/missing-image.png"}};
