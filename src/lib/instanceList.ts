const THRESHOLD = 2;    //Instances with less than THRESHOLD users aren't counted (limits number of requests)

//Return a list of instance links and their names, fetched from the Fediverse Observer API https://api.fediverse.observer/
export async function fetchInstances() {
    const res = await fetchGraphQL();
    let instances = res.data.nodes;

    instances.sort((a, b) => b.active_users_monthly - a.active_users_monthly);

    instances = instances.filter(inst => inst.active_users_monthly >= THRESHOLD);

    return instances.map(inst => ({
        name: inst.name,
        url: `https://${inst.domain}`,
        users: inst.active_users_monthly
    })) satisfies Instance[];
}

//Makes a GraphQL request and extracts the JSON data
async function fetchGraphQL() {
    const res = await fetch("https://api.fediverse.observer/", {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
            "Accept": "*/*",
            "Accept-Language": "it",
            "Content-Type": "application/json",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://api.fediverse.observer/",
        "body": "{\"query\":\"\\n{\\n  nodes(softwarename: \\\"lemmy\\\"){\\n    domain\\n    name\\n    active_users_monthly\\n  }\\n}\\n    \"}",
        "method": "POST",
        "mode": "cors"
    });

    return await res.json() as GraphQLResponse;
}

//Represents a Lemmy instance
export interface Instance {
    name: string;
    url: string;
    users: number;
}

// GraphQL stuff
interface GraphQLResponse {
    data: Data
}

interface Data {
    nodes: Node[]
}

interface Node {
    domain: string
    name: string
    active_users_monthly: number
}
