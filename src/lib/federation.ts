import type { Instance as InstanceInit } from "./instanceList";

const TIMEOUT = 60000;

/**
 * Checks the federation status between an instance (from the API) and the queried domain
 * @param instance The instance retrieved from the API
 * @param query The queried domain
*/
export async function checkFederation(instance: InstanceInit, query: string): Promise<Instance> {
    let response: Response;

    switch (instance.software) {
        case "lemmy":
            response = await checkLemmy(instance as LemmyInstance, query);
            break;
        // case "mastodon":
        // response = await checkMastodon(instance as MastodonInstance, query);
        // break;
        default:
            response = {
                blocked: undefined,
                linked: undefined,
                notAllowed: undefined,
                error: true,
            }
    }
    // console.log({ ...instance, ...response })
    return { ...instance, ...response };
}

/**
 * Checks the federation status of a Lemmy instance
 * @param instance The instance retrieved from the API
 * @param query The queried domain
*/
async function checkLemmy(instance: LemmyInstance, query: string): Promise<Response> {
    const url = `https://${instance.domain}/api/v3/federated_instances`;
    let res: Response = {
        error: false,
        linked: undefined,
        blocked: undefined,
        notAllowed: undefined
    };

    try {
        const fed = (await fetchTimeout(url, TIMEOUT) as LemmyFederation).federated_instances;

        res.blocked = fed.blocked.map(i => i.domain).includes(query);
        res.linked = fed.linked.map(i => i.domain).includes(query);

        if (fed.allowed.length > 0 && instance.domain !== query) {
            res.notAllowed = !fed.allowed.map(instance => instance.domain).includes(query);
            if (res.notAllowed) res.linked = false;
        } else {
            res.notAllowed = false;
        }
    } catch (_) {
        console.error(_)
        res.error = true;
    }

    return res;

    interface LemmyFederation {
        federated_instances: {
            linked: { domain: string }[]
            allowed: { domain: string }[]
            blocked: { domain: string }[]
        }
    }
}

/**
 * Checks the federation status of a Mastodon instance
 * @param instance The instance retrieved from the API
 * @param query The queried domain
*/
// async function checkMastodon(instance: MastodonInstance): Promise<Response> {    }


/*      HELPER FUNCTIONS       */

//Performs a fetch request to a given url but aborts it after timeout milliseconds
async function fetchTimeout(url: string, timeout: number) {
    const federationPromise = (async () => {
        const res = await fetch(url);
        return res.json();
    })();

    const timeoutPromise = new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));
    return Promise.race([federationPromise, timeoutPromise]);
}


/*      TS INTERFACES       */

interface LemmyInstance extends InstanceInit { software: 'lemmy' }
interface MastodonInstance extends InstanceInit { software: 'mastodon' }

interface Response {
    linked: boolean | undefined;    //Instance linked with queried instance
    blocked: boolean | undefined;   //Instance has blocked/defederated the queried instance
    notAllowed: boolean | undefined;//The instance is on allow list only and the queried instance isn't in said list
    error: boolean;                 //Error during lookup
}

interface Instance extends InstanceInit, Response { };