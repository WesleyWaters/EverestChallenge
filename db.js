const dotenv = require('dotenv')
dotenv.config()
const {MongoClient} = require('mongodb')

const client = new MongoClient(process.env.CONNECTIONSTRING)

async function start(){
    await client.connect()
    console.log('DB Connected')
    module.exports = client
    const app = require(`./app`)
    console.log('About to start listening')
    app.listen(process.env.PORT)
    console.log(`listening on port:${process.env.PORT}`)
}

start()