const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');


const app = express();
const port = 8000;

app.use(express.json());
app.use(express.static('public'));

async function getDBCollection(dbAddress, dbName, dbCollectionName) {
	const client = new MongoClient(dbAddress);
	await client.connect();
	const db = client.db(dbName);
	return db.collection(dbCollectionName);
}

app.get('/notes', async function(req, res){
	const collection = await getDBCollection('mongodb://127.0.0.1', 'journalapp', 'notes');
	const data = await collection.find({}).toArray();
	res.send(data);
});

app.get('/notes/:id', async function(req, res){
	const collection = await getDBCollection('mongodb://127.0.0.1', 'journalapp', 'notes');
	const data = await collection.findOne({_id: new ObjectId(req.params.id)});
	res.send(data);
});

app.post('/notes', async function(req, res){
	const note = {...req.body};
	const collection = await getDBCollection('mongodb://127.0.0.1', 'journalapp', 'notes');
	await collection.insertOne(note);
	res.send(note);
});

app.patch('/notes/:id', async function(req, res){
	const collection = await getDBCollection('mongodb://127.0.0.1', 'journalapp', 'notes');
	const data = await collection.updateOne({_id: new ObjectId(req.params.id)}, {'$set': req.body});
	res.send({});
});

app.delete('/notes/:id', async function(req, res){
	const collection = await getDBCollection('mongodb://127.0.0.1', 'journalapp', 'notes');
	await collection.deleteOne({_id: new ObjectId(req.params.id)});
	res.send({});
});

app.listen(port, function() {
	console.log('SERVER IS STARTED');
});