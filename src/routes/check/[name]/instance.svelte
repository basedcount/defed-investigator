<script lang="ts">
    import type { Instance } from "$lib/instanceList";

    export let inst: Instance;
    export let className: string;   //Specify card colour through this
</script>

<div class="card card-compact w-full shadow-md overflow-clip text-clip {className}">
    <div class="card-body">
        <h2 class="card-title">{inst.name}</h2>
        <a class="link max-w-fit mx-2 md:mx-0" href="https://{inst.domain}">{inst.domain}</a>

        <!-- Used for instances with unknown #users (defaults to -1). Happens in defed list (green) -->
        {#if inst.users > 0}
            <p>{inst.users} {inst.users === 1 ? "active user" : "active users"}</p>
        {:else}
            <p class="invisible">Unavailable</p>
        {/if}
    </div>
</div>
