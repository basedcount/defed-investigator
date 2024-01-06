import { checkFederation } from "$lib/federation";

export async function load({ data }) {
    return {
        name: data.name,
        instances: data.instances.map(inst => checkFederation(inst, data.name)),
        blockedBy: [],
        // blockedBy: await getBlockedBy(data.name, data.instances),
        total: data.instances.length,
        warning: data.warning
    };
}

/*
//Returns the queried instance's blocklist
async function getBlockedBy(name: string, instances: InstanceInit[]) {
    const url = `https://${name}`;
    const federation = await getFederationTimeout(url, TIMEOUT);

    const blockedInstancesList = federation.federated_instances?.blocked;
    if (blockedInstancesList === undefined) throw new Error();

    //At this point only the domain is known, still have to lookup the name and users number
    const blockedList = blockedInstancesList?.map(el => `https://${el.domain}`);

    const res = new Array<Instance>();

    for (const blocked of blockedList) {
        for (const inst of instances) {
            if (inst.domain === blocked) {
                res.push({
                    name: inst.name,
                    url: inst.domain,
                    users: inst.users,
                    blocked: undefined,
                    linked: undefined,
                    notAllowed: undefined,
                    error: false
                });

                break;
            }
        }
    }

    res.sort((a, b) => b.users - a.users);

    return res;
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
*/

interface Instance {
    name: string;                   //Instance name
    url: string;                    //Instance domain
    users: number;                  //Number of active users in the instance
    linked: boolean | undefined;    //Instance linked with queried instance
    blocked: boolean | undefined;   //Instance has blocked/defederated the queried instance
    notAllowed: boolean | undefined;//The instance is on allow list only and the queried instance isn't in said list
    error: boolean;                 //Error during lookup
}