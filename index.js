require('dotenv').config();
const express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x4uxqpq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("user_management");
    const usersCollections = database.collection("users");

    app.post('/users', async(req, res) => {
      const userData = req.body;
      // console.log(userData);
      const result = await usersCollections.insertOne(userData);
      res.send(result);
    })

    app.get('/users', async (req, res) => {
      const result = await usersCollections.find().toArray();
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Simple User Management!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
