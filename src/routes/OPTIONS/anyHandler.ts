import { Knex } from 'knex';
import createResponse from '../../utils/createResponse';

export async function handleOptionsRequest(knex: Knex, request: Request) {
	return createResponse('', 200);
}
