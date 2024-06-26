import { Knex } from 'knex';
import { handleVerifyRequest } from '../../services/verifyHandler';
import createResponse from '../../utils/createResponse';
import generateUniqueID from '../../utils/generateUniqueID';

export async function handlePutCardRequest(knex: Knex, request: Request, env: Env) {
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

    for (const link of data.links) {
		const linkExists = await knex('Links').where('Id', link.Id).first();
		if (linkExists && linkExists.CardId !== link.CardId) {
			return createResponse("Invalid post data.", 409);
		}

		if (!linkExists) {
			const linkId = await generateUniqueID(knex, 'Links');
			await knex('Links').insert({
				Id: linkId,
				CardId: data.Id,
				Title: link.Title,
				Url: link.Url,
			});
		} else {
			await knex('Links')
				.where('Id', link.Id)
				.update({
				Id: link.Id,
				CardId: link.CardId,
				Title: link.Title,
				Url: link.Url,
			});
		}
	}

    return createResponse({ success: true }, 200);
}
