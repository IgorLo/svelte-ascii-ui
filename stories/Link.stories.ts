import type { Meta,StoryObj } from '@storybook/svelte-vite';import Link from '../src/lib/Link.svelte';
const meta={title:'Actions/Link',component:Link,tags:['autodocs'],args:{label:'Открыть проект ↗',href:'#example',button:false,size:'m'},argTypes:{size:{control:'select',options:['s', 'm', 'l']},children:{control:false}}} satisfies Meta<typeof Link>;export default meta;type Story=StoryObj<typeof meta>;export const Playground:Story={};export const ButtonLink:Story={args:{button:true}};

export const Large: Story = { args: { size: 'l' } };
