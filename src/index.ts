import Knex from 'knex';
import ClientD1 from 'knex-cloudflare-d1';
import { handleTestloginRequest } from './routes/testloginHandler';
import { handleLoginRequest } from './services/loginHandler';
import { handleCardRequest } from './routes/cardHandler';
import { handleTitleRequest } from './routes/titleHandler';
import { handleCollectionRequest } from './routes/collectionHandler';
import { handleCategoryRequest } from './routes/categoryHandler';

export default {
    async fetch(request, env, ctx): Promise<Response> {
        const knex = Knex({
            client: ClientD1,
            connection: {
                database: env.MINDCLIP_DATA
            },
            useNullAsDefault: true,
        });

        const url = new URL(request.url);
        const { pathname, searchParams } = url;

        if (request.method === 'POST') {
            let response;
            switch (pathname) {
                case "/login":
                    response = await handleLoginRequest(knex, request, env);
                    break;
                case "/testlogin":
                    response = await handleTestloginRequest(knex, request, env);
                    break;
                default:
                    response = new Response("Invalid path.", { status: 404 });
            }
            return response;
        } else if (request.method === 'GET') {
            let response;
            switch (pathname) {
                case "/card":
                    response = await handleCardRequest(knex, request);
                    break;
                case "/title":
                    response = await handleTitleRequest(knex, request);
                    break;
                case "/collection":
                    response = await handleCollectionRequest(knex, request);
                    break;
                case "/category":
                    response = await handleCategoryRequest(knex, request);
                    break;
                case "/":
                    response = new Response("Welcome to the MindClip API. Call /linkcard to get the data from the database.", { status: 404 });
                    break;
                default:
                    response = new Response("Invalid path.", { status: 404 });
            }
            return response;
        } else {
            return new Response("Invalid request method. Only GET or POST is supported.", { status: 405 });
        }
    },
} satisfies ExportedHandler<Env>;