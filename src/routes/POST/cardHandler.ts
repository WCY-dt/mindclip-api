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

    await knex('Cards').insert({
        Id: data.Id,
        Collection: data.Collection,
        Category: data.Category,
        Title: data.Title,
        Url: data.Url,
        Description: data.Description,
        Detail: data.Detail,
    });

	let linkId = await generateUniqueID(knex, 'Links');

	for (const link of data.links) {
		await knex('Links').insert({
			Id: linkId,
			CardId: data.Id,
			Title: link.Title,
			Url: link.Url,
		});
		linkId++;
	}

    let result = {
        Id: data.Id,
        links: data.links.map(link => (link.Id))
    };

    return createResponse(result, 200);
}
