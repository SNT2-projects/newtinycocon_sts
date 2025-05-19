<script lang="ts">
import { onMount } from 'svelte';
import { fetchCocons } from '$lib/api/directus';
import { goto } from '$app/navigation';
import { Card, CardHeader, CardContent } from '$lib/components/ui/card';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';
const API_URL = import.meta.env.VITE_DIRECTUS_URL;


let search = '';
let cocons: any[] = [];
let loading = false;
let error = '';
let exports: string[] = [];
let compiling = false;
let deleting = '';

async function loadCocons() {
  loading = true;
  error = '';
  try {
    const data = await fetchCocons(search);
    cocons = data.data;
  } catch (e) {
    error = 'Impossible de charger les cocons.';
  } finally {
    loading = false;
  }
}

async function loadExports() {
  try {
    const res = await fetch('/api/exports');
    exports = await res.json();
  } catch (e) {
    // ignore
  }
}

async function compilePages() {
  if (compiling) return;
  
  compiling = true;
  try {
    const response = await fetch('/api/compile', {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la compilation');
    }
    
    const result = await response.json();
    
    // Rafraîchir la liste des exports après compilation
    await loadExports();
    
    alert(`Compilation terminée! ${result.exportName} créé avec ${result.filesCount} fichiers.`);
  } catch (e) {
    alert('Erreur lors de la compilation. Veuillez réessayer.');
    console.error(e);
  } finally {
    compiling = false;
  }
}

async function deleteExport(name: string) {
  if (deleting) return;
  
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'export "${name}" ?`)) {
    return;
  }
  
  deleting = name;
  try {
    const response = await fetch(`/api/exports/${name}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erreur lors de la suppression');
    }
    
    // Rafraîchir la liste des exports après suppression
    await loadExports();
    
  } catch (e) {
    alert('Erreur lors de la suppression. Veuillez réessayer.');
    console.error(e);
  } finally {
    deleting = '';
  }
}

function onSearchInput(e: Event) {
  search = (e.target as HTMLInputElement).value;
  loadCocons();
}

function goToCocon(id: string, title: string) {
  // Crée un slug à partir du titre (remplace les espaces par des tirets, en minuscules, sans caractères spéciaux)
  const slug = title.toLowerCase()
    .replace(/[^\w\s-]/g, '') // supprime les caractères spéciaux
    .replace(/\s+/g, '-') // remplace les espaces par des tirets
    .replace(/--+/g, '-'); // évite les tirets multiples
  
  goto(`/cocon/${slug}?id=${id}`);
}

// Fonction pour extraire et formater la date de l'export à partir du nom
function parseExportDate(exportName: string): string {
  // Format typique: export-DD-MM-YYYY_HH-MM-SS
  const match = exportName.match(/export-(\d{2})-(\d{2})-(\d{4})_(\d{2})-(\d{2})-(\d{2})/);
  
  if (!match) return '';
  
  const [_, day, month, year, hours, minutes] = match;
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

onMount(() => {
  loadCocons();
  loadExports();
});
</script>

<div class="container mx-auto py-10 flex flex-col gap-8">
  <!-- Header principal -->
  <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
    <div class="flex items-center gap-3">
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="#FFEDD5"/><path d="M12 28V12h16v16H12Zm2-2h12V14H14v12Zm2-2v-8h8v8h-8Z" fill="#F59E42"/></svg>
      <div class="flex items-center gap-2">
        <div class="text-2xl font-extrabold tracking-tight text-gray-900">TinyCocon</div>
        <span class="text-xs font-semibold text-orange-500 bg-orange-50 rounded px-2 py-0.5 align-middle">studioSPORT</span>
      </div>
      <div class="hidden md:block text-sm text-gray-500 font-medium ml-2">Gestionnaire de cocons sémantiques</div>
    </div>
    <Button asChild variant="outline" class="border-orange-300 text-orange-700 hover:bg-orange-50 whitespace-nowrap flex items-center gap-2">
      <a href={`${API_URL}/admin`} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 whitespace-nowrap">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#F59E42" stroke-width="2" d="M12 5v14m7-7H5"/></svg>
        Accès Admin
      </a>
    </Button>
  </header>

  <!-- Section Cocons -->
  <Card class="mb-2">
    <CardHeader class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-2">
      <div class="flex items-center gap-2">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#2563EB" stroke-width="2" d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z"/><path stroke="#2563EB" stroke-width="2" d="M3 8.25h18"/></svg>
        <span class="font-semibold text-lg text-gray-900">Cocons disponibles</span>
      </div>
      <Input
        class="w-full md:w-72 border-gray-200 focus:ring-2 focus:ring-blue-200"
        placeholder="Rechercher un cocon..."
        value={search}
        on:input={onSearchInput}
        iconLeft
      >
        <svg slot="iconLeft" width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#94A3B8" stroke-width="2"/><path stroke="#94A3B8" stroke-width="2" d="M21 21l-3.5-3.5"/></svg>
      </Input>
    </CardHeader>
    <CardContent class="pt-0">
      {#if loading}
        <div class="space-y-2">
          {#each Array(5) as _}
            <div class="h-8 bg-gray-100 rounded animate-pulse"></div>
          {/each}
        </div>
      {:else if error}
        <div class="text-red-500">{error}</div>
      {:else if cocons.length === 0}
        <div class="text-gray-400 italic">Aucun cocon trouvé.</div>
      {:else}
        <ul class="max-h-64 overflow-y-auto divide-y divide-gray-100">
          {#each cocons as cocon, i (cocon.id)}
            <li class="flex items-center justify-between py-2 cursor-pointer hover:bg-blue-50 rounded-lg px-2 transition group animate-fade-in" on:click={() => goToCocon(cocon.id, cocon.title)} style="animation-delay: {i * 40}ms">
              <div class="flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#2563EB" stroke-width="2" d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z"/><path stroke="#2563EB" stroke-width="2" d="M3 8.25h18"/></svg>
                <span class="font-medium text-gray-900 group-hover:text-blue-700 transition">{cocon.title}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                  <span>{cocon.articles?.length || 0} article{cocon.articles?.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </CardContent>
  </Card>

  <!-- Section Exports & Actions -->
  <div class="grid md:grid-cols-2 gap-8">
    <!-- Exports récents -->
    <Card>
      <CardHeader class="flex items-center gap-2 pb-2">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#16A34A" stroke-width="2" d="M4 17.25V6.75A2.25 2.25 0 0 1 6.25 4.5h11.5A2.25 2.25 0 0 1 20 6.75v10.5A2.25 2.25 0 0 1 17.75 19.5H6.25A2.25 2.25 0 0 1 4 17.25Z"/><path stroke="#16A34A" stroke-width="2" d="M8 12h8m-4-4v8"/></svg>
        <span class="font-semibold text-lg text-gray-900">Exports récents</span>
      </CardHeader>
      <CardContent>
        {#if exports.length === 0}
          <div class="text-gray-400 italic">Aucun export trouvé.</div>
        {:else}
          <ul class="space-y-2">
            {#each exports as exp, i (exp)}
              <li class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 shadow-sm animate-fade-in" style="animation-delay: {i * 60}ms">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#16A34A" stroke-width="2" d="M4 17.25V6.75A2.25 2.25 0 0 1 6.25 4.5h11.5A2.25 2.25 0 0 1 20 6.75v10.5A2.25 2.25 0 0 1 17.75 19.5H6.25A2.25 2.25 0 0 1 4 17.25Z"/><path stroke="#16A34A" stroke-width="2" d="M8 12h8m-4-4v8"/></svg>
                
                <div class="flex-1 flex items-center gap-2">
                  <span class="font-medium truncate">{exp}</span>
                  {#if parseExportDate(exp)}
                    <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{parseExportDate(exp)}</span>
                  {/if}
                </div>
                
                <a href={`/exports/${exp}`} download class="hover:text-green-700 text-gray-500 transition" title="Télécharger">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#16A34A" stroke-width="2" d="M12 4v12m0 0l-4-4m4 4l4-4"/></svg>
                </a>
                
                <a href={`mailto:?subject=Export ${exp}&body=Voici l'export: ${exp}`} class="hover:text-green-700 text-gray-500 transition" title="Envoyer par mail">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#16A34A" stroke-width="2" d="M4 4h16v16H4V4zm0 0l8 8 8-8"/></svg>
                </a>
                
                <button 
                  class="hover:text-red-700 text-gray-500 transition" 
                  title="Supprimer" 
                  on:click|stopPropagation={(e) => { 
                    e.preventDefault(); 
                    deleteExport(exp); 
                  }}
                  disabled={deleting === exp}
                >
                  {#if deleting === exp}
                    <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  {:else}
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#EF4444" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </CardContent>
    </Card>

    <!-- Actions principales -->
    <Card>
      <CardHeader class="flex items-center gap-2 pb-2">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#F59E42" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        <span class="font-semibold text-lg text-gray-900">Actions rapides</span>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <Button variant="outline" class="border-gray-200 hover:bg-blue-50 text-gray-700 hover:text-blue-700" on:click={compilePages} disabled={compiling}>
          {#if compiling}
            <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Compilation en cours...
          {:else}
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#64748B" stroke-width="2" d="M4 4h16v16H4V4zm0 0l8 8 8-8"/></svg>
            Compiler les pages publiées
          {/if}
        </Button>
        <Button asChild variant="destructive" class=" border-red-200 bg-red-50 text-red-700 hover:bg-red-100">
          <a class="flex items-center gap-2" href="mailto:service-info@snt2.fr?subject=Problème%20TinyCocon%20(studioSPORT)&body=Bonjour, je rencontre un problème sur l'application TinyCocon (studioSPORT)">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#DC2626" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Signaler un problème
          </a>
        </Button>
      </CardContent>
    </Card>
  </div>
</div>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: none; }
}
.animate-fade-in {
  animation: fade-in 0.5s both;
}
</style>
