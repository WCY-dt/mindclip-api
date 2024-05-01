import { Knex } from 'knex';
import { handleVerifyRequest } from '../../services/verifyHandler';
import createResponse from '../../utils/createResponse';
import generateUniqueID from '../../utils/generateUniqueID';

export async function handlePostCardLinkRequest(knex: Knex, request: Request, env: Env) {
    if (!await handleVerifyRequest(request, env)) {
        return createResponse('Unauthorized', 401);
    }

    let data: linkProps;
    try {
        data = await request.json();
    } catch (e) {
        return createResponse("Invalid post data.", 400);
    }

    if (!data.CardId) {
        return createResponse("Invalid post data.", 400);
    }

    data.Id = await generateUniqueID(knex, 'Links');

    await knex('Links').insert({
        Id: data.Id,
        CardId: data.CardId,
        Title: data.Title,
        Url: data.Url,
    });

    let result = { Id: data.Id };

    return createResponse(result, 200);
}
