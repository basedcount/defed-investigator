//Performs a fetch request to a given url but aborts it after timeout milliseconds
export async function fetchTimeout(url: string, timeout: number): Promise<{ data: any; code: number; ok: boolean; }> {
    const federationPromise = (async () => {
        const res = await fetch(url);
        if (!res.ok) return { data: [], code: res.status, ok: res.ok };

        return { data: await res.json(), code: res.status, ok: res.ok };
    })();

    const timeoutPromise = new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));
    return Promise.race([federationPromise, timeoutPromise]);
}

//Similar to fetchTimeout but with text output instead of JSON 
export async function fetchTextTimeout(url: string, timeout: number): Promise<{ data: any; code: number; ok: boolean; }> {
    const federationPromise = (async () => {
        const res = await fetch(url);
        if (!res.ok) return { data: [], code: res.status, ok: res.ok };

        return { data: await res.text(), code: res.status, ok: res.ok };
    })();

    const timeoutPromise = new Promise<any>((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout));
    return Promise.race([federationPromise, timeoutPromise]);
}
