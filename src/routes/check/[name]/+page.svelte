<script lang="ts">
    import type { PageData } from './$types';

	export let data: PageData;

    let progress = 1;
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

<main class="h-[calc(100vh-4rem)] w-full bg-base-200">
    <div class="mx-4 md:mx-auto md:w-2/3 flex flex-col items-center">
        {#if data.warning}
            <div class="alert alert-warning mt-3 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>No instance found with name <span class="font-mono">{data.name}</span>; whatch for spelling mistakes!</span>
            </div>
        {/if}

        <h1 class="text-2xl mt-2 font-semibold">
            Statistics for <span class="font-mono">{data.name}</span>
        </h1>

        <div class="grid grid-cols-3 mt-6 w-full">
            <div class="col-span-3">
                Explored instances:
            </div>
            <div>
                {progress - 1} / {data.total} 
            </div>
            <div/>
            <div class="place-self-end">
                {percentage.toFixed(2) + "%"}
            </div>

            <progress class="progress progress-primary h-4 col-span-3" value={percentage} max="100"></progress>
        </div>

        <div class="mt-6 w-full flex flex-col gap-4">
            <div class="collapse collapse-arrow bg-secondary">
                <input type="radio" name="my-accordion-2" checked={true} /> 
                <div class="collapse-title text-xl font-medium">
                    Instances defederated from <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content">
                    {#each data.instances as instance}
                    {#await instance then inst}
                    {#if inst.blocked}
                        <li>
                            {inst.name}
                        </li>
                    {/if}
                    {/await}
                    {/each}
                </div>
            </div>

            <div class="collapse collapse-arrow bg-accent">
                <input type="radio" name="my-accordion-2" /> 
                <div class="collapse-title text-xl font-medium">
                    Instances federated with <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content"> 
                    {#each data.instances as instance}
                    {#await instance then inst}
                    {#if inst.linked}
                        <li>
                            {inst.name}
                        </li>
                    {/if}
                    {/await}
                    {/each}
                </div>
            </div>

            <div class="collapse collapse-arrow bg-error">
                <input type="radio" name="my-accordion-2" /> 
                <div class="collapse-title text-xl font-medium">
                    Instances that returned errors
                </div>
                <div class="collapse-content"> 
                    {#each data.instances as instance}
                    {#await instance then inst}
                    {#if inst.error}
                        <li>
                            {inst.name}
                        </li>
                    {/if}
                    {/await}
                    {/each}
                </div>
            </div>
        </div>
    </div>   
</main>