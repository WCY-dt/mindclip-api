import { Knex } from 'knex';
import jwt from '@tsndr/cloudflare-worker-jwt'
import createResponse from '../utils/createResponse';

export async function handleLoginRequest(knex: Knex, request: Request, env: Env) {
    let user: string, pass: string;

    try {
        const data: { user: string, pass: string } = await request.json();
        user = data.user;
        pass = data.pass;
    } catch (error) {
        return createResponse('Invalid post data.', 400);
    }

    if (user !== `${env.USERNAME}` || pass !== `${env.PASSWORD}`) {
        return createResponse('Unauthorized', 401);
    }

    const token = await jwt.sign({
        user: user,
        // nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2 // 2 hour
    }, `${env.SECRET_KEY}`);

    const results = { token };

    return createResponse(results, 200);
}
