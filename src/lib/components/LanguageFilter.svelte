<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let langs: string[] = [];
  export let selectedLangs: string[] = [];
  const dispatch = createEventDispatcher();

  function toggleLang(lang: string) {
    if (selectedLangs.includes(lang)) {
      selectedLangs = selectedLangs.filter(l => l !== lang);
    } else {
      selectedLangs = [...selectedLangs, lang];
    }
    dispatch('change', selectedLangs);
  }
</script>

<div class="flex gap-2">
  {#each langs as lang}
    <button
      type="button"
      class="px-3 py-1 rounded border font-semibold transition-colors
        {selectedLangs.includes(lang) ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}"
      on:click={() => toggleLang(lang)}
    >
      {lang}
    </button>
  {/each}
</div> 