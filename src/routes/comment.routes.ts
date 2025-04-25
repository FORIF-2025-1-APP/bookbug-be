import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller';

const router = Router();

// Create a new comment
router.post('/', authMiddleware as RequestHandler, createComment as RequestHandler);

// Get all comments for a reply
router.get('/reply/:replyId', getComments as RequestHandler);

// Get a specific comment
router.get('/:id', getComment as RequestHandler);

// Update a comment
router.put('/:id', authMiddleware as RequestHandler, updateComment as RequestHandler);

// Delete a comment
router.delete('/:id', authMiddleware as RequestHandler, deleteComment as RequestHandler);

export default router; 