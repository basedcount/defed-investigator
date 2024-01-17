import { getDefederations } from "$lib/defederated";

export async function load({ data }) {
    return {
        name: data.name,
        instances: data.instances,
        blockedBy: getDefederations(data.instances, data.name),
        total: data.instances.length,
        warning: data.warning
    };
}
