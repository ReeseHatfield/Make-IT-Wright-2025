const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

// enable CORS for all routes, change this as needed
app.use(cors())

app.get('/', (req, res) => res.json({ message: "Hello World with CORS!" }))

app.listen(port, () => console.log(`Example app with CORS enabled listening at http://localhost:${port}`))

