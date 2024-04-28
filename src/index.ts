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

		let response;
		switch (pathname) {
			case "/linkcard":
				response = handleLinkcardRequest(knex, request);
			case "/title":
				response = handleTitleRequest(knex, request);
			case "/collection":
				response = handleCollectionRequest(knex, request);
			case "/category":
				response = handleCategoryRequest(knex, request);
			case "/":
				response = new Response("Welcome to the MindClip API. Call /linkcard to get the data from the database.");
			default:
				response = new Response("Invalid path. Only /linkcard is supported.", { status: 404 });
		}
		response.headers.set('Access-Control-Allow-Origin', '*');
		response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

		return response;
	},
} satisfies ExportedHandler<Env>;