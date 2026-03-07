const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = 4000;

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'FashionData';
let db;

MongoClient.connect(url)
    .then(client => {
        db = client.db(dbName);
        console.log('✅ Connected to MongoDB');
    })
    .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/api/fashions', async (req, res) => {
    try {
        const { style } = req.query;
        const filter = style ? { style } : {};
        const fashions = await db.collection('Fashionex58')
            .find(filter)
            .sort({ creation_date: -1 })
            .toArray();
        res.json(fashions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/fashions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const fashion = await db.collection('Fashionex58').findOne({ _id: new ObjectId(id) });
        if (!fashion) return res.status(404).json({ error: 'Not found' });
        res.json(fashion);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/fashions', async (req, res) => {
    try {
        const { style, fashion_title, fashion_details, thumbnail } = req.body;
        const newFashion = {
            style,
            fashion_title,
            fashion_details,
            thumbnail,
            creation_date: new Date()
        };
        const result = await db.collection('Fashionex58').insertOne(newFashion);
        res.status(201).json({ ...newFashion, _id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/fashions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { style, fashion_title, fashion_details, thumbnail } = req.body;
        const updateData = {
            style,
            fashion_title,
            fashion_details,
            thumbnail
        };
        const result = await db.collection('Fashionex58').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/fashions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.collection('Fashionex58').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

app.listen(port, () => {
    console.log(`My Server listening on port ${port}`)
})