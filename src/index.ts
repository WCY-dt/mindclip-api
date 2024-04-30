import Knex from 'knex';
import ClientD1 from 'knex-cloudflare-d1';

import createResponse from './utils/createResponse';

import { handleLoginRequest } from './services/loginHandler';

import { handleCardRequest } from './routes/cardHandler';
import { handleTitleRequest } from './routes/titleHandler';
import { handleCollectionRequest } from './routes/collectionHandler';
import { handleCategoryRequest } from './routes/categoryHandler';

import { handleEditNewCardRequest } from './routes/editNewCardHandler';
import { handleEditNewLinkRequest } from './routes/editNewLinkHandler';
import { handleEditModifyRequest } from './routes/editModifyHandler';
import { handleEditDeleteCardRequest } from './routes/editDeleteCardHandler';
import { handleEditDeleteLinkRequest } from './routes/editDeleteLinkHandler';

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
        
        try {
            if (request.method === 'POST') {
                switch (pathname) {
                    case "/login":
                    case "/edit":
                        return await handleLoginRequest(knex, request, env);
                    case "/edit/new/card":
                        return await handleEditNewCardRequest(knex, request, env);
                    case "/edit/new/link":
                        return await handleEditNewLinkRequest(knex, request, env);
                    case "/edit/modify":
                        return await handleEditModifyRequest(knex, request, env);
                    case "/edit/delete/card":
                        return await handleEditDeleteCardRequest(knex, request, env);
                    case "/edit/delete/link":
                        return await handleEditDeleteLinkRequest(knex, request, env);
                    default:
                        return createResponse("Invalid path.", 404);
                }
            } else if (request.method === 'GET') {
                switch (pathname) {
                    case "/card":
                        return await handleCardRequest(knex, request);
                    case "/title":
                        return await handleTitleRequest(knex, request);
                    case "/collection":
                        return await handleCollectionRequest(knex, request);
                    case "/category":
                        return await handleCategoryRequest(knex, request);
                    case "/":
                        return createResponse("Welcome to MindClip!", 204);
                    default:
                        return createResponse("Invalid path.", 404);
                }
            } else {
                return createResponse("Invalid method.", 405);
            }
        } catch (error) {
            return createResponse("Internal server error.", 500);
        }
    },
} satisfies ExportedHandler<Env>;