import { Router, RequestHandler } from 'express';
import { createReply, getReplies, getReply, updateReply, deleteReply } from '../controllers/reply.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware as RequestHandler, createReply as RequestHandler);
router.get('/review/:reviewId', getReplies as RequestHandler);
router.get('/:id', getReply as RequestHandler);
router.patch('/:id', authMiddleware as RequestHandler, updateReply as RequestHandler);
router.delete('/:id', authMiddleware as RequestHandler, deleteReply as RequestHandler);

export default router; 