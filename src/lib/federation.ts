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
        case "mastodon":
            response = await checkMastodon(instance as MastodonInstance, query);
            break;
        default:
            response = {
                blocked: undefined,
                linked: undefined,
                notAllowed: undefined,
                silenced: undefined,
                unknown: undefined,
                error: true,
            }
    }

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
        notAllowed: undefined,
        //Lemmy instances can't be neither silenced nor have an unknown status
        silenced: false,
        unknown: false,
    };

    try {
        const data = await fetchTimeout(url, TIMEOUT);
        if (!data.ok) throw new Error(data.code.toString());

        const fed = (data.data as LemmyFederation).federated_instances;

        res.blocked = fed.blocked.map(i => i.domain).includes(query);
        res.linked = fed.linked.map(i => i.domain).includes(query);

        if (fed.allowed.length > 0 && instance.domain !== query) {
            res.notAllowed = !fed.allowed.map(instance => instance.domain).includes(query);
            if (res.notAllowed) res.linked = false;
        } else {
            res.notAllowed = false;
        }
    } catch (_) { res.error = true; }

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
async function checkMastodon(instance: MastodonInstance, query: string): Promise<Response> {
    const urlLinked = `https://${instance.domain}/api/v1/instance/peers`;
    const urlModerated = `https://${instance.domain}/api/v1/instance/domain_blocks`;

    let res: Response = {
        error: false,
        linked: undefined,
        blocked: undefined,
        silenced: undefined,
        unknown: undefined,
        //Mastodon instances on whitelist don't share them publicly
        notAllowed: false,
    };

    try {
        const [linkedData, moderatedData] = await Promise.all([fetchTimeout(urlLinked, TIMEOUT), fetchTimeout(urlModerated, TIMEOUT)]);

        if (linkedData.code === 401 || linkedData.code === 404 || moderatedData.code === 401 || moderatedData.code === 404) {
            res.unknown = true;
        } else if (!linkedData.ok || !moderatedData.ok) {
            throw new Error();
        }
        else {
            const [linked, moderated]: [string[], MastodonModerated[]] = [linkedData.data, moderatedData.data];

            res.linked = linked.includes(query);
            if (!res.linked) {
                const moderation = moderated.find(inst => inst.domain === query);
                if (moderation) {
                    res.silenced = moderation.severity === 'silence';
                    res.blocked = moderation.severity === 'suspend';
                }
            }
        }
    } catch (_) { res.error = true; }

    return res;

    interface MastodonModerated {
        domain: string;
        // digest: string;
        severity: 'silence' | 'suspend';
        // comment: string;
    }
}


/*      HELPER FUNCTIONS       */

//Performs a fetch request to a given url but aborts it after timeout milliseconds
async function fetchTimeout(url: string, timeout: number): Promise<{ data: any; code: number; ok: boolean; }> {
    const federationPromise = (async () => {
        const res = await fetch(url);
        if (!res.ok) return { data: [], code: res.status, ok: res.ok };

        return { data: await res.json(), code: res.status, ok: res.ok };
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
    silenced: boolean | undefined;  //The instance has limited / silenced the queried instance. It's still reachable by users but not shown publicly
    unknown: boolean | undefined;   //The instance chose to hide their blocklist. No information is available
    error: boolean;                 //Error during lookup
}

interface Instance extends InstanceInit, Response { };