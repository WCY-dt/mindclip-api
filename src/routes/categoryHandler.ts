import { Knex } from 'knex';
import createResponse from '../utils/createResponse';

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
    return createResponse(categories, 200);
}