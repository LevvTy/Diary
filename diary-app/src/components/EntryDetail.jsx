import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { getTimeStr } from '../lib/time'
import './EntryDetail.css'

function formatTime(isoString) {
  return getTimeStr(isoString)
}

export default function EntryDetail({ entry, onDelete, onClose }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const dateStr = entry.entry_date || entry.created_at

  const handleDelete = () => {
    onDelete(entry.id)
    onClose()
  }

  return (
    <div className="entry-detail-overlay" onClick={onClose}>
      <div className="entry-detail-panel" onClick={e => e.stopPropagation()}>
        <button className="entry-detail-close" onClick={onClose} aria-label="Đóng">✕</button>

        <div className="entry-detail-header">
          {entry.emotion && (
            <span className="entry-detail-emotion">{entry.emotion.emoji}</span>
          )}
          <div>
            <h3 className="entry-detail-title">{entry.title}</h3>
            <time className="entry-detail-time">🕐 {formatTime(dateStr)}</time>
          </div>
        </div>

        {entry.emotion && (
          <div className="entry-detail-badge">
            {entry.emotion.emoji} {entry.emotion.label}
          </div>
        )}

        <div className="entry-detail-divider" />

        <p className="entry-detail-content">{entry.content}</p>

        <div className="entry-detail-footer">
          <button className="entry-detail-delete" onClick={() => setShowConfirm(true)}>
            🗑 Xóa nhật ký
          </button>
        </div>

        {showConfirm && (
          <ConfirmDialog
            message="Bạn có chắc muốn xóa nhật ký này?"
            onConfirm={handleDelete}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </div>
  )
}
