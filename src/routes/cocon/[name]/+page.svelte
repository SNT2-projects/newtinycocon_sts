<script lang="ts">
import { onMount } from 'svelte';
import { fetchCoconById } from '$lib/api/directus';
import LanguageFilter from '$lib/components/LanguageFilter.svelte';
import ArticleList from '$lib/components/ArticleList.svelte';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { Input } from '$lib/components/ui/input';

let cocon: any = null;
let loading = true;
let error = '';
let selectedLangs: string[] = [];
let availableLanguages: string[] = [];

// Variables pour la recherche d'articles
let searchTerm = '';
let allArticles: any[] = [];
let filteredArticles: any[] = [];

onMount(async () => {
  const { params, url } = get(page);
  const slug = params.name; // Le nom du paramètre slug
  const id = url.searchParams.get('id');
  
  if (!id) {
    error = 'Cocon introuvable. ID manquant.';
    loading = false;
    return;
  }
  
  try {
    const response = await fetchCoconById(id);
    cocon = response.data;
    
    // Récupérer toutes les langues disponibles dans ce cocon
    if (cocon.articles && cocon.articles.length > 0) {
      const languageSet = new Set<string>();
      cocon.articles.forEach((article: any) => {
        article.contents.forEach((content: any) => {
          if (content.language) {
            languageSet.add(content.language.toUpperCase());
          }
        });
      });
      availableLanguages = Array.from(languageSet);
      
      // Conserver tous les articles pour la recherche
      allArticles = cocon.articles || [];
    }
    
    applyFilters();
  } catch (e) {
    error = 'Erreur lors du chargement du cocon.';
  } finally {
    loading = false;
  }
});

function applyFilters() {
  if (!cocon) return;
  
  // Commencer avec tous les articles
  let articles = allArticles;
  
  // Appliquer le filtre de recherche par titre
  if (searchTerm.trim() !== '') {
    const lowercaseSearch = searchTerm.toLowerCase();
    articles = articles.filter(article => 
      article.title && article.title.toLowerCase().includes(lowercaseSearch)
    );
  }
  
  // Appliquer le filtre par langue
  if (selectedLangs.length > 0) {
    articles = articles.filter(article => 
      article.contents.some((content: any) => 
        selectedLangs.includes(content.language.toUpperCase())
      )
    );
  }
  
  filteredArticles = articles;
}

// Fonction qui reçoit l'événement dispatch du composant LanguageFilter
function onLangChange(event: CustomEvent<string[]>) {
  selectedLangs = event.detail;
  applyFilters();
}

// Fonction pour gérer la recherche
function onSearchInput(e: Event) {
  searchTerm = (e.target as HTMLInputElement).value;
  applyFilters();
}
</script>

<div class="container mx-auto py-8">
  {#if loading}
    <div class="flex justify-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {:else if cocon}
    <h1 class="text-3xl font-bold mb-4">{cocon.title}</h1>
    <nav class="mb-4 text-gray-500 bg-white p-4 rounded-lg shadow-md">
      <a href="/" class="hover:underline">Accueil</a> &gt; {cocon.title}
    </nav>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col gap-4 mb-6">
        <!-- Titre et compteur d'articles -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold">Articles</h2>
            <span class="text-sm text-gray-500">({filteredArticles.length} sur {allArticles.length})</span>
          </div>
          
          <!-- Filtre par langue -->
          {#if availableLanguages.length > 0}
            <div>
              <div class="text-sm text-gray-500 mb-1">Filtrer par langue:</div>
              <LanguageFilter langs={availableLanguages} bind:selectedLangs on:change={onLangChange} />
            </div>
          {/if}
        </div>
        
        <!-- Barre de recherche -->
        <div class="w-full md:max-w-md">
          <div class="flex items-center border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-200 px-3 py-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" class="text-gray-400 mr-2">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
              <path stroke="currentColor" stroke-width="2" d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              type="search"
              placeholder="Rechercher un article..."
              value={searchTerm}
              on:input={onSearchInput}
              class="flex-1 border-none focus:outline-none focus:ring-0 text-sm"
            />
          </div>
        </div>
      </div>
      
      <!-- Résultats -->
      {#if !cocon.articles || cocon.articles.length === 0}
        <div class="text-gray-400 italic py-4">Aucun article disponible pour ce cocon.</div>
      {:else if filteredArticles.length === 0}
        <div class="text-gray-400 italic py-4 border-t border-gray-100 pt-6">
          Aucun article ne correspond à vos critères de recherche.
          {#if searchTerm}
            <button 
              class="text-blue-500 hover:underline ml-2" 
              on:click={() => { searchTerm = ''; applyFilters(); }}
            >
              Effacer la recherche
            </button>
          {/if}
        </div>
      {:else}
        <div class="border-t border-gray-100 pt-6">
          <ArticleList filteredArticles={filteredArticles} coconId={cocon.id} />
        </div>
      {/if}
    </div>
  {:else}
    <div class="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-4">
      Cocon introuvable.
    </div>
  {/if}
</div> 