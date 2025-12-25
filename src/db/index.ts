import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required. Please check your .env file.');
}

const client = new Client({
    connectionString: databaseUrl,
});

client.connect().catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});

const db = drizzle(client);
export default db;