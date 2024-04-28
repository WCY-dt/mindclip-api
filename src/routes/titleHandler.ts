import { Knex } from 'knex';

export async function handleTitleRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;
    const collection = searchParams.get('collection');

    const query = knex('Linkcard').select('Title', 'Urlpath');
    if (collection) {
        query.whereLike('Col', `%${collection}%`);
    }
    const results = await query;
    const response = new Response(JSON.stringify(results), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'X-Content-Type-Options': 'nosniff',
        },
    });
    return response;
}