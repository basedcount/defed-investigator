# Lemmy Defed-Investigator
A small SvelteKit application to find out who has blocked / defederated your Lemmy instance.

# How does it work?
The site will send a request to every known Lemmy instance through the user's browser. The process will take approximately 1-2 minutes. The list of Lemmy instances is retrieved [here](https://github.com/maltfield/awesome-lemmy-instances).

# Troubleshooting
The site has to query over 1300 instances, so it's possible that a few will time out. At the moment the only workaround for this issue is running the tool multiple times.