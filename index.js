const express = require('express')
const cors = require('cors')
const { endpoints, results } = require('./data')
const { supabase } = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'API Monitor is running!' })
})

app.post('/add', async (req, res) => {
    const { name, url } = req.body
    endpoints.push({ name, url })
    const { error } = await supabase.from('endpoints').insert({ name, url })
    if (error) console.log('Supabase error:', error)
    res.json({ message: `Added ${name}`, endpoints })
})

app.get('/endpoints', (req, res) => {
    res.json(endpoints)
})

app.get('/results', (req, res) => {
    res.json(results)
})

app.delete('/delete', async (req, res) => {
    const { url } = req.body
    const index = endpoints.findIndex(ep => ep.url === url)
    if (index !== -1) {
        endpoints.splice(index, 1)
    }
    const { error } = await supabase.from('endpoints').delete().eq('url', url)
    if (error) console.log('Supabase error:', error)
    res.json({ message: 'Deleted successfully', endpoints })
})

app.listen(5000, async () => {
    console.log('Server started on port 5000')
    const { data, error } = await supabase.from('endpoints').select('*')
    if (error) {
        console.log('Error loading endpoints:', error)
    } else {
        data.forEach(ep => endpoints.push(ep))
        console.log('Loaded endpoints from database:', endpoints)
    }
})

require('./monitor')