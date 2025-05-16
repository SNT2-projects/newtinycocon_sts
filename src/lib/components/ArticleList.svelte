<script lang="ts">
  export let filteredArticles: any[] = [];
</script>

<ul class="divide-y divide-gray-200">
  {#each filteredArticles as article}
    <li class="py-3 flex items-center gap-4">
      <span class="font-bold text-lg">{article.title}</span>
      <div class="flex gap-1 ml-2">
        {#each article.contents as content}
          <span class="px-2 py-0.5 rounded bg-gray-100 text-xs font-semibold border border-gray-300">
            {content.language.toUpperCase()}
          </span>
        {/each}
      </div>
    </li>
  {/each}
</ul> 