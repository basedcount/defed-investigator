import { checkFederation } from "$lib/federation";
import { getDefederations } from "$lib/defederated";

export async function load({ data }) {
    return {
        name: data.name,
        instances: data.instances.map(inst => checkFederation(inst, data.name)),
        blockedBy: await getDefederations(data.instances, data.name),
        total: data.instances.length,
        warning: data.warning
    };
}
