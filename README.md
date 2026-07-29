# AI Agent 安全审计与知识管理系统

一个基于 React 和 Vite 构建的现代化 AI 代理安全审计与知识管理平台，提供智能化的安全分析、漏洞管理和知识库检索功能。

## ✨ 核心功能

### 🔍 安全审计

- **任务管理**: 创建和管理安全审计任务
- **代码上传**: 支持代码文件上传和分析
- **报告生成**: 自动生成详细的安全审计报告
- **漏洞追踪**: 识别和管理安全漏洞

### 📚 知识管理

- **智能搜索**: 快速检索安全知识库
- **知识管理**: 维护和更新安全知识条目

### 📊 数据可视化

- **仪表盘**: 实时展示系统关键指标
- **审计详情**: 深入分析审计结果

## 🚀 技术栈

### 核心框架

- **React 19** - 采用最新的 React 版本和 React Compiler
- **Vite 8** - 快速的构建工具和开发服务器
- **React Router 7** - 客户端路由管理

### 状态管理与数据获取

- **TanStack Query (React Query)** - 服务端状态管理
- **Axios** - HTTP 客户端

### UI 与样式

- **Tailwind CSS 4** - 原子化 CSS 框架
- **@tailwindcss/vite** - Tailwind Vite 插件

### 代码质量

- **ESLint 10** - 代码检查工具
- **React Compiler** - React 编译优化

## 📦 项目结构

```
ai-agent/
├── src/
│   ├── api/           # API 请求封装
│   ├── assets/        # 静态资源
│   ├── components/    # 可复用组件
│   │   ├── AppShell.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Ui.jsx
│   ├── hooks/         # 自定义 React Hooks
│   ├── layout/        # 布局组件
│   ├── pages/         # 页面组件
│   │   ├── Dashboard/   # 仪表盘
│   │   ├── Audit/       # 审计相关页面
│   │   ├── Knowledge/   # 知识库页面
│   │   └── Login/       # 登录页面
│   ├── store/         # 状态管理
│   ├── utils/         # 工具函数
│   ├── App.jsx        # 应用入口
│   ├── main.jsx       # React 挂载点
│   └── main.css       # 全局样式
├── public/            # 公共静态资源
├── dist/              # 构建输出目录
├── .env.development   # 开发环境配置
├── vite.config.js     # Vite 配置
├── eslint.config.js   # ESLint 配置
└── package.json       # 项目依赖
```

## 🛠️ 快速开始

### 环境要求

- Node.js >= 18
- pnpm (推荐) / npm / yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发模式

```bash
pnpm dev
```

应用将在 `http://localhost:5173` 启动（默认端口）

### 构建生产版本

```bash
pnpm build
```

构建输出将生成在 `dist` 目录

### 预览生产构建

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

## 🔐 环境配置

在项目根目录创建 `.env.development` 文件（已存在），配置开发环境变量：

```env
VITE_API_BASE_URL=your_api_url
```

## 🎯 主要特性

### React Compiler

项目启用了 React Compiler，能够自动优化 React 组件性能。详细信息请参考 [React Compiler 文档](https://react.dev/learn/react-compiler)。

**注意**: React Compiler 会影响 Vite 开发和构建性能。

### 路由保护

使用 `ProtectedRoute` 组件保护需要认证的路由，未登录用户将被重定向到登录页面。

### 代码分割

使用 React 的 `lazy` 和动态导入实现页面级代码分割，优化首屏加载性能。

### 状态管理

采用 TanStack Query 管理服务端状态，提供缓存、重试、轮询等开箱即用的功能。

## 📝 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建页面组件
2. 在 `src/App.jsx` 中添加路由配置
3. 如需保护路由，使用 `ProtectedRoute` 包裹

### 添加 API 接口

1. 在 `src/api/` 目录下创建或更新 API 模块
2. 使用 Axios 实例进行 HTTP 请求
3. 配合 TanStack Query 使用以获得最佳体验

### 自定义 Hooks

在 `src/hooks/` 目录下创建可复用的业务逻辑 Hooks

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目为私有项目

## 🔗 相关资源

- [React 文档](https://react.dev/)
- [Vite 文档](https://vite.dev/)
- [TanStack Query 文档](https://tanstack.com/query/latest)
- [React Router 文档](https://reactrouter.com/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
