import { useState } from 'react'
import EntryDetail from './EntryDetail'
import './DiaryDetail.css'

function formatTime(isoString) {
  // Lấy phần giờ:phút trực tiếp từ string tránh lệch timezone
  const timePart = isoString.slice(11, 16)
  if (timePart) return timePart
  return new Date(isoString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatFullDate(isoString) {
  const [y, m, d] = isoString.slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function DiaryDetail({ dateLabel, entries, onDelete, onClose }) {
  const [selectedEntry, setSelectedEntry] = useState(null)

  const handleDelete = (id) => {
    onDelete(id)
    if (entries.length === 1) onClose()
  }

  const dateStr = entries[0].entry_date || entries[0].created_at

  return (
    <div className="diary-detail">
      <div className="detail-day-header">
        <span className="detail-day-icon">📅</span>
        <div>
          <h2 className="detail-day-title">{dateLabel}</h2>
          <p className="detail-day-sub">{formatFullDate(dateStr)}</p>
        </div>
      </div>

      <div className="detail-timeline">
        {entries.map((entry, i) => (
          <div key={entry.id} className="timeline-item">
            <div className="timeline-time">
              <span className="time-dot" />
              <time>{formatTime(entry.entry_date || entry.created_at)}</time>
            </div>

            <div
              className="timeline-body"
              onClick={() => setSelectedEntry(entry)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setSelectedEntry(entry)}
            >
              <div className="timeline-header">
                {entry.emotion && (
                  <span className="timeline-emotion">{entry.emotion.emoji}</span>
                )}
                <h3 className="timeline-title">{entry.title}</h3>
              </div>

              <p className="timeline-preview">{entry.content}</p>

              <span className="timeline-read-more">Đọc thêm →</span>
            </div>

            {i < entries.length - 1 && <div className="timeline-connector" />}
          </div>
        ))}
      </div>

      {selectedEntry && (
        <EntryDetail
          entry={selectedEntry}
          onDelete={handleDelete}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  )
}
