import type { Instance as InstanceInit } from "$lib/instanceList";
import { LemmyHttp, type GetFederatedInstancesResponse } from 'lemmy-js-client';
import { fetchInstances } from "$lib/instanceList";

export async function load({ params }) {
    const instances = await fetchInstances();
    const name = params.name;

    let warning = false;

    //Send a warning if the instance isn't in the CSV file: it probably doesn't exist
    if (!instances.map(el => el.url).includes(name)) warning = true;

    return {
        name: name,
        instances: instances.map(el => checkFederation(name, el)),
        total: instances.length,
        warning: warning
    };
}

//Check whether an instance is federated with the queried instance
async function checkFederation(name: string, instance: InstanceInit): Promise<Instance> {
    let linked: boolean | undefined;
    let blocked: boolean | undefined;
    let error: boolean;

    try {
        const federation = await getFederationTimeout(instance.url, 60000);

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

//Starts a lemmy client and returns the federation data of an instance, fails after a timeout
async function getFederationTimeout(url: string, timeout: number): Promise<GetFederatedInstancesResponse> {
    const federationPromise = (async () => {
        const client: LemmyHttp = new LemmyHttp(url);
        return await client.getFederatedInstances();
    })();
    const timeoutPromise = new Promise<GetFederatedInstancesResponse>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));
    return Promise.race([federationPromise, timeoutPromise]);
}


interface Instance {
    name: string;                   //Instance name
    url: string;                    //Instance domain
    linked: boolean | undefined;    //Instance linked with queried instance
    blocked: boolean | undefined;   //Instance has blocked/defederated the queried instance
    error: boolean                  //Error during lookup
}