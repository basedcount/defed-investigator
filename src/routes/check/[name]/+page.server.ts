import { fetchInstances } from "$lib/instanceList";

export async function load({ params, fetch }) {
    const instances = await fetchInstances();
    const name = params.name;

    let warning = false;

    //Send a warning if the instance isn't in the CSV file: it probably doesn't exist
    if (!instances.map(el => el.url).includes(name)) warning = true;

    return {
        name: name,
        instances,
        warning: warning
    };
}
