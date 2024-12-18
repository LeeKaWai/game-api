# 拔河游戏 (Tug-of-War Game)

这是一个简单的拔河游戏，实现了用户与机器对战的功能。用户可以选择队伍（左队或右队），然后通过点击按钮来推动绳子。每次点击会推动绳子向自己队伍的一侧移动，机器会随机推动绳子，游戏直到某一方获胜（绳子到达临界点）。

## 功能概述

- 用户可以选择左队或右队。
- 游戏开始后，用户点击按钮推动绳子。
- 机器会随机推动绳子，模拟机器对战。
- 当绳子达到临界点时，游戏结束并显示胜负。
- 游戏结束后，可以重新选择队伍并开始新一局游戏。

## 技术栈

- **前端**：React (使用 Next.js)、TypeScript
- **后端**：Node.js、Express、Socket.IO
- **通信**：WebSocket（使用 Socket.IO）

## 项目结构

### 1. api

```bash
# 进入项目目录
cd game-api

# 安装依赖
npm install


# 启动服务
node server.js
```

浏览器访问 http://localhost:4000

### 2. web

```bash
# 进入项目目录
cd game-web


# 安装依赖
npm install

# 启动服务
npm run dev
```
浏览器访问 http://localhost:3000




