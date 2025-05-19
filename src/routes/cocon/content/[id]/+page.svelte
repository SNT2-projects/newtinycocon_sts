<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { fetchContentById } from '$lib/api/directus';
import { get } from 'svelte/store';

let loading = true;
let error = '';
let content: any = null;
let article: any = null;
let cocon: any = null;

onMount(async () => {
  const { params, url } = get(page);
  const contentId = params.id;
  
  if (!contentId) {
    error = 'Contenu introuvable. ID manquant.';
    loading = false;
    return;
  }
  
  try {
    // Charger directement le contenu avec toutes ses relations
    const response = await fetchContentById(contentId);
    content = response.data;
    
    // Récupérer l'article et le cocon depuis la réponse
    article = content.article;
    if (article) {
      cocon = article.cocon;
    }
  } catch (e) {
    error = 'Erreur lors du chargement du contenu.';
  } finally {
    loading = false;
  }
});

function goBack() {
  if (cocon) {
    goto(`/cocon/${cocon.title.toLowerCase().replace(/\s+/g, '-')}?id=${cocon.id}`);
  } else if (article) {
    goto(`/article/${article.id}`);
  } else {
    goto('/');
  }
}

// Fonction pour prévisualiser en mode production
function viewInProduction() {
  goto(`/production/preview/${content.id}`);
}

// Formatage d'une date pour l'affichage
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Déterminer la classe de statut
function getStatusClass(status: string): string {
  switch (status?.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'archived':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

// Traduire le statut en français
function translateStatus(status: string): string {
  switch (status?.toLowerCase()) {
    case 'published':
      return 'publié';
    case 'draft':
      return 'brouillon';
    case 'archived':
      return 'archivé';
    default:
      return status || '';
  }
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
  {:else if content}
    <nav class="mb-4 text-gray-500 flex items-center gap-2">
      <button 
        class="p-1 rounded hover:bg-gray-100" 
        on:click={goBack}
        title="Retour"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <span>
        <a href="/" class="hover:underline">Accueil</a> 
        {#if cocon}
          &gt; <a href={`/cocon/${cocon.title.toLowerCase().replace(/\s+/g, '-')}?id=${cocon.id}`} class="hover:underline">{cocon.title}</a>
        {/if}
        {#if article}
          &gt; <span class="text-gray-700">{article.title}</span>
        {/if}
        <span class="px-2 py-0.5 rounded text-xs font-semibold uppercase ml-2 bg-gray-100 border border-gray-300">{content.language.toUpperCase()}</span>
        
        {#if content.status}
          <span class="px-2 py-0.5 rounded text-xs font-semibold ml-1 {getStatusClass(content.status)}">
            {translateStatus(content.status)}
          </span>
        {/if}
      </span>
      
      <!-- Bouton pour voir en mode production -->
      <button 
        class="ml-auto px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center gap-2 text-sm transition-colors" 
        on:click={viewInProduction}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke="currentColor" stroke-width="2" d="M2 12s3-9 10-9 10 9 10 9-3 9-10 9-10-9-10-9z" />
        </svg>
        Prévisualiser en production
      </button>
    </nav>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- En-tête avec métadonnées -->
      <div class="border-b border-gray-100 p-6">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold mb-2">{content.title || content.meta_title || "Sans titre"}</h1>
            {#if content.description}
              <p class="text-gray-500">{content.description}</p>
            {/if}
          </div>
          
          <div class="flex flex-col gap-2 text-sm text-gray-500">
            {#if content.date_created}
              <div>
                <span class="font-semibold">Créé le:</span> {formatDate(content.date_created)}
              </div>
            {/if}
            {#if content.date_updated}
              <div>
                <span class="font-semibold">Mis à jour le:</span> {formatDate(content.date_updated)}
              </div>
            {/if}
            {#if content.sort}
              <div>
                <span class="font-semibold">Ordre:</span> {content.sort}
              </div>
            {/if}
          </div>
        </div>
      </div>
      
      <!-- Corps du contenu -->
      <div class="p-6">
        {#if content.body}
          <div class="prose prose-lg max-w-none">
            {@html content.body}
          </div>
        {:else}
          <div class="text-gray-400 italic py-4">Pas de contenu disponible.</div>
        {/if}
      </div>
      
      <!-- Liens externes, s'il y en a -->
      {#if content['links-i2k-m']}
        <div class="border-t border-gray-100 p-6 bg-gray-50">
          <h2 class="text-lg font-semibold mb-3">Liens:</h2>
          <div class="flex flex-wrap gap-2">
            {#each Array.isArray(content['links-i2k-m']) ? content['links-i2k-m'] : [content['links-i2k-m']] as link}
              {#if typeof link === 'string'}
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="px-3 py-1 rounded border font-medium transition-colors bg-white text-blue-600 border-blue-200 hover:bg-blue-50 flex items-center gap-1"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" class="text-blue-500">
                    <path stroke="currentColor" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Lien externe
                </a>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Autres versions linguistiques -->
      {#if article && article.contents && article.contents.length > 1}
        <div class="border-t border-gray-100 p-6 bg-gray-50">
          <h2 class="text-lg font-semibold mb-3">Disponible dans d'autres langues:</h2>
          <div class="flex flex-wrap gap-2">
            {#each article.contents as otherContent}
              {#if otherContent.id !== content.id}
                <a 
                  href={`/cocon/content/${otherContent.id}`}
                  class="px-3 py-1 rounded border font-semibold transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  {otherContent.language.toUpperCase()}
                </a>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-4">
      Contenu introuvable.
    </div>
  {/if}
</div> 