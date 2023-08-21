<script>
    import '../app.css';
</script>

<svelte:head>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>

    <!-- Primary Meta Tags -->
    <title>Defederation Investigator for Lemmy</title>
    <meta name="title" content="Defederation Investigator for Lemmy">
    <meta name="description" content="Discover who has defederated your Lemmy instance with the Defederation Investigator.">

    <meta name="keywords" content="lemmy,defederation,defed,investigator,investigation,federation,fediverse,mastodon,kbin,peertube,basedcount">
    <meta name="robots" content="index, follow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="language" content="English">
    <meta name="author" content="ornato-t">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://defed.xyz/" />
    <meta property="og:title" content="Defederation Investigator for Lemmy" />
    <meta property="og:description" content="Discover who has defederated your Lemmy instance with the Defederation Investigator." />
    <meta property="og:image" content="https://defed.xyz/favicon.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://defed.xyz" />
    <meta property="twitter:title" content="Defederation Investigator for Lemmy" />
    <meta property="twitter:description" content="Discover who has defederated your Lemmy instance with the Defederation Investigator." />
    <meta property="twitter:image" content="https://defed.xyz/favicon.png" />
</svelte:head>

<div class="navbar bg-base-100">
    <div class="navbar-start">
        <a class="btn btn-outline btn-secondary normal-case text-sm px-2 md:px-4 cursor-pointer" href="https://lemmy.basedcount.com">
            <span class="hidden md:block">
                Powered by Based Count
            </span>
            <img class="h-8 w-8 md:ml-1.5 md:mt-1.5" src="/favicon.png" alt="BasedCount pill">
        </a>

    </div>

    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl cursor-pointer" href="/">Lemmy Defed-Investigator</a>
    </div>

    <div class="navbar-end">
        <a class="btn btn-ghost hidden md:flex cursor-pointer" href="https://github.com/ornato-t/lemmy-defed-investigator">
            <i class='bx bxl-github text-4xl'></i>
        </a>
    </div>     
</div>
<slot/>