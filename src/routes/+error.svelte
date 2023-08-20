<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
    <title>Error {$page.status}</title>
    <meta name="description" content="Error {$page.status}">
</svelte:head>

<div class="hero min-h-[calc(100vh-4rem)] bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Error {$page.status}</h1>
        <p class="py-6">{$page.error?.message}</p>
      </div>
    </div>
</div>