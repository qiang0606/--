# ChatHub - 聊天工作台

一个类似微信的聊天系统，支持账号托管功能。

## 项目结构

```
.
├── packages/
│   ├── frontend/     # Vue3 + TypeScript + TSX 前端项目
│   └── backend/      # NestJS 后端项目
├── package.json
└── pnpm-workspace.yaml
```

## 功能特性

- ✅ 微信式聊天界面
- ✅ 账号托管功能（可以托管其他账号进行对话）
- ✅ 实时消息推送（WebSocket）
- ✅ 对话管理（私聊、群聊）
- ✅ 消息历史记录

## 技术栈

### 前端
- Vue 3
- TypeScript
- TSX
- Vite
- Element Plus

### 后端
- NestJS
- TypeScript
- Mongoose (MongoDB)
- Socket.IO (WebSocket)
- JWT 认证
- Passport

## 快速开始

### 前置要求

1. **Node.js** >= 18.0.0
2. **pnpm** >= 8.0.0
3. **MongoDB** 需要安装并运行 MongoDB 服务

### 安装 MongoDB

#### Windows
下载并安装 MongoDB Community Server: https://www.mongodb.com/try/download/community

启动 MongoDB 服务：
```bash
# 默认情况下，MongoDB 会在 localhost:27017 运行
```

#### macOS
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Linux
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 安装依赖

```bash
pnpm install
```

### 配置环境变量（可选）

复制 `.env.example` 到 `packages/backend/.env` 并修改配置：

```bash
cd packages/backend
cp .env.example .env
```

默认 MongoDB 连接：`mongodb://localhost:27017/chathub`

### 初始化数据（可选）

```bash
cd packages/backend
npx ts-node src/scripts/init-mongo-data.ts
```

这将创建：
- 测试用户：`admin` / `123456`
- 两个托管账号（account1, account2）
- 每个账号的好友列表

### 启动开发环境

```bash
# 启动后端（需要 MongoDB 运行）
pnpm run dev:backend

# 启动前端（新终端）
pnpm run dev:frontend
```

### 访问

- 前端：http://localhost:3000
- 后端 API：http://localhost:3001

## 使用流程

1. **登录系统**：使用 `admin` / `123456` 登录
2. **选择托管账号**：选择要托管的账号
3. **查看好友列表**：查看该账号的好友
4. **开始对话**：选择好友开始对话
5. **发送消息**：实时发送和接收消息

## API 端点

### 认证
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户信息

### 账号管理
- `GET /api/accounts/managed` - 获取可托管的账号列表
- `GET /api/accounts/:accountId/friends` - 获取账号的好友列表

### 聊天
- `GET /api/chat/conversations` - 获取对话列表
- `GET /api/chat/conversations/:id/messages` - 获取消息列表
- `POST /api/chat/conversations` - 创建对话
- `POST /api/chat/messages` - 发送消息
- `POST /api/chat/conversations/:id/read` - 标记为已读

## 开发注意事项

1. **数据库**：使用 MongoDB，默认连接 `mongodb://localhost:27017/chathub`
2. **认证**：使用 JWT，token 存储在 localStorage
3. **WebSocket**：连接时需要传递 token 进行认证
4. **CORS**：后端已配置允许 `http://localhost:3000` 的跨域请求

## 故障排除

### MongoDB 连接失败

确保 MongoDB 服务正在运行：
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl status mongodb
```

### 端口被占用

如果 3000 或 3001 端口被占用，可以修改：
- 前端端口：`packages/frontend/vite.config.ts`
- 后端端口：`packages/backend/src/main.ts`
