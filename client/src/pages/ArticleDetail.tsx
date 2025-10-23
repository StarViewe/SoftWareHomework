import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArticleById } from '../services/api'
import './ArticleDetail.css'

interface Article {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  status: string
}

interface ArticleDetailProps {
  onLogout: () => void
}

function ArticleDetail({ onLogout }: ArticleDetailProps) {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadArticle()
  }, [id])

  const loadArticle = async () => {
    try {
      if (id) {
        const data = await getArticleById(id)
        setArticle(data)
      }
    } catch (error) {
      console.error('Failed to load article:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (!article) {
    return (
      <div className="not-found">
        <h2>文章未找到</h2>
        <button onClick={() => navigate('/')}>返回首页</button>
      </div>
    )
  }

  return (
    <div className="article-detail-container">
      <header className="detail-header">
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="back-btn">← 返回首页</button>
          <button onClick={() => navigate('/admin')} className="admin-btn">管理后台</button>
        </div>
      </header>

      <article className="article-detail">
        <div className="article-meta">
          <span className="article-category-tag">{article.category}</span>
          <span className="article-date-text">{formatDate(article.createdAt)}</span>
        </div>
        
        <h1 className="article-detail-title">{article.title}</h1>
        
        <div className="article-content-detail">
          {article.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
}

export default ArticleDetail

