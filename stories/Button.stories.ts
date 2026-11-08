import type { Meta,StoryObj } from '@storybook/svelte-vite';
import Button from '../src/lib/Button.svelte';
const meta={title:'Actions/Button',component:Button,tags:['autodocs'],args:{label:'Применить',size:'m',variant:'default',disabled:false,loading:false,fullWidth:false},argTypes:{size:{control:'select',options:['s', 'm', 'l']},variant:{control:'select',options:['default','primary','danger']},children:{control:false},icon:{control:'select',options:[undefined,'plus','minus','chevron-down','close','refresh','info']},iconEnd:{control:'select',options:[undefined,'plus','minus','chevron-down','close','refresh','info']}},parameters:{docs:{description:{component:'Кнопка действия. Иконки задаются именем Pixelarticons или snippets icon/iconEnd; loading сохраняет подпись и блокирует действие. По умолчанию type="button".'}}}} satisfies Meta<typeof Button>;
export default meta;type Story=StoryObj<typeof meta>;
export const Playground:Story={};export const Small:Story={args:{size:'s'}};export const Primary:Story={args:{variant:'primary'}};export const Danger:Story={args:{variant:'danger',label:'Удалить'}};export const Disabled:Story={args:{disabled:true}};export const Loading:Story={args:{loading:true,label:'Сохранение'}};export const LongLabel:Story={args:{label:'Сохранить настройки ко всем выбранным изображениям'}};export const FullWidth:Story={args:{fullWidth:true}};

export const Large: Story = { args: { size: 'l' } };

export const WithIcon: Story = { args: { label: 'Создать подборку', icon: 'plus' } };
export const Refresh: Story = { args: { label: 'Обновить данные', icon: 'refresh' } };
