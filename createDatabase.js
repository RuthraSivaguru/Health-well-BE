require('dotenv').config();
const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    user: process.env.DB_USERNAME || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres DB
    password: process.env.DB_PASSWORD || '7235',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');
    
    // Check if database exists
    const dbName = process.env.DB_NAME || 'ai_assistant';
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (res.rowCount === 0) {
      console.log(`Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log('Database created successfully');
    } else {
      console.log(`Database "${dbName}" already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err.stack);
  } finally {
    await client.end();
  }
}

createDatabase();
