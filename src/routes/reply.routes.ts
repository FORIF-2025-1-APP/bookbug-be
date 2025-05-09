import { Router, RequestHandler } from 'express';
import { createReply, getReplies, getReply, updateReply, deleteReply } from '../controllers/reply.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/replies:
 *   post:
 *     tags:
 *       - Replies
 *     summary: Create a new reply
 *     description: Add a new reply to a review
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
 *               - reviewId
 *             properties:
 *               content:
 *                 type: string
 *               reviewId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reply created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware as RequestHandler, createReply as RequestHandler);

/**
 * @swagger
 * /api/replies/review/{reviewId}:
 *   get:
 *     tags:
 *       - Replies
 *     summary: Get all replies for a review
 *     description: Retrieve all replies associated with a specific review
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: List of replies retrieved successfully
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
 *                   reviewId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Review not found
 */
router.get('/review/:reviewId', getReplies as RequestHandler);

/**
 * @swagger
 * /api/replies/{id}:
 *   get:
 *     tags:
 *       - Replies
 *     summary: Get a specific reply
 *     description: Retrieve a specific reply by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reply ID
 *     responses:
 *       200:
 *         description: Reply found
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
 *                 reviewId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Reply not found
 */
router.get('/:id', getReply as RequestHandler);

/**
 * @swagger
 * /api/replies/{id}:
 *   patch:
 *     tags:
 *       - Replies
 *     summary: Update a reply
 *     description: Update an existing reply's content
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reply ID
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
 *         description: Reply updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the reply owner
 *       404:
 *         description: Reply not found
 */
router.patch('/:id', authMiddleware as RequestHandler, updateReply as RequestHandler);

/**
 * @swagger
 * /api/replies/{id}:
 *   delete:
 *     tags:
 *       - Replies
 *     summary: Delete a reply
 *     description: Remove a reply from the database
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reply ID
 *     responses:
 *       200:
 *         description: Reply deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the reply owner
 *       404:
 *         description: Reply not found
 */
router.delete('/:id', authMiddleware as RequestHandler, deleteReply as RequestHandler);

export default router; 