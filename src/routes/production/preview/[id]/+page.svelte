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

<!-- Style adapté à une page de production e-commerce -->
<div class="bg-gray-100 py-8">
  <div class="container mx-auto px-4">
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
      <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div class="p-8">
          <!-- En-tête de l'article -->
          {#if content.body}
            <div class="prose prose-lg max-w-none">
              {@html content.body}
            </div>
          {:else}
            <div class="text-gray-400 italic py-4">Pas de contenu disponible.</div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>