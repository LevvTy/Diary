const BASE = '/api'

async function parseResponse(res) {
  const text = await res.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return null }
}

export async function fetchEntries() {
  const res = await fetch(`${BASE}/entries`)
  const data = await parseResponse(res)
  if (!res.ok) throw new Error(data?.error || 'Không thể tải nhật ký')
  return data ?? []
}

export async function addEntry(entry) {
  const res = await fetch(`${BASE}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  const data = await parseResponse(res)
  if (!res.ok) throw new Error(data?.error || 'Lưu thất bại')
  return data
}

export async function deleteEntry(id) {
  const res = await fetch(`${BASE}/entries/${id}`, { method: 'DELETE' })
  const data = await parseResponse(res)
  if (!res.ok) throw new Error(data?.error || 'Xóa thất bại')
  return data
}
