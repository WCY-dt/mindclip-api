import { Knex } from 'knex';

export async function handleCategoryRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;
    const collection = searchParams.get('collection');

    const query = knex('Linkcard').select('Category').distinct();
    if (collection) {
        query.whereLike('Col', `%${collection}%`);
    }
    const results = await query;
    return Response.json(results.map((c) => c.Category));
}