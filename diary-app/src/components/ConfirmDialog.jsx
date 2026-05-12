import './ConfirmDialog.css'

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-box" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">🗑️</div>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-cancel" onClick={onCancel}>Hủy</button>
          <button className="confirm-ok" onClick={onConfirm}>Xóa</button>
        </div>
      </div>
    </div>
  )
}
