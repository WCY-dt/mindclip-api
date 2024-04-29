import { Knex } from 'knex';
import { handleVerifyRequest } from '../services/verifyHandler';

export async function handleTestloginRequest(knex: Knex, request: Request, env: Env) {
    if (!await handleVerifyRequest(request, env)) {
        return new Response('Unauthorized', { status: 401 });
    }

    const results = 'Test login successful!';

    const response = new Response(JSON.stringify(results), {
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