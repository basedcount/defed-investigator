import { fetchInstances, type Instance as InstanceInit } from "$lib/instanceList";
import type { GetFederatedInstancesResponse } from 'lemmy-js-client';

export async function load({ params, fetch }) {
    const instances = await fetchInstances();
    const name = params.name;

    let warning = false;

    //Send a warning if the instance isn't in the CSV file: it probably doesn't exist
    if (!instances.map(el => el.url).includes(name)) warning = true;

    return {
        name: name,
        instances: instances.map(el => checkFederation(name, el, fetch)),
        total: instances.length,
        warning: warning
    };
}

//Check whether an instance is federated with the queried instance
async function checkFederation(name: string, instance: InstanceInit, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>): Promise<Instance> {
    let linked: boolean | undefined;
    let blocked: boolean | undefined;
    let error: boolean;

    try {
        const federation = await fetch('/proxy', { method: 'POST', body: JSON.stringify({ url: instance.url }) }) as GetFederatedInstancesResponse;

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