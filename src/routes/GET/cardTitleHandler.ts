import { Knex } from 'knex';
import createResponse from '../../utils/createResponse';

export async function handleGetCardTitleRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;
    const collection = searchParams.get('collection');

    const query = knex('Cards').select('Title', 'Url');
    if (collection) {
        query.whereLike('Collection', `%${collection}%`);
    }
    const results = await query;
    return createResponse(results, 200);
}
