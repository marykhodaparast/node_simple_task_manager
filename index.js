// require("dotenv").config();
// const mongoose = require("mongoose");

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));
const { mongoclient, MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log('connected to MongoDB');

    const db = client.db("testDB");
    const collection = db.collection("users");

    await collection.insertOne({ name: "Ali", age: 30 });

    const users = await collection.find().toArray();
    console.log(users);
  } finally {
    await client.close();
  }
}

run().catch(console.dir)
