
const express = require('express');
var cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4100
// midelwire
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j0yhois.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


const userCollection = client.db('myuserDB').collection('users')

// user api
app.get('/users' , async(req , res ) => {
    const cursor = userCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })
  app.post('/users', async (req , res) =>{
    const users = req.body ;
    console.log(users);
    const result = await userCollection.insertOne(users);
    res.send(result)
  })


// added new job 
const jobCollection = client.db("insertDB").collection("addjob");

app.get('/jobs' , async(req , res ) => {
  const cursor = jobCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

// add new jobs
app.post('/jobs', async (req , res) =>{
    const addedNewJob = req.body ;
    console.log(addedNewJob);
    const result = await jobCollection.insertOne(addedNewJob);
    res.send(result)
})


/
 // Fetch jobs by id
app.get('/jobs/:id', async (req, res) => {
  const jobId = req.params.id;
  console.log(jobId)
  const query = { _id: new ObjectId(jobId) };
  const job = await jobCollection.findOne(query);
  res.json(job);
});
 
// mybids get 

 const myBidsCollections =client.db('mybidsDB').collection('mybids')
app.get('/mybids', async (req , res)=>{
  const cursor = myBidsCollections.find();
  const result = await cursor.toArray();
  res.send(result)
})
app.post('/mybids', async (req , res) =>{
  const myBids = req.body;
  console.log(myBids)
  const result = await myBidsCollections.insertOne(myBids)
  res.send(result);
})
//  bids Request 

const bidsRequest = client.db('mybidsDB').collection('bidsRquest');

app.get('/bidsrequest', async (req, res) => {
  try {
    const cursor = bidsRequest.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching bids requests:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post('/bidsrequest', async (req, res) => {
  try {
    const bidsReuest = req.body;
    console.log(bidsReuest);

    const result = await bidsRequest.insertOne(bidsReuest);
    res.send(result);
  } catch (error) {
    console.error("Error adding bids request:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
// // for cheeking error 
// app.post('/bidsrequest', async (req, res) => {
//   const bidsRequest = req.body;
//   console.log(bidsRequest);

//   try {
//     const result = await bidsRequest.insertOne(bidsRequest);
//     console.log(result);
//     res.send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });


app.get('/', (req, res) => {
  res.send('jobi site')
})

app.listen(port, () => {
  console.log(`Jobi app listening on port ${port}`)
})