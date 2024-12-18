// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000', // 允许来自前端的请求，修改为前端的地址
  methods: ['GET', 'POST'],
  credentials: true,  // 允许携带 cookies 等凭证
}));

let gameState = {
  userTeam: null, // 玩家队伍
  machineTeam: null, // 机器队伍
  ropePosition: 50, // 0到100，50为临界点
  gameStarted: false,
  winner: null,
};

io.on('connection', (socket) => {
  console.log('a user connected: ' + socket.id);

  // 玩家选择队伍
  socket.on('choose_team', (team) => {
    if (gameState.gameStarted) return;

    if (team === 'left' && !gameState.userTeam) {
      gameState.userTeam = 'left';
      gameState.machineTeam = 'right';
      socket.emit('team_chosen', 'left');
      io.emit('machine_chosen', 'right'); // 广播机器选择右队
    } else if (team === 'right' && !gameState.userTeam) {
      gameState.userTeam = 'right';
      gameState.machineTeam = 'left';
      socket.emit('team_chosen', 'right');
      io.emit('machine_chosen', 'left'); // 广播机器选择左队
    }
  });



  let lastClickTime = null; // 上一次点击的时间
  let userSpeedFactor = 1; // 用户点击速度的因子，初始为1
  
  // 玩家推动绳子，随机向左或向右推动
  socket.on('button_click', () => {
    if (!gameState.gameStarted) return;
  
    const currentTime = Date.now(); // 当前点击的时间
    if (lastClickTime) {
      const clickInterval = currentTime - lastClickTime; // 计算点击间隔（毫秒）
      userSpeedFactor = Math.max(1, Math.floor(1000 / clickInterval)); // 根据点击间隔计算速度因子，越快因子越大，避免因子过小，默认1
    }
    lastClickTime = currentTime; // 更新上一次点击的时间
  
    // 玩家推动绳子，基于点击速度的因子
    if (gameState.userTeam === 'left') {
      gameState.ropePosition -= Math.floor(Math.random() * 2) * userSpeedFactor; // 左队：点击越快，绳子越大
    } else if (gameState.userTeam === 'right') {
      gameState.ropePosition += Math.floor(Math.random() * 2) * userSpeedFactor; // 右队：点击越快，绳子越大
    }
  
    // 机器随机推动绳子（机器的移动还是按随机值，但也可以根据机器速度来调整）
    if (gameState.machineTeam === 'left') {
      gameState.ropePosition -= Math.floor(Math.random() * 2); // 机器推动左队
    } else if (gameState.machineTeam === 'right') {
      gameState.ropePosition += Math.floor(Math.random() * 2); // 机器推动右队
    }
  
    // 判断游戏是否结束，如果绳子通过了临界点
    if (gameState.ropePosition <= 10) {
      gameState.winner = 'left'; // 左队赢
      io.emit('game_over', 'left');
      gameState.gameStarted = false;
      gameState.ropePosition =50;
    } else if (gameState.ropePosition >= 90) {
      gameState.winner = 'right'; // 右队赢
      io.emit('game_over', 'right');
      gameState.gameStarted = false;
      gameState.ropePosition =50;
    } else {
      // 如果没有结束，广播当前绳子位置
      io.emit('update_rope', gameState.ropePosition);
    }
  });


  // 玩家准备开始游戏
  socket.on('start_game', () => {
    if (gameState.userTeam && gameState.machineTeam && !gameState.gameStarted) {
      gameState.gameStarted = true;
      io.emit('game_started');  // 向所有客户端广播游戏开始
    }
  });

  // 断开连接时清理状态
  socket.on('disconnect', () => {
    gameState.userTeam = null;
    gameState.machineTeam = null;
    console.log('a user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
