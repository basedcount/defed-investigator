# Lemmy Defed-Investigator
A small SvelteKit application to find out who has blocked / defederated your Lemmy instance.

# How does it work?
The site will send a request to every known Lemmy instance through the user's browser. The process will take approximately 30 seconds. The list of Lemmy instances is retrieved [here](https://github.com/maltfield/awesome-lemmy-instances). The Investigator will intentionally avoid querying personal or inactive instances (less than 2 active monthly users).

# Troubleshooting
Some instances cannot be reached by the investigator because of a strict CORS policy on their server. Unfortunately the only workaround to this would be setting up a server and running the tool server side from there. Right now I have no plans of doing so.

It is also possible that a few requests will time out. A stable connection on the user's side might help prevent this kind of errors.

# Local execution
This tool is built with SvelteKit and requires Node to run locally. Run the following commands:

`npm i`

to install the dependencies

`npm run dev`

to start a local server.