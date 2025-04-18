import express from 'express';
import { login } from './service.js'; // ← 注意后缀.js

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('收到登录请求:', username, password);

  const token = login(username, password);
  if (token) {
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;

