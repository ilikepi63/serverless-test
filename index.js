const serverless = require('serverless-http');
const express = require('express')
const app = express()
const { Client } = require('pg')

app.use(express.json({ strict: false }));

app.get('/hello', function (req, res) {
    res.send('Hello World!')
})

app.get("/developer", (req, res) => {

    getDevelopers()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: err });
        })

});

app.post("/developer", (req, res) => {

    // we are getting those things
    const { firstName, lastName } = req.body;

    createDeveloper(firstName, lastName)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({ message: err });
        })


});

async function createConnection() {

    /// Get those database credentials babaaay
    const { DATABASE_URL,
        DATABASE_PORT,
        DATABASE_USERNAME,
        DATABASE_PASSWORD, } = process.env;

    console.log(process.env);

    const client = new Client({
        host: DATABASE_URL,
        port: DATABASE_PORT,
        user: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
    })

    await client.connect();

    return client;
}

async function getDevelopers() {
    const client = await createConnection();

    const text = 'SELECT * FROM developers;'

    const result = await client.query(text).then(r => r.rows);

    await client.end();

    return result;
}

async function createDeveloper(firstName, lastName) {
    const client = await createConnection();

    const text = 'INSERT INTO developers(first_name, last_name) VALUES($1, $2) RETURNING *'
    const values = [firstName, lastName]

    const result = await client.query(text, values).then(r => r.rows);



    await client.end();

    return result;
}

module.exports.handler = serverless(app);