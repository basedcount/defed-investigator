import type { RequestHandler } from "@sveltejs/kit";
import { fetchInstances } from "$lib/instanceList";

export const GET: RequestHandler = async () => {
    const instances = await fetchInstances();

    return new Response(JSON.stringify(instances));
}

