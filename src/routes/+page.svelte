<script lang="ts">
    import { goto } from '$app/navigation';

    let instance: string;

    function query() {
        console.log(instance)
        goto(`/check/${instance}`);
    }
</script>

<div class="hero min-h-[calc(100vh-4rem)] bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-lg">
        <h1 class="text-5xl font-bold">Investigate defederation</h1>
        <div class="py-6">
            <p>
                Find out which Lemmy instances have blocked / defederated yours.
            </p>
            <p>
                Enter the domain (URL) of your Lemmy instance and press enter.
            </p>
        </div>

        <form on:submit|preventDefault={query}>
            <input type="text" placeholder="lemmy.example.com" class="input input-bordered input-primary w-full max-w-xs" bind:value={instance}/>
        </form>

        <div class="py-6 text-sm text-acc">
            <p>
                <span class="font-bold text-accent-focus">How does this work?</span> The Investigator will query every Lemmy instance through your browser. The search will take approximately 1-2 minutes. 
            </p>
            <p>
                The full list of instances is available <a href="https://github.com/maltfield/awesome-lemmy-instances" class="link">here</a>.
            </p>
        </div>
      </div>
    </div>
  </div>