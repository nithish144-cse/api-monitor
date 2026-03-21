const express = require('express')
const cors = require('cors')
const app=express()
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.json({ message: 'API Monitor is running!' })
})
app.listen(300, () => {
    console.log('Server started on port 3000')
})
