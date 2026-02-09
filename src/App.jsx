import { useState } from 'react'
import './App.css'
import Home from './Home'
import Game from './Game'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [selectedMode, setSelectedMode] = useState(null)

  const handleSelectMode = (modeId) => {
    setSelectedMode(modeId)
    setCurrentView('game')
  }

  const handleBack = () => {
    setCurrentView('home')
    setSelectedMode(null)
  }

  return (
    <div className="app">
      {currentView === 'home' ? (
        <Home onSelectMode={handleSelectMode} />
      ) : (
        <Game gameMode={selectedMode} onBack={handleBack} />
      )}
    </div>
  )
}

export default App
