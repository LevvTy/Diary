import './DiaryCard.css'

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DiaryCard({ entry, onDelete }) {
  const { id, title, content, emotion, createdAt } = entry

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa nhật ký này?')) {
      onDelete(id)
    }
  }

  return (
    <article className="diary-card">
      <div className="card-header">
        {emotion && (
          <span className="card-emotion" title={emotion.label}>
            {emotion.emoji}
          </span>
        )}
        <div className="card-meta">
          <h3 className="card-title">{title}</h3>
          <time className="card-date" dateTime={createdAt}>
            🕐 {formatDate(createdAt)}
          </time>
        </div>
      </div>

      {emotion && (
        <div className="card-emotion-badge">
          {emotion.emoji} {emotion.label}
        </div>
      )}

      <p className="card-content">{content}</p>

      <button
        className="delete-btn"
        onClick={handleDelete}
        aria-label={`Xóa nhật ký: ${title}`}
      >
        🗑️ Xóa
      </button>
    </article>
  )
}
