<script lang="ts">
import { onMount } from 'svelte';
import { fetchCocons } from '$lib/api/directus';
import { goto } from '$app/navigation';
import { Card, CardHeader, CardContent } from '$lib/components/ui/card';
import { Input } from '$lib/components/ui/input';
import { Button } from '$lib/components/ui/button';

let search = '';
let cocons: any[] = [];
let loading = false;
let error = '';
let exports: string[] = [];

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

function onSearchInput(e: Event) {
  search = (e.target as HTMLInputElement).value;
  loadCocons();
}

function goToCocon(name: string) {
  goto(`/cocon/${name}`);
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
      <a href="https://sts.tinycocon.snt2.tech" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 whitespace-nowrap">
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
          {#each cocons as cocon, i (cocon.name)}
            <li class="flex items-center gap-2 py-2 cursor-pointer hover:bg-blue-50 rounded-lg px-2 transition group animate-fade-in" on:click={() => goToCocon(cocon.name)} style="animation-delay: {i * 40}ms">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#2563EB" stroke-width="2" d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z"/><path stroke="#2563EB" stroke-width="2" d="M3 8.25h18"/></svg>
              <span class="font-medium text-gray-900 group-hover:text-blue-700 transition">{cocon.name}</span>
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
                <span class="flex-1 truncate font-medium">{exp}</span>
                <a href={`/exports/${exp}`} download class="hover:text-green-700 text-gray-500 transition" title="Télécharger">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#16A34A" stroke-width="2" d="M12 4v12m0 0l-4-4m4 4l4-4"/></svg>
                </a>
                <a href={`mailto:?subject=Export ${exp}&body=Voici l'export: ${exp}`} class="hover:text-green-700 text-gray-500 transition" title="Envoyer par mail">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#16A34A" stroke-width="2" d="M4 4h16v16H4V4zm0 0l8 8 8-8"/></svg>
                </a>
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
        <Button variant="outline" class="border-gray-200 text-gray-400 cursor-not-allowed" disabled>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#64748B" stroke-width="2" d="M4 4h16v16H4V4zm0 0l8 8 8-8"/></svg>
          Compiler les pages publiées
        </Button>
        <Button variant="outline" class="border-gray-200 text-gray-400 cursor-not-allowed" disabled>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#64748B" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Signaler des pages manquantes
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
