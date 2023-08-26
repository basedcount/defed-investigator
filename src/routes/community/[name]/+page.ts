import type { Instance as InstanceInit } from "$lib/instanceList";
import getCommunityTimeout from "./getCommunityTimeout.js";

const TIMEOUT = 60000;

export async function load({ data }) {
    return {
        name: data.name,
        domain: data.domain,
        community: data.community,
        instances: data.instances.map(el => getBlockedCommunities(el, data.name, data.domain)),
        total: data.instances.length,
        warning: data.warning
    };
}

//Get a list of communities blocked by the queried instance
async function getBlockedCommunities(instance: InstanceInit, community: string, hostInstance: string) {
    try {
        const res = await getCommunityTimeout(instance.url, community, hostInstance, TIMEOUT);

        return {
            name: instance.name,
            url: instance.url,
            users: instance.users,
            blocked: res.community_view.blocked,
            federated: res.federated,
            error: false
        };
    } catch (e) {
        if (e === 'couldnt_find_community') {
            return {
                name: instance.name,
                url: instance.url,
                users: instance.users,
                blocked: true,
                federated: false,
                error: false
            }
        }

        return {
            name: instance.name,
            url: instance.url,
            users: instance.users,
            blocked: undefined,
            federated: undefined,
            error: true
        }
    }

}
