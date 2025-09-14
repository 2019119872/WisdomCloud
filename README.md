# 智云图库 (Wisdom Cloud Library)

## 项目介绍

智云图库是一个基于Vue3 + SpringBoot开发的现代化智能图床系统，具备AI图片处理、实时协作编辑、空间管理分析等核心功能。项目采用前后端分离架构，前端使用Vue3 + TypeScript + Vite构建，后端采用SpringBoot + MyBatis Plus + PostgreSQL技术栈。

### 项目模块

1. **图片管理模块**：支持图片上传、分类、标签、搜索、详情展示等基础功能
2. **AI处理模块**：集成AI图片处理能力，包括智能扩图、图片优化等
3. **协作编辑模块**：支持多人实时协作编辑图片，具备WebSocket实时通信能力

### 技术栈

**前端**：
- Vue 3 (Composition API)
- TypeScript
- Vite
- Ant Design Vue
- ECharts (数据可视化)
- WebSocket (实时协作)

**后端**：
- SpringBoot
- MyBatis Plus
- Redis (缓存)
- cos (对象存储)

## 核心功能

### 1. AI图片处理
- AI智能扩图：基于深度学习算法自动扩展图片边界
- 图片优化：自动调整图片质量与尺寸
- 智能标签：自动识别图片内容并生成标签

### 2. 实时协作编辑
- 多人实时协作：支持多人同时编辑同一张图片
- 操作同步：通过WebSocket实现实时操作同步
- 光标追踪：实时显示其他用户的编辑光标位置

### 3. 空间管理分析
- 空间统计：存储空间使用情况分析
- 图片分类：按标签、分类等维度统计图片
- 数据可视化：使用ECharts展示各类分析图表

## 项目结构

```
wisdom-cloud-library/
├── src/
│   ├── api/           # 接口请求
│   ├── assets/        # 静态资源
│   ├── components/    # 组件
│   ├── constants/     # 常量定义
│   ├── router/        # 路由配置
│   ├── store/         # 状态管理
│   ├── utils/         # 工具函数
│   ├── views/         # 页面视图
│   └── App.vue        # 根组件
├── public/            # 公共资源
├── package.json       # 依赖配置
└── vite.config.ts     # 构建配置
```
### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- Java >= 17
- PostgreSQL >= 13.0
- Redis >= 6.0
- MinIO

### 前端运行
```bash
# 安装依赖
npm install

# 开发运行 (默认端口: 5174)
npm run dev

# 构建生产环境
npm run build
```

项目启动后访问: http://localhost:5174/

## 功能模块详解

### 图片管理
- 支持单张和批量图片上传
- 图片分类管理
- 标签系统
- 搜索功能

### AI处理
- AI扩图算法集成
- 图片质量优化
- 智能内容识别

### 协作编辑
- 实时通信机制
- 操作同步
- 光标位置追踪

### 空间分析
- 存储空间统计
- 图片分类分析
- 数据可视化展示

## 项目亮点

1. **现代化技术栈**：采用Vue3 + TypeScript + Vite构建前端，SpringBoot构建后端
2. **AI能力集成**：集成AI图片处理功能，提升用户体验
3. **实时协作**：基于WebSocket实现实时协作编辑功能
4. **数据可视化**：使用ECharts实现丰富的数据分析展示
5. **响应式设计**：适配不同设备屏幕尺寸


