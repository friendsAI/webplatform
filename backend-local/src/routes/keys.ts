import { Router } from 'express';
const router = Router();

router.get('/list', (_req, res) => {
    res.json([]); // 先返回空列表让前端不报错
  });

export default router;

