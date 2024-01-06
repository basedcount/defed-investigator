//Instances with less than USERS users aren't counted (limits number of requests)
const LEMMY_USERS = 100;
const MASTODON_USERS = 1000;

//Return a list of instance links and their names, fetched from the Fediverse Observer GraphQL API
export async function fetchInstances() {
    const [lemmy, mastodon] = await Promise.all([query('lemmy', LEMMY_USERS), query('mastodon', MASTODON_USERS)]);

    const instances = [...lemmy, ...mastodon];
    instances.sort((a, b) => b.users - a.users);

    return instances;
}

async function query(software: Software, minimum: number) {
    const query = `
    query {
        nodes(status: "UP" softwarename: "${software}" minusersmonthly: ${minimum}) 
        {domain metatitle active_users_monthly        }
    }
    `;

    const res = await fetch('https://api.vader.dev/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const instances = await res.json() as InstanceAPI;

    return instances.data.nodes.map(instance => {
        let name: string;
        if (instance.metatitle) name = instance.metatitle.split(' - ')[0];
        else name = instance.domain;

        return {
            name,
            software,
            domain: instance.domain,
            users: instance.active_users_monthly,
        }
    }) satisfies Instance[];
}

//Represents an instance as returned by the API
interface InstanceAPI {
    data: {
        nodes: {
            domain: string
            metatitle: string
            active_users_monthly: number
        }[]
    }
}

type Software = 'lemmy' | 'mastodon';

//Represents a Fediverse instance
export interface Instance {
    name: string;
    domain: string;
    users: number;
    software: Software;
}