import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [endpoints, setEndpoints] = useState([])
  const [results, setResults] = useState([])
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    fetchEndpoints()
    fetchResults()
    const interval = setInterval(() => {
      fetchResults()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchEndpoints = async () => {
    const res = await fetch('http://localhost:5000/endpoints')
    const data = await res.json()
    setEndpoints(data)
  }

  const fetchResults = async () => {
    const res = await fetch('http://localhost:5000/results')
    const data = await res.json()
    setResults(data)
  }

  const addEndpoint = async () => {
    if (!name || !url) return
    await fetch('http://localhost:5000/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url })
    })
    setName('')
    setUrl('')
    fetchEndpoints()
  }

  const deleteEndpoint = async (url) => {
    await fetch('http://localhost:5000/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    fetchEndpoints()
  }

  const getLatestResult = (url) => {
    const urlResults = results.filter(r => r.url === url)
    return urlResults[urlResults.length - 1]
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      
      <h1 style={{ color: '#333' }}>API Monitor Dashboard</h1>
      <p style={{ color: '#666' }}>Monitoring {endpoints.length} APIs</p>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ marginTop: 0 }}>Add New API</h2>
        <input
          placeholder="Name (e.g. Google)"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '180px' }}
        />
        <input
          placeholder="URL (e.g. https://google.com)"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '250px' }}
        />
        <button
          onClick={addEndpoint}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add
        </button>
      </div>

      <h2>Monitored APIs</h2>
      {endpoints.map((ep, i) => {
        const latest = getLatestResult(ep.url)
        return (
          <div key={i} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, color: '#333' }}>{ep.name}</h3>
              <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>{ep.url}</p>
              {latest && (
                <p style={{ margin: '4px 0', fontSize: '13px', color: '#888' }}>
                  Latency: {latest.latency}ms | Last checked: {new Date(latest.checked_at).toLocaleTimeString()}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {latest ? (
                <span style={{ padding: '6px 14px', borderRadius: '20px', background: latest.up ? '#4CAF50' : '#f44336', color: 'white', fontWeight: 'bold' }}>
                  {latest.up ? '✅ UP' : '❌ DOWN'}
                </span>
              ) : (
                <span style={{ padding: '6px 14px', borderRadius: '20px', background: '#gray', color: '#666' }}>
                  Checking...
                </span>
              )}
              <button
                onClick={() => deleteEndpoint(ep.url)}
                style={{ padding: '6px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default App