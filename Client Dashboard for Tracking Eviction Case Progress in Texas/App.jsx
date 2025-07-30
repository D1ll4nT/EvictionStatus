import { useState } from 'react'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [caseData, setCaseData] = useState(null)

  const handleLogin = (data) => {
    setCaseData({
      ...data,
      caseNumber: data.caseNumber || '21456'
    })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCaseData(null)
  }

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard caseData={caseData} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App

