const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const { json } = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hr7oi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const servicesadd = client.db("dreamtours").collection("addservices");
    const bookstours = client.db("dreamtours").collection("bookstours");
    // https://salty-cove-54306.herokuapp.com/showallservices

    // showallservices
    app.get("/showallservices", async (req, res) => {
      const cursor = servicesadd.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/serviceadd", async (req, res) => {
      const data = req.body;
      const result = await servicesadd.insertOne(data);
      res.json(result);
    });

    // booktours
    app.get("/booktourslist", async (req, res) => {
      const cursor = bookstours.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/booktours", async (req, res) => {
      const data = req.body;
      const result = await bookstours.insertOne(data);
      res.json(result);
    });
    app.delete("/delettable/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookstours.deleteOne(query);
      res.json(result);
    });

    app.put("/statusupdate/:id", async (req, res) => {
      const Id = req.params.id;
      const AllData = req.body;
      const filter = { _id: ObjectId(Id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: AllData.status,
        },
      };
      const result = await bookstours.updateOne(filter, updateDoc, options);
      res.json(result);
    });
  } finally {
  }
}

run().catch(() => console.log("error"));

app.listen(port, () => {
  console.log("server runing 5000");
});
