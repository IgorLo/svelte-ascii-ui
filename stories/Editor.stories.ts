import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { expect, userEvent, within } from 'storybook/test';
import Editor from './EditorExample.svelte';
const meta = { title:'Examples/Editor', component:Editor, tags:['autodocs'], args:{size:'s'}, argTypes:{size:{control:'select',options:['s', 'm', 'l']}} } satisfies Meta<typeof Editor>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Compact: Story = {};
export const Medium: Story = {args:{size:'m'}};
export const SaveAndRetry: Story = {play:async({canvasElement})=>{
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('checkbox'));
  await userEvent.click(canvas.getByRole('button',{name:'Сохранить'}));
  await expect(await canvas.findByRole('alert')).toHaveTextContent('Не удалось сохранить');
  await userEvent.click(canvas.getByRole('checkbox'));
  await userEvent.click(canvas.getByRole('button',{name:'Сохранить'}));
  await expect(await canvas.findByText('Сохранено')).toBeVisible();
}};

export const Large: Story = { args: { size: 'l' } };
