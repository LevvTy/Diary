import { useState } from 'react'
import { addEntry } from '../lib/api'
import { useToast } from '../lib/toast'
import './DiaryForm.css'

const EMOTIONS = [
  { emoji: '😊', label: 'Vui vẻ' },
  { emoji: '😢', label: 'Buồn' },
  { emoji: '😡', label: 'Tức giận' },
  { emoji: '😰', label: 'Lo lắng' },
  { emoji: '😴', label: 'Mệt mỏi' },
  { emoji: '🥰', label: 'Hạnh phúc' },
  { emoji: '😐', label: 'Bình thường' },
  { emoji: '🤩', label: 'Phấn khích' },
]

// Format datetime-local value từ Date
function toLocalDatetimeValue(date) {
  const pad = n => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function DiaryForm({ onSaved }) {
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emotion, setEmotion] = useState(null)
  const [date, setDate] = useState(() => toLocalDatetimeValue(new Date()).slice(0, 10))
  const [time, setTime] = useState(() => toLocalDatetimeValue(new Date()).slice(11, 16))
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || status === 'saving') return

    const entry = {
      title: title.trim() || 'Không có tiêu đề',
      content: content.trim(),
      emotion,
      entry_date: `${date}T${time}:00`,
    }

    setStatus('saving')
    setErrorMsg('')

    try {
      await addEntry(entry)
      setTitle('')
      setContent('')
      setEmotion(null)
      setDate(toLocalDatetimeValue(new Date()).slice(0, 10))
      setTime(toLocalDatetimeValue(new Date()).slice(11, 16))
      setStatus('success')
      toast('Đã lưu nhật ký thành công 🎉')
      onSaved()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
      toast(err.message || 'Có lỗi xảy ra', 'error')
    }
  }

  return (
    <form className="diary-form" onSubmit={handleSubmit}>
      <h2 className="form-title">✍️ Viết nhật ký mới</h2>

      <div className="form-group">
        <label htmlFor="diary-title">Tiêu đề</label>
        <input
          id="diary-title"
          type="text"
          placeholder="Hôm nay của bạn thế nào?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={status === 'saving'}
        />
      </div>

      <div className="form-group">
        <label>Ngày &amp; giờ</label>
        <div className="datetime-row">
          <div className="datetime-field">
            <span className="datetime-icon">📅</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              disabled={status === 'saving'}
            />
          </div>
          <div className="datetime-field">
            <span className="datetime-icon">🕐</span>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              disabled={status === 'saving'}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Cảm xúc hôm nay</label>
        <div className="emotion-picker">
          {EMOTIONS.map(em => (
            <button
              key={em.emoji}
              type="button"
              className={`emotion-btn ${emotion?.emoji === em.emoji ? 'selected' : ''}`}
              onClick={() => setEmotion(em)}
              title={em.label}
              aria-label={em.label}
              aria-pressed={emotion?.emoji === em.emoji}
              disabled={status === 'saving'}
            >
              <span className="emotion-emoji">{em.emoji}</span>
              <span className="emotion-label">{em.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="diary-content">
          Nội dung <span className="required">*</span>
        </label>
        <textarea
          id="diary-content"
          placeholder="Hãy kể về ngày hôm nay của bạn..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
          required
          disabled={status === 'saving'}
        />
      </div>

      {status === 'error' && (
        <div className="form-message error" role="alert">
          ❌ {errorMsg || 'Có lỗi xảy ra, vui lòng thử lại.'}
        </div>
      )}

      <button
        type="submit"
        className="submit-btn"
        disabled={!content.trim() || status === 'saving'}
      >
        {status === 'saving' ? '⏳ Đang lưu...' : '💾 Lưu nhật ký'}
      </button>
    </form>
  )
}
