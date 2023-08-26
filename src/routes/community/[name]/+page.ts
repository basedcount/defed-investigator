import type { Instance as InstanceInit } from "$lib/instanceList";
import { LemmyHttp, type CommunityView, type GetCommunityResponse } from 'lemmy-js-client';

const TIMEOUT = 60000;

export async function load({ data }) {
    return {
        name: data.name,
        domain: data.domain,
        community: data.community,
        instances: data.instances.map(el => getBlockedCommunities(el, data.name)),
        total: data.instances.length,
        warning: data.warning
    };
}

//Get a list of communities blocked by the queried instance
async function getBlockedCommunities(instance: InstanceInit, community: string) {
    try {
        const res = await getCommunityTimeout(instance.url, community, TIMEOUT);

        return {
            name: instance.name,
            url: instance.url,
            users: instance.users,
            // communityName: res.community_view.community.title,
            blocked: res.community_view.blocked,
            error: false
        };
    } catch (e) {
        return {
            error: true
        }
    }

}

//Starts a lemmy client and returns the federation data of an instance, fails after a timeout
async function getCommunityTimeout(url: string, community: string, timeout: number): Promise<GetCommunityResponse> {
    const communityPromise = (async () => {
        const client: LemmyHttp = new LemmyHttp(url);
        return await client.getCommunity({ name: community });
    })();

    const timeoutPromise = new Promise<GetCommunityResponse>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));
    return Promise.race([communityPromise, timeoutPromise]);
}