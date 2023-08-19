import { parse } from 'csv-parse';

//Return a list of instance links and their names, fetched from the awesome-lemmy-instances GitHub repo
export async function fetchInstances() {
    const instancesArr = await parseCSV();
    const instances = arrayToObject(instancesArr);

    return instances;
}

//Fetch a CSV of all Lemmy instances from GitHub and parses it as an array of strings
async function parseCSV(): Promise<string[]> {
    //Fetch list of instances from GitHub
    const url = 'https://raw.githubusercontent.com/maltfield/awesome-lemmy-instances/main/awesome-lemmy-instances.csv';

    //Parse the request
    const res = await fetch(url);
    const data = await res.text();

    //Setup CSV parser and asynchronously parse each line
    const parser = parse(data);
    const instances = new Array<string>();

    for await (const record of parser) {
        instances.push(record[0]);
    }

    return instances;
}

//Converts an array of strings to  an array of objects of the Instance interface
function arrayToObject(arr: string[]): Instance[] {
    arr.splice(0, 1); //Remove first element (CSV heading)

    const regex = /\[(.+)\]\((\S+)\)/;    //Regex to capture markdown links eg: [name](link)

    const res: Instance[] = arr.map(line => {
        const match = line.match(regex);

        if (match == null) throw new Error('Badly formatted CSV');
        if (match.length < 3) throw new Error('Badly formatted CSV');

        return {
            name: match[1],
            url: match[2]
        }

    });

    return res;
}

//Represents a Lemmy instance
interface Instance {
    name: string;
    url: string;
}