import { fetchInstances } from "$lib/instanceList";

export async function load({ params }) {
    const instances = await fetchInstances();
    const name = params.name;

    let warning = true;

    const pattern = /^https?:\/\//; //Regex to truncate the protocol form an URL

    //Send a warning if the instance isn't in the API response: it probably doesn't exist
    for (const host of instances.map(inst => inst.domain)) {
        if (host.replace(pattern, "") === name) {
            warning = false;
            break;
        }
    }

    return {
        name: name,
        instances,
        warning: warning
    };
}
