const express = require("express");
var cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//mongoDB Uri

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wnynm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("dreamVacation");
    const serviceCollection = database.collection("services");
    const bookingCollection = database.collection("bookings");

    //GET API All Services
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //Get All Bookings

    app.get("/booking", async (req, res) => {
      const cursor = bookingCollection.find({});
      const allOrders = await cursor.toArray();
      res.send(allOrders);
    });

    //GET Bookings by email

    app.get("/booking/:email", async (req, res) => {
      //console.log(req.params.email);
      const cursor = bookingCollection.find({ email: req.params.email });
      const result = await cursor.toArray();
      res.send(result);
    });

    //POST A New Service or Destination

    app.post("/services", async (req, res) => {
      //console.log("Hitting the post service");
      const result = await serviceCollection.insertOne(req.body);
      res.json(result);
    });

    //POST Add A booking

    app.post("/addbooking", async (req, res) => {
      const result = await bookingCollection.insertOne(req.body);
      console.log(result);
      res.json(result);
    });

    //DELETE A BOOKING

    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      console.log(query);
      const result = await bookingCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hi, Hello from node");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
