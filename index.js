const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.gzgfqcq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const servicesCollections = client.db('Glamour-support-products').collection('services')
        const serviceReviewCollections = client.db('Glamour-support-products').collection('serviceReview')

        //Services API
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollections.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const products = await servicesCollections.findOne(query)
            res.send(products)
        })

        //Services Review API
        app.post('/serviceReview', async (req, res) => {
            const review = req.body;
            const result = await serviceReviewCollections.insertOne(review)
            res.send(result)
        })
        app.get('/serviceReview', async (req, res) => {
            let query = {}
            if (req.query._id) {
                query = {
                    id: req.query._id
                }
            }
            const cursor = serviceReviewCollections.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/serviceReview/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const serviceReview = await serviceReviewCollections.findOne(query)
            res.send(serviceReview)
        })
    }
    finally {

    }

}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('NODE.js running')
})

app.listen(port, () => {
    console.log(`port running ${port}`)
})