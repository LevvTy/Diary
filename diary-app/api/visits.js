import supabase from './_supabase.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'POST') {
    const body = await new Promise(resolve => {
      if (req.body && typeof req.body === 'object') return resolve(req.body)
      let data = ''
      req.on('data', chunk => { data += chunk })
      req.on('end', () => { try { resolve(JSON.parse(data)) } catch { resolve({}) } })
    })

    const visited_at = body.visited_at || new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().replace('Z', '+07:00')

    const { error } = await supabase
      .from('visits')
      .insert([{ visited_at }])

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
