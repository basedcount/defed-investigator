import { redirect } from '@sveltejs/kit';

//Redirect links in the old URL format to the new one
export async function load({ params }) {
    redirect(301, `/check?name=${params.name}&software=lemmy`);
}
