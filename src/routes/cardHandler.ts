import { Knex } from 'knex';
import createResponse from '../utils/createResponse';

export async function handleCardRequest(knex: Knex, request: Request) {
    const url = new URL(request.url);
    const { searchParams } = url;
    const collection = searchParams.get('collection');
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const showid = searchParams.get('showid');

    const cards = knex('Cards').select('*');

    if (collection) {
        cards.whereLike('Collection', `%${collection}%`);
    }
    if (category) {
        cards.whereLike('Category', `%${category}%`);
    }
    if (query) {
        cards.whereLike('Category', `%${query}%`)
            .orWhereLike('Title', `%${query}%`)
            .orWhereLike('Description', `%${query}%`)
            .orWhereLike('Detail', `%${query}%`);
    }

    let results = await cards;

    const resultsWithLinks = await Promise.all(results.map(async (result) => {
        const links = await knex('Links').select('*').where('CardId', result.Id);
        if (showid !== null) {
            return { ...result, links };            
        } else {
            const cleanedLinks = links.map(({ Id, CardId, ...rest }) => rest);
            const { Id, ...cleanedResult } = result;
            return { ...cleanedResult, links: cleanedLinks };
        }
    }));

    return createResponse(resultsWithLinks, 200);
}