# ChatHub 项目设置指南

## 项目结构

```
chathub-monorepo/
├── packages/
│   ├── frontend/     # Vue3 + TypeScript + TSX 前端
│   └── backend/       # NestJS 后端
├── package.json
└── pnpm-workspace.yaml
```

## 安装步骤

### 1. 安装 pnpm（如果还没有）

```bash
npm install -g pnpm
```

### 2. 安装依赖

在项目根目录运行：

```bash
pnpm install
```

### 3. 初始化数据库（可选）

如果需要初始化测试数据，运行：

```bash
cd packages/backend
npx ts-node src/scripts/init-data.ts
```

这将创建：
- 测试用户：`admin` / `123456`
- 两个托管账号（account1, account2）
- 每个账号的好友列表

## 启动项目

### 方式一：分别启动

```bash
# 终端1：启动后端
pnpm run dev:backend

# 终端2：启动前端
pnpm run dev:frontend
```

### 方式二：同时启动（Windows PowerShell）

```bash
pnpm run dev
```

## 访问地址

- 前端：http://localhost:3000
- 后端 API：http://localhost:3001
- WebSocket：ws://localhost:3001

## 功能说明

### 账号托管功能

1. **登录**：使用 `admin` / `123456` 登录
2. **选择托管账号**：登录后选择要托管的账号
3. **选择好友**：选择托管账号的好友进行对话
4. **发送消息**：以托管账号的身份发送消息

### API 端点

#### 认证
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户信息

#### 账号管理
- `GET /api/accounts/managed` - 获取可托管的账号列表
- `GET /api/accounts/:accountId/friends` - 获取账号的好友列表

#### 聊天
- `GET /api/chat/conversations` - 获取对话列表
- `GET /api/chat/conversations/:id/messages` - 获取消息列表
- `POST /api/chat/conversations` - 创建对话
- `POST /api/chat/messages` - 发送消息
- `POST /api/chat/conversations/:id/read` - 标记为已读

## 技术栈

### 前端
- Vue 3 (Composition API)
- TypeScript
- TSX (JSX for Vue)
- Element Plus
- Pinia (状态管理)
- Socket.IO Client (WebSocket)
- Vite

### 后端
- NestJS
- TypeScript
- TypeORM
- SQLite (开发环境)
- Socket.IO (WebSocket)
- JWT 认证
- Passport

## 开发注意事项

1. **数据库**：开发环境使用 SQLite，数据库文件为 `packages/backend/chathub.db`
2. **认证**：使用 JWT，token 存储在 localStorage
3. **WebSocket**：连接时需要传递 token 进行认证
4. **CORS**：后端已配置允许 `http://localhost:3000` 的跨域请求

## 后续开发建议

1. 添加消息类型支持（图片、文件等）
2. 实现群聊功能
3. 添加消息撤回、转发等功能
4. 实现消息搜索
5. 添加用户状态（在线/离线）
6. 实现消息已读回执
7. 添加文件上传功能
8. 实现消息推送通知

