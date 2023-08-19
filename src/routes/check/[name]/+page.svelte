<script lang="ts">
    import type { PageData } from './$types';

	export let data: PageData;

    let progress = 0;
    let percentage = 0;

    data.instances.forEach(p => {
        p.then(() => {
            percentage = progress++ / data.total * 100;
        })

        p.catch(() => {
            percentage = progress++ / data.total * 100;
        })
    });
</script>

<svelte:head>
	<title>Info on {data.name}</title>
	<meta name="description" content="">
</svelte:head>

Scanned: {percentage + "%"} {progress} / {data.total}

<br>


<div style="margin-top: 4rem;">
The following instances have blocked <span>{data.name}</span>
<br/>
{#each data.instances as instance}
        {#await instance then inst}
            {#if inst.blocked}
                {inst.name}
                <br/>
            {/if}
        {/await}
{/each}
</div>
