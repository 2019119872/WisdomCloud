# Wisdom Cloud Library

智慧云图库 - 一个功能丰富的图片管理平台

## 项目介绍

Wisdom Cloud Library 是一个基于 Vue3 + Spring Boot 的全栈图片管理平台，支持图片上传、分类、搜索、AI处理等功能。

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Ant Design Vue
- Axios
- Vue Router
- Pinia

### 后端
- Spring Boot 2.7.6
- MyBatis Plus
- MySQL
- Redis
- Sa-Token 权限认证
- ShardingSphere 分库分表
- 腾讯云 COS 对象存储
- 阿里云 AI

## 功能特性

- 用户注册登录
- 图片上传与管理
- 图片分类与标签
- 图片搜索（支持标签、颜色、内容搜索）
- AI 图片处理（抠图、外延）
- 空间管理（个人/团队空间）
- 权限控制
- 数据统计分析

## 本地开发

### 前端
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

### 后端
```bash
# 编译项目
./mvnw package

# 运行项目
java -jar target/yu-picture-backend-0.0.1-SNAPSHOT.jar
```

## 部署

请参考 [DEPLOYMENT.md](DEPLOYMENT.md) 文件获取详细的部署指南。

## 环境配置

### 前端环境变量
- VITE_API_BASE_URL: 后端API地址

### 后端环境变量
- DATABASE_URL: 数据库连接URL
- DATABASE_USERNAME: 数据库用户名
- DATABASE_PASSWORD: 数据库密码
- REDIS_HOST: Redis主机地址
- REDIS_PORT: Redis端口

## 目录结构

### 前端
```
src/
├── api/           # API 接口封装
├── assets/        # 静态资源
├── components/    # 公共组件
├── constants/     # 常量定义
├── layouts/       # 页面布局
├── pages/         # 页面组件
├── router/        # 路由配置
├── stores/        # 状态管理
└── utils/         # 工具函数
```

### 后端
```
src/main/java/com/yupi/yupicturebackend/
├── annotation/    # 自定义注解
├── aop/           # AOP 切面
├── api/           # 第三方API调用
├── common/        # 通用类
├── config/        # 配置类
├── constant/      # 常量定义
├── controller/    # 控制器
├── exception/     # 异常处理
├── manager/       # 业务管理层
├── mapper/        # 数据访问层
├── model/         # 数据模型
├── service/       # 业务逻辑层
└── utils/         # 工具类
```


