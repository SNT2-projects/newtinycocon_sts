<script lang="ts">
  import { goto } from '$app/navigation';
  export let filteredArticles: any[] = [];
  export let coconId: string = '';

  function navigateToContent(articleId: string, contentId: string, language: string) {
    console.log("[Navigation] Tentative de navigation vers le contenu:", { articleId, contentId, language, coconId });
    const url = `/cocon/content/${contentId}?article=${articleId}&cocon=${coconId}&lang=${language}`;
    console.log("[Navigation] URL de destination:", url);
    goto(url);
  }

  // Determine the color class based on content status
  function getStatusColorClass(status: string | undefined): string {
    if (!status) return '';
    
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300';
      case 'draft':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300';
      case 'archived':
        return 'bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400';
      default:
        return 'bg-gray-100 border-gray-300 hover:bg-blue-50 hover:border-blue-300';
    }
  }
</script>

<ul class="divide-y divide-gray-200">
  {#each filteredArticles as article}
    <li class="py-3">
      <div class="flex items-center gap-4 mb-2">
        <span class="font-bold text-lg">{article.title}</span>
      </div>
      <div class="flex flex-wrap gap-2 ml-2">
        {#each article.contents as content}
          <button 
            class="px-2 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 {getStatusColorClass(content.status)}"
            on:click={() => navigateToContent(article.id, content.id, content.language)}
          >
            <span class="uppercase">{content.language}</span>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" class="ml-1 text-gray-500">
              <path stroke="currentColor" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        {/each}
      </div>
    </li>
  {/each}
</ul> 