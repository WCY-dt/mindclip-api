import { Knex } from 'knex';

export async function handleCollectionRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;

    const query = knex('Cards').select('Collection').distinct();
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