import { fetchInstances } from "$lib/instanceList";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
    const instances = await fetchInstances();
    const name = params.name;

    let warning = true;

    const urlRegex = /^https?:\/\//; //Regex to truncate the protocol form an URL
    const communityRegex = /^(.*)@(.*)$/;

    const match = name.match(communityRegex);
    if (!match)
        throw error(400, 'Community string formatted incorrectly')

    const community = match[1];
    const domain = match[2];

    //Send a warning if the instance isn't in the CSV file: it probably doesn't exist
    for (const host of instances.map(el => el.url)) {
        if (host.replace(urlRegex, "") === domain) {
            warning = false;
            break;
        }
    }

    return {
        name,
        domain,
        community,
        instances,
        warning
    };
}
