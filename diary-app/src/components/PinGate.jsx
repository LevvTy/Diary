import { useState, useRef, useEffect } from 'react'
import './PinGate.css'

const CORRECT_PIN = import.meta.env.VITE_PIN || '0000'
const SESSION_KEY = 'diary_unlocked'

export default function PinGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  )
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const inputs = useRef([])

  useEffect(() => {
    if (!unlocked) inputs.current[0]?.focus()
  }, [unlocked])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...pin]
    next[i] = val
    setPin(next)
    setError(false)

    if (val && i < 3) inputs.current[i + 1]?.focus()

    // Auto submit khi điền đủ 4 số
    if (val && i === 3) {
      const entered = [...next.slice(0, 3), val].join('')
      submit(entered)
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !pin[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
  }

  const submit = (entered = pin.join('')) => {
    if (entered === CORRECT_PIN) {
      sessionStorage.setItem(SESSION_KEY, '1')
      // Ghi lượt truy cập vào DB theo UTC+7
      const vnTime = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().replace('Z', '+07:00')
      fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visited_at: vnTime }),
      }).catch(() => {})
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setPin(['', '', '', ''])
      setTimeout(() => {
        setShake(false)
        inputs.current[0]?.focus()
      }, 500)
    }
  }

  if (unlocked) return children

  return (
    <div className="pin-screen">
      <div className="pin-card">
        <div className="pin-lock-icon">🔒</div>
        <h1 className="pin-title">Nhật Ký Của Tôi</h1>
        <p className="pin-subtitle">Nhập mã PIN để tiếp tục (pass là ngày ấy)</p>

        <div className={`pin-inputs ${shake ? 'shake' : ''}`}>
          {pin.map((val, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              className={`pin-input ${error ? 'error' : ''} ${val ? 'filled' : ''}`}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              autoComplete="off"
            />
          ))}
        </div>

        {error && <p className="pin-error">Mã PIN không đúng, thử lại</p>}
      </div>
    </div>
  )
}
