import { Knex } from 'knex';

export default async function generateUniqueID(knex: Knex, tableName: string): Promise<number> {
    const maxId = await knex(tableName).max('Id as Id').first();
    if (maxId) {
        return maxId.Id + 1;
    } else {
        return 1;
    }
}
