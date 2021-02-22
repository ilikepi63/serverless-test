const { Client } = require('pg')

const text = 'INSERT INTO developers(first_name, last_name) VALUES($1, $2) RETURNING *'
const values = ['Cameron', 'Harris']

const client = new Client({

})

client.connect()
    .then(() => {
        return client.query(text, values)
    })
    .then((res) => {
        console.log(res.rows);
    })
    .then(() => {
        return client.end()
    })
    .catch(console.error)
