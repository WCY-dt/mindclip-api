import { Knex } from 'knex';

export async function handleCollectionRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;

    const query = knex('Linkcard').select('Col').distinct();
    const results = await query;
    return Response.json(results.map((c) => c.Col));
}