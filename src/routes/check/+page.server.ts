import { fetchInstances } from "$lib/instanceList";
import type { Software } from "$lib/software.js";
import { error } from "@sveltejs/kit";
import { getDefederations } from "$lib/defederated";

export async function load({ url }) {
    const nameParam = url.searchParams.get('name');
    const softwareParam = url.searchParams.get('software') ?? '';

    if (!nameParam) error(400, { message: 'No instance specified. Enter the name of an instance to query it' });
    const name = removeProtocol(nameParam);

    //Extract softwareStr into an array of Softwares
    let software = softwareParam.split(',');
    if (software.length === 1 && software[0] === '') software = [];
    const instances = await fetchInstances(software as Software[]);

    //Send a warning if the instance isn't in the API response: it probably doesn't exist
    const warning = !instances.map(inst => inst.domain).includes(name);

    //Only return queried instances
    const instancesFiltered = instances.filter(i => i.query);

    return {
        name,
        instances: instancesFiltered,
        warning,
        total: instancesFiltered.length,
        blockedBy: getDefederations(instances, name),     //This is awaited on server to get around CORS
    };
}

function removeProtocol(url: string) {
    const pattern = /^https?:\/\//;

    return url.replace(pattern, "").toLowerCase();
}