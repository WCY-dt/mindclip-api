import { Knex } from 'knex';
import jwt from '@tsndr/cloudflare-worker-jwt'

export async function handleLoginRequest(knex: Knex, request: Request, env: Env) {
    let user: string, pass: string;

    try {
        const data: { user: string, pass: string } = await request.json();
        user = data.user;
        pass = data.pass;
    } catch (error) {
        return new Response('Invalid request', { status: 400 });
    }

    if (user !== `${env.USERNAME}` || pass !== `${env.PASSWORD}`) {
        return new Response('Invalid credentials', { status: 401 });
    }

    const token = await jwt.sign({ user: user }, `${env.SECRET_KEY}`);

    const results = { token };

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