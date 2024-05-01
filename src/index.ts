import Knex from 'knex';
import ClientD1 from 'knex-cloudflare-d1';

import createResponse from './utils/createResponse';

import { handleLoginRequest } from './services/loginHandler';

import { handleGetCardRequest } from './routes/GET/cardHandler';
import { handleGetCardTitleRequest } from './routes/GET/cardTitleHandler';
import { handleGetCardCollectionRequest } from './routes/GET/cardCollectionHandler';
import { handleGetCardCategoryRequest } from './routes/GET/cardCategoryHandler';

import { handlePostCardRequest } from './routes/POST/cardHandler';
import { handlePostCardLinkRequest } from './routes/POST/cardLinkHandler';

import { handlePutCardRequest } from './routes/PUT/cardHandler';

import { handleDeleteCardRequest } from './routes/DELETE/cardHandler';
import { handleDeleteCardLinkRequest } from './routes/DELETE/cardLinkHandler';

import { handleOptionsRequest } from './routes/OPTIONS/anyHandler';

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
		const method = request.method;

		console.log(`method: ${method} - Pathname: ${pathname}`);

        try {
			if (pathname === '/') {
				return createResponse("Welcome to MindClip!", 204);
			}

			switch (method) {
				case 'OPTIONS':
					return await handleOptionsRequest(knex, request);
				case 'GET':
					switch (pathname) {
						case "/card":
							return await handleGetCardRequest(knex, request);
						case "/card/title":
							return await handleGetCardTitleRequest(knex, request);
						case "/card/collection":
							return await handleGetCardCollectionRequest(knex, request);
						case "/card/category":
							return await handleGetCardCategoryRequest(knex, request);
						default:
							return createResponse("Invalid path.", 404);
					}
				case 'POST':
					switch (pathname) {
						case "/login":
							return await handleLoginRequest(knex, request, env);
						case "/card":
							return await handlePostCardRequest(knex, request, env);
						case "/card/link":
							return await handlePostCardLinkRequest(knex, request, env);
						default:
							return createResponse("Invalid path.", 404);
					}
				case 'PUT':
					switch (pathname) {
						case "/card":
							return await handlePutCardRequest(knex, request, env);
						default:
							return createResponse("Invalid path.", 404);
					}
				case 'DELETE':
					switch (pathname) {
						case "/card":
							return await handleDeleteCardRequest(knex, request, env);
						case "/card/link":
							return await handleDeleteCardLinkRequest(knex, request, env);
						default:
							return createResponse("Invalid path.", 404);
					}
				default:
					return createResponse("Invalid method.", 405);
			}
        } catch (error) {
            return createResponse("Internal server error.", 500);
        }
    },
} satisfies ExportedHandler<Env>;
