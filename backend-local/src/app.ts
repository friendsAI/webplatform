// backend-local/src/app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRouter from './auth/controller.js'; // 登录接口
import uploadRouter from './routes/upload.js';     // 上传接口
import assetsRouter from './routes/assets.js';     // 资产接口

const app = express();
const PORT = 8888;


app.use(express.json());  //Express 提供的内置中间件，用来解析application/json类型的请求体
app.use(cors());
//app.use(bodyParser.json()); //旧版本的解析中间件

// ✅全部挂载
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/assets', assetsRouter);

// 测试接口
app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.listen(PORT, () => {
  console.log(`🚀Backend-local running at http://localhost:${PORT}`);
});

