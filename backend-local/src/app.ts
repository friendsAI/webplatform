import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './auth/controller.js'; // ← 注意后缀.js

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`✅ Backend-local running at http://localhost:${PORT}`);
});

