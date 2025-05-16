<script lang="ts">
import { onMount } from 'svelte';
import { fetchCoconByName } from '$lib/api/directus';
import LanguageFilter from '$lib/components/LanguageFilter.svelte';
import ArticleList from '$lib/components/ArticleList.svelte';
import { page } from '$app/stores';
import { get } from 'svelte/store';

let cocon: any = null;
let selectedLangs: string[] = [];
let filteredArticles: any[] = [];

const langs = ['FR', 'EN', 'NL', 'IT', 'DE'];

onMount(async () => {
  const { params } = get(page);
  const name = params.name;
  const data = await fetchCoconByName(name);
  cocon = data.data[0];
  filterArticles();
});

function filterArticles() {
  if (!cocon) return;
  if (selectedLangs.length === 0) {
    filteredArticles = cocon.articles;
  } else {
    filteredArticles = cocon.articles.filter((article: any) =>
      selectedLangs.every(lang =>
        article.contents.some((c: any) => c.language.toUpperCase() === lang)
      )
    );
  }
}

function onLangChange(langs: string[]) {
  selectedLangs = langs;
  filterArticles();
}
</script>

<div class="container mx-auto py-8">
  <h1 class="text-3xl font-bold mb-4">{cocon?.name}</h1>
  <nav class="mb-4 text-gray-500">
    <a href="/" class="hover:underline">Accueil</a> &gt; {cocon?.name}
  </nav>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <h2 class="text-xl font-semibold mb-2 md:mb-0">Articles</h2>
      <LanguageFilter {langs} bind:selectedLangs on:change={onLangChange} />
    </div>
    <ArticleList {filteredArticles} />
  </div>
</div> 