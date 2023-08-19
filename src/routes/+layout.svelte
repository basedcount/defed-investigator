<script>
    import '../app.css';
</script>

<svelte:head>
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</svelte:head>

<div class="navbar bg-base-100">
    <div class="navbar-start">
        <a class="btn btn-outline btn-secondary normal-case text-sm px-2 md:px-4" href="https://lemmy.basedcount.com">
            <span class="hidden md:block">
                Powered by Based Count
            </span>
            <img class="h-8 w-8 md:ml-1.5 md:mt-1.5" src="https://lemmy.basedcount.com/pictrs/image/7128ea29-f4bf-4602-b1b7-5517a09ae3f4.png" alt="BasedCount pill">
        </a>

    </div>

    <div class="navbar-center">
      <a class="btn btn-ghost normal-case text-xl" href="/">Lemmy Defed-Investigator</a>
    </div>

    <div class="navbar-end">
        <a href="https://github.com/ornato-t/lemmy-defed-investigator" class="btn btn-ghost hidden md:flex">
            <i class='bx bxl-github text-4xl'></i>
        </a>
    </div>     
</div>
<slot/>