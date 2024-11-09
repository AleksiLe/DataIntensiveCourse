const { MongoClient } = require('mongodb');

const url1 = 'mongodb://localhost:27017/eu';
const url2 = 'mongodb://localhost:27017/na';
const url3 = 'mongodb://localhost:27017/asia';

async function connectToDatabase(url) {
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

async function connectToAllDatabases() {
    const eu = await connectToDatabase(url1);
    const na = await connectToDatabase(url2);
    const asia = await connectToDatabase(url3);

    return { eu, na, asia };
}

module.exports = connectToAllDatabases;