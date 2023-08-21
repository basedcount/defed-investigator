<script lang="ts">
    import type { PageData } from './$types';

	export let data: PageData;

    let progress = 1;
    let percentage = 0;
    let blockedCount = 0;
    let linkedCount = 0;
    let errorCount = 0;

    data.instances.forEach(p => {
        p.then(val => {
            percentage = progress++ / data.total * 100;
            if(val.blocked) blockedCount++
            if(val.linked) linkedCount++
            if(val.error) errorCount++
        })

        p.catch(() => {
            percentage = progress++ / data.total * 100;
            errorCount++
        })
    });

    function trimUrl(url: string){
        return url.substring(8);    //From "https://example.com" return "example.com"
    }
</script>

<svelte:head>
	<title>Info on {data.name}</title>
	<meta name="description" content="">
</svelte:head>

<main class="min-h-[calc(100vh-4rem)] w-full bg-base-200 pb-6">
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
                <input type="checkbox" name="my-accordion-2" checked={true} /> 
                <div class="collapse-title text-xl font-medium">
                    Instances defederated from <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                    <div class="col-span-full">
                        {blockedCount} total instances
                    </div>

                    {#each data.instances as instance}
                    {#await instance then inst}
                    {#if inst.blocked}
                        <div class="card card-compact w-full bg-secondary-focus shadow-md overflow-clip text-clip">
                            <div class="card-body">
                              <h2 class="card-title">{inst.name}</h2>
                              <a class="link max-w-fit mx-2" href="{inst.url}">{trimUrl(inst.url)}</a>
                              <p>{inst.users} {inst.users === 1 ? 'active user' : 'active users'}</p>
                            </div>
                        </div>
                    {/if}
                    {/await}
                    {/each}
                </div>
            </div>

            <div class="collapse collapse-arrow bg-accent">
                <input type="checkbox" name="my-accordion-2" /> 
                <div class="collapse-title text-xl font-medium">
                    Instances federated with <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4"> 
                    <div class="col-span-full">
                        {linkedCount} total instances
                    </div>

                    {#each data.instances as instance}
                    {#await instance then inst}
                    {#if inst.linked}
                    <div class="card card-compact w-full bg-accent-focus shadow-md overflow-clip text-clip">
                        <div class="card-body">
                          <h2 class="card-title">{inst.name}</h2>
                          <a class="link max-w-fit mx-2" href="{inst.url}">{trimUrl(inst.url)}</a>
                          <p>{inst.users} {inst.users === 1 ? 'active user' : 'active users'}</p>
                        </div>
                    </div>
                    {/if}
                    {/await}
                    {/each}
                </div>
            </div>

            {#if errorCount > 0}
            <div class="collapse collapse-arrow bg-error">
                <input type="checkbox" name="my-accordion-2" /> 
                <div class="collapse-title text-xl font-medium">
                    Instances that returned errors
                </div>
                <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                    <div class="col-span-full">
                        {errorCount} total instances
                    </div>

                    {#each data.instances as instance}
                    {#await instance then inst}
                    {#if inst.error}
                    <div class="card card-compact w-full bg-red-400 shadow-md overflow-clip text-clip">
                        <div class="card-body">
                          <h2 class="card-title">{inst.name}</h2>
                          <a class="link max-w-fit mx-2" href="{inst.url}">{trimUrl(inst.url)}</a>
                          <p>{inst.users} {inst.users === 1 ? 'active user' : 'active users'}</p>
                        </div>
                    </div>
                    {/if}
                    {/await}
                    {/each}
                    <div class="col-span-full text-sm italic">
                        <p>
                            These errors are likely caused by the instances blocking the API used by the Investigator (as is the case for <span class="font-mono">programming.dev</span> and <span class="font-mono">futurology.today</span>) or them being offline.
                        </p>
                        <p>
                            They could also be caused by timeouts to the connection. A stable connection and a decently powerful device may help in reducing their number.
                        </p>
                    </div>
                </div>
            </div>
            {/if}
        </div>
    </div>   
</main>