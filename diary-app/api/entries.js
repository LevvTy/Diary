import supabase from './_supabase.js'

// Helper parse body vì Vercel Functions không tự parse JSON
async function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body)
    }
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data)) } catch { resolve({}) }
    })
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // GET /api/entries
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase GET error:', error)
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json(data)
  }

  // POST /api/entries
  if (req.method === 'POST') {
    const body = await parseBody(req)
    const { title, content, emotion } = body

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Nội dung không được để trống' })
    }

    const { data, error } = await supabase
      .from('entries')
      .insert([{
        title: title?.trim() || 'Không có tiêu đề',
        content: content.trim(),
        emotion: emotion ?? null,
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase POST error:', error)
      return res.status(500).json({ error: error.message })
    }
    return res.status(201).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
