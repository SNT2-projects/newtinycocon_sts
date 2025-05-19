<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let langs: string[] = [];
  export let selectedLangs: string[] = [];
  const dispatch = createEventDispatcher();

  // Associer une couleur à chaque langue
  const langColors: Record<string, { bg: string, text: string, border: string }> = {
    'FR': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    'EN': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    'DE': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    'IT': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    'NL': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
    'ES': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' }
  };

  function getColorClasses(lang: string, isSelected: boolean) {
    const color = langColors[lang] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    if (isSelected) {
      return `${color.bg} ${color.text} ${color.border} ring-2 ring-offset-1 ring-blue-400`;
    }
    return `${color.bg} ${color.text} ${color.border} opacity-60 hover:opacity-100`;
  }

  function toggleLang(lang: string) {
    if (selectedLangs.includes(lang)) {
      selectedLangs = selectedLangs.filter(l => l !== lang);
    } else {
      selectedLangs = [...selectedLangs, lang];
    }
    dispatch('change', selectedLangs);
  }
</script>

<div class="flex flex-wrap gap-2">
  {#each langs as lang}
    <button
      type="button"
      class="px-3 py-1 rounded border font-semibold transition-all
        {getColorClasses(lang, selectedLangs.includes(lang))}"
      on:click={() => toggleLang(lang)}
      title={selectedLangs.includes(lang) ? `Désélectionner ${lang}` : `Sélectionner ${lang}`}
    >
      {lang}
    </button>
  {/each}
</div> 