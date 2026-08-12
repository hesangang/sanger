# 集成平台门户首页

基于 **React + Vite + Tailwind CSS** 构建的集成平台门户首页，展示各类网站信息，支持分类筛选、搜索、卡片展示和点击跳转。

## 技术栈

- React 18
- Vite 5
- Tailwind CSS 4

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
src/
├── data/
│   └── sites.js          # 网站数据和分类配置
├── components/
│   ├── Header.jsx        # 顶部导航 + 搜索框
│   ├── Hero.jsx          # 英雄横幅
│   ├── CategoryNav.jsx   # 分类导航
│   ├── SiteCard.jsx      # 网站卡片
│   ├── SiteGrid.jsx      # 卡片网格
│   └── Footer.jsx        # 页脚
├── App.jsx               # 主应用
├── main.jsx              # 入口
└── index.css             # 全局样式
```

## 功能特性

- ✅ 9 大分类筛选
- ✅ 实时搜索（标题 / 描述 / 标签）
- ✅ 卡片式展示（封面图、标题、描述、标签、访问量）
- ✅ 点击卡片新标签页跳转
- ✅ 响应式布局
- ✅ 暗色英雄区域 + 渐变卡片

## 如何添加新网站

在 `src/data/sites.js` 的 `sites` 数组中添加对象：

```js
{
  id: 17,
  title: '新网站名称',
  description: '网站描述信息',
  url: 'https://example.com',
  category: 'dev', // 分类ID，需在 categories 中定义
  cover: 'https://example.com/favicon.ico',
  icon: '🔥',
  tag: '标签',
  visitors: '1万',
  gradient: 'from-blue-500 to-indigo-600', // Tailwind 渐变类
}
```

## 可用分类

`all` `dev` `design` `cloud` `ai` `ops` `doc` `product` `data`
