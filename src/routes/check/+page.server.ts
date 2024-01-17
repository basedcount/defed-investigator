import { fetchInstances } from "$lib/instanceList";
import type { Software } from "$lib/software.js";
import { error } from "@sveltejs/kit";

export async function load({ url }) {
    const name = url.searchParams.get('name');
    const softwareStr = url.searchParams.get('software') ?? '';

    if (!name) error(400, { message: 'No instance specified. Enter the name of an instance to query it' });

    //Extract softwareStr into an array of Softwares
    let software = softwareStr.split(',');
    if (software.length === 1 && software[0] === '') software = [];
    const instances = await fetchInstances(software as Software[]);

    //Send a warning if the instance isn't in the API response: it probably doesn't exist
    const warning = !instances.map(inst => inst.domain).includes(name);

    return {
        name: removeProtocol(name),
        instances,
        warning
    };
}

function removeProtocol(url: string) {
    const pattern = /^https?:\/\//;

    return url.replace(pattern, "").toLowerCase();
}