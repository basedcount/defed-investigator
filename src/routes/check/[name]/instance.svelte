<script lang="ts">
    import type { Instance } from "$lib/instanceList";

    export let inst: Instance;
    export let className: string; //Specify card colour through this
</script>

<div class="card card-compact w-full shadow-md overflow-clip text-clip {className}">
    
    <div class="card-body ">
        <!-- Background image -->
        {#if inst.software}
            <img src="/software/{inst.software}.svg" alt={inst.software} class="h-full absolute top-0 right-4 py-4 opacity-25 z-10"/>
        {/if}
        <h2 class="card-title line-clamp-1 z-20">{inst.name}</h2>
        <a class="link max-w-fit mx-2 md:mx-0 z-20" href="https://{inst.domain}">{inst.domain}</a>

        <!-- Used for instances with unknown #users (defaults to -1). Happens in defed list (green) -->
        {#if inst.users > 0}
            <p class="z-20">{inst.users} {inst.users === 1 ? "active user" : "active users"}</p>
        {:else}
            <p class="invisible">Unavailable</p>
        {/if}
    </div>
</div>
