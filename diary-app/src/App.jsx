import { useState } from 'react'
import DiaryForm from './components/DiaryForm'
import DiaryList from './components/DiaryList'
import Modal from './components/Modal'
import PinGate from './components/PinGate'
import './App.css'

function App() {
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)

  const handleSaved = () => {
    setShowForm(false)
    setRefresh(r => r + 1)
  }

  return (
    <PinGate>
      <div className="app-container">
        <header className="app-header">
          <span className="header-icon">📖</span>
          <h1>Nhật Ký Của Tôi</h1>
          <p className="subtitle">Ghi lại cảm xúc và kỷ niệm mỗi ngày</p>
          <button className="new-entry-btn" onClick={() => setShowForm(true)}>
            ✍️ Viết nhật ký
          </button>
        </header>

        <main className="app-main">
          <DiaryList refreshKey={refresh} />
        </main>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
          <DiaryForm onSaved={handleSaved} />
        </Modal>
      </div>
    </PinGate>
  )
}

export default App
