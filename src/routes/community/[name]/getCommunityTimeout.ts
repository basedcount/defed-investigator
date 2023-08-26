/*  The Lemmy API wrapper is a bit silly
    And a bunch of things 
    that should never be undefined
    sometimes are.
    
    So, in order to not lose my sanity, I have to do a little of:
*/
// @ts-nocheck

import { LemmyHttp, type GetCommunityResponse, type Instance } from 'lemmy-js-client';

//Starts a lemmy client and returns the federation data of an instance, fails after a timeout
export default async function getCommunityTimeout(url: string, community: string, hostInstance: string, timeout: number): Promise<Community> {
    const communityPromise = (async () => {
        const client: LemmyHttp = new LemmyHttp(url);
        const communityData: Community = await client.getCommunity({ name: community });

        const federation = (await client.getFederatedInstances()).federated_instances;
        let federated = false;

        for (const instance of federation?.linked) {
            if (instance.domain === hostInstance) {
                federated = true;
                break;
            }
        }

        if (federation?.allowed.length > 0) {
            for (const instance of federation?.allowed) {
                if (instance.domain === hostInstance) {
                    federated = false;
                    break;
                }
            }
        }

        for (const instance of federation?.blocked) {
            if (instance.domain === hostInstance) {
                federated = false;
                break;
            }
        }

        communityData.federated = federated;
        return communityData;
    })();

    const timeoutPromise = new Promise<Community>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));
    return Promise.race([communityPromise, timeoutPromise]);
}


interface Community extends GetCommunityResponse {
    federated?: boolean;
}