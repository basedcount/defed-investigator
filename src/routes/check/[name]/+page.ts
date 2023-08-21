import type { Instance as InstanceInit } from "$lib/instanceList";
import { LemmyHttp, type GetFederatedInstancesResponse } from 'lemmy-js-client';

const TIMEOUT = 90000;

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
    let notAllowed: boolean | undefined;
    let error: boolean;

    try {
        const federation = await getFederationTimeout(instance.url, TIMEOUT);

        const blockedList = federation.federated_instances?.blocked;
        const linkedList = federation.federated_instances?.linked;
        const allowList = federation.federated_instances?.allowed;

        if (blockedList === undefined) throw new Error();
        if (linkedList === undefined) throw new Error();
        if (allowList === undefined) throw new Error();

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

        if (allowList.length > 0) {
            if (!allowList.map(instance => instance.domain).includes(name)) {
                notAllowed = true;
                linked = false;
            } else {
                notAllowed = false;
            }
        } else {
            notAllowed = false;
        }

        error = false;
    } catch (e) {
        error = true;
    }

    return {
        name: instance.name,
        url: instance.url,
        users: instance.users,
        linked,
        blocked,
        notAllowed,
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
    users: number;                  //Number of active users in the instance
    linked: boolean | undefined;    //Instance linked with queried instance
    blocked: boolean | undefined;   //Instance has blocked/defederated the queried instance
    notAllowed: boolean | undefined //The instance is on allow list only and the queried instance isn't in said list
    error: boolean                  //Error during lookup
}