const express = require('express');
const path = require('path');
const connectToAllDatabases = require('./connectDB');

const app = express();
const port = 3000;

// Serve static files (index.html, script.js)
app.use(express.static(path.join(__dirname)));

// Express json middleware
app.use(express.json());

// Keep ids up to date
let nextID = 11;

let mongoDB, postgreDB;
async function connectDB() {
    const databases = await connectToAllDatabases();
    mongoDB = databases.mongo;
    postgreDB = databases.postgre;
        
    // Call the function to populate the databases
    //await delay(2000)
    //console.log(postgreDB);
    //populateDatabases().catch(err => console.error(err));
};
connectDB();

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function populateDatabases() {
    // Populate MongoDB
    const mongoUsers = [
        { "id": 1, "name": "Alpha" },
        { "id": 2, "name": "Bravo" },
        { "id": 3, "name": "Charlie" },
        { "id": 4, "name": "Delta" },
        { "id": 5, "name": "Echo" }
    ];
    
    await mongoDB.collection('users').insertMany(mongoUsers);
    console.log('MongoDB users populated');
    // Populate PostgreSQL
    const postgreUsers = [
        { "id": 6, "name": "Foxtrot" },
        { "id": 7, "name": "Golf" },
        { "id": 8, "name": "Hotel" },
        { "id": 9, "name": "India" },
        { "id": 10, "name": "Juliet" }
    ]
    for (const user of postgreUsers) {
        await postgreDB.query('INSERT INTO users (id, name) VALUES ($1, $2);', [user.id, user.name]);
    }
    console.log('PostgreSQL users populated');
}

// Endpoint to get data from MongoDB
app.get('/mongo/read', async (req, res) => {
    try {
        const Data = await mongoDB.collection("users").find({}, { projection: { _id: 0 } }).toArray();
        res.json(Data);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to insert data into MongoDB
app.post('/mongo/insert', async (req, res) => {
    try {
        const result = await mongoDB.collection("users").insertOne({id: nextID, name: req.body.name});
        nextID += 1;
        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to modify data in MongoDB
app.post('/mongo/modify', async (req, res) => {
    try {
        console.log(req.body)
        const result = await mongoDB.collection("users").updateOne({ id: req.body.id }, { $set: { name: req.body.name } });
        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to delete data from MongoDB
app.post('/mongo/delete', async (req, res) => {
    try {
        const result = await mongoDB.collection("users").deleteOne({ id: req.body.id });
        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to get data from PostgreSQL
app.get('/postgre/read', async (req, res) => {
    try {
        const result = await postgreDB.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to insert data into PostgreSQL
app.post('/postgre/insert', async (req, res) => {
    try {
        const result = await postgreDB.query('INSERT INTO users (id, name) VALUES ($1, $2) RETURNING *', [nextID, req.body.name]);
        nextID += 1;
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to modify data in PostgreSQL
app.post('/postgre/modify', async (req, res) => {
    try {
        const { id, name } = req.body;
        const result = await postgreDB.query('UPDATE users SET id = $1, name = $2 WHERE id = $1 RETURNING *', [id, name]);
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to delete data from PostgreSQL
app.post('/postgre/delete', async (req, res) => {
    try {
        const result = await postgreDB.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.body.id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

// Endpoint to query both databases
app.get('/both/read', async (req, res) => {
    try {
        const mongoData = await mongoDB.collection("users").find({}, { projection:  { _id: 0 } }).toArray();
        const postgreResult = await postgreDB.query('SELECT * FROM users');
        const postgreData = postgreResult.rows;

        // Combine both datasets
        const combinedData = [...mongoData, ...postgreData];

        res.json(combinedData);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});