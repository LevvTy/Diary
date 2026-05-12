import express from 'express'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config() // load .env

const app = express()
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

// GET /api/entries
app.get('/api/entries', async (req, res) => {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('entry_date', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/entries
app.post('/api/entries', async (req, res) => {
  const { title, content, emotion, entry_date } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'Nội dung không được để trống' })

  const { data, error } = await supabase
    .from('entries')
    .insert([{
      title: title?.trim() || 'Không có tiêu đề',
      content: content.trim(),
      emotion: emotion ?? null,
      entry_date: entry_date ?? new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// DELETE /api/entries/:id
app.delete('/api/entries/:id', async (req, res) => {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

// POST /api/visits
app.post('/api/visits', async (req, res) => {
  const { error } = await supabase
    .from('visits')
    .insert([{ visited_at: new Date().toISOString() }])

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json({ success: true })
})

app.listen(3001, () => console.log('API server running on http://localhost:3001'))
