<script lang="ts">
  import Header from '$lib/components/production/Header.svelte';
  import Footer from '$lib/components/production/Footer.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  // Cette fonction permet de quitter le mode production
  function exitProductionMode() {
    const path = $page.url.pathname;
    const contentId = path.split('/').pop();
    
    if (contentId) {
      goto(`/cocon/content/${contentId}`);
    } else {
      goto('/');
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/prod.css">
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />
  
  <!-- Bannière admin pour quitter le mode production -->
  <div class="bg-blue-900 text-white py-2 px-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-sm font-medium">Mode prévisualisation production</div>
      <button 
        class="text-xs bg-white text-blue-900 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
        on:click={exitProductionMode}
      >
        Quitter ce mode
      </button>
    </div>
  </div>
  
  <main class="flex-grow">
    <slot />
  </main>
  
  <Footer />
</div> 