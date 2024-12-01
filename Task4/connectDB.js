const { MongoClient } = require('mongodb');
const { Client } = require('pg')
const url1 = 'mongodb://localhost:27017/task4';

require('dotenv').config();


async function connectToMongoDatabase(url) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log(`Connected to database at ${url}`);
        return client.db();
    } catch (err) {
        console.error(`Failed to connect to database at ${url}`, err);
        throw err;
    }
}

async function connectToPostgreDatabase() {
    const client = new Client({
        user: process.env.USER,
        password: process.env.USERPASSWORD,
        host: 'localhost',
        port: 5432,
        database: 'mock'
    });
    client.connect().then(() => {
        console.log('Connected to postgres database');
    }).catch((err) => {
        console.error(err + ': Error connecting to postgres database');
    });
    return client;
}

async function connectToAllDatabases() {
    mongo = await connectToMongoDatabase(url1);
    postgre = await connectToPostgreDatabase();
    return { mongo, postgre };
}

module.exports = connectToAllDatabases;