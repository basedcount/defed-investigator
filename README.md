# Lemmy Defed-Investigator
A small SvelteKit application to find out who has blocked / defederated your Lemmy instance.

# How does it work?
The site will send a request to every known Lemmy instance through the user's browser. The process will take approximately 1-2 minutes. The list of Lemmy instances is retrieved [here](https://github.com/maltfield/awesome-lemmy-instances).

# Troubleshooting
Some instances appear to block the API requests of the investigator, two big instances notorious for doing this are [programming.dev](https://programming.dev/) and [futurology.today](https://futurology.today/). At the time of writing no workaround for this is known.

The site has to query over 1300 instances, so it's also possible that a few requests will time out. The stability of the user's connection heavily impacts this.