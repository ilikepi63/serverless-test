const { Client } = require('pg')

const text = 'INSERT INTO developers(first_name, last_name) VALUES($1, $2) RETURNING *'
const values = ['Cameron', 'Harris']

const client = new Client({
    host: 'database-1.cgdkrrkdene6.eu-west-1.rds.amazonaws.com',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
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
