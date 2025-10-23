import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getArticles, createArticle, updateArticle, deleteArticle } from '../services/api'
import './Admin.css'

interface Article {
  id: string
  title: string
  content: string
  category: string
  createdAt: string
  status: 'published' | 'draft'
}

interface AdminProps {
  onLogout: () => void
}

function Admin({ onLogout }: AdminProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: 'draft' as 'published' | 'draft'
  })
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const navigate = useNavigate()

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const data = await getArticles()
      setArticles(data)
    } catch (error) {
      console.error('Failed to load articles:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (currentArticle) {
        await updateArticle(currentArticle.id, formData)
      } else {
        await createArticle(formData)
      }
      
      resetForm()
      loadArticles()
    } catch (error) {
      console.error('Failed to save article:', error)
      alert('保存失败，请重试')
    }
  }

  const handleEdit = (article: Article) => {
    setCurrentArticle(article)
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      status: article.status
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    try {
      await deleteArticle(id)
      loadArticles()
    } catch (error) {
      console.error('Failed to delete article:', error)
      alert('删除失败，请重试')
    }
  }

  const resetForm = () => {
    setCurrentArticle(null)
    setFormData({ title: '', content: '', category: '', status: 'draft' })
    setIsEditing(false)
  }

  const handleLogoutClick = () => {
    if (confirm('确定要退出登录吗？')) {
      onLogout()
      navigate('/login')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  }

  const filteredArticles = articles.filter(article => {
    if (filter === 'all') return true
    return article.status === filter
  })

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>博客管理后台</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="view-blog-btn">查看博客</button>
          <button onClick={handleLogoutClick} className="logout-btn">退出登录</button>
        </div>
      </header>

      <div className="admin-content">
        <aside className="admin-sidebar">
          <button 
            className={`new-article-btn ${isEditing ? 'editing' : ''}`}
            onClick={() => isEditing ? resetForm() : setIsEditing(true)}
          >
            {isEditing ? '取消编辑' : '+ 新建文章'}
          </button>

          <div className="filter-section">
            <h3>筛选</h3>
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
              >
                全部 ({articles.length})
              </button>
              <button 
                className={filter === 'published' ? 'active' : ''}
                onClick={() => setFilter('published')}
              >
                已发布 ({articles.filter(a => a.status === 'published').length})
              </button>
              <button 
                className={filter === 'draft' ? 'active' : ''}
                onClick={() => setFilter('draft')}
              >
                草稿 ({articles.filter(a => a.status === 'draft').length})
              </button>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          {isEditing ? (
            <div className="editor-section">
              <h2>{currentArticle ? '编辑文章' : '新建文章'}</h2>
              <form onSubmit={handleSubmit} className="article-form">
                <div className="form-group">
                  <label>标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="请输入文章标题"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>分类</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="例如：技术、生活、随笔"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>内容</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="请输入文章内容"
                    rows={15}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                  >
                    <option value="draft">草稿</option>
                    <option value="published">发布</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    {currentArticle ? '更新文章' : '创建文章'}
                  </button>
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    取消
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="articles-list-section">
              <h2>文章列表</h2>
              {filteredArticles.length === 0 ? (
                <div className="empty-state">
                  <p>暂无文章</p>
                  <button onClick={() => setIsEditing(true)}>创建第一篇文章</button>
                </div>
              ) : (
                <div className="articles-table">
                  <table>
                    <thead>
                      <tr>
                        <th>标题</th>
                        <th>分类</th>
                        <th>状态</th>
                        <th>创建时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArticles.map(article => (
                        <tr key={article.id}>
                          <td className="title-cell">{article.title}</td>
                          <td>{article.category}</td>
                          <td>
                            <span className={`status-badge ${article.status}`}>
                              {article.status === 'published' ? '已发布' : '草稿'}
                            </span>
                          </td>
                          <td>{formatDate(article.createdAt)}</td>
                          <td className="actions-cell">
                            <button onClick={() => handleEdit(article)} className="edit-btn">
                              编辑
                            </button>
                            <button onClick={() => handleDelete(article.id)} className="delete-btn">
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Admin

