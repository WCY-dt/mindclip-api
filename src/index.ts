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

		const collection = searchParams.get('collection');
		const category = searchParams.get('category');
		const q = searchParams.get('query');

		switch (pathname) {
			case "/linkcard":
				return handleLinkcardRequest(knex, request);
			case "/title":
				return handleTitleRequest(knex, request);
			case "/collection":
				return handleCollectionRequest(knex, request);
			case "/category":
				return handleCategoryRequest(knex, request);
			case "/":
				return new Response("Welcome to the MindClip API. Call /linkcard to get the data from the database.");
			default:
				return new Response("Invalid path. Only /linkcard is supported.", { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;