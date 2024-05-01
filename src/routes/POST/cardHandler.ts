import { Knex } from 'knex';
import { handleVerifyRequest } from '../../services/verifyHandler';
import createResponse from '../../utils/createResponse';
import generateUniqueID from '../../utils/generateUniqueID';

export async function handlePostCardRequest(knex: Knex, request: Request, env: Env) {
    if (!await handleVerifyRequest(request, env)) {
        return createResponse('Unauthorized', 401);
    }

    let data: dataProps;
    try {
        data = await request.json();
    } catch (e) {
        return createResponse("Invalid post data.", 400);
    }

    data.Id = await generateUniqueID(knex, 'Cards');

    data.links.forEach(async (link, index) => {
        link.Id = await generateUniqueID(knex, 'Links');
        link.CardId = data.Id;
    });

    await knex('Cards').insert({
        Id: data.Id,
        Collection: data.Collection,
        Category: data.Category,
        Title: data.Title,
        Url: data.Url,
        Description: data.Description,
        Detail: data.Detail,
    });

    await Promise.all(data.links.map(async (link) => {
        await knex('Links').insert({
            Id: link.Id,
            CardId: link.CardId,
            Title: link.Title,
            Url: link.Url,
        });
    }));

    let result = {
        Id: data.Id,
        links: data.links.map(link => (link.Id))
    };

    return createResponse(result, 200);
}
