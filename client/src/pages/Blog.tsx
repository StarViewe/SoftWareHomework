import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getArticles } from '../services/api'
import './Blog.css'

interface Article {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  status: string
}

interface BlogProps {
  onLogout: () => void
}

function Blog({ onLogout }: BlogProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    loadArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, searchTerm, selectedCategory])

  const loadArticles = async () => {
    try {
      const data = await getArticles()
      const published = data.filter((article: Article) => article.status === 'published')
      setArticles(published)
      
      const uniqueCategories = Array.from(new Set(published.map((a: Article) => a.category)))
      setCategories(uniqueCategories as string[])
    } catch (error) {
      console.error('Failed to load articles:', error)
    }
  }

  const filterArticles = () => {
    let filtered = articles

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredArticles(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getExcerpt = (content: string, length: number = 150) => {
    return content.length > length ? content.substring(0, length) + '...' : content
  }

  return (
    <div className="blog-container">
      <header className="blog-header">
        <div className="header-content">
          <h1 className="blog-title">我的个人博客</h1>
          <p className="blog-subtitle">分享技术，记录生活</p>
          <div className="header-buttons">
            <button onClick={() => navigate('/admin')} className="admin-button">
              管理后台
            </button>
          </div>
        </div>
      </header>

      <div className="blog-content">
        <aside className="sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <h3>文章分类</h3>
            <ul className="category-list">
              <li 
                className={selectedCategory === 'all' ? 'active' : ''}
                onClick={() => setSelectedCategory('all')}
              >
                全部 ({articles.length})
              </li>
              {categories.map(category => (
                <li
                  key={category}
                  className={selectedCategory === category ? 'active' : ''}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category} ({articles.filter(a => a.category === category).length})
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="articles-main">
          {filteredArticles.length === 0 ? (
            <div className="no-articles">
              <p>暂无文章</p>
            </div>
          ) : (
            <div className="articles-grid">
              {filteredArticles.map(article => (
                <article 
                  key={article.id} 
                  className="article-card"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  <div className="article-category">{article.category}</div>
                  <h2 className="article-title">{article.title}</h2>
                  <p className="article-excerpt">{getExcerpt(article.content)}</p>
                  <div className="article-footer">
                    <span className="article-date">{formatDate(article.createdAt)}</span>
                    <span className="read-more">阅读全文 →</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Blog

