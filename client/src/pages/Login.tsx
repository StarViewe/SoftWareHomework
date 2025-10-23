import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import './Login.css'

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(username, password)
      localStorage.setItem('token', response.token)
      onLogin()
      navigate('/admin')
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">个人博客管理系统</h1>
        <p className="login-subtitle">欢迎回来</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>

          <div className="login-tips">
            <p>默认账号：admin</p>
            <p>默认密码：admin123</p>
          </div>
        </form>

        <button className="back-button" onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    </div>
  )
}

export default Login

