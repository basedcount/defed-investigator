import { softwareList, type Software } from "./software";

//Return a list of instance links and their names, fetched from the Fediverse Observer GraphQL API
export async function fetchInstances(softwareQuery: Software[]) {   
    //Query the GraphQL API for every tracked software (regardless of whether they are queried or not. If they aren't they'll be filtered out later)
    const res = await Promise.all(softwareList.map(software => query(software.name, software.users, softwareQuery)));

    const instances = res.flat();
    instances.sort((a, b) => b.users - a.users);

    return instances;
}

/**
 * Query the Fediverse Observer GraphQL API for a given software
 * @param software The software to be queried
 * @param minimum Minimum number of monthly active users for the instance to be returned
 * @param queriedSoftware List of queried softawares
*/
async function query(software: Software, minimum: number, queriedSoftware: string[]) {
    const query = `
    query {
        nodes(status: "UP" softwarename: "${software}" minusersmonthly: ${minimum}) 
        {domain metatitle active_users_monthly}
    }
    `;

    const res = await fetch('https://api.fediverse.observer/', {
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
            query: queriedSoftware.includes(software),  //True if the server is among the queried ones
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

//Represents a Fediverse instance
export interface Instance {
    name: string;
    domain: string;
    users: number;
    software: Software;
    query: boolean;
}