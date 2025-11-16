const express = require('express')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const cors = require('cors')
const { MongoClient } = require('mongodb');
dotenv.config()

const app = express()
app.use(bodyparser.json())
app.use(cors())
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = 'PManager';


const port = 3000

client.connect();
app.get('/', async(req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})

app.post('/', async(req, res) => {
  const passwords = req.body;
  const db = client.db(dbName);
  const collection = db.collection('passwords');

  const findResult = await collection.insertOne(passwords);
  res.send({success:true,result:findResult})
})

app.delete('/', async(req, res) => {
  const passwords = req.body;
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.deleteOne(passwords);
  res.send({success:true,result:findResult})
})


app.put('/', async(req, res) => {
  const { id, site, sitename, password } = req.body;
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const result = await collection.updateOne(
    {id:id},
    {$set:{site, sitename, password}}
  );
  res.send({success:true,result})
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
