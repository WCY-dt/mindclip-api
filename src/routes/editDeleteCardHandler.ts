import { Knex } from 'knex';
import { handleVerifyRequest } from '../services/verifyHandler';
import createResponse from '../utils/createResponse';

type postDataProps = {
    Id: number
}

export async function handleEditDeleteCardRequest(knex: Knex, request: Request, env: Env) {
    if (!await handleVerifyRequest(request, env)) {
        return createResponse('Unauthorized', 401);
    }

    let data: postDataProps;
    try {
        data = await request.json();
    } catch (e) {
        return createResponse("Invalid post data.", 400);
    }

    const cardExists = await knex('Cards').where('Id', data.Id).first();
    if (!cardExists) {
        return createResponse("Invalid post data.", 409);
    }

    await knex('Cards')
        .where('Id', data.Id)
        .del();

    return createResponse({ success: true }, 200);
}