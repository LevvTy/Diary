import { useState } from 'react'
import { addEntry } from '../lib/api'
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

export default function DiaryForm({ onSaved }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emotion, setEmotion] = useState(null)
  const [status, setStatus] = useState('idle') // idle | saving | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || status === 'saving') return

    const entry = {
      id: Date.now(),
      title: title.trim() || 'Không có tiêu đề',
      content: content.trim(),
      emotion,
      createdAt: new Date().toISOString(),
    }

    setStatus('saving')
    setErrorMsg('')

    try {
      await addEntry(entry)
      setTitle('')
      setContent('')
      setEmotion(null)
      setStatus('success')
      onSaved()
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <form className="diary-form" onSubmit={handleSubmit}>
      <h2>✏️ Viết nhật ký mới</h2>

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

      {status === 'success' && (
        <div className="form-message success" role="status">
          ✅ Đã lưu nhật ký lên GitHub thành công!
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
