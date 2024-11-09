const express = require('express');
const path = require('path');
const connectToAllDatabases = require('./connectDB');

const app = express();
const port = 3000;

// Serve static files (index.html, script.js)
app.use(express.static(path.join(__dirname)));

let eu, na, asia;
async function connectDB() {
    const databases = await connectToAllDatabases();
    eu = databases.eu;
    na = databases.na;
    asia = databases.asia;
};
connectDB();

// Endpoint to get data from MongoDB
app.get('/eu/:collection', async (req, res) => {
    const collectionName = req.params.collection;
    try {
        const Data = await eu.collection(collectionName).find().toArray();
        res.json(Data);
    } catch (err) {
        res.status(500).send(err);
    }
});
app.get('/na/:collection', async (req, res) => {
    const collectionName = req.params.collection;
    try {
        const Data = await na.collection(collectionName).find().toArray();
        res.json(Data);
    } catch (err) {
        res.status(500).send(err);
    }
});
app.get('/asia/:collection', async (req, res) => {
    const collectionName = req.params.collection;
    try {
        const Data = await asia.collection(collectionName).find().toArray();
        res.json(Data);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});