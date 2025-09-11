<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fetchContentById } from '$lib/api/directus';
  import { get } from 'svelte/store';

  let loading = true;
  let error = '';
  let content: any = null;
  let article: any = null;

  onMount(async () => {
    const { params } = get(page);
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
      
      // Récupérer l'article depuis la réponse
      article = content.article;
    } catch (e) {
      error = 'Erreur lors du chargement du contenu.';
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <!-- Charger les styles de production avec une haute priorité -->
  <link rel="stylesheet" href="/prod.css" importance="high" />
  <style>
    /* Styles globaux pour surcharger Tailwind et donner la priorité aux styles de prod.css */
    :global(html) {
      /* Forcer la priorité des styles externes */
      --tw-important: initial !important;
    }
    
    /* Réinitialisation des styles spécifiques qui pourraient être en conflit */
    :global(.preview-container *) {
      font-family: inherit !important;
      box-sizing: border-box !important;
    }
    
    /* Assurez-vous que les styles spécifiques à la prod prennent le dessus */
    :global(.preview-container .prose) {
      max-width: none !important;
    }
  </style>
</svelte:head>

<!-- Utilisation d'une classe conteneur spécifique pour cibler les styles -->
<div class="preview-container bg-white">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Colonne principale -->
      <div class="w-full md:w-1/2 lg:w-2/3">
        {#if loading}
          <div class="flex justify-center p-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        {:else if error}
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        {:else if content}
          <!-- Article principal -->
          <div class="bg-white w-full overflow-hidden">
            <div class="p-8">
              <!-- En-tête de l'article -->
              {#if content.body}
                <div class="article-content">
                  {@html content.body}
                </div>
              {:else}
                <div class="text-gray-400 italic py-4">Pas de contenu disponible.</div>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <!-- Aside - Menu latéral -->
      <aside class="w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
        <!-- Contenu aside de l'article -->
        {#if content?.aside}
          <div class="bg-white rounded-lg p-6 mb-6">
            <div class="aside-content">
              {@html content.aside}
            </div>
          </div>
        {/if}
      </aside>
    </div>
  </div>
</div>