<script lang="ts">import{Theme,Button,Panel,Progress,Figure,Quote,Background,createSineWaves}from'svelte-ascii-ui';import'svelte-ascii-ui/styles.css';import'svelte-ascii-ui/fonts.css';let count=$state(0);const pattern=createSineWaves({seed:42,waveRandomness:.9});</script>
<p class="host">Host content retains its own font and colors.</p>
<Theme><main><h1>Установленный пакет</h1><Panel title="Проверка зависимости"><Button label={`Счётчик: ${count}`} onclick={()=>count++}/><Progress value={count/10} label="Счётчик"/><Quote text="Компоненты импортированы из установленного tarball."/></Panel><div style="height:140px"><Background {pattern} paused/></div></main></Theme>
<style>.host{color:navy;font-family:Arial}main{padding:24px;background:var(--bg)}h1{font-size:1.4em;font-weight:400}</style>
