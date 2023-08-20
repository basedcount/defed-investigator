import { parse } from 'csv-parse';

//Return a list of instance links and their names, fetched from the awesome-lemmy-instances GitHub repo
export async function fetchInstances() {
    const { instancesArr, usersArr } = await parseCSV();
    const instances = arrayToObject(instancesArr, usersArr);

    return instances;
}

//Fetch a CSV of all Lemmy instances from GitHub and parses it as an array of strings
async function parseCSV() {
    //Fetch list of instances from GitHub
    const url = 'https://raw.githubusercontent.com/maltfield/awesome-lemmy-instances/main/awesome-lemmy-instances.csv';

    //Parse the request
    const res = await fetch(url);
    const data = await res.text();

    //Setup CSV parser and asynchronously parse each line
    const parser = parse(data);
    const instances = new Array<string>();
    const users = new Array<number>();

    for await (const record of parser) {
        instances.push(record[0]);
        users.push(record[6]);
    }

    return { instancesArr: instances, usersArr: users };
}

//Converts an array of strings to  an array of objects of the Instance interface
function arrayToObject(arr: string[], users: number[]) {
    arr.splice(0, 1); //Remove first element (CSV heading)
    users.splice(0, 1); //Remove first element (CSV heading)

    const regex = /\[(.+)\]\((\S+)\)/;    //Regex to capture markdown links eg: [name](link)

    const res: Instance[] = arr.map((line, i) => {
        const match = line.match(regex);

        if (match == null) throw new Error('Badly formatted CSV');
        if (match.length < 3) throw new Error('Badly formatted CSV');

        return {
            name: match[1],
            url: match[2],
            users: users[i],
        }

    });

    return res;
}

//Represents a Lemmy instance
export interface Instance {
    name: string;
    url: string;
    users: number;
}