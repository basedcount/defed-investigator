<script lang="ts">
    import type { PageData } from "./$types";
    import { checkFederation } from "$lib/federation";
    import type { Instance as Instance_t } from "$lib/federation";
    import Instance from "./instance.svelte";
    import { onMount } from "svelte";

    export let data: PageData;

    const CHUNK_SIZE = 50;

    let progress = 1;
    let percentage = 0;
    let blockedCount = 0;
    let linkedCount = 0;
    let notAllowedCount = 0;
    let silencedCount = 0;
    let unknownCount = 0;
    let errorCount = 0;

    let instances = new Array<Instance_t>();
    onMount(async () => {
        for (let i = 0; i < data.instances.length; i += CHUNK_SIZE) {
            const chunk = data.instances.slice(i, i + CHUNK_SIZE);
            const chunkResults = await Promise.allSettled(chunk.map((inst) => checkFederation(inst, data.name)));
            const successes = new Array<Instance_t>();

            for (const inst of chunkResults) {
                if (inst.status === "rejected") continue;
                percentage = (progress++ / data.total) * 100;

                if (inst.value.blocked) blockedCount++;
                if (inst.value.linked) linkedCount++;
                if (inst.value.notAllowed) notAllowedCount++;
                if (inst.value.error) errorCount++;
                if (inst.value.silenced) silencedCount++;
                if (inst.value.unknown) unknownCount++;

                successes.push(inst.value);
            }

            instances = [...instances, ...successes];
        }
    });
</script>

<svelte:head>
    <title>Info on {data.name}</title>
    <meta name="description" content="" />
</svelte:head>

