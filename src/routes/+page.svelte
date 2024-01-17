<script lang="ts">
    import { softwareList } from "$lib/software";

    //This is sent to the server. First mapped as all instances to check all boxes.
    //As boxes are unchecked, they get reoved from here
    let softwares = softwareList.map((s) => s.name);
</script>

<div class="hero min-h-[calc(100vh-4rem)] bg-base-200">
    <div class="hero-content text-center">
        <div class="max-w-lg">
            <h1 class="text-5xl font-bold">Investigate defederation</h1>
            <div class="py-6">
                <p>Find out which Fediverse instances have blocked / defederated yours.</p>
                <p>Enter the domain (URL) of your instance and press enter.</p>
            </div>

            <form class="w-full flex flex-col" method="get" action="/check">
                <div class="flex flex-row place-content-center gap-x-2">
                    <input type="text" placeholder="lemmy.example.com" name="name" required autocomplete="off" autocapitalize="off" class="input input-bordered input-primary w-full max-w-xs" />
                    <button type="submit" class="btn btn-outline btn-primary" aria-label="Search">
                        <i class="bx bx-search-alt text-xl"></i>
                    </button>
                </div>
                <div class="grid grid-cols-4 max-w-md mx-auto gap-x-2">
                    <span class="col-span-full justify-self-start mt-2"> Query the following softwares: </span>
                    {#each softwareList as software}
                        <label class="cursor-pointer label justify-normal gap-x-1">
                            <input type="checkbox" value={software.name} class="checkbox checkbox-primary" bind:group={softwares} />
                            <span class="label-text capitalize">{software.name}</span>
                        </label>
                    {/each}
                </div>
                <input type="hidden" value={softwares} name="software" />
            </form>

            <p class="py-6 text-sm">
                <span class="font-bold text-accent-focus">How does this work?</span>
                The Investigator will query every Fediverse instance through your browser. The full list of instances is retrieved from the
                <a href="https://fediverse.observer/list" class="link">Fediverse Observer</a>.
            </p>
        </div>
    </div>
</div>
