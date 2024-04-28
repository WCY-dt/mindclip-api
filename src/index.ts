import Knex from 'knex';
import ClientD1 from 'knex-cloudflare-d1';
import { handleLinkcardRequest } from './routes/linkcardHandler';
import { handleTitleRequest } from './routes/titleHandler';
import { handleCollectionRequest } from './routes/collectionHandler';
import { handleCategoryRequest } from './routes/categoryHandler';

export default {
    async fetch(request, env): Promise<Response> {
        const knex = Knex({
            client: ClientD1,
            connection: {
                database: env.MINDCLIP_DATA
            },
            useNullAsDefault: true,
        });

        const url = new URL(request.url);
        const { pathname, searchParams } = url;

        if (request.method !== 'GET') {
            return new Response("Invalid request method. Only GET is supported.", { status: 405 });
        }

        let response;
        switch (pathname) {
            case "/linkcard":
                response = await handleLinkcardRequest(knex, request);
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
                response = new Response("Invalid path. Only /linkcard is supported.", { status: 404 });
        }
        return response;
    },
} satisfies ExportedHandler<Env>;