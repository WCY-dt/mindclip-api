import { Knex } from 'knex';

export default async function generateUniqueID(knex: Knex, tableName: string): Promise<number> {
    let id;
    let repeated;
    do {
        id = Math.floor(Math.random() * 10000);
        repeated = await knex(tableName).where('Id', id);
    } while (repeated.length > 0);
    return id;
}