import { LemmyHttp, type GetFederatedInstancesResponse } from 'lemmy-js-client';
import { json } from '@sveltejs/kit';

const TIMEOUT = 90000;

export async function POST({ request }) {
    const { url } = await request.json();

    try {
        return json(await getFederationTimeout(url, TIMEOUT))
    } catch (e) {
        console.log('Error with:', url, e)
        return json(null)
    }
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
