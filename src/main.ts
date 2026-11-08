import { mount } from 'svelte';
import './lib/fonts.css';

import Prototype from './Prototype.svelte';
import './prototype.css';

mount(Prototype, { target: document.getElementById('app')! });

