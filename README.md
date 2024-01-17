# Defed Investigator
A website mapping federation activity throughout the Fediverse. Quickly found out who has defederated your instance.

# Purpose
Most Fediverse softwares will let users know which instances they are federated with and which ones are blocked. This is, however, only one directional. Users have no easy way of knowing which instances have defederated or silenced theirs. This tool aims at fixing that.

# Supported softwares
While the Investigator started off as a Lemmy-only project, it has now grown to support the following softwares:
- Lemmy
- Mastodon
- Misskey
- Pleroma
- Akkoma
- Mbin

# How does it work?
The site will send a request to every instance running the selected softwares. The requests will be sent through your browser. The process can be lenghty, and even take various minutes. To speed up the process, you may choose to only query some softwares. The list of instances is retrieved from the API of the [Fediverse Observer](https://fediverse.observer/). Single user or otherwise small instances are excluded from the process.

Given the high number of requests performed concurrently, it's possible that your device or network will slow down as the query progresses. Hold on tight!

# Troubleshooting
Some instances cannot be reached by the investigator because of a strict CORS policy on their server. Unfortunately the only workaround to this would be setting up a server and running the tool server side from there. Right now I have no plans of doing so.

It is also possible that a few requests will time out. A stable connection might help prevent this kind of errors.

# Local execution
This tool is built with SvelteKit and requires Node to run locally. Run the following commands:

`npm i`

to install the dependencies

`npm run dev`

to start a local server.