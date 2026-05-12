import { useState, useEffect } from 'react'
import { fetchEntries, deleteEntry } from '../lib/api'
import DiaryCard from './DiaryCard'
import './DiaryList.css'

export default function DiaryList({ refreshKey }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchEntries()
      .then(data => setEntries(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [refreshKey])

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhật ký này?')) return
    try {
      const updated = await deleteEntry(id)
      setEntries(updated)
    } catch (err) {
      alert('Xóa thất bại: ' + err.message)
    }
  }

  return (
    <section className="diary-list">
      <h2>📚 Nhật ký của bạn</h2>

      {loading && (
        <div className="list-status">⏳ Đang tải nhật ký...</div>
      )}

      {!loading && error && (
        <div className="list-status error">❌ {error}</div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p>Chưa có nhật ký nào. Hãy viết điều gì đó!</p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="entries-grid">
          {entries.map(entry => (
            <DiaryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  )
}
