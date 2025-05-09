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

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment
 *     description: Add a new comment to a reply
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - replyId
 *             properties:
 *               content:
 *                 type: string
 *               replyId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware as RequestHandler, createComment as RequestHandler);

/**
 * @swagger
 * /api/comments/reply/{replyId}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get all comments for a reply
 *     description: Retrieve all comments associated with a specific reply
 *     parameters:
 *       - in: path
 *         name: replyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Reply ID
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   replyId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Reply not found
 */
router.get('/reply/:replyId', getComments as RequestHandler);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get a specific comment
 *     description: Retrieve a specific comment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 replyId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Comment not found
 */
router.get('/:id', getComment as RequestHandler);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Update a comment
 *     description: Update an existing comment's content
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the comment owner
 *       404:
 *         description: Comment not found
 */
router.put('/:id', authMiddleware as RequestHandler, updateComment as RequestHandler);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment
 *     description: Remove a comment from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the comment owner
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', authMiddleware as RequestHandler, deleteComment as RequestHandler);

export default router; 