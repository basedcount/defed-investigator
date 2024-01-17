import { getDefederations } from "$lib/defederated";

export async function load({ data }) {
    const instancesFiltered = data.instances.filter(i => i.query);

    return {
        name: data.name,
        instances: instancesFiltered,
        blockedBy: getDefederations(data.instances, data.name),
        total: instancesFiltered.length,
        warning: data.warning
    };
}
