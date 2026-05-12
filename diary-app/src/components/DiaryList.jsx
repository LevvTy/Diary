import { useState, useEffect } from 'react'
import { fetchEntries, deleteEntry } from '../lib/api'
import { useToast } from '../lib/toast'
import { getDateKey, formatDateLabel } from '../lib/time'
import DiaryCard from './DiaryCard'
import DiaryDetail from './DiaryDetail'
import Modal from './Modal'
import './DiaryList.css'

// Group entries theo ngày (YYYY-MM-DD theo local time)
function groupByDate(entries) {
  const map = {}
  entries.forEach(entry => {
    const key = getDateKey(entry.entry_date || entry.created_at)
    if (!map[key]) map[key] = []
    map[key].push(entry)
  })
  Object.values(map).forEach(arr =>
    arr.sort((a, b) => {
      const da = a.entry_date || a.created_at
      const db = b.entry_date || b.created_at
      return da.localeCompare(db)
    })
  )
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, entries]) => ({ key, entries }))
}

export default function DiaryList({ refreshKey }) {
  const toast = useToast()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchEntries()
      .then(data => setEntries(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [refreshKey])

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id)
      setEntries(prev => prev.filter(e => e.id !== id))
      toast('Đã xóa nhật ký')
    } catch (err) {
      toast(err.message || 'Xóa thất bại', 'error')
    }
  }

  const groups = groupByDate(entries)

  // Sync selectedGroup khi entries thay đổi (sau khi xóa)
  const syncedGroup = selectedGroup
    ? groups.find(g => g.key === selectedGroup.key)
    : null

  return (
    <section className="diary-list">
      <div className="diary-list-header">
        <h2>📚 Nhật ký của bạn</h2>
        {entries.length > 0 && (
          <span className="entry-count">{entries.length} bài</span>
        )}
      </div>

      {loading && <div className="list-status">⏳ Đang tải nhật ký...</div>}
      {!loading && error && <div className="list-status error">❌ {error}</div>}

      {!loading && !error && groups.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <p>Chưa có nhật ký nào. Hãy viết điều gì đó!</p>
        </div>
      )}

      {!loading && !error && groups.length > 0 && (
        <div className="entries-grid">
          {groups.map(group => (
            <DiaryCard
              key={group.key}
              dateLabel={formatDateLabel(group.key)}
              entries={group.entries}
              onClick={() => setSelectedGroup(group)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={!!syncedGroup} onClose={() => setSelectedGroup(null)}>
        {syncedGroup && (
          <DiaryDetail
            dateLabel={formatDateLabel(syncedGroup.key)}
            entries={syncedGroup.entries}
            onDelete={handleDelete}
            onClose={() => setSelectedGroup(null)}
          />
        )}
      </Modal>
    </section>
  )
}
