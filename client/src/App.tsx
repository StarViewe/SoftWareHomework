import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Blog from './pages/Blog'
import ArticleDetail from './pages/ArticleDetail'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<Blog onLogout={handleLogout} />} />
        <Route path="/article/:id" element={<ArticleDetail onLogout={handleLogout} />} />
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? (
              <Admin onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  )
}

export default App

