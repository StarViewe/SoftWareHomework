const fs = require('fs');
const path = require('path');

const ARTICLES_FILE = path.join(__dirname, 'articles.json');

// 初始化示例文章
const initArticles = () => {
  return [
    {
      id: '1',
      title: '欢迎使用个人博客系统',
      content: '这是一个功能完整的个人博客系统，包含了文章发布、编辑、删除等基本功能。\n\n系统采用前后端分离架构，前端使用React + TypeScript开发，后端使用Node.js + Express构建。\n\n你可以在管理后台创建、编辑和删除文章，也可以将文章保存为草稿。博客首页会展示所有已发布的文章，支持按分类筛选和搜索功能。',
      category: '系统公告',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'React开发实践：如何构建一个现代化的Web应用',
      content: 'React是目前最流行的前端框架之一，它采用组件化的开发方式，让代码更加模块化和可维护。\n\n在这篇文章中，我们将探讨如何使用React构建一个现代化的Web应用。首先，我们需要了解React的核心概念，如组件、Props、State和生命周期。\n\n组件是React应用的基本构建块。通过将UI拆分成独立、可复用的组件，我们可以更好地组织代码，提高开发效率。\n\n使用React Hooks，我们可以在函数组件中使用state和其他React特性，使代码更加简洁和易读。',
      category: '技术分享',
      status: 'published',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      title: 'Node.js后端开发最佳实践',
      content: 'Node.js是一个基于Chrome V8引擎的JavaScript运行时，它让JavaScript可以在服务器端运行。\n\n在进行Node.js后端开发时，我们需要注意以下几点：\n\n1. 使用异步编程模式，避免阻塞主线程\n2. 合理使用中间件，保持代码的模块化\n3. 实现完善的错误处理机制\n4. 使用环境变量管理配置\n5. 做好安全防护，防止常见的Web攻击\n\n通过遵循这些最佳实践，我们可以构建出高性能、可维护的后端服务。',
      category: '技术分享',
      status: 'published',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '4',
      title: '2024年的技术展望',
      content: '随着技术的不断发展，2024年将会有很多令人兴奋的技术趋势。\n\n人工智能将继续快速发展，特别是大语言模型的应用将更加广泛。Web3和区块链技术也将继续演进，为去中心化应用带来更多可能性。\n\n在前端领域，React、Vue和Angular等框架将继续完善，新的工具和库也会不断涌现。TypeScript的使用将更加普及，帮助开发者编写更加健壮的代码。\n\n对于开发者来说，保持学习和探索的心态非常重要。',
      category: '技术趋势',
      status: 'published',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString()
    }
  ];
};

// 获取文章列表
const getArticles = () => {
  try {
    if (!fs.existsSync(ARTICLES_FILE)) {
      const defaultArticles = initArticles();
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(defaultArticles, null, 2));
      return defaultArticles;
    }
    const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
};

// 保存文章列表
const saveArticles = (articles) => {
  try {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
  } catch (error) {
    console.error('Error saving articles:', error);
    throw error;
  }
};

module.exports = {
  getArticles,
  saveArticles
};

