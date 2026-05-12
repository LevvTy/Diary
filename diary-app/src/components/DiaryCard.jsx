import './DiaryCard.css'

export default function DiaryCard({ dateLabel, entries, onClick }) {
  const first = entries[0]
  const emotions = [...new Set(entries.map(e => e.emotion?.emoji).filter(Boolean))]

  return (
    <article
      className="diary-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="card-top">
        <span className="card-date-label">{dateLabel}</span>
        {entries.length > 1 && (
          <span className="card-count">{entries.length} mục</span>
        )}
      </div>

      <h3 className="card-title">{first.title}</h3>
      <p className="card-preview">{first.content}</p>

      {emotions.length > 0 && (
        <div className="card-emotions">
          {emotions.map(emoji => (
            <span key={emoji} className="card-emotion-icon">{emoji}</span>
          ))}
        </div>
      )}
    </article>
  )
}
