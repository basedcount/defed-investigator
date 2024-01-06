- remove lemmy api dependency, make requests manually with fetch
- if mastodon query related endpoint, write mastodon handler function
- move current logic to lemmy handler function

- (svelte) split requests in batches to only parse around 150 at a time