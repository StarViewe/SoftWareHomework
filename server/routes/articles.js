const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('./auth');
const { getArticles, saveArticles } = require('../data/articles');

const router = express.Router();

// 获取所有文章（公开访问）
router.get('/', (req, res) => {
  try {
    const articles = getArticles();
    res.json(articles);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: '获取文章列表失败' });
  }
});

// 获取单篇文章（公开访问）
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const articles = getArticles();
    const article = articles.find(a => a.id === id);

    if (!article) {
      return res.status(404).json({ message: '文章不存在' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: '获取文章失败' });
  }
});

// 创建文章（需要认证）
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, content, category, status } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: '标题、内容和分类不能为空' });
    }

    const articles = getArticles();
    const newArticle = {
      id: uuidv4(),
      title,
      content,
      category,
      status: status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    articles.push(newArticle);
    saveArticles(articles);

    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: '创建文章失败' });
  }
});

// 更新文章（需要认证）
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;

    const articles = getArticles();
    const index = articles.findIndex(a => a.id === id);

    if (index === -1) {
      return res.status(404).json({ message: '文章不存在' });
    }

    articles[index] = {
      ...articles[index],
      title: title || articles[index].title,
      content: content || articles[index].content,
      category: category || articles[index].category,
      status: status || articles[index].status,
      updatedAt: new Date().toISOString()
    };

    saveArticles(articles);
    res.json(articles[index]);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: '更新文章失败' });
  }
});

// 删除文章（需要认证）
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const articles = getArticles();
    const filteredArticles = articles.filter(a => a.id !== id);

    if (articles.length === filteredArticles.length) {
      return res.status(404).json({ message: '文章不存在' });
    }

    saveArticles(filteredArticles);
    res.json({ message: '文章已删除' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: '删除文章失败' });
  }
});

module.exports = router;