<main class="min-h-[calc(100vh-4rem)] w-full bg-base-200 pb-6">
    <div class="mx-4 md:mx-auto md:w-2/3 flex flex-col items-center">
        {#if data.warning}
            <div class="alert alert-warning mt-3 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>No instance found with name <span class="font-mono">{data.name}</span>; watch for spelling mistakes!</span>
            </div>
        {/if}

        <h1 class="text-2xl mt-2 font-semibold">
            Statistics for <span class="font-mono">{data.name}</span>
        </h1>

        <div class="grid grid-cols-3 mt-6 w-full">
            <div class="col-span-3">Explored instances:</div>
            <div>
                {progress - 1} / {data.total}
            </div>
            <div />
            <div class="place-self-end">
                {percentage.toFixed(2) + "%"}
            </div>

            <progress class="progress progress-primary h-4 col-span-3" value={percentage} max="100"></progress>
        </div>

        <div class="mt-6 w-full flex flex-col gap-4">
            <div class="collapse collapse-arrow bg-secondary">
                <input type="checkbox" name="my-accordion-2" checked={true} aria-label="Expand / collapse" />
                <div class="collapse-title text-xl font-medium">
                    Instances defederated from <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                    <div class="col-span-full">
                        {blockedCount} total {blockedCount === 1 ? "instance" : "instances"}
                    </div>

                    {#each instances as inst}
                        {#if inst.blocked}
                            <Instance {inst} className={"bg-secondary-focus"} />
                        {/if}
                    {/each}
                </div>
            </div>

            <div class="collapse collapse-arrow bg-primary">
                <input type="checkbox" name="my-accordion-2" aria-label="Expand / collapse" />
                <div class="collapse-title text-xl font-medium">
                    Instances not allowing <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                    <div class="col-span-full">
                        {notAllowedCount} total {notAllowedCount === 1 ? "instance" : "instances"}
                        <p class="font-sm mt-1">
                            These instances are only federating with a limited number of domains and <span class="font-mono">{data.name}</span> isn't among them.
                        </p>
                    </div>

                    {#each instances as inst}
                        {#if inst.notAllowed}
                            <Instance {inst} className={"bg-primary-focus"} />
                        {/if}
                    {/each}
                </div>
            </div>

            {#if silencedCount > 0}
                <div class="collapse collapse-arrow bg-purple-500">
                    <input type="checkbox" name="my-accordion-2" aria-label="Expand / collapse" />
                    <div class="collapse-title text-xl font-medium">
                        Instances with limited federation with <span class="font-mono">{data.name}</span>
                    </div>
                    <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                        <div class="col-span-full">
                            {silencedCount} total {silencedCount === 1 ? "instance" : "instances"}
                            <p class="font-sm mt-1">
                                These instances are federated with <span class="font-mono">{data.name}</span> but chose to hide it from their public front pages.
                            </p>
                        </div>

                        {#each instances as inst}
                            {#if inst.silenced}
                                <Instance {inst} className={"bg-purple-600"} />
                            {/if}
                        {/each}

                        <div class="col-span-full text-sm italic">
                            For more information on this federation mode, check out the <a class="link" href="https://docs.joinmastodon.org/admin/moderation/#limit-server">Mastodon documentation</a>.
                        </div>
                    </div>
                </div>
            {/if}

            <div class="collapse collapse-arrow bg-green-500">
                <input type="checkbox" name="my-accordion-2" aria-label="Expand / collapse" />
                <div class="collapse-title text-xl font-medium">
                    Instances defederated by <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                    {#await data.blockedBy}
                        <div class="col-span-full">Loading...</div>
                    {:then blockedBy}
                        <div class="col-span-full">
                            {blockedBy.length} total {blockedBy.length === 1 ? "instance" : "instances"}
                            <p class="font-sm mt-1">
                                {#if blockedBy.length > 1}
                                    <span class="font-mono">{data.name}</span> has defederated from these instances.
                                {:else if blockedBy.length === 1}
                                    <span class="font-mono">{data.name}</span> has defederated from this instance.
                                {:else}
                                    <span class="font-mono">{data.name}</span> hasn't defederated from any instances.
                                {/if}
                            </p>
                        </div>

                        {#each blockedBy as inst}
                            <Instance {inst} className={"bg-green-600"} />
                        {/each}
                    {/await}
                </div>
            </div>

            <div class="collapse collapse-arrow bg-accent">
                <input type="checkbox" name="my-accordion-2" aria-label="Expand / collapse" />
                <div class="collapse-title text-xl font-medium">
                    Instances federated with <span class="font-mono">{data.name}</span>
                </div>
                <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                    <div class="col-span-full">
                        {linkedCount} total {linkedCount === 1 ? "instance" : "instances"}
                    </div>

                    {#each instances as inst}
                        {#if inst.linked}
                            <Instance {inst} className={"bg-accent-focus"} />
                        {/if}
                    {/each}
                </div>
            </div>

            {#if unknownCount > 0}
                <div class="collapse collapse-arrow bg-gray-400">
                    <input type="checkbox" name="my-accordion-2" aria-label="Expand / collapse" />
                    <div class="collapse-title text-xl font-medium">Instances with hidden blocklists</div>
                    <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                        <div class="col-span-full">
                            {unknownCount} total {unknownCount === 1 ? "instance" : "instances"}
                            <p class="font-sm mt-1">These instances have decided to keep their blocklists hidden to the public, therefore it's impossible to gather any insights on them.</p>
                        </div>

                        {#each instances as inst}
                            {#if inst.unknown}
                                <Instance {inst} className={"bg-gray-500"} />
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}

            {#if errorCount > 0}
                <div class="collapse collapse-arrow bg-error">
                    <input type="checkbox" name="my-accordion-2" aria-label="Expand / collapse" />
                    <div class="collapse-title text-xl font-medium">Instances that returned errors</div>
                    <div class="collapse-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                        <div class="col-span-full">
                            {errorCount} total {errorCount === 1 ? "instance" : "instances"}
                        </div>

                        {#each instances as inst}
                            {#if inst.error}
                                <Instance {inst} className={"bg-red-400"} />
                            {/if}
                        {/each}
                        <div class="col-span-full text-sm italic">
                            <p>
                                These errors are likely caused by the instances blocking <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" class="link">CORS requests</a> or them being temporarily offline.
                            </p>
                            <p>They could also be caused by timeouts to the connection.</p>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</main>
