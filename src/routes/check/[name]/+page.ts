import type { Instance as InstanceInit } from "$lib/instanceList";
import type { GetFederatedInstancesResponse } from 'lemmy-js-client';

export async function load({ fetch, data }) {
    return {
        name: data.name,
        instances: data.instances.map(el => checkFederation(data.name, el, fetch)),
        total: data.instances.length,
        warning: data.warning
    };
}

//Check whether an instance is federated with the queried instance
async function checkFederation(name: string, instance: InstanceInit, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>): Promise<Instance> {
    let linked: boolean | undefined;
    let blocked: boolean | undefined;
    let error: boolean;

    try {
        const res = await fetch('/proxy', { method: 'POST', body: JSON.stringify({ url: instance.url }) });
        const federation = await res.json()  as GetFederatedInstancesResponse;

        const blockedList = federation.federated_instances?.blocked;
        const linkedList = federation.federated_instances?.linked;

        if (blockedList === undefined) throw new Error();
        if (linkedList === undefined) throw new Error();

        if (blockedList.map(instance => instance.domain).includes(name)) {
            blocked = true;
        } else {
            blocked = false;
        }
        if (linkedList.map(instance => instance.domain).includes(name)) {
            linked = true;
        } else {
            linked = false;
        }

        error = false;
    } catch (e) {
        error = true;
    }

    return {
        name: instance.name,
        url: instance.url,
        linked,
        blocked,
        error,
    };
}

interface Instance {
    name: string;                   //Instance name
    url: string;                    //Instance domain
    linked: boolean | undefined;    //Instance linked with queried instance
    blocked: boolean | undefined;   //Instance has blocked/defederated the queried instance
    error: boolean                  //Error during lookup
}