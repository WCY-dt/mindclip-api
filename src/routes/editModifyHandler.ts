import { Knex } from 'knex';
import { handleVerifyRequest } from '../services/verifyHandler';
import createResponse from '../utils/createResponse';

export async function handleEditModifyRequest(knex: Knex, request: Request, env: Env) {
    if (!await handleVerifyRequest(request, env)) {
        return createResponse('Unauthorized', 401);
    }

    let data: dataProps;
    try {
        data = await request.json();
    } catch (e) {
        return createResponse("Invalid post data.", 400);
    }

    if (!data.Id) {
        return createResponse("Invalid post data.", 400);
    }
    data.links.forEach(async (link, index) => {
        if (!link.Id || !link.CardId) {
            return createResponse("Invalid post data.", 400);
        }
    });


    const cardExists = await knex('Cards').where('Id', data.Id).first();
    if (!cardExists) {
        return createResponse("Invalid post data.", 409);
    }

    await knex('Cards')
        .where('Id', data.Id)
        .update({
        Id: data.Id,
        Collection: data.Collection,
        Category: data.Category,
        Title: data.Title,
        Url: data.Url,
        Description: data.Description,
        Detail: data.Detail,
    });

    await Promise.all(data.links.map(async (link) => {
        const linkExists = await knex('Links').where('Id', link.Id).first();
        if (!linkExists || linkExists.CardId !== link.CardId) {
            return createResponse("Invalid post data.", 409);
        }

        await knex('Links')
            .where('Id', link.Id)
            .update({
            Id: link.Id,
            CardId: link.CardId,
            Title: link.Title,
            Url: link.Url,
        });
    }));

    return createResponse({ success: true }, 200);
}