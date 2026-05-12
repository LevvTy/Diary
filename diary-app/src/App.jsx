import { useState } from 'react'
import DiaryForm from './components/DiaryForm'
import DiaryList from './components/DiaryList'
import './App.css'

function App() {
  const [refresh, setRefresh] = useState(0)

  const handleSaved = () => setRefresh(r => r + 1)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📖 Nhật Ký Của Tôi</h1>
        <p className="subtitle">Ghi lại cảm xúc và kỷ niệm mỗi ngày</p>
      </header>
      <main className="app-main">
        <DiaryForm onSaved={handleSaved} />
        <DiaryList refreshKey={refresh} />
      </main>
    </div>
  )
}

export default App
