const cron = require('node-cron')
const axios = require('axios')
const { endpoints, results } = require('./data')
const { supabase } = require('./db')
const { sendAlert } = require('./alert')

cron.schedule('*/1 * * * *', async () => {
    console.log('Checking APIs...')
    console.log('Endpoints:', endpoints)

    for (const endpoint of endpoints) {
        const start = Date.now()
        try {
            const response = await axios.get(endpoint.url, { timeout: 5000 })
            const latency = Date.now() - start

            const result = {
                name: endpoint.name,
                url: endpoint.url,
                status: response.status,
                latency: latency,
                up: true,
                checked_at: new Date().toISOString()
            }

            results.push(result)

            const { error } = await supabase.from('result').insert(result)
            if (error) console.log('Supabase error:', error)

            console.log(`✅ ${endpoint.name} — ${response.status} — ${latency}ms`)

        } catch (error) {
            const result = {
                name: endpoint.name,
                url: endpoint.url,
                status: 0,
                latency: Date.now() - start,
                up: false,
                checked_at: new Date().toISOString()
            }

            results.push(result)

            const { error2 } = await supabase.from('result').insert(result)
            if (error2) console.log('Supabase error:', error2)

            await sendAlert(endpoint.name, endpoint.url)

            console.log(`❌ ${endpoint.name} — DOWN`)
        }
    }
})