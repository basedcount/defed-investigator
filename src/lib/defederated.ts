import type { Instance } from "./instanceList";
import { fetchTimeout } from "./fetch";
import type { AkkomaInstance, LemmyInstance, MastodonInstance, MbinInstance, MisskeyInstance, PleromaInstance } from "./federation";

const TIMEOUT = 60000;

/**
 * Get the defederation lits of a queried instance
 * @param instanceList The list of instances retrieved from the API
 * @param query The queried domain
*/
export async function getDefederations(instanceList: Instance[], query: string): Promise<Instance[] | null> {
    const instance = instanceList.find(inst => inst.domain === query);
    if (!instance) return [];

    switch (instance.software) {
        case "lemmy":
            return checkLemmy(instance as LemmyInstance, instanceList);
        case "mastodon":
            return checkMastodon(instance as MastodonInstance, instanceList);
        case "pleroma":
            return checkMastodon(instance as PleromaInstance, instanceList);
        case "akkoma":
            return checkMastodon(instance as AkkomaInstance, instanceList);
        case "mbin":
            return checkMbin(instance as MbinInstance, instanceList);
        case "misskey":
            return checkMisskey(instance as MisskeyInstance, instanceList);
        default:
            return null;
    }
}

/**
 * Get the defederation lits of a Lemmy instance
 * @param instance The queried instance
 * @param instanceList The list of instances retrieved from the API
*/
async function checkLemmy(instance: LemmyInstance, instanceList: Instance[]): Promise<Instance[] | null> {
    const url = `https://${instance.domain}/api/v3/federated_instances`;

    try {
        const data = await fetchTimeout(url, TIMEOUT);
        if (!data.ok) throw new Error(data.code.toString());

        const blocklist = (data.data as LemmyFederation).federated_instances.blocked;

        const res = new Array<Instance>();
        for (const blocked of blocklist) {
            const inst = instanceList.find(i => i.domain === blocked.domain);
            if (inst) res.push(inst);
            //@ts-ignore
            else res.push({ domain: blocked.domain, name: blocked.domain, software: blocked.software, users: -1 })
        }

        res.sort((a, b) => b.users - a.users);

        return res;
    } catch (_) { return null }

    interface LemmyFederation {
        federated_instances: {
            blocked: { domain: string, software: string }[]
        }
    }
}

/**
 * Get the defederation lits of a Mastodon instance
 * @param instance The queried instance
 * @param instanceList The list of instances retrieved from the API
*/
async function checkMastodon(instance: MastodonInstance | PleromaInstance | AkkomaInstance, instanceList: Instance[]): Promise<Instance[] | null> {
    const url = `https://${instance.domain}/api/v1/instance/domain_blocks`;

    try {
        const data = await fetchTimeout(url, TIMEOUT);
        if (!data.ok) throw new Error(data.code.toString());

        const blocklist = data.data as MastodonModerated[];

        const res = new Array<Instance>();
        for (const blocked of blocklist) {
            if (blocked.severity === 'suspend') {
                const inst = instanceList.find(i => i.domain === blocked.domain);
                if (inst) res.push(inst);
                //@ts-ignore
                else res.push({ domain: blocked.domain, name: blocked.domain, software: blocked.software, users: -1 })
            }
        }

        res.sort((a, b) => b.users - a.users);

        return res;
    } catch (_) { return null }

    interface MastodonModerated {
        domain: string;
        // digest: string;
        severity: 'silence' | 'suspend';
        // comment: string;
    }
}

/**
 * Get the defederation lits of a Mbin instance
 * @param instance The queried instance
 * @param instanceList The list of instances retrieved from the API
*/
async function checkMbin(instance: MbinInstance, instanceList: Instance[]): Promise<Instance[] | null> {
    const url = `https://${instance.domain}/api/defederated`;

    try {
        const data = await fetchTimeout(url, TIMEOUT);
        if (!data.ok) throw new Error(data.code.toString());

        const blocklist = (data.data as MbinDefederation).instances;

        const res = new Array<Instance>();
        for (const blocked of blocklist) {
            const inst = instanceList.find(i => i.domain === blocked);

            if (inst) res.push(inst);
            //@ts-ignore
            else res.push({ domain: blocked, name: blocked, software: blocked.software, users: -1 })
        }

        res.sort((a, b) => b.users - a.users);

        return res;
    } catch (_) { return null }

    interface MbinDefederation {
        instances: string[];
    }
}

/**
 * Get the defederation lits of a Misskey instance
 * @param instance The queried instance
 * @param instanceList The list of instances retrieved from the API
*/
async function checkMisskey(instance: MisskeyInstance, instanceList: Instance[]): Promise<Instance[] | null> {
    const url = `https://${instance.domain}/api/federation/instances`;

    try {
        const data = await fetchTimeout(url, TIMEOUT);
        if (!data.ok) throw new Error(data.code.toString());

        const fedArr = data.data as MisskeyFederation[];
        const blocklist = fedArr.filter(i => i.isBlocked || i.isSuspended);

        const res = new Array<Instance>();
        for (const blocked of blocklist) {
            const inst = instanceList.find(i => i.domain === blocked.host);

            if (inst) res.push(inst);
            //@ts-ignore
            else res.push({ domain: blocked.host, name: blocked.name ?? blocked.host, software: blocked.softwareName ?? '', users: blocked.usersCount })
        }

        res.sort((a, b) => b.users - a.users);

        return res;
    } catch (_) { return null }

    interface MisskeyFederation {
        id: string
        firstRetrievedAt: string
        host: string
        usersCount: number
        notesCount: number
        followingCount: number
        followersCount: number
        isNotResponding: boolean
        isSuspended: boolean
        isBlocked: boolean
        softwareName?: string
        softwareVersion?: string
        openRegistrations?: boolean
        name?: string
        description?: string
        maintainerName?: string
        maintainerEmail?: string
        isSilenced: boolean
        isSensitiveMedia: boolean
        iconUrl?: string
        faviconUrl?: string
        themeColor?: string
        infoUpdatedAt?: string
        latestRequestReceivedAt?: string
    }
}
