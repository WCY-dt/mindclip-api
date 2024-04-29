import { Knex } from 'knex';

export async function handleCategoryRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;
    const collection = searchParams.get('collection');

    const query = knex('Cards').select('Category').distinct();
    if (collection) {
        query.whereLike('Collection', `%${collection}%`);
    }
    const results = await query;
    const categories = results.map(result => result.Category);
    const response = new Response(JSON.stringify(categories), {
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