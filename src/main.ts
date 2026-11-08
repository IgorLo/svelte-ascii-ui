import { mount } from 'svelte';
import './lib/fonts.css';

import Gallery from './Gallery.svelte';

mount(Gallery, { target: document.getElementById('app')! });

