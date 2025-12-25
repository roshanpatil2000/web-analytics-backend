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

let isConnected = false;

const db = drizzle(client);

export async function connectDb(): Promise<void> {
    if (isConnected) {
        return;
    }

    try {
        await client.connect();
        isConnected = true;
        console.log('✅ Successfully connected to database');
    } catch (error) {
        console.error('❌ Failed to connect to database:', error);
        throw error;
    }
}

export async function disconnectDb(): Promise<void> {
    if (!isConnected) {
        return;
    }

    try {
        await client.end();
        isConnected = false;
        console.log('✅ Disconnected from database');
    } catch (error) {
        console.error('❌ Error disconnecting from database:', error);
        throw error;
    }
}

export default db;