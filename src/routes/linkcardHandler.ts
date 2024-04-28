import { Knex } from 'knex';

export async function handleLinkcardRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;
    const collection = searchParams.get('collection');
    const category = searchParams.get('category');
    const q = searchParams.get('query');

    const query = knex('Linkcard').select('*');

    if (collection) {
        query.whereLike('Col', `%${collection}%`);
    }

    if (category) {
        query.whereLike('Category', `%${category}%`);
    }

    if (q) {
        query.whereLike('Category', `%${q}%`)
            .orWhereLike('Title', `%${q}%`)
            .orWhereLike('Descr', `%${q}%`)
            .orWhereLike('Detail', `%${q}%`);
    }

    let results = await query;

    const resultsWithLinks = await Promise.all(results.map(async (result) => {
        const links = await knex('Links').select('*').where('LinkcardId', result.Id);
        links.forEach((link) => {
            delete link.Id;
            delete link.LinkcardId;
        });
        return { ...result, links };
    }));

    resultsWithLinks.forEach((result) => {
        delete result.Id;
    });

    const response = new Response(JSON.stringify(resultsWithLinks), {
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