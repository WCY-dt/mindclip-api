import { Knex } from 'knex';
import createResponse from '../../utils/createResponse';

export async function handleGetCardCollectionRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;

    const query = knex('Cards').select('Collection').distinct();
    const results = await query;
    const collections = results.map(result => result.Collection);
    return createResponse(collections, 200);
}
